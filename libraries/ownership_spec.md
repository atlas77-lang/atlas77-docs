# Atlas77 Ownership and Lifecycle Specification (v0.8.0)

## 1. Abstract

Atlas77 v0.8.0 implements a value-oriented ownership model with explicit transfer semantics and deterministic destruction. The compiler enforces ownership safety in two phases:

- Semantic phase: type-checking and ownership analysis over HIR.
- Lowering/backend phase: explicit delete/copy operations in LIR and C99 code generation.

There is no GC. Resource release is represented as explicit `delete` operations inserted by compiler passes and lowered to destructor/free calls in generated C.

## 2. Value Categories

### 2.1 Trivial Types

A type is treated as trivially copyable (implicit bitwise copy allowed) when it matches one of the following:

- Primitive scalars: integers, unsigned integers, floats, booleans, chars, unit.
- Literal-number internal types.
- Pointers (`*T`), function types, slices.
- Inline arrays whose element type is trivially copyable.
- Struct/generic-struct types whose resolved signature has `is_trivially_copyable = true`.

Implicit copy sites (for example `let y = x` and argument passing in ownership analysis) are allowed only for trivially copyable sources, except for compiler temporaries (`__tmp*`) which are allowed to transfer ownership.

### 2.2 Resource Types

A type is treated as resource-owning for lifecycle purposes when it requires drop:

- Struct/generic-struct with user-defined or synthesized destructor.
- Struct/generic-struct containing fields that recursively require drop.
- Inline arrays whose inner type requires drop.

Pointers are excluded from automatic value-destruction classification (`*T` itself is not auto-deleted as a value type).

## 3. The Move Protocol

### 3.1 Formal Rules

#### Rule M1: Explicit move intrinsic

`move(x)` is represented as an intrinsic call. Ownership analysis marks `x` as `Moved` at the move-site span.

```atlas
let a = build_resource();
let b = move(a);
// a is invalid after this point
```

#### Rule M2: Implicit assignment/capture

For `let y = x`, `const y = x`, assignment `y = x`, and call arguments:

- If `x` is trivially copyable: operation is treated as copy.
- If `x` is non-trivially-copyable: emit `type_not_trivially_copyable` error.
- Exception: if `x` is a compiler temporary (`__tmp*`) and destination type matches, transfer is permitted and temp is marked deleted.

```atlas
let x: File = open_file();
let y = x;     // error: non-trivial implicit copy
let y = move(x); // valid transfer
```

### 3.2 Source Invalidation

After explicit `move(x)`, later uses are rejected with moved/consumed diagnostics, depending on control-flow joins.

Ownership state machine used by analysis:

- `Alive`
- `Moved(spans)`
- `Deleted(spans)`
- `Consumed(spans)`
- Conditional variants of moved/deleted/consumed after branch merges

Conceptually this refines the high-level Active/Moved/Uninitialized model into explicit deleted and branch-conditional states.

## 4. Lifecycle Management

### 4.1 Deterministic Destruction

Atlas77 performs deterministic deletion by synthesizing `delete` expressions in HIR.

#### 4.1.1 Struct destructor synthesis

For struct types lacking a user destructor but requiring drop transitively, semantic analysis generates a `__dtor` body that deletes each drop-requiring field via `this->field`.

Generated shape:

```atlas
fn __dtor(this: *Self) {
    delete this->field1;
    delete this->field2;
}
```

Copyability flags are then recomputed from final destructor state.

#### 4.1.2 Scope-exit insertion

Ownership pass transforms each block:

- Push new scope frame (locals + ownership states).
- Process statements.
- On normal block exit: append `delete local;` for surviving `Alive` locals in reverse declaration order when local type requires auto-delete.

#### 4.1.3 Return-path insertion

For `return expr;`, ownership pass inserts scope drops before return:

- Traverse active scopes from inner to outer.
- Delete `Alive` locals requiring auto-delete.
- Exclude returned identifier when returning a local directly to preserve ownership transfer.

#### 4.1.4 Reassignment pre-delete

Before `dst = val`, if `dst` is currently `Alive` and auto-deletable, pass inserts `delete dst;` before assignment to prevent leak on overwrite.

```atlas
let h = new_handle();
h = new_handle();
// compiler inserts delete h before second assignment
```

### 4.2 Branching and Loops

#### 4.2.1 If/else state merge

The pass clones scope stacks for then/else branches and merges per-variable states:

