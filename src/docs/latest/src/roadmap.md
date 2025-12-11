# Atlas 77 Language Roadmap

This document outlines the planned features and improvements for Atlas 77. Features are organized by category and development status.

## Current Version

Atlas 77 is currently in **early development** (v0.6). The compiler and runtime are functional but not production-ready. Expect breaking changes and API modifications.

## Language Features

### Implemented ✅

- **Static typing** – All variables require explicit type annotations
- **Structs** – Product types with fields and methods
- **Functions** – First-class declaration with explicit return types
- **Generics** – Parametric types with explicit type parameters
- **Control flow** – `if`/`else`, `while` loops
- **Memory management** – `new`/`delete` with RAII cleanup
- **References** – Borrowing without ownership transfer
- **Copy/Move semantics** – Copy implicit for primitives, move for custom types
- **Error types** – `Option<T>` and `Result<T, E>` for error handling
- **Comments** – Single-line comments with `//`

### Planned 🎯

#### High Priority

1. **Operator Overloading**
   - Allow custom implementations of `+`, `-`, `*`, `/`, `==`, `<`, etc.
   - Enable ergonomic syntax for user-defined types
   - Status: Design phase

2. **For-loops over Ranges**
   - Syntax: `for i in 0..10 { ... }`
   - Support inclusive ranges: `0..=10`
   - Status: Design phase

3. **Pattern Matching**
   - Match expressions 
   - Status: Design phase

4. **Copy & Move Semantics Refinement**
   - Better ergonomics for ownership patterns
   - Improved compiler diagnostics
   - Status: In progress

5. **Dead Code Elimination**
   - Optimization pass to remove unused variables, functions, and code
   - Status: Planned

6. **Compiler Improvements**
    - **Error Recovery** – Report multiple errors instead of stopping at first
    - **Better diagnostics** – More helpful error messages with suggestions
    - **Optimization passes** – Constant folding, inlining, etc.
    - Status: Ongoing

7. **Code Generation Backends**
    - **Cranelift Backend** – Native code generation (in addition to VM)
    - Status: Cranelift in progress

#### Medium Priority 

8. **First-class Functions and Closures**
   - Functions as values: `fun_ptr: fun(int64) -> int64`
   - Anonymous functions: `fun (x: int64) -> int64 { x * 2 }`
   - Closures that capture variables
   - Status: Design phase

9. **Concepts** 
   - Define shared behavior and interfaces
   - Generic constraints on type parameters
   - Default implementations
   - Status: Design phase

10. **Union Types**
   - Discriminated unions for variant data
   - Similar to Rust enums with pattern matching
   - Status: Design phase

11. **Smart Pointers**
    - `rc_ptr<T>` – Reference-counted pointers for shared ownership
    - Status: Experimental (std/rc_ptr, WIP)

12. **Type Casting**
    - Explicit casting utilities in `std/cast`
    - Support for numeric and structural conversions
    - Status: Experimental (std/cast, WIP)

#### Lower Priority

13. **Async/Await**
   - Non-blocking I/O support
   - `async` functions and `await` expressions
   - Status: Design phase

14. **Package System**
    - Organize code into packages
    - Namespace support for avoiding name collisions
    - Status: Design phase

15. **Package Manager**
    - Dependency resolution and management
    - Binary distribution via crates.io
    - Status: Design phase

## Standard Library Roadmap

### Core Modules (v1.0)

- ✅ `std/io` – Input/output (print, input, panic) *note: println WIP*
- ✅ `std/fs` – File system operations
- ✅ `std/string` – String manipulation
- ✅ `std/vector` – Dynamic arrays
- ✅ `std/option` – Optional values
- ✅ `std/result` – Error handling with results
- ✅ `std/box` – Heap-allocated values
- ✅ `std/iter` – Iterators and iteration
- ✅ `std/map` – Key-value collections
- ✅ `std/time` – Time and duration
- ✅ `std/math` – Mathematical functions

### Experimental Modules (v0.6)

- 🔧 `std/rc_ptr` – Reference-counted smart pointers (WIP)
- 🔧 `std/cast` – Type conversion utilities (WIP)

### Future Modules (v2.0+)

- 📋 `std/sync` – Threads and synchronization
- 📋 `std/net` – Network I/O and TCP/UDP sockets
- 📋 `std/json` – JSON serialization/deserialization
- 📋 `std/regex` – Regular expressions
- 📋 `std/hash` – Cryptographic and hash functions
- 📋 `core/graphics` – Graphics rendering (Vulkan/OpenGL/DirectX)
- 📋 `core/sdl` – SDL 2.0 bindings
- 📋 `core/ffi` – C FFI (foreign function interface)
- 📋 `core/ffi_rust` – Rust FFI

## Runtime & VM

### Current Status

- VM-based interpreter (deprecated, to be replaced)
- Basic execution model for testing and learning
- Not optimized for performance

### Planned Improvements

1. **Cranelift Backend** – Compile to native code for performance
2. **Optimizations** – Constant folding, dead code elimination, inlining
3. **Error Recovery** – Report multiple compilation errors
4. **Better Diagnostics** – Improving the context and suggestions in error messages

## Tooling

### `atlas_77` CLI

#### Implemented ✅
- `atlas_77 init <project>` – Create new project
- `atlas_77 build <file>` – Compile project
- `atlas_77 run <file>` – Execute file or project
- `atlas_77 help` – Show help

#### Planned 🎯
- `atlas_77 test` – Run tests
- `atlas_77 doc` – Generate documentation

### Build Artifacts

- Default location: `./builds/<project_name>/`
- Binary format: VM bytecode (temporary)
- Native code (future)

## Compiler Features

### Optimizations

- 📋 Dead code elimination
- 📋 Constant folding
- 📋 Function inlining
- 📋 Loop unrolling
- 📋 Register allocation (with native backend)

## Milestone Timeline

- **v0.3.x**:
    - Initial language design
    - Basic parser implementation
    - Basic AST visitor runtime

- **v0.4.x**:
    - Prototype language design
    - Basic parser and AST

- **v0.5.x (completed)**:
    - Proof of concept compiler
    - Basic syntax and semantics

- **vO.6.x (current)**: 
    - Core language features
    - Basic standard library
    - Move & copy semantics
> [!Note] Nothing is set in stone; timelines may shift based on what I want to work on and community feedback.
- **v0.7.x**:
    - Cranelift backend MVP
- **Future versions**:
    - Operator overloading
    - Pattern matching
    - First-class functions & closures
    - Concepts
    
> [!Note] 
> Timeline is aspirational and subject to change based on development priorities and community feedback.

## Contributing

The language is actively developed. Feature requests, bug reports, and discussions are welcome. Development happens in the compiler repository.

## See Also

- [Language Reference](./language-reference.md)
- [Memory Model](./memory-model.md)
- [Standard Library](./std.md)
