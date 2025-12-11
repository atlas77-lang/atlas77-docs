# Memory Model

Atlas 77 employs **manual memory management** with **automatic scope-based cleanup**. This document explains how memory allocation, deallocation, and ownership work.

## Allocation with `new`

Memory is allocated using the `new` keyword:

```cpp
struct Person {
public:
    name: string;
    age: int32;
    
    Person(name: string, age: int32) {
        this.name = name;
        this.age = age;
    }
}

let person: &Person = &new Person("Alice", 30);
```

## Deallocation with `delete`

Memory is freed using the `delete` keyword:

```cpp
delete person;  // Free memory and call destructor
```

The `delete` operation:
1. Calls the destructor (if one exists)
2. Frees the allocated memory
3. Invalidates the reference

## Automatic Scope-Based Cleanup (RAII)

The compiler automatically inserts `delete` instructions at the end of each scope for variables that haven't been moved yet:

```cpp
fun process_file() -> unit {
    let file: File = File("data.txt");
    
    // ... use file ...
    
} // Compiler automatically calls: delete file;
```

This pattern is called **RAII** (Resource Acquisition Is Initialization):
- Resources are acquired during object construction (`new`)
- Resources are released automatically at scope exit via destructors

### Example: File Resource Management

```cpp
struct File {
    path: string;
    is_open: bool;
    
    // Constructor acquires resource
    File(path: string) {
        this.path = path;
        this.is_open = true;
        // Open file
    }
    
    // Destructor releases resource
    fun ~File(this: File) -> unit {
        if this.is_open {
            // Close file
            this.is_open = false;
        }
    }
}

fun read_and_process() -> unit {
    let file: File = File("input.txt");
    let content: string = file.read();
    
    // ...
    
} // File destructor called here; file is automatically closed
```

## Ownership and Move Semantics

Atlas 77 uses **move semantics by default** for custom types. When you assign a value, ownership transfers to the new variable:

```cpp
struct Box<T> {
public:
    value: T;
}

let box1: Box<int64> = Box(42);
let box2: Box<int64> = box1;  // Ownership moves from box1 to box2

// box1 is no longer accessible; moved values cannot be used
// println(box1.value);  // ERROR: box1 has been moved
```

Once a value is moved, the original variable becomes inaccessible. This prevents use-after-free bugs:

```cpp
fun take_ownership(b: Box<int64>) -> unit {
    println(b.value);
    // b is deleted at end of scope
}

let box: Box<int64> = Box(100);
take_ownership(box);  // Ownership transfers to function
// println(box.value);  // ERROR: box has been moved
```

## Copy Semantics

### Implicit Copy (Primitive Types and References)

Primitive types and references are implicitly copyable:

```cpp
let x: int64 = 42;
let y: int64 = x;  // 'x' is copied; both x and y exist

let ref_x: &int64 = &x;
let ref_y: &int64 = ref_x;  // Reference is copied
```

### Opt-In Copy (Custom Types)

To make a custom type copyable, implement a **Copy constructor**:

```cpp
struct MyData {
public:
    value: int64;
    
    MyData(val: int64) {
        this.value = val;
    }
    
    // Copy constructor
    fun Copy(this: MyData) -> MyData {
        return MyData(this.value);
    }
}

let data1: MyData = MyData(100);
let data2: MyData = data1;  // Now data1 is copied; both data1 and data2 exist
```

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
