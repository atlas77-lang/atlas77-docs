# Generics

Generics allow you to write flexible, reusable code by parameterizing types. Atlas77 supports generics for both structs and functions.

## Overview

Generics enable you to define data structures and functions that work with multiple types while maintaining type safety. Instead of writing separate implementations for each type, you write one generic implementation.

**Key Points:**
- Generic parameters must be **explicitly specified** at call sites (no type inference)
- Generic parameter names must be **single uppercase letters** (e.g., `T`, `U`, `V`)
- Constraints can be applied to restrict what types can be used
- Currently, only the `std::copyable` constraint is available

> **Note:** The single-letter restriction for generic parameter names is temporary and will be relaxed in future versions.

## Generic Structs

Define a struct with type parameters using angle brackets:

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
    
    fun set(&this, value: T) {
        this.value = value;
    }
}

fun main() {
    // Type parameter must be explicitly specified
    let int_box = new Box<int64>(42);
    let str_box = new Box<string>("Hello");
    
    println(*int_box.get());  // Output: 42
    println(*str_box.get());  // Output: Hello
}
```

### Multiple Type Parameters

Structs can have multiple generic parameters:

```cpp
struct Pair<K, V> {
public:
    key: K;
    value: V;
    
    Pair(key: K, value: V) {
        this.key = key;
        this.value = value;
    }
    
    fun get_key(&const this) -> K {
        return *(this.key);
    }
    
    fun get_value(&const this) -> V {
        return *(this.value);
    }
}

fun main() {
    let pair = new Pair<int64, string>(1, "one");
    println(pair.get_key());    // Output: 1
    println(pair.get_value());  // Output: one
}
```

## Generic Functions

Functions can also be generic:

```cpp
import "std/io";

fun identity<T>(value: T) -> T {
    return value;
}

fun swap<T, U>(a: T, b: U) -> Pair<U, T> {
    return new Pair<U, T>(b, a);
}

fun main() {
    // Explicit type parameters required
    let x = identity<int64>(42);
    let s = identity<string>("hello");
    
    println(x);  // Output: 42
    println(s);  // Output: hello
}
```

### Calling Generic Functions

Type parameters must be explicitly specified when calling generic functions:

```cpp
// ✓ Correct - explicit type parameter
let result = identity<int64>(42);

// ✗ Error - type inference not supported
// let result = identity(42);
```

## Generic Constraints

Constraints restrict which types can be used as generic parameters. They ensure that generic code only works with types that support required operations.

### The `std::copyable` Constraint

The `std::copyable` constraint requires that a type can be copied (has a `_copy` method or is a primitive type).

#### Syntax

Apply constraints using a colon (`:`) after the type parameter name:

```cpp
struct Container<T: std::copyable> {
public:
    data: T;
    
    Container(data: T) {
        this.data = data;
    }
    
    // This method requires T to be copyable
    fun duplicate(&const this) -> T {
        return *(this.data);  // Copy the data
    }
}
```

#### Multiple Parameters with Mixed Constraints

You can have some constrained and some unconstrained parameters:

```cpp
// T and S are copyable, U has no constraint
struct Mixed<T: std::copyable, S: std::copyable, U> {
public:
    first: T;
    second: S;
    third: U;
    
    Mixed(first: T, second: S, third: U) {
        this.first = first;
        this.second = second;
        this.third = third;
    }
    
    // Can copy first and second because they're copyable
    fun get_first_copy(&const this) -> T {
        return *(this.first);
    }
    
    fun get_second_copy(&const this) -> S {
        return *(this.second);
    }
    
    // Can only return reference to third (not copyable)
    fun get_third_ref(&const this) -> &const U {
        return &(this.third);
    }
}
```

### When to Use Constraints

Use `std::copyable` when your generic code needs to:
- Return values by copy
- Store multiple copies of the same value
- Pass values to functions that consume them (and you need to keep a copy)

```cpp
import "std/vector";

struct Cache<T: std::copyable> {
private:
    items: Vector<T>;
public:
    Cache() {
        this.items = Vector<T>::with_capacity(10u);
    }
    
    fun add(&this, item: T) {
        this.items.push(item);
    }
    
    // Requires copyable to return a copy
    fun get(&this, index: uint64) -> T {
        return *(this.items.get(index));
    }
}