- Same terminal state on both sides -> keep it.
- Alive on one side + invalid on other -> conditional invalid state.
- delete-family on both sides -> Deleted(combined spans).
- move-family on both sides -> Moved(combined spans).
- mixed move/delete families -> Consumed(combined spans).

#### 4.2.2 Loop merge

Loop body executes on cloned stack; merged back without else arm, yielding potential conditional invalidation.

#### 4.2.3 Access checks

Identifier reads consult nearest state map:

- `Alive` -> valid.
- `Moved/Deleted/Consumed` -> hard error.
- Conditional states -> potentially-* error.

## 5. Compiler Diagnostics

### 5.1 Ownership and Copy Diagnostics (errors)

Primary ownership-related diagnostics include:

- `sema::type_not_trivially_copyable`
- `sema::trying_to_access_a_moved_value`
- `sema::trying_to_access_a_deleted_value`
- `sema::trying_to_access_a_consumed_value`
- `sema::trying_to_access_a_potentially_moved_value`
- `sema::trying_to_access_a_potentially_deleted_value`
- `sema::trying_to_access_a_potentially_consumed_value`
- `sema::ownership_analysis_failed` (aggregates related ownership errors)

### 5.2 Pointer-in-Struct Warning

The semantic checker emits warning `sema::non_trivially_copyable_struct_holds_a_raw_pointer_with_no_custom_destructor` when all conditions hold:

- Struct is not marked `std::trivially_copyable`.
- Struct has no user-defined destructor.
- Struct contains at least one raw pointer field.

This warns about unsafe copy/move behavior without explicit lifecycle policy.

```atlas
struct Buffer {
    data: *uint8;
}
// warning: non-trivially-copyable struct holds raw pointer with no custom destructor
```

### 5.3 Trivial-Copyability Rule Source

Copyability is established by:

- Explicit flag: `#[std::trivially_copyable]`.
- Final destructor presence (user-defined or synthesized).
- Recursive field-based drop requirement.

Post-synthesis recomputation ensures `is_trivially_copyable` remain consistent with generated destructors.

## 6. Lowering to C99

### 6.1 LIR Representation

Ownership-sensitive lowering uses explicit instructions:

- `AggregateCopy { ty, dst, src }`: aggregate copy for arrays.
- `HeapAllocCopy { ty, dst, src }`: allocate + copy.
- `Delete { ty, src, should_free }`: destruction and optional free.

`delete` on trivially copyable values is lowered to unit/no-op form (load unit immediate), enabling later elimination.

### 6.2 Generated C99 Patterns

#### 6.2.1 Aggregate/value copy

- Array copy lowered to `memcpy(...)`.
- Scalar/unions/structs fallback lowered to assignment.

```c
memcpy(dst, src, sizeof(MyStruct));
```

#### 6.2.2 Delete lowering

- Value delete of struct type: call generated destructor with address.
- Pointer delete of pointer-to-struct: call destructor on pointed object, then `free` when `should_free = true`.

```c
MyType___dtor(&value);      // value delete
MyType___dtor(ptr);         // pointer delete (struct pointee)
free(ptr);                  // when should_free is true
```

### 6.3 Move Representation in Lowering

`move(x)` intrinsic lowers to the operand of `x` (no runtime move primitive). Safety comes from semantic ownership-state invalidation; backend code generation uses ordinary value/pointer operations plus explicit destructor/free points.

## 7. Reference Examples

### 7.1 Non-trivial implicit copy rejection

```atlas
let a: Resource = make();
let b = a; // error: implicit copy requires std::trivially_copyable
```

### 7.2 Explicit move + use-after-move

```atlas
let a: Resource = make();
let b = move(a);
use(a); // error: trying to access a moved/consumed value
```

### 7.3 Scope cleanup insertion

```atlas
fn f() {
    let x = make_resource();
    work();
} // compiler inserts delete x before block exit
```

### 7.4 Return transfer exclusion

```atlas
fn make() -> Resource {
    let r = build();
    return r; // return path excludes r from injected scope-drop list
}
```

## 8. What's next

### 8.0 `std::copyable` Introduction

In the future a trait/interface `std::copyable` will be introduced for explicit copy, e.g. `my_resource.copy()`. It will be an auto/intrinsic interface/trait, meaning the compiler will be able to auto generate you the function if asked for it.

### 8.1 `std::take` Introduction

In the future `std::take()` will be added, so we can take a value and replace its source with a default one if the type can be defaulted.
> It will be based on the `std::default` trait/interface


