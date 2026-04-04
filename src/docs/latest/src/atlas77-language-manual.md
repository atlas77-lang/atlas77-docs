# Atlas77 v0.8.0 Language Manual

This manual documents Atlas77 as it exists in v0.8.0.
It focuses on behavior that is visible in the compiler pipeline and in the current standard library implementation.

## 1. Language Fundamentals

### 1.1 Primitive Types

Atlas77 defines the following primitive scalar/value types in the language reference:

| Type | Meaning | Size |
| --- | --- | --- |
| int8 | Signed integer | 1 byte |
| int16 | Signed integer | 2 bytes |
| int32 | Signed integer | 4 bytes |
| int64 | Signed integer | 8 bytes |
| uint8 | Unsigned integer | 1 byte |
| uint16 | Unsigned integer | 2 bytes |
| uint32 | Unsigned integer | 4 bytes |
| uint64 | Unsigned integer | 8 bytes |
| float32 | IEEE-like floating point | 4 bytes |
| float64 | IEEE-like floating point | 8 bytes |
| bool | true/false | 1 byte |
| char | Single Unicode code point | 4 bytes |
| string | UTF-8 byte string | Variable |
| unit | Empty value type | 0 bytes (semantic) |

Status note: the generated language-reference page also states that some primitive types are planned or not fully implemented yet. Treat compiler support as authoritative over table intent.

```atlas77
fun main() {
    let a: int64 = 42;
    let b: uint8 = 255;
    let c: float64 = 3.14159;
    let ok: bool = true;
    let ch: char = 'A';
    let s: string = "atlas";
}
```

### 1.2 Structs

Atlas77 structs are nominal types with fields and methods. In current code style, object creation is done with factory/static methods such as Type::new(...) or with struct literals.

```atlas77
public struct Person {
public:
    name: string;
    age: int32;

    fun new(name: string, age: int32) -> Person {
        return Person { .name = name, .age = age };
    }

    fun birthday(*this) {
        this->age = this->age + 1;
    }
}

fun main() {
    let p = Person::new("Ada", 30);
    p.birthday();
}
```

Member access uses . on values and -> through pointers to values.

### 1.3 Pointers

Atlas77 uses explicit raw pointers:

- *T for mutable pointer access
- *const T for immutable pointer access

```atlas77
fun read_first(ptr: *const int64) -> int64 {
    return *ptr;
}

fun set_first(ptr: *int64, v: int64) {
    *ptr = v;
}
```

> NB: References are not yet implemented, but is a planned feature for future releases.

## 2. The Atlas77 Memory Model

Source of truth: ownership specification in docs/ownership_spec.md.

### 2.1 Value Semantics: Trivial vs Resource Types

Trivially copyable values can be copied implicitly.
Resource values require deterministic drop and cannot be implicitly copied.

```atlas77
let x: int64 = 10;
let y: int64 = x; // copy is valid
```

```atlas77
let r: Resource = make_resource();
let r2: Resource = r; // invalid: non-trivial implicit copy
```

### 2.2 Ownership Transfer with move(x)

move(x) transfers ownership and invalidates x for later use.

```atlas77
let a = build_resource();
let b = move(a);
use(a); // invalid after move
```

Compiler diagnostics include moved/deleted/consumed and potentially-moved variants at branch joins.

### 2.3 Deterministic Cleanup and Destructors

The compiler inserts delete operations in HIR, and lowers to destructor calls (and free when needed) in generated C.

```atlas77
public struct FileHandle {
private:
    raw: *uint8;
public:
    ~FileHandle() {
        if this->raw != null {
            free(this->raw);
        }
    }
}
```

Scope-exit cleanup, return-path cleanup, and reassignment pre-delete are handled by ownership/lifecycle passes.

## 3. Standard Library Reference

### 3.1 std/memory

Current low-level primitives:

- malloc<T>(size)
- free<T>(ptr)
- memcpy<T>(dest, src, size)
- sizeof<T>() and alignof<T>() wrappers
- move<T>(from) intrinsic

