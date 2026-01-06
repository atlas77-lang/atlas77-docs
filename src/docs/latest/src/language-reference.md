# Language Reference

This document provides a comprehensive reference for Atlas 77 syntax, semantics, and language features.

## Syntax Overview

### Comments

Atlas 77 supports single-line comments only:

```cpp
// This is a single-line comment
let x: int64 = 42; // Comments can appear at end of line
```

> [!Note] 
> Multi-line comments (`/* ... */`) are not yet implemented.

### Keywords

Reserved keywords in Atlas 77 include: `let`, `const`, `fun`, `struct`, `import`, `return`, `if`, `else`, `while`, `for`, `new`, `delete`, `public`, `private`, `this`, and others.

Refer to [Reserved Keywords](./reserved_keywords.md) for the complete list.

## Variables and Constants

Variables are declared with `let` and constants with `const`. Type annotations are **mandatory** for constants, while the compiler can infer types for mutable variables. It's mandatory for the sake of readability.

```cpp
let x: int64 = 42;
let name: string = "Atlas";
const PI: float64 = 3.14159;

// Type inference is limited; explicit types are required
let result = 10; // Types can be inferred for initialized variables.
```

## Types

Atlas 77 is statically typed and strongly typed. Here are the fundamental types:

### Primitive Types

| Type      | Description                      | Size       |
|-----------|----------------------------------|------------|
| `int8`    | Signed 8-bit integer             | 1 byte     |
| `int16`   | Signed 16-bit integer            | 2 bytes    |
| `int32`   | Signed 32-bit integer            | 4 bytes    |
| `int64`   | Signed 64-bit integer            | 8 bytes    |
| `uint8`   | Unsigned 8-bit integer           | 1 byte     |
| `uint16`  | Unsigned 16-bit integer          | 2 bytes    |
| `uint32`  | Unsigned 32-bit integer          | 4 bytes    |
| `uint64`  | Unsigned 64-bit integer          | 8 bytes    |
| `float32` | 32-bit floating point            | 4 bytes    |
| `float64` | 64-bit floating point            | 8 bytes    |
| `bool`    | Boolean (`true` / `false`)       | 1 byte     |
| `char`    | Single Unicode character         | 4 bytes    |
| `string`  | UTF-8 string (length in bytes)   | Variable   |
| `unit`    | Empty type (like `void`)         | —          |

> [!Note]
> Some primitive types (like `int8`, `int16`, `float32`, etc.) are planned but not yet fully implemented.

### Strings

Strings are UTF-8 encoded and their length is measured in **bytes**, not characters:

```cpp
let greeting: string = "Hello, Atlas!";
```

> [!Note] 
> String type is currently temporary and may change in future versions.

### Arrays

Arrays have fixed length known at compile-time:

```cpp
let numbers: [int64] = [1, 2, 3, 4, 5];
let items: [string] = ["apple", "banana", "cherry"];
```

### Generics

Atlas 77 supports parametric types (generics) with **explicit type parameters** (no type inference):
> [!Warning]
> As of v0.7.0, type inference for generics is not supported. Type parameters must be explicitly specified.
> 
> Additionally, generic parameters name can only be a single uppercase letter (e.g., `T`, `U`, `V`). This is only temporary and will be relaxed in future versions.

```cpp
struct Box<T> {
public:
    value: T;
    Box(val: T) {
        this.value = val;
    }
}

fun get_value<T>(box: Box<T>) -> T {
    return box.value;
}

let int_box: Box<int64> = new Box<int64>(42);
let value: int64 = get_value<int64>(int_box);
```

Type parameters must be explicitly specified at call sites. For more details, see [Generics](./generics.md).

## Functions

Functions are declared with `fun` keyword and require explicit return types:

```cpp
fun add(a: int64, b: int64) -> int64 {
    return a + b;
}

// Function returning nothing (unit) doesn't require to specify return type
fun greet(name: string) {
    println("Hello, " + name);
}

// Functions that return nothing use return type 'unit'
fun perform_action() -> unit {
    // No return statement needed for unit
}
```

### Return Type Specification

Return types are mandatory for all functions. Use `unit` for functions that don't return a value.

## Operators and Precedence

Atlas 77 uses operator precedence similar to C/C++.

### Operator Precedence Table

Listed from highest to lowest precedence:

