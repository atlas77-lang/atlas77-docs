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