```atlas77
import "std/memory";

fun main() {
    let buf = malloc<uint8>(128);
    // ... use buf
    free(buf);
}
```

### 3.2 Vector<T>

Vector<T> in std/vector owns heap storage and tracks length/capacity.

- push doubles capacity when full (0 -> 1 -> 2 -> 4 ...)
- pop and take move values out
- destructor deletes elements in range [0, length)

```atlas77
import "std/vector";

fun main() {
    let v = Vector<int64>::with_capacity(2);
    v.push(10);
    v.push(20);
    v.push(30); // growth occurs

    let last = v.pop();
    let first = v.take(0);
}
```

Ownership note: element type T should be designed with Atlas77 drop semantics in mind, since vector cleanup calls delete on stored elements.

### 3.3 String

String in std/string is an owning byte-buffer wrapper over *uint8 with explicit len/capacity.

- UTF-8 bytes, length in bytes
- c_str() ensures trailing NUL and may reallocate
- with_capacity reserves space manually

```atlas77
import "std/string";

fun main() {
    let s = String::from_chars("hello");
    let t = s.to_upper();
    let u = s.concat(&t);
    print(u.c_str());
}
```

Implementation note: string behavior currently reflects pragmatic std internals, not a finalized immutable string design.

### 3.4 optional<T>

optional<T> is a tagged union-like utility for nullable values.

- optional<T>::of(value)
- optional<T>::empty()
- has_value(), is_empty(), value(), value_or(default)

```atlas77
import "std/optional";

fun maybe_even(n: int64) -> optional<int64> {
    if (n % 2 == 0) {
        return optional<int64>::of(n);
    }
    return optional<int64>::empty();
}
```

value() consumes and panics on empty.

### 3.5 expected<T, E>

expected<T, E> models success or error outcomes.

- expected<T, E>::expect(v)
- expected<T, E>::unexpected(e)
- is_expected(), is_unexpected()
- expected_value(), unexpected_value(), *_or(default)

```atlas77
import "std/expected";

fun parse_nonzero(v: int64) -> expected<int64, string> {
    if (v == 0) {
        return expected<int64, string>::unexpected("zero is not allowed");
    }
    return expected<int64, string>::expect(v);
}
```

### 3.6 io

std/io provides print, println, input, panic, printf plus FILE/Stdin interop-facing types.

```atlas77
import "std/io";

fun main() {
    print("Name: ");
    let name = input();
    println(name.c_str());
}
```

### 3.7 Experimental shared_ptr

std/experimental/smart_ptr.atlas currently includes shared_ptr<T> with a strong counter block.

- copy increments counter
- release decrements and deletes at zero
- no weak pointers
- no cycle handling

```atlas77
import "std/experimental/smart_ptr";

fun main() {
    let p = shared_ptr<int64>::make(10);
    let q = p.copy();
    // both point to same rc_block
}
```

### 3.8 Raylib Wrapper State

Current raylib binding code is an extern-heavy prototype, not a finished package story:

- requires raylib.h and host linker setup
- mixes extern structs/functions with Atlas-side helpers
- demonstrates practical app loop structure

```atlas77
extern fun InitWindow(width: int32, height: int32, title: *const uint8);
extern fun WindowShouldClose() -> bool;
extern fun BeginDrawing();
extern fun EndDrawing();

fun main() {
    InitWindow(800, 450, "demo");
    while (!WindowShouldClose()) {
        BeginDrawing();
        EndDrawing();
    }
}
```

Planned direction: expose library gating with a compiler flag before introducing a full build configuration format.

## 4. C Interoperability

### 4.1 Extern Functions and Structs

Use extern fun and extern struct to declare C ABI symbols.

```atlas77
extern struct FILE {
    handle: uint64;
}

extern fun printf<T>(fmt: *uint8, value: T);

fun main() {
    printf("%s\n", "hello from atlas77");
}
```

### 4.2 Atlas77 to C Pipeline

The compiler flow in libraries/lib.rs is:

