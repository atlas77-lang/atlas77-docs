# Move/Copy Semantics in Atlas77

This document explains how ownership, move, and copy semantics work in Atlas77.

## Table of Contents
1. [Overview](#overview)
2. [Ownership Model](#ownership-model)
3. [Copy Eligibility](#copy-eligibility)
4. [Move Semantics](#move-semantics)
5. [Copy Semantics](#copy-semantics)
6. [The Ownership Pass](#the-ownership-pass)
7. [Examples](#examples)
8. [Common Patterns](#common-patterns)
9. [Common Pitfalls](#common-pitfalls)

---

## Overview

Atlas77 uses an ownership system similar to Rust to manage memory safely and automatically. Every value has a single owner, and when that owner goes out of scope, the value is automatically freed. Values can be transferred between owners (moved) or duplicated (copied).

**Key Principles:**
- Every variable owns its value
- Ownership can be **moved** (transferred) or **copied** (duplicated)
- When a value is moved, the original owner becomes invalid
- When a value is copied, both the original and the copy remain valid
- Automatic memory management through destructors

---

## Ownership Model

Every variable in Atlas77 owns its value. When a variable goes out of scope, its destructor is automatically called:

```atlas
fun example() {
    let x = new MyStruct(42);
    // x owns the MyStruct instance
    
    // ... use x ...
    
} // x goes out of scope here - destructor called automatically
```

### Transferring Ownership

When you pass a value to a function or assign it to another variable, ownership can be transferred:

```atlas
fun consume(obj: MyStruct) {
    // obj now owns the value
} // obj destroyed here

fun main() {
    let x = new MyStruct(42);
    consume(x);  // Ownership transferred to consume()
    // x is no longer valid here!
}
```

---

## Copy Eligibility

A type is **copyable** if and only if:

1. **It's a primitive type**: `int64`, `float64`, `uint64`, `bool`, `char`
2. **It's a reference**: `&T` or `&const T` (references are just pointers)
3. **It's a string**: Built-in `string` type (copyable but needs freeing)
4. **It has auto-generated copy**: Structs where the number of fields equals the number of constructor parameters
5. **It defines a `_copy` method**: Custom structs with an explicit copy constructor

> [!NOTE]
> **Auto-Generated Copy Constructor (v0.7.0)**  
> The compiler automatically generates a `_copy` method for structs where `#fields == #constructor_args`.
> This is a simple heuristic that works for most cases but can cause issues with complex types.
> In v0.7.1, this will be replaced with proper copy constructor generation and better semantics.

### Primitive Types

Primitives are always copied - they're too cheap to move:

```atlas
let a: int64 = 42;
let b: int64 = a;  // Copy (a is still valid)
let c: int64 = a;  // Another copy (a still valid)

println(a);  // ✓ Works - a is still valid
```

### References

References are lightweight pointers that don't own the data:

```atlas
fun borrow(obj: &const MyStruct) {
    // obj is just a reference - doesn't own the data
    println(obj.value);
}

fun main() {
    let x = new MyStruct(42);
    borrow(&x);  // Pass reference
    println(x.value);  // ✓ x is still valid
}
```

### Strings

Strings are copyable (they implement copy) but still need memory management:

```atlas
let s1 = "hello";
let s2 = s1;  // Copy (both strings valid)
println(s1);  // ✓ Works
println(s2);  // ✓ Works
// Both destructors will be called
```

### Auto-Generated Copy (Most Structs)

Most simple structs automatically get a copy constructor:

```atlas
struct Point {
public:
    x: int64;
    y: int64;

    Point(x: int64, y: int64) {  // 2 params
        this.x = x;
        this.y = y;
    }
    // Compiler auto-generates _copy because: 2 fields == 2 params ✓
}

fun main() {
    let p1 = new Point(10, 20);
    let p2 = p1;  // Copy (auto-generated)
    
    println(p1.x);  // ✓ Works
    println(p2.x);  // ✓ Works
}
```

**When auto-generation works:**
```atlas
struct Simple {.

### Non-Copyable Types

A type is non-copyable when the constructor parameters don't match the field count:

```atlas
struct Resource {
public:
    id: int64;
    handle: int64;  // 2 fields
    
    Resource(id: int64) {  // 1 param - NO auto-copy generated!
        this.id = id;
        this.handle = allocate_handle(id);  // Computed field
        println("Resource acquired");
    }
    
    ~Resource() {
        println("Resource released");
    }
    
    // No _copy method - this type is NOT copyable
}

fun main() {
    let r1 = new Resource(1);
    let r2 = r1;  // MOVE (r1 becomes invalid)
    
    // println(r1.id);  // ✗ ERROR: r1 was moved
    println(r2.id);     // ✓ Works
    
} // Only r2's destructor is called
```

Another example of non-copyable:
```atlas
struct Config {
public:
    value: int64;  // 1 field
    
    Config(a: int64, b: int64) {  // 2 params - NO auto-copy!
        this.value = a + b;  // Computed from multiple params
    }
    // No auto-generated copy (2 params ≠ 1 field)
}

### Manual Copy Constructors

You can always define `_copy` manually for full control:

```atlas
struct CustomCopy {
public:
    value: int64;
    
    CustomCopy(value: int64) {
        this.value = value;
    }

    // Manual copy constructor
    fun _copy(&const this) -> CustomCopy {
        println("Custom copy!");
        let result = new CustomCopy(*this.value * 2);  // Custom logic
        return result;
    }
}

fun main() {
    let c1 = new CustomCopy(10);
    let c2 = c1;  // Uses manual _copy
    
    println(c1.value);  // 10
    println(c2.value);  // 20 (custom logic applied)
}
```

---

## Move Semantics

**Move** transfers ownership from one variable to another. The source becomes invalid:

> [!NOTE]
> The compiler will try to generate the _copy() constructor automatically, so this example isn't perfectly representative of a non-copyable type. However, it illustrates the move semantics clearly.

```atlas
struct Resource {
public:
    id: int64;
    
    Resource(id: int64) {
        this.id = id;
        println("Resource acquired");
    }
    
    ~Resource() {
        println("Resource released");
    }
    
    // No _copy method - this type is NOT copyable
}

fun main() {
    let r1 = new Resource(1);
    let r2 = r1;  // MOVE (r1 becomes invalid)
    
    // println(r1.id);  // ✗ ERROR: r1 was moved
    println(r2.id);     // ✓ Works
    
} // Only r2's destructor is called
```

### When Moves Happen

Moves occur when:
- A non-copyable value is used (passed to function, assigned, returned)
- A copyable value is used for the **last time** (optimization)

---

## Copy Semantics

**Copy** creates a new independent value via the `_copy` method:

```atlas
struct Data {
public:
    value: int64;
    
    fun _copy(&const this) -> Data {
        println("Copying!");
        let result = new Data();
        result.value = *this.value;
        return result;
    }
}

fun main() {
    let d1 = new Data();
    d1.value = 100;
    
    let d2 = d1;  // COPY (both valid)
    d2.value = 200;
    
    println(d1.value);  // Prints: 100
    println(d2.value);  // Prints: 200
    
} // Both d1 and d2 destructors are called
```

### Copy vs Move for Copyable Types

Even copyable types can be moved if it's the last use (optimization):

```atlas
fun process(data: Data) {
    println(data.value);
}

fun main() {
    let d = new Data();
    d.value = 42;
    
    process(d);  // MOVE (last use - no copy needed!)
    // d is invalid here
}
```

But if you use it again, it will copy:

```atlas
fun main() {
    let d = new Data();
    d.value = 42;
    
    process(d);        // COPY (not last use)
    println(d.value);  // ✓ d is still valid
    
} // d's destructor called here
```

---

## The Ownership Pass

The compiler performs an ownership analysis in multiple phases:

### Phase 1: Use Collection
Records all uses of each variable, classifying them as:
- **Read**: Borrowing (e.g., `&x`, reading through reference)
- **OwnershipConsuming**: Taking ownership (e.g., passing by value)

### Phase 2: Copy-Biased Lowering
For each ownership-consuming use:
- If type is copyable → insert `COPY` expression
- If type is not copyable → insert `MOVE` expression

### Phase 3: Last-Use Optimization
Find the last ownership-consuming use of each variable:
- Convert `COPY` → `MOVE` for last use (optimization)
- Saves unnecessary copy constructor calls

### Phase 4: Destructor Insertion
At the end of each scope:
- Insert `delete` for every variable that still owns a value
- Variables that were moved don't get deleted

### Phase 5: Validation
Check for errors:
- Use after move
- Copying non-copyable types
- Moving out of containers

---

## Examples

### Example 1: Basic Ownership Transfer

```atlas
struct Message {
public:
    text: string;
    
    Message(text: string) {
        this.text = text;Auto-Generated Copy)

Most simple structs are automatically copyable:

```atlas
struct Counter {
public:
    count: int64;
    
    Counter(count: int64) {  // 1 param, 1 field - auto-copy generated!
        this.count = count;
    }
    // Compiler automatically generates _copy for this struct
}

fun increment(counter: Counter) {
    counter.count = counter.count + 1;
}

fun main() {
    let c = new Counter(0);
    
    increment(c);  // COPY (c used again below)
    increment(c);  // COPY (c used again below)
    
    println(c.count);  // Still 0 (copies were modified, not original
        return c;
    }
}

fun increment(counter: Counter) {
    counter.count = counter.count + 1;
}

fun main() {
    let c = new Counter();
    c.count = 0;
    
    increment(c);  // COPY (c used again below)
    increment(c);  // COPY (c used again below)
    
    println(c.count);  // Still 0 (copies were modified)
}
```

### Example 3: Borrowing with References

```atlas
fun increment_ref(counter: &Counter) {
    counter.count = counter.count + 1;
}

fun main() {
    let c = new Counter();
    c.count = 0;
    
    increment_ref(&c);  // Borrow (no copy/move)
    increment_ref(&c);  // Borrow
    
    println(c.count);   // 2 (original modified)
}
```

### Example 4: Return Values

```atlas
fun create_message(text: string) -> Message {
    let msg = new Message(text);
    return msg;  // Ownership transferred to caller
}

fun main() {
    let my_msg = create_message("Test");
    println(my_msg.text);  // ✓ Works
}
```

---

## Common Patterns

### Pattern 1: Builder Pattern with Move

```atlas
struct Builder {
public:
    value: int64;
    
    fun set_value(this, v: int64) -> Builder {
        this.value = v;
        return this;  // Move this back to caller
    }
    
    fun build(this) -> Product {
        let p = new Product(this.value);
        delete this;  // Explicit cleanup
        return p;
    }
}
```

### Pattern 2: Borrowing for Reads

```atlas
fun print_value(obj: &const MyStruct) {
    println(obj.value);
}

fun main() {
    let obj = new MyStruct(42);
    print_value(&obj);  // Borrow
    print_value(&obj);  // Borrow again
    // obj still valid
}
```

### Pattern 3: Mutable Borrowing

```atlas
fun modify(obj: &MyStruct) {
    obj.value = obj.value + 1;
}

fun main() {
    let obj = new MyStruct(42);
    modify(&obj);  // Mutable borrow
    println(obj.value);  // 43
}
```

---

## Common Pitfalls

### Pitfall 1: Use After Move

```atlas
fun consume(obj: Resource) { }

fun main() {
    let r = new Resource(1);
    consume(r);  // r moved
    
    println(r.id);  // ✗ ERROR: use after move
}Mismatched Constructor Parameters

```atlas
struct MyData {
public:
    value: int64;
    cached: bool;  // 2 fields
    
    MyData(value: int64) {  // 1 param - NO auto-copy!
        this.value = value;
        this.cached = false;
    }
}

fun main() {
    let d = new MyData(42);
    let d2 = d;  // MOVE (no auto-copy because 1 param ≠ 2 fields)
    
    println(d.value);  // ✗ ERROR: d was moved
}
```

**Solution:** Either match parameters to fields, or implement `_copy` manually:

```atlas
// Option 1: Match constructor to fields
struct MyData {
public:
    value: int64;
    cached: bool;
    
    MyData(value: int64, cached: bool) {  // Now 2 params = 2 fields ✓
        this.value = value;
        this.cached = cached;
    }
    // Auto-copy works now!
}

// Option 2: Implement _copy manually
struct MyData {
public:
    value: int64;
    cached: bool;
    
    MyData(value: int64) {
        this.value = value;
        this.cached = false;
    }
    
    fun _copy(&const this) -> MyData {
        let result = new MyData(*this.value);
        result.cached = *this.cached
    let d2 = d;  // MOVE
    
    println(d.value);  // ✗ ERROR: d was moved
}
```

**Solution:** Implement `_copy` if you need multiple uses:

```atlas
struct MyData {
public:
    value: int64;
    
    fun _copy(&const this) -> MyData {
        let result = new MyData();
        result.value = *this.value;
        return result;
    }
}
```

### Pitfall 3: Temporary Values in Cast Expressions

```atlas
fun get_string() -> String {
    return new String("hello");
}

fun main() {
    // ⚠ WARNING: temporary from get_string() can't be freed
    let x = get_string() as string;
}
```

**Solution:** Store the result in a variable first:

```atlas
fun main() {
    let temp = get_string();
    let x = temp as string;  // ✓ Now temp can be properly freed
}
```

### Pitfall 4: Moving Out of Containers

```atlas
fun main() {
    let list = [new Resource(1), new Resource(2)];
    
    let r = list[0];  // ✗ ERROR: can't move out of container
}
```

**Solution:** Use references or copy if the type is copyable:

```atlas
fun main() {
    let list = [new Resource(1), new Resource(2)];
    
    let r = &list[0];  // ✓ Borrow instead
}
```

### Pitfall 5: Double Move

```atlas
fun process(r: Resource) { }

fun main() {)
- **Primitives**: Always copied
- **Strings**: Copyable but still needs memory management
- **Auto-generated copy**: Most structs where `#fields == #constructor_params` (v0.7.0)
  - ⚠️ Simple heuristic that will be improved in v0.7.1
- **Manual copy**: Define `_copy` method for custom behavior
    process(r);  // ✗ ERROR: r already moved
}
```

**Solution:** Create a new resource or use references:

```atlas
fun process(r: &Resource) { }

fun main() {
    let r = new Resource(1);
    process(&r);  // Borrow
    process(&r);  // ✓ Borrow again
}
```

---

## Summary

- **Ownership**: Every value has exactly one owner
- **Move**: Transfers ownership (source becomes invalid)
- **Copy**: Creates duplicate (both remain valid, requires `_copy` method)
- **Primitives**: Always copied
- **Strings**: Copyable but still needs memory management
- **References**: Lightweight borrowing without ownership transfer
- **Automatic cleanup**: Destructors called when variables go out of scope
- **Compiler optimization**: Last-use moves even for copyable types

The ownership system ensures memory safety while providing explicit control over when values are copied vs moved.
