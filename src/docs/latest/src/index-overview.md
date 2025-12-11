# Documentation Overview

Welcome to the Atlas 77 documentation! This guide will help you navigate and understand the language.

## Quick Navigation

### New to Atlas 77?

Start here:
1. [Getting Started](./getting_started.md) – Install and run your first program
2. [Hello, World!](./hello_world.md) – Your first program walkthrough
3. [Introduction](./introduction.md) – Overview of Atlas 77 and its goals

### Learning the Language

- [Language Reference](./language-reference.md) – Complete syntax guide covering:
  - Variables, types, and type system
  - Functions and operators
  - Structs and methods
  - References and ownership
  - Control flow
  - Modules and imports
  - Planned features

- [Memory Model](./memory-model.md) – Understand how memory works:
  - Allocation with `new` and deallocation with `delete`
  - Move and copy semantics
  - Automatic scope-based cleanup
  - References and borrowing
  - RAII patterns

- [Error Handling](./error-handling.md) – Work with errors:
  - `Option<T>` type
  - `Result<T, E>` type
  - Explicit error checking
  - Best practices

### Practical Examples

- [Guessing Game Tutorial](./guessing_game.md) – Build an interactive program
- [Blue Engine](./blue_engine.md) – Graphics and game development

### Standard Library

- [Standard Library Reference](./std.md) – All built-in modules:
  - `std/io` – Input/output
  - `std/fs` – File operations
  - `std/string` – String manipulation
  - `std/vector` – Dynamic arrays
  - `std/option` – Optional values
  - `std/result` – Result type
  - `std/map` – Key-value collections
  - `std/iter` – Iterators
  - And more...

### Advanced Topics

- [Generics](./generics.md) – Parametric types and generic programming
- [Reserved Keywords](./reserved_keywords.md) – Complete keyword list
- [VM Instructions](./vm_instructions.md) – Low-level bytecode instructions

### Planning & Development

- [Roadmap](./roadmap.md) – See what's coming:
  - Planned language features
  - Standard library expansion
  - Compiler improvements
  - Timeline and milestones

## Language At a Glance

### Philosophy

> "Maximum control, safety opt-in"

Atlas 77 prioritizes **explicit control** over implicit behavior:
- Manual memory management with automatic cleanup
- Explicit error handling (no implicit exceptions)
- Move semantics by default for custom types
- No inheritance (composition instead)
- No "hidden magic" – everything is visible in code

### Key Features

- **Statically typed** – All types explicit; limited inference
- **Memory safe** – Scope-based cleanup prevents leaks
- **Fast** – At least should be 🥸
- **Familiar** – Syntax inspired by C++, Rust, and modern languages

### Simple Example

```cpp
import "std/io";

// Define a struct
struct Person {
public:
    name: string;
    age: int32;
    
    Person(name: string, age: int32) {
        this.name = name;
        this.age = age;
    }
    
    fun display(this: Person) -> unit {
        println("Name: " + this.name);
    }
}

// Use the struct
fun main() -> int64 {
    let person: Person = Person("Alice", 30);
    person.display();
    return 0;
}
```

## Common Tasks

### Create a New Project
```bash
atlas_77 init my_project
cd my_project
atlas_77 build
atlas_77 run
```

### Run a Single File
```bash
atlas_77 run hello.atlas
```

### Read from User Input
```cpp
import "std/io";

fun main() -> int64 {
    let line: string = input();
    println("You entered: " + line);
    return 0;
}
```

### Work with Files
```cpp
import "std/fs";

fun main() -> int64 {
    let content: string = read_file("data.txt");
    write_file("output.txt", content);
    return 0;
}
```

### Handle Errors
```cpp
import "std/io";

fun divide(a: int64, b: int64) -> Result<int64, string> {
    if b == 0 {
        return Result(false, 0, "Division by zero");
    } else {
        return Result(true, a / b, "");
    }
}

fun main() -> int64 {
    let result: Result<int64, string> = divide(10, 2);
    if result.is_ok {
        println("Result: " + result.ok_value);
    } else {
        println("Error: " + result.err_value);
    }
    return 0;
}
```

## Current Status

Atlas 77 is **actively developed** and in **early stages**. Expect:
- Breaking changes between versions
- Missing features from the roadmap
- Incomplete error messages
- Potential bugs

This is **not production-ready** software. Use for learning and experimentation.

## Contributing & Feedback

Have questions or ideas? The Atlas 77 compiler repository welcomes:
- Bug reports
- Feature requests
- Documentation improvements
- Community discussions

## Architecture Overview

```
┌─────────────────────────────────────┐
│   Atlas 77 Source Code (.atlas)     │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   Compiler (Rust)                   │
│   - Parser                          │
│   - Type Checker                    │
│   - Code Generator                  │
└──────────────┬──────────────────────┘
               │
               ├─────────────────────────┐
               │                         │
               ▼                         ▼
    ┌──────────────────┐     ┌──────────────────┐
    │  VM Bytecode     │     │  Native Code     │
    │  (Current)       │     │  (Planned)       │
    └────────┬─────────┘     └────────┬─────────┘
             │                        │
             ▼                        ▼
    ┌──────────────────┐     ┌──────────────────┐
    │  VM Interpreter  │     │  Native Binary   │
    │  (Runtime)       │     │  Executable      │
    └────────┬─────────┘     └────────┬─────────┘
             │                        │
             └────────────┬───────────┘
                          │
                          ▼
                    ┌──────────────┐
                    │   Output     │
                    └──────────────┘
```

## See Also

- **[Introduction](./introduction.md)** – Atlas 77 goals and philosophy
- **[Language Reference](./language-reference.md)** – Full syntax reference
- **[Roadmap](./roadmap.md)** – Future direction

---

Happy coding! Start with [Getting Started](./getting_started.md) if you're new to Atlas 77.
