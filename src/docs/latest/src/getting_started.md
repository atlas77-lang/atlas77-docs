# Getting Started with Atlas 77

Welcome to Atlas 77! This guide will help you understand the basics of the language and write your first programs.

## Your First Program

Here is a simple "Hello, Atlas!" program:

```cpp
import "std/io";

fun main() {
    println("Hello, Atlas!");
}
```

Save this code to a `.atlas` file, then run it with:

```bash
atlas_77 run <FILE_PATH>
```

For example:
```bash
atlas_77 run hello.atlas
```

## Creating a Project

To create a new Atlas 77 project with standard structure:

```bash
atlas_77 init my_project
cd my_project
atlas_77 run
```

This creates a basic project template with all necessary files.

## Core Concepts

### 1. Comments

Comments document code and are ignored by the compiler.

```cpp
// This is a single-line comment
let x: int64 = 42;  // Comments can appear at the end of lines
```

> **Note:** Multi-line comments are not yet implemented.

### 2. Variables and Constants

Variables are declared with `let` (mutable) or `const` (immutable):

```cpp
import "std/io";

fun main() {
    let x: int64 = 5;
    x = 10;  // OK - mutable variable
    println(x);  // Output: 10

    const y: int64 = 5;
    // y = 10;  // Error: Cannot assign to a constant
}
```

Type annotations are mandatory for constants, the compiler can infer types for mutable variables. It's mandatory for the sake of readability.

### 3. Data Types

Atlas77 is statically and strongly typed.

#### Primitive Types

| Type      | Description               | Status |
|-----------|---------------------------|--------|
| `int64`   | 64-bit signed integer     | ✅     |
| `uint64`  | 64-bit unsigned integer   | ✅     |
| `float64` | 64-bit floating point     | ✅     |
| `bool`    | Boolean (`true`/`false`)  | ✅     |
| `char`    | Unicode character         | ✅     |
| `string`  | UTF-8 string              | ✅     |

Other integer and float sizes (`int8`, `int16`, `int32`, `float32`, etc.) are planned but not yet fully implemented.

#### Strings

Strings are UTF-8 encoded. Length is measured in bytes, not characters:

```cpp
import "std/io";

fun main() {
    let greeting: string = "Hello, Atlas!";
    println(greeting);
}
```

### 4. Functions

Functions are defined with the `fun` keyword and require explicit return types:

```cpp
import "std/io";

fun add(x: int64, y: int64) -> int64 {
    return x + y;
}

fun greet(name: string) -> unit {
    println("Hello, " + name);
}

fun main() {
    let result = add(5, 10);
    println(result);  // Output: 15
    
    greet("Atlas");  // Output: Hello, Atlas
}
```

Use `unit` as the return type for functions that don't return a value.

### 5. Control Flow

#### If-Else Statements

```cpp
import "std/io";

fun main() {
    let x = 5;

    if x > 0 {
        println("x is positive");
    } else if x < 0 {
        println("x is negative");
    } else {
        println("x is zero");
    }
}
```

#### While Loops

```cpp
import "std/io";

fun main() {
    let i = 0;
    while i < 5 {
        println(i);
        i = i + 1;
    }
}
```

> **Note:** For-loops and pattern matching are planned but not yet implemented.

### 6. Arrays

Arrays store multiple values of the same type with fixed size:

```cpp
import "std/io";

fun main() {
    let numbers: [int64] = [1, 2, 3, 4, 5];
    let i = 0;
    while i < 5 {
        println(numbers[i]);
        i = i + 1;
    }
}
```

You can also allocate arrays with specific sizes:

```cpp
import "std/io";

fun main() {
    // Allocate an array of 5 int64s
    let numbers = new [int64; 5];
    let i = 0;
    while i < 5 {
        numbers[i] = i * 2;
        println(numbers[i]);
        i = i + 1;
    }
}
```

### 7. Structs

Structs group related data together:

```cpp
import "std/io";

struct Person {
public:
    name: string;
    age: int64;
    
    Person(name: string, age: int64) {
        this.name = name;
        this.age = age;
    }
    
    fun greet(&this) {
        println("Hello, my name is " + this.name);
    }
}

fun main() {
    let person = new Person("Alice", 30);
    person.greet();  // Output: Hello, my name is Alice
}
```

Fields are private by default. Use `public:` to make them accessible outside the struct.

### 8. Enums

Enums define types with a set of named values:

```cpp
import "std/io";

public enum Color {
    Red = 1;
    Yellow;      // Auto-assigned: 2
    Green = 3;
    Purple;      // Auto-assigned: 4
    Blue = 5;
}

fun main() {
    let color = Color::Red;
    println(color);  // Output: 1
}
```

### 9. Generics

Define generic structs and functions with type parameters:

```cpp
import "std/io";

struct Box<T> {
public:
    value: T;
    
    Box(value: T) {
        this.value = value;
    }
    
    fun get(&this) -> &const T {
        return &(this.value);
    }
}

fun main() {
    let int_box = new Box<int64>(42);
    let val = int_box.get();
    println(*val);  // Output: 42
}
```

Type parameters must be explicitly specified at call sites.

### 10. Memory Management and Ownership

Atlas77 uses an ownership system for safe memory management:

```cpp
import "std/io";

struct Resource {
public:
    id: int64;
    
    Resource(id: int64) {
        this.id = id;
        println("Resource created");
    }
    
    ~Resource() {
        println("Resource destroyed");
    }
}

fun main() {
    let r = new Resource(1);
    // Resource automatically destroyed at end of scope
}
// Output:
// Resource created
// Resource destroyed
```

**Key Points:**
- Use `new` to allocate memory
- Memory is automatically freed at end of scope (RAII)
- Values are moved by default (source becomes invalid)
- Values can be copied if they have a `_copy` method

See [Memory Model](./memory-model.md) for complete details.

### 11. Error Handling

Atlas77 provides `optional<T>` and `expected<T, E>` for explicit error handling:

```cpp
import "std/io";
import "std/optional";

fun divide(a: int64, b: int64) -> optional<int64> {
    if b == 0 {
        return optional<int64>::empty();
    }
    return optional<int64>::of(a / b);
}

fun main() {
    let result = divide(10, 2);
    if result.has_value() {
        println(result.value());  // Output: 5
    } else {
        println("Division by zero!");
    }
}
```

See [Error Handling](./error-handling.md) for comprehensive examples.

### 12. The Standard Library

Atlas77 includes a standard library with essential functionality:

```cpp
import "std/io";        // Input/output
import "std/fs";        // File system
import "std/string";    // String utilities
import "std/vector";    // Dynamic arrays
import "std/optional";  // Optional values
import "std/expected";  // Error handling
import "std/math";      // Math functions
import "std/time";      // Time operations

fun main() {
    println("Hello, World!");
}
```

Check out the [Standard Library](./std.md) for complete documentation.

## Next Steps

Now that you understand the basics, explore these topics:

- **[Hello, World!](./hello_world.md)** – Detailed walkthrough of your first program
- **[Guessing Game](./guessing_game.md)** – Build a fun interactive program
- **[Language Reference](./language-reference.md)** – Complete language syntax
- **[Memory Model](./memory-model.md)** – Understand ownership and copy semantics  
- **[Error Handling](./error-handling.md)** – Master optional and expected types
- **[Standard Library](./std.md)** – Explore available modules

## Current Limitations

Atlas77 is actively developed. Some features are not yet available:

- ❌ Multi-line comments
- ❌ For-loops (range-based iteration)
- ❌ Pattern matching
- ❌ Break/continue statements
- ❌ First-class functions and closures
- ❌ Async/await
- ❌ Traits/interfaces

These features are planned for future releases. Check the [Roadmap](./roadmap.md) for more details.