| Precedence | Operator                      | Associativity | Description                                       |
|------------|-------------------------------|---------------|---------------------------------------------------|
| 1          | `()` `[]` `.`                 | Left-to-right | Function call, array index, member access         |
| 2          | `!` `-` `+` `~`               | Right-to-left | Logical NOT, unary minus, unary plus, bitwise NOT |
| 3          | `*` `/` `%`                   | Left-to-right | Multiplication, division, modulo                  |
| 4          | `+` `-`                       | Left-to-right | Addition, subtraction                             |
| 5          | `<<` `>>`                     | Left-to-right | Bitwise shift left, shift right                   |
| 6          | `<` `<=` `>` `>=`             | Left-to-right | Relational operators                              |
| 7          | `==` `!=`                     | Left-to-right | Equality operators                                |
| 8          | `&`                           | Left-to-right | Bitwise AND                                       |
| 9          | `^`                           | Left-to-right | Bitwise XOR                                       |
| 10         | `\|`                          | Left-to-right | Bitwise OR                                        |
| 11         | `&&`                          | Left-to-right | Logical AND                                       |
| 12         | `\|\|`                        | Left-to-right | Logical OR                                        |
| 13         | `=` `+=` `-=` `*=` `/=` etc.  | Right-to-left | Assignment operators                              |

> [!Note]
> Operator overloading is **planned** for a future version.
> Some operators have not been implemented yet.

## Structs

Structs are product types that group related data:

```cpp
struct Person {
private:
    age: int32;
public:
    name: string;
    email: string;
    
    Person(name: string, email: string, age: int32) {
        this.name = name;
        this.email = email;
        this.age = age;
    }
    
    fun display(this: Person) -> unit {
        println(this.name);
    }
}
```

### Visibility Rules

By default, all struct fields and methods are **private**. To make fields or methods public, precede them with a `public:` block:

```cpp
struct Config {
private:
    internal_state: int64;
public:
    api_key: string;
    timeout: int32;
}
```

- Only `api_key` and `timeout` are accessible outside the struct
- `internal_state` is private and only accessible within struct methods

### Methods

Methods are functions associated with a struct. The receiver (`this`) is passed explicitly:

```cpp
fun display(this) -> unit {
    println(this.name);
}
```

## References

References allow you to work with values without taking ownership. References are **not nullable**.
> [!Warning]
> Reference design is still a work in progress. There is no guarantee that the current design will remain stable.

### Reference Syntax

```cpp
let x: int64 = 42;
let mutable_ref: &int64 = &x;      // Mutable reference
let immutable_ref: &const int64 = &x;  // Immutable reference
```

### Reference Behavior

- References are trivially copyable and are copied implicitly
- References cannot be null; all references point to valid values
- The mutability or immutability of the reference is determined at declaration time. `&my_var` just creates a reference and based on the context it is assigned to, it can be mutable or immutable.

## Copy and Move Semantics

Atlas77 uses an ownership system where values can be either copied or moved. See [Memory Model](./memory-model.md) for comprehensive details.

### Copy Semantics (Implicit)

Primitive types, strings, and references are **implicitly copyable**:

```cpp
let a: int64 = 10;
let b: int64 = a;  // 'a' is copied; both 'a' and 'b' exist

let s1: string = "hello";
let s2: string = s1;  // Strings are copyable

let ref_a: &int64 = &a;
let ref_b: &int64 = ref_a;  // Reference is copied
```

### Move Semantics (Default for Custom Types)

For custom structs, values are **moved by default** unless the struct implements a `_copy` method:

```cpp
struct Resource {
public:
    data: string;
    
    Resource(data: string) {
        this.data = data;
    }
}

let r1 = new Resource("data");
let r2 = r1;  // 'r1' is moved to 'r2'; 'r1' no longer accessible
// Using 'r1' here would be a compile error
```

### Auto-Generated Copy Constructor

The compiler automatically generates a `_copy` method for structs where the number of fields equals the number of constructor parameters:

```cpp
struct Point {
public:
    x: int64;
    y: int64;
    
    Point(x: int64, y: int64) {  // 2 params, 2 fields - auto-copy!
        this.x = x;
        this.y = y;
    }
}

let p1 = new Point(10, 20);
let p2 = p1;  // Copied automatically
```

### Manual Copy Constructor

To make a custom type copyable or customize copy behavior, implement a `_copy` method:

```cpp
struct CopyableData {
public:
    value: int64;
    
    CopyableData(val: int64) {
        this.value = val;
    }
    
    // Manual copy constructor
    fun _copy(&const this) -> CopyableData {
        return new CopyableData(*(this.value));
    }
}

let d1 = new CopyableData(100);
let d2 = d1;  // Now 'd1' is copied, both exist
```

> **Note:** The compiler automatically generates `_copy` for most simple structs. See [Memory Model](./memory-model.md) for complete rules.

## Memory Management

Atlas 77 uses **manual memory management** with automatic cleanup at scope boundaries.

### Allocation and Deallocation

```cpp
// Allocate memory with 'new'
let ptr: &MyStruct = &new MyStruct(...);

// Deallocate explicitly with 'delete'
delete ptr;
```

### Automatic Deallocation (RAII)

The compiler automatically inserts `delete` instructions at the end of each scope for variables that haven't been moved:

```cpp
fun example() -> unit {
    let resource: MyStruct = MyStruct();
    // ... use resource ...
} // Compiler automatically calls delete on 'resource' here
```

### Destructors

When a value is deleted, its destructor is called before memory is freed. Destructors clean up resources:

```cpp
struct File {
    path: string;
    
    // Destructor: called by delete
    fun ~File(this: File) -> unit {
        // Close file, cleanup resources
    }
}
```

> [!Note] 
> The current runtime is marked as deprecated. Precise semantics of destructors and scope-based cleanup may evolve.

## Error Handling

Atlas 77 provides `optional<T>` and `expected<T, E>` types for error handling. There is no implicit error propagation (no try/? operator); handle errors explicitly.

### optional Type

The `optional<T>` type represents a value that may or may not exist:

```cpp
import "std/optional";

fun find_user(id: int64) -> optional<User> {
    if id > 0 {
        let user = new User(id);
        return optional<User>::of(user);
    } else {
        return optional<User>::empty();
    }
}

// Using optional
let user_opt = find_user(1);
if user_opt.has_value() {
    let user = user_opt.value();
    println("Found user");
} else {
    println("User not found");
}
```

### expected Type

The `expected<T, E>` type represents either a success value or an error:

```cpp
import "std/expected";

fun parse_int(s: string) -> expected<int64, string> {
    // Try to parse
    if is_valid_number(s) {
        let number = convert_to_int(s);
        return expected<int64, string>::expect(number);
    } else {
        return expected<int64, string>::unexpected("Failed to parse");
    }
}

// Using expected
let result = parse_int("42");
if result.is_expected() {
    let number = result.expected_value();
    println(number);
} else {
    let error = result.unexpected_value();
    println(error);
}
```

### Value Extraction with Defaults

```cpp
import "std/optional";
import "std/expected";

// optional with default
let value = some_optional.value_or(42);

// expected with default
let value = some_expected.expected_value_or(0);
```

> **Note:**  
> There is no automatic error propagation syntax (`try` / `?` operator) by design to maintain explicit control and avoid "hidden magic" in error handling.
>
> See [Error Handling](./error-handling.md) for comprehensive examples and best practices.

## Modules and Imports

### Current Import System

Use the `import` statement to include modules:

```cpp
import "std/io";
import "std/fs";
import "std/string";

fun main() -> unit {
    println("Hello, Atlas!");
}
```

Imports use file paths (not yet package-based). The compiler locates module files relative to the standard library.

> [!Warning] 
> Multiple imports of the same module may result in duplication even with guard mechanisms. This is a known limitation of the current system.

### Future: Package-Based Imports

Package-based imports and selective imports are **planned** for after the compiler bootstrap phase. Expected syntax:

```cpp
// Planned (not yet available):
// import mypackage::io;
// from mypackage import io, fs;
```

## Control Flow

### If-Else

```cpp
if condition {
    // ...
} else if other_condition {
    // ...
} else {
    // ...
}
```

### While Loops

```cpp
while x < 10 {
    x = x + 1;
}
```

### For Loops (Basic)

Basic for loops are currently supported:

```cpp
for i in 0..10 {  // Range iteration is planned
    println(i);
}
```

> [!Note] 
> Range-based for-loops (`for x in range`) are **planned** for a future version.

## Planned Features

The following features are actively developed and planned for future releases:

- **Operator Overloading** – Define custom behavior for operators like `+`, `-`, `*`, etc.
- **For-loops over Ranges** – Iterate over ranges with syntax like `for i in 0..10`
- **Pattern Matching** – Destructure and match values
- **First-class Functions and Closures** – Functions as values, anonymous functions, closures
- **Async/Await** – Asynchronous programming support
- **Traits** (or "Concepts") – Define shared behavior across types
- **Union Types** – Discriminated unions for variant data
- **Package System** – Dependency management and package organization
- **Package Manager** – Tool for downloading and managing packages
- **Copy & Move Semantics Refinement** – Better documentation and ergonomics
- **Dead Code Elimination** – Optimization pass to remove unused code
- **Cranelift Backend** – Native code generation (in addition to VM execution)
- **Compiler Error Recovery** – Better error messages and recovery from multiple errors

## Known Limitations and Footguns

- **No multiline comments** – Only single-line comments with `//`
- **No pattern matching** – Cannot destructure values into patterns
- **No break/continue** – Loop control statements not yet implemented
- **No variadics** – Variable argument functions not supported
- **No named parameters** – All parameters are positional
- **No inheritance** – Structs use composition instead of inheritance
- **No type inference** – All type annotations must be explicit
- **String type is temporary** – May change in future versions
- **stdlib copyability uncertain** – Assume standard library types are non-copyable

---

For detailed examples and tutorials, see:
- [Hello, World!](./hello_world.md)
- [Guessing Game](./guessing_game.md)
- [Standard Library](./std.md)