fun main() {
    // Works with copyable types
    let cache = new Cache<int64>();
    cache.add(42);
    let value = cache.get(0u);  // Copy returned
    println(value);
}
```

## Common Patterns

### Generic Container with Methods

```cpp
import "std/optional";

struct Option<T> {
private:
    has_value: bool;
    value: T;
public:
    Option(has_value: bool, value: T) {
        this.has_value = has_value;
        this.value = value;
    }
    
    fun is_some(&this) -> bool {
        return this.has_value;
    }
    
    fun unwrap(this) -> T {
        if !this.has_value {
            panic("Called unwrap on empty Option");
        }
        return this.value;
    }
}
```

### Generic Functions with Constraints

```cpp
// Only works with copyable types
fun create_pair<T: std::copyable>(value: T) -> Pair<T, T> {
    return new Pair<T, T>(value, value);
}

fun main() {
    let pair = create_pair<int64>(42);
    println(pair.get_key());    // 42
    println(pair.get_value());  // 42
}
```

### Generic Wrapper

```cpp
struct Wrapper<T> {
private:
    inner: T;
public:
    Wrapper(inner: T) {
        this.inner = inner;
    }
    
    fun get_ref(&const this) -> &const T {
        return &(this.inner);
    }
    
    fun get_mut(&this) -> &T {
        return &(this.inner);
    }
    
    fun consume(this) -> T {
        return this.inner;
    }
}
```

## Examples from Standard Library

### Vector<T>

The standard library's `Vector<T>` is a good example of generics in action:

```cpp
import "std/vector";

fun main() {
    // Generic over int64
    let numbers = new Vector<int64>([1, 2, 3]);
    numbers.push(4);
    
    // Generic over string
    let names = new Vector<string>(["Alice", "Bob"]);
    names.push("Charlie");
}
```

### optional<T>

The `optional<T>` type uses generics for nullable values:

```cpp
import "std/optional";

fun divide(a: int64, b: int64) -> optional<int64> {
    if b == 0 {
        return optional<int64>::empty();
    }
    return optional<int64>::of(a / b);
}
```

### expected<T, E>

The `expected<T, E>` type uses two generic parameters:

```cpp
import "std/expected";

fun parse_int(s: string) -> expected<int64, string> {
    if is_valid(s) {
        return expected<int64, string>::expect(parse(s));
    }
    return expected<int64, string>::unexpected("Invalid number");
}
```

## Current Limitations

- **No type inference** – Type parameters must always be explicitly specified
- **Single-letter names only** – Generic parameters must be single uppercase letters (temporary)
- **One constraint only** – Only `std::copyable` is currently available
- **No default type parameters** – Cannot specify default types for generic parameters
- **No variance annotations** – No covariance or contravariance support

## Future Enhancements

Planned improvements for the generics system include:

- **Multi-character generic parameter names** – Allow names like `Key`, `Value`, `Element`
- **More constraints** – Additional built-in constraints (e.g., `std::comparable`, `std::numeric`)
- **Custom constraints** – Define your own constraints (traits/concepts)
- **Type inference** – Infer type parameters from context where possible
- **Default type parameters** – Specify default types for optional parameters
- **Where clauses** – More flexible constraint syntax

## Best Practices

1. **Use descriptive names** – Even with single letters, choose meaningful ones:
   - `T` for general Type
   - `K` for Key
   - `V` for Value
   - `E` for Error
   - `R` for Result

2. **Apply constraints appropriately** – Only add `std::copyable` when you actually need to copy values

3. **Document type requirements** – Comment on what operations your generic code expects:
   ```cpp
   // T must support equality comparison (not enforced yet)
   struct Set<T> { /* ... */ }
   ```

4. **Prefer references when possible** – If you don't need to copy, use references:
   ```cpp
   fun inspect<T>(value: &const T) {
       // No copy required
   }
   ```

5. **Be explicit** – Always specify type parameters clearly:
   ```cpp
   // Good
   let box = new Box<int64>(42);
   
   // Not supported
   // let box = new Box(42);
   ```

---

See also:
- [Language Reference](./language-reference.md) – Complete language syntax
- [Standard Library](./std.md) – Generic types in the standard library
- [Memory Model](./memory-model.md) – Copy semantics and ownership
