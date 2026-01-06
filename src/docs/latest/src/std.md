# Standard Library

> **Note:**  
> The standard library is a work in progress. Some modules are complete while others are still in development. This documentation reflects the current state of the implemented modules.

## Overview

The Atlas77 standard library provides essential data structures, utilities, and I/O functions. The library is organized into modules that can be imported individually.

**Each module is now documented on its own page with complete API reference, usage examples, and best practices.**

## Module Index

### Core Utilities

| Module | Description | Status |
|--------|-------------|--------|
| [std/io](./std-io.md) | Input/output operations (print, println, input, panic) | ✅ Stable |
| [std/string](./std-string.md) | String manipulation and text processing | ✅ Stable |
| [std/mem](./std-mem.md) | Memory management utilities (swap, drop, size_of) | ✅ Stable |

### Collections

| Module | Description | Status |
|--------|-------------|--------|
| [std/vector](./std-vector.md) | Dynamic arrays with Vector<T> | ✅ Stable |
| [std/map](./std-map.md) | Hash maps for key-value storage with Map<K,V> | ✅ Stable |
| [std/queue](./std-queue.md) | FIFO queue data structure with Queue<T> | ✅ Stable |
| [std/iter](./std-iter.md) | Iterator utilities with Iter<T> | ✅ Stable |

### Error Handling

| Module | Description | Status |
|--------|-------------|--------|
| [std/optional](./std-optional.md) | Nullable values with optional<T> | ✅ Stable |
| [std/expected](./std-expected.md) | Result types for error handling with expected<T,E> | ✅ Stable |

### File System

| Module | Description | Status |
|--------|-------------|--------|
| [std/fs](./std-fs.md) | File operations (read, write, exists, remove) | ✅ Stable |

### Math & Time

| Module | Description | Status |
|--------|-------------|--------|
| [std/math](./std-math.md) | Mathematical functions (abs, min, max, pow, trigonometry, random) | ✅ Stable |
| [std/time](./std-time.md) | Time operations and formatting | ✅ Stable |

### Deprecated Modules

| Module | Description | Status |
|--------|-------------|--------|
| [std/box](./std-box.md) | Heap-allocated values - use direct allocation instead | ⚠️ Deprecated |

## Quick Start Examples

### Hello World

```cpp
import "std/io";

fun main() {
    println("Hello, Atlas77!");
}
```

### Working with Collections

```cpp
import "std/vector";
import "std/io";

fun main() {
    let numbers = new Vector<int64>([1, 2, 3, 4, 5]);
    
    numbers.push(6);
    
    let iter = numbers.into_iter();
    while iter.has_next() {
        let num = iter.next().value();
        println(num);
    }
}
```

### Error Handling

```cpp
import "std/optional";
import "std/io";

fun divide(a: int64, b: int64) -> optional<int64> {
    if b == 0 {
        return optional<int64>::empty();
    }
    return optional<int64>::of(a / b);
}

fun main() {
    let result = divide(10, 2);
    
    if result.has_value() {
        println("Result: " + result.value());
    } else {
        println("Division by zero!");
    }
}
```

### File Operations

```cpp
import "std/fs";
import "std/io";

fun main() {
    let file = File::open("data.txt");
    let content = file.read();
    
    println("File contents:");
    println(content);
    
    file.close();
}
```

### Using Maps

```cpp
import "std/map";
import "std/io";

fun main() {
    let scores = new Map<string, int64>();
    
    scores.insert("Alice", 95);
    scores.insert("Bob", 87);
    scores.insert("Charlie", 92);
    
    let alice_score = scores.get("Alice");
    if alice_score.has_value() {
        println("Alice's score: " + *alice_score.value());
    }
}
```

## Common Patterns

### Iterator Pattern

Most collections provide an `into_iter()` method that consumes the collection and returns an iterator:

```cpp
import "std/vector";
import "std/iter";

let vec = new Vector<int64>([1, 2, 3]);
let iter = vec.into_iter();

while iter.has_next() {
    let item = iter.next().value();
    // Process item
}
```

### Error Handling with optional

Use `optional<T>` for values that might not exist:

```cpp
import "std/optional";

// Function that might not return a value
fun find_item(items: [int64], target: int64) -> optional<int64> {
    let i = 0;
    while i < len(&items) {
        if items[i] == target {
            return optional<int64>::of(i);
        }
        i = i + 1;
    }
    return optional<int64>::empty();
}

// Usage
let result = find_item([1, 2, 3], 2);
if result.has_value() {
    println("Found at index: " + result.value());
}
```

### Error Handling with expected

Use `expected<T, E>` for operations that can fail with error information:

```cpp
import "std/expected";
import "std/fs";

fun safe_read_file(path: string) -> expected<string, string> {
    if !File::exists(path) {
        return expected<string, string>::unexpected("File not found");
    }
    
    let file = File::open(path);
    let content = file.read();
    file.close();
    
    return expected<string, string>::expect(content);
}

// Usage
let result = safe_read_file("data.txt");
if result.is_expected() {
    println(result.expected_value());
} else {
    println("Error: " + result.unexpected_value());
}
```

## Module Import

To use any standard library module, import it at the top of your file:

```cpp
import "std/io";
import "std/vector";
import "std/map";
```

You can import multiple modules as needed. The import system loads the module once and makes all its public functions, structs, and methods available.

## Conventions

### Naming
- **Functions**: `snake_case` (e.g., `to_upper`, `split_lines`)
- **Structs**: `PascalCase` (e.g., `Vector`, `File`, `Time`)
- **Methods**: `snake_case` (e.g., `has_value`, `is_empty`)
- **Constants**: `SCREAMING_SNAKE_CASE` (e.g., `MAX_SIZE`)

### Error Handling
- Functions that might fail return `optional<T>` (no error info) or `expected<T,E>` (with error info)
- Use `panic()` only for unrecoverable errors

### Memory Management
- Types follow move-by-default semantics
- Copyable types must implement a `_copy()` method
- Use references (`&T`, `&T`) to borrow without moving

## Performance Considerations

- **Vector**: O(1) append (amortized), O(1) indexed access, O(n) insert/remove in middle
- **Map**: O(1) average case insert/get/remove, O(n) worst case
- **Queue**: O(1) enqueue/dequeue
- **Iterator**: Zero-cost abstractions, compiled away

## See Also

- [Getting Started](./getting_started.md) - Complete guide for new users
- [Memory Model](./memory-model.md) - Understanding ownership and move semantics
- [Error Handling](./error-handling.md) - Detailed error handling patterns
- [Generics](./generics.md) - Using generic types and constraints
- [Language Reference](./language-reference.md) - Complete language syntax