1. Parse source to AST.
2. Lower AST to HIR.
3. Monomorphize generics.
4. Type check.
5. Run ownership pass and inject delete semantics.
6. Lower HIR to LIR.
7. Emit C99 source and generated header in build/.
8. Invoke selected C compiler backend.

The generated artifacts include:

- build/output.atlas
- build/output.atlas_lir
- build/output.atlas_c.c
- build/__atlas77_header.h

### 4.3 TCC vs GCC/Clang Workflow

CLI behavior from libraries/main.rs and libraries/lib.rs:

- Build defaults to TinyCC (tinycc or tcc)
- Release and debug are mutually exclusive CLI flags
- GCC/Clang/MSVC/Intel are selectable backends
- Extra linker/compiler flags are passed through with repeated --c-arg

Example commands:

```c
atlas77 build src/main.atlas -c tinycc -o ./build
atlas77 build src/main.atlas -c gcc -r --c-arg=-lm --c-arg=-lraylib
atlas77 build src/main.atlas -c clang -r
atlas77 check src/main.atlas
```

Practical guidance:

- Use TinyCC for fast local iteration.
- Use GCC or Clang for stricter diagnostics and release optimization validation.

## 5. Advanced Features

### 5.1 Generics

Atlas77 supports generic structs and functions with explicit type parameters.

```atlas77
public struct Pair<T> {
public:
    a: T;
    b: T;
}

fun pick_first<T>(x: T, _y: T) -> T {
    return x;
}

fun main() {
    let p = Pair<int64> { .a = 1, .b = 2 };
    let v = pick_first<int64>(p.a, p.b);
}
```

Current codebase also demonstrates generic constraints in library helpers (for example copy<T: std::copyable> in std/memory).

### 5.2 Function Pointers

Atlas77 supports typed function pointers, including static functions, generic function instances, and method pointers.

```atlas77
struct Foo {
public:
    fp: fun(int32, int32) -> int32;
    add_const_fp: fun(*const Foo, int32) -> int32;

    fun add(a: int32, b: int32) -> int32 {
        return a + b;
    }

    fun add_const(*const this, value: int32) -> int32 {
        return value + 100;
    }
}

fun pick_first<T>(a: T, _b: T) -> T {
    return a;
}

fun main() {
    let add_fn: fun(int32, int32) -> int32 = Foo::add;
    let foo = Foo {
        .fp = add_fn,
        .add_const_fp = Foo::add_const,
    };

    let r1 = foo.fp(2, 3);
    let r2 = foo.add_const_fp(&foo, 11);

    let pick_i64: fun(int64, int64) -> int64 = pick_first<int64>;
    let r3 = pick_i64(10, 20);
}
```

### 5.3 Intrinsics

Core intrinsics in std/memory:

- size_of<T>()
- align_of<T>()
- move<T>(value)

User-facing wrappers:

- sizeof<T>()
- alignof<T>()

```atlas77
import "std/memory";

fun main() {
    let s = sizeof<int64>();
    let a = alignof<int64>();

    let x = String::new();
    let y = move(x);
    // x is invalid after move
}
```

## 6. Real-World Application Structure

The raylib sample demonstrates a typical Atlas77 program skeleton for interactive apps:

1. Extern declarations for host APIs.
2. Domain structs/enums for runtime state.
3. Initialization block.
4. Main loop with update + draw phases.
5. Deterministic shutdown.

```atlas77
fun main() {
    InitWindow(800, 450, "2d camera");
    SetTargetFPS(60);

    while (!WindowShouldClose()) {
        // update
        // draw
    }

    CloseWindow();
}
```

This structure maps cleanly onto Atlas77 ownership rules because state lifetime is explicit and scoped.

## 7. Operational Notes and Caveats

- Atlas77 is under active development; not all documented types/features are equally mature.
- Standard library modules are practical and evolving, not frozen ABI contracts.
- Pointer-heavy code must be audited manually; ownership pass does not replace C interop discipline.
- Use check and multiple C backends in CI to catch backend-specific issues early.