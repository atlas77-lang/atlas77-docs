# Memory Model and Ownership

Atlas77 uses an **ownership system** similar to Rust to manage memory safely and automatically. This document explains how memory allocation, ownership, move semantics, and copy semantics work in Atlas77.

## Overview

**Key Principles:**
- Every variable owns its value
- Ownership can be **moved** (transferred) or **copied** (duplicated)
- When a value is moved, the original owner becomes invalid
- When a value is copied, both the original and the copy remain valid
- Automatic memory management through RAII and destructors

## Allocation with `new`

Memory is allocated using the `new` keyword:

```cpp
struct Person {
public:
    name: string;
    age: int64;
    
    Person(name: string, age: int64) {
        this.name = name;
        this.age = age;
    }
}

let person = new Person("Alice", 30);
```

## Automatic Scope-Based Cleanup (RAII)

The compiler automatically inserts `delete` instructions at the end of each scope for variables that still own their values:

```cpp
import "std/fs";

fun process_file() -> unit {
    let file = new File("data.txt");
    
    // ... use file ...
    
} // Compiler automatically calls: delete file;
```

This pattern is called **RAII** (Resource Acquisition Is Initialization):
- Resources are acquired during object construction (`new`)
- Resources are released automatically at scope exit via destructors

### Example: File Resource Management

```cpp
import "std/fs";

struct FileHandler {
public:
    file: File;
    
    FileHandler(path: string) {
        this.file = new File(path);
        println("File opened");
    }
    
    ~FileHandler() {
        println("File closed");
        delete this.file;
    }
}

fun read_and_process() -> unit {
    let handler = new FileHandler("input.txt");
    
    // ... use handler ...
    
} // FileHandler destructor called automatically
```

## Ownership Model

Every variable in Atlas77 owns its value. When a variable goes out of scope, its destructor is automatically called:

```cpp
fun example() {
    let x = new MyStruct(42);
    // x owns the MyStruct instance
    
    // ... use x ...
    
} // x goes out of scope - destructor called automatically
```

### Transferring Ownership

When you pass a value to a function or assign it to another variable, ownership can be transferred:

```cpp
fun consume(obj: MyStruct) {
    // obj now owns the value
} // obj destroyed here

fun main() {
    let x = new MyStruct(42);
    consume(x);  // Ownership transferred to consume()
    // x is no longer valid here!
}
```

## Copy Eligibility

A type is **copyable** if and only if:

1. **It's a primitive type**: `int64`, `float64`, `uint64`, `bool`, `char`
2. **It's a reference**: `&T` or `&const T` (references are just pointers)
3. **It's a string**: Built-in `string` type (copyable but needs freeing)
4. **It has auto-generated copy**: Structs where the number of fields equals the number of constructor parameters
5. **It defines a `_copy` method**: Custom structs with an explicit copy constructor

> **Note:** Auto-Generated Copy Constructor (v0.7.0)  
> The compiler automatically generates a `_copy` method for structs where `#fields == #constructor_args`.
> This is a simple heuristic that works for most cases but can cause issues with complex types.
> In v0.7.1, this will be replaced with proper copy constructor generation and better semantics.

### Primitive Types

Primitives are always copied - they're too cheap to move:

```cpp
let a: int64 = 42;
let b: int64 = a;  // Copy (a is still valid)
let c: int64 = a;  // Another copy (a still valid)

println(a);  // ✓ Works - a is still valid
```

### References

References are lightweight pointers that don't own the data:

```cpp
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

Strings are copyable but still need memory management:

```cpp
let s1 = "hello";
let s2 = s1;  // Copy (both strings valid)
println(s1);  // ✓ Works
println(s2);  // ✓ Works
// Both destructors will be called
```

### Auto-Generated Copy (Most Structs)

Most simple structs automatically get a copy constructor:

```cpp
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

### Non-Copyable Types

A type is non-copyable when the constructor parameters don't match the field count:

```cpp
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

### Manual Copy Constructors

You can always define `_copy` manually for full control:

```cpp
struct CustomCopy {
public:
    value: int64;
    
    CustomCopy(value: int64) {
        this.value = value;
    }

    // Manual copy constructor
    fun _copy(&const this) -> CustomCopy {
        println("Custom copy!");
        let result = new CustomCopy(*(this.value) * 2);  // Custom logic
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

## Move Semantics

**Move** transfers ownership from one variable to another. The source becomes invalid:

```cpp
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

## Copy Semantics

**Copy** creates a new independent value via the `_copy` method:

```cpp
struct Data {
public:
    value: int64;
    
    Data(value: int64) {
        this.value = value;
    }
    
    fun _copy(&const this) -> Data {
        println("Copying!");
        let result = new Data(*(this.value));
        return result;
    }
}

fun main() {
    let d1 = new Data(100);
    
    let d2 = d1;  // COPY (both valid)
    d2.value = 200;
    
    println(d1.value);  // Prints: 100
    println(d2.value);  // Prints: 200
    
} // Both d1 and d2 destructors are called
```

### Copy vs Move for Copyable Types

Even copyable types can be moved if it's the last use (optimization):

```cpp
fun process(data: Data) {
    println(data.value);
}

fun main() {
    let d = new Data(42);
    
    process(d);  // MOVE (last use - no copy needed!)
    // d is invalid here
}
```

But if you use it again, it will copy:

```cpp
fun main() {
    let d = new Data(42);
    
    process(d);        // COPY (not last use)
    println(d.value);  // ✓ d is still valid
    
} // d's destructor called here
}
```

## Common Patterns

### Pattern 1: Borrowing for Reads

```cpp
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

### Pattern 2: Mutable Borrowing

```cpp
fun modify(obj: &MyStruct) {
    obj.value = obj.value + 1;
}

fun main() {
    let obj = new MyStruct(42);
    modify(&obj);  // Mutable borrow
    println(obj.value);  // 43
}
```

### Pattern 3: Return Values Transfer Ownership

```cpp
import "std/string";

fun create_message(text: string) -> String {
    let msg = new String(text);
    return msg;  // Ownership transferred to caller
}

fun main() {
    let my_msg = create_message("Test");
    println(my_msg.s);  // ✓ Works
}
```

## Common Pitfalls

### Pitfall 1: Use After Move

```cpp
fun consume(obj: Resource) { }

fun main() {
    let r = new Resource(1);
    consume(r);  // r moved
    
    println(r.id);  // ✗ ERROR: use after move
}
```

**Solution:** Use references if you need to keep the value:

```cpp
fun consume(obj: &Resource) { }

fun main() {
    let r = new Resource(1);
    consume(&r);  // Borrow
    println(r.id);  // ✓ Works
}
```

### Pitfall 2: Mismatched Constructor Parameters

```cpp
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

```cpp
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
        let result = new MyData(*(this.value));
        result.cached = this.cached;
        return result;
    }
}
```

### Pitfall 3: Double Move

```cpp
fun process(r: Resource) { }

fun main() {
    let r = new Resource(1);
    process(r);  // r moved
    process(r);  // ✗ ERROR: r already moved
}
```

**Solution:** Create a new resource or use references:

```cpp
fun process(r: &Resource) { }

fun main() {
    let r = new Resource(1);
    process(&r);  // Borrow
    process(&r);  // ✓ Borrow again
}
```

## Summary

- **Ownership**: Every value has exactly one owner
- **Move**: Transfers ownership (source becomes invalid)
- **Copy**: Creates duplicate (both remain valid, requires `_copy` method)
- **Primitives**: Always copied
- **Strings**: Copyable but still needs memory management
- **Auto-generated copy**: Structs where `#fields == #constructor_params`
- **References**: Lightweight borrowing without ownership transfer
- **Automatic cleanup**: Destructors called when variables go out of scope
- **Compiler optimization**: Last-use moves even for copyable types

The ownership system ensures memory safety while providing explicit control over when values are copied vs moved.

Without the Copy constructor, assignment moves instead of copying.

## References

References allow borrowing values without transferring ownership. References in Atlas 77 are:
- **Not nullable** – always point to valid values
- **Trivially copyable** – copying is implicit and cheap
- **Not rebindable** – may change in future versions

### Reference Syntax

```cpp
let value: int64 = 42;

// Mutable reference
let mutable_ref: &int64 = &value;

// Immutable reference
let immutable_ref: &const int64 = &const value;
```

### Using References

```cpp
fun modify_value(ref: &int64) -> unit {
    *ref = 100;  // Dereference and modify
}

let x: int64 = 42;
modify_value(&x);
println(x);  // 100
```

> [!Warning] 
> Reference design is still evolving and heavily inspired by Rust. Current behavior and semantics may change.

## Destructors

Destructors are special methods that clean up resources when an object is deleted:

```cpp
struct Resource {
public:
    ptr: int64;  // Some resource pointer
    
    Resource() {
        // Acquire resource
        this.ptr = allocate();
    }
    
    // Destructor: called by delete
    fun ~Resource(this: Resource) -> unit {
        if this.ptr != 0 {
            deallocate(this.ptr);
            this.ptr = 0;
        }
    }
}
```

Destructors are called:
1. When `delete` is explicitly called
2. When scope exits (automatic cleanup)
3. In the correct order for nested scopes

### Destructor Execution Order

For scoped values, destructors are called in **reverse order of construction** (LIFO):

```cpp
fun example() -> unit {
    let a: Resource = Resource();  // Constructed first
    let b: Resource = Resource();  // Constructed second
    
    // ...
    
} // Destructors called: ~b, then ~a (reverse order)
```

## Scope-Based Cleanup Rules

1. **Single scope:** Variables deleted at end of scope
2. **Early returns:** Variables deleted before returning
3. **Moved values:** Not deleted (ownership transferred)
4. **Conditional scopes:** Variables deleted when block exits

```cpp
fun conditional_cleanup(flag: bool) -> unit {
    let resource1: Resource = Resource();
    
    if flag {
        let resource2: Resource = Resource();
        // resource2 deleted here
    }
    
    // resource1 deleted here
}
```

## Lifetime and Validity

References must remain valid for their entire lifetime:

```cpp
fun create_ref() -> &int64 {
    let x: int64 = 42;
    return &x;  // ERROR: x will be deleted at end of scope
}
```

This is a common pitfall. Values cannot outlive their owners:

```cpp
fun valid_reference(x: &int64) -> &int64 {
    return x;  // OK: reference comes from parameter, guaranteed to be valid
}
```

## Current Limitations

- **Runtime is deprecated** – Precise semantics may evolve
- **Destructor semantics uncertain** – Copy/move interaction with destructors being refined
- **stdlib copyability uncertain** – Assume standard library types are non-copyable unless documented

## Future Improvements

- **Smart Pointers** (`rc_ptr<T>`) – Reference-counted pointers for shared ownership
- **Guaranteed Copy Constructor Optimization** – Automatic elision of unnecessary copies
- **Move Semantics Refinement** – Clearer rules for implicit copying vs. moving

---

See [Language Reference](./language-reference.md) for details on copy/move semantics.
