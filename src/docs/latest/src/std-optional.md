# std/optional

Type-safe nullable values.

## Struct: `optional<T>`

Represents a value that may or may not be present.

```cpp
union optional_storage<T> { 
    value: T;
    empty: unit;
}

struct optional<T> {
private:
    data: optional_storage<T>;
    has_value: bool;
}
```

## Static Methods

### `optional<T>::of(data: T) -> optional<T>`

Create an optional containing a value.

```cpp
import "std/optional";

let opt = optional<int64>::of(42);
```

### `optional<T>::empty() -> optional<T>`

Create an empty optional.

```cpp
let opt = optional<int64>::empty();
```

## Instance Methods

### `has_value(&this) -> bool`

Check if the optional contains a value.

```cpp
let opt = optional<int64>::of(42);
if opt.has_value() {
    println("Has value");
}
```

### `value(this) -> T`

Consume the optional and return the value (panics if empty).

```cpp
let opt = optional<int64>::of(42);
let val = opt.value();  // 42
```

> **Warning:** This method panics if the optional is empty. Always check with `has_value()` first or use `value_or()`.

### `value_or(this, default: T) -> T`

Consume the optional and return the value or a default.

```cpp
let opt = optional<int64>::empty();
let val = opt.value_or(0);  // 0
```

## Usage Examples

### Basic Optional Usage

```cpp
import "std/optional";
import "std/io";

fun find_user(id: int64) -> optional<string> {
    if id > 0 {
        return optional<string>::of("Alice");
    }
    return optional<string>::empty();
}

fun main() {
    let user = find_user(1);
    
    if user.has_value() {
        println(user.value());
    } else {
        println("User not found");
    }
}
```

### Using value_or for Defaults

```cpp
import "std/optional";
import "std/io";

fun get_config_timeout() -> optional<int64> {
    return optional<int64>::empty();
}

fun main() {
    let timeout = get_config_timeout().value_or(30);
    println(timeout);  // 30
}
```

### Optional with Structs

```cpp
import "std/optional";
import "std/io";

struct User {
public:
    id: int64;
    name: string;
    
    User(id: int64, name: string) {
        this.id = id;
        this.name = name;
    }
}

fun find_user(id: int64) -> optional<User> {
    if id == 1 {
        return optional<User>::of(new User(1, "Alice"));
    }
    return optional<User>::empty();
}

fun main() {
    let user_opt = find_user(1);
    
    if user_opt.has_value() {
        let user = user_opt.value();
        println(user.name);
    }
}
```

### Chaining Optional Operations

```cpp
import "std/optional";
import "std/io";

fun parse_number(s: string) -> optional<int64> {
    if s == "42" {
        return optional<int64>::of(42);
    }
    return optional<int64>::empty();
}

fun double_if_even(n: int64) -> optional<int64> {
    if n % 2 == 0 {
        return optional<int64>::of(n * 2);
    }
    return optional<int64>::empty();
}

fun main() {
    let num_opt = parse_number("42");
    
    if num_opt.has_value() {
        let num = num_opt.value();
        let doubled_opt = double_if_even(num);
        
        if doubled_opt.has_value() {
            println(doubled_opt.value());  // 84
        }
    }
}
```

## When to Use optional

Use `optional<T>` when:
- A value might not exist (like finding an item in a collection)
- You want to explicitly handle the "no value" case
- The absence of a value is not an error condition
- You don't need to communicate *why* there's no value

For operations that can fail with meaningful error information, use [`expected<T, E>`](./std-expected.md) instead.

## Best Practices

1. **Always check before unwrapping**: Use `has_value()` before calling `value()`
2. **Prefer value_or()**: When you have a sensible default, use `value_or()` instead of manual checking
3. **Document return types**: Make it clear in comments when a function might return empty
4. **Consider expected**: If you need error context, use `expected<T, E>` instead

---

**See also:**
- [std/expected](./std-expected.md) - For operations that can fail with error information
- [Error Handling](./error-handling.md) - Complete error handling guide
- [Standard Library Overview](./std.md)
