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
| [std/io](./libraries/std-io.md) | Input/output operations (print, println, input, panic) | ✅ Stable |
| [std/string](./libraries/std-string.md) | String manipulation and text processing | ✅ Stable |
| [std/mem](./libraries/std-mem.md) | Memory management utilities (swap, drop, size_of) | ✅ Stable |

### Collections

| Module | Description | Status |
|--------|-------------|--------|
| [std/vector](./libraries/std-vector.md) | Dynamic arrays with Vector<T> | ✅ Stable |
| [std/map](./libraries/std-map.md) | Hash maps for key-value storage with Map<K,V> | ✅ Stable |
| [std/queue](./libraries/std-queue.md) | FIFO queue data structure with Queue<T> | ✅ Stable |
| [std/iter](./libraries/std-iter.md) | Iterator utilities with Iter<T> | ✅ Stable |

### Error Handling

| Module | Description | Status |
|--------|-------------|--------|
| [std/optional](./libraries/std-optional.md) | Nullable values with optional<T> | ✅ Stable |
| [std/expected](./libraries/std-expected.md) | Result types for error handling with expected<T,E> | ✅ Stable |

### File System

| Module | Description | Status |
|--------|-------------|--------|
| [std/fs](./libraries/std-fs.md) | File operations (read, write, exists, remove) | ✅ Stable |

### Math & Time

| Module | Description | Status |
|--------|-------------|--------|
| [std/math](./libraries/std-math.md) | Mathematical functions (abs, min, max, pow, trigonometry, random) | ✅ Stable |
| [std/time](./libraries/std-time.md) | Time operations and formatting | ✅ Stable |

### Deprecated Modules

| Module | Description | Status |
|--------|-------------|--------|
| [std/box](./libraries/std-box.md) | Heap-allocated values - use direct allocation instead | ⚠️ Deprecated |
