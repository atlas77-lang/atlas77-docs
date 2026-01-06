# Error Handling in Atlas 77

Atlas 77 provides explicit error handling through `optional<T>` and `expected<T, E>` types. There is **no implicit error propagation**; errors must be handled explicitly to avoid "hidden magic."

## Philosophy

Error handling in Atlas 77 is **explicit and intentional**:
- No automatic exception throwing or catching
- No implicit `try`/`?` operator for error propagation
- Errors must be checked and handled at the point they occur
- This gives you **maximum control** over error recovery

## optional Type

The `optional<T>` type represents a value that may or may not exist.

### Creating optional Values

Use `optional<T>` for fallible operations that don't need error details:

```cpp
import "std/optional";

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
    if id > 0 {
        // Found user
        let user = new User(id, "Alice");
        return optional<User>::of(user);
    } else {
        // Not found
        return optional<User>::empty();
    }
}
```

### Checking optional Values

```cpp
let user_opt = find_user(42);

// Check if value exists
if user_opt.has_value() {
    let user = user_opt.value();  // Consumes the optional
    println(user.name);
} else {
    println("User not found");
}
```

### Using value_or for Defaults

```cpp
import "std/optional";

fun get_config_value(key: string) -> optional<string> {
    // ... lookup logic ...
    return optional<string>::empty();
}

fun main() {
    let timeout = get_config_value("timeout").value_or("30");
    println(timeout);  // Prints: 30
}
```

## expected Type

The `expected<T, E>` type represents either a success with a value, or a failure with an error.

### Creating expected Values

Use `expected<T, E>` when operations can fail and you need to communicate why:

```cpp
import "std/expected";

fun parse_int(s: string) -> expected<int64, string> {
    // Try to parse string to integer
    if is_valid_number(s) {
        let number: int64 = convert_to_int(s);
        return expected<int64, string>::expect(number);
    } else {
        return expected<int64, string>::unexpected("Invalid number format");
    }
}
```

### Checking expected Values

```cpp
let result = parse_int("42");

// Explicit check with is_expected
if result.is_expected() {
    let number = result.expected_value();  // Consumes the expected
    println(number);
} else {
    let error = result.unexpected_value();  // Consumes the expected
    println(error);
}
```

### Using expected_value_or for Defaults

```cpp
import "std/expected";

fun divide(a: int64, b: int64) -> expected<int64, string> {
    if b == 0 {
        return expected<int64, string>::unexpected("Division by zero");
    }
    return expected<int64, string>::expect(a / b);
}

fun main() {
    let result = divide(10, 0).expected_value_or(0);
    println(result);  // Prints: 0
}
```

### Pattern: Checking Both Success and Error

```cpp
let result = parse_int("invalid");

if result.is_expected() {
    let value = result.expected_value();
    println(value);
} else if result.is_unexpected() {
    let error = result.unexpected_value();
    println(error);  // Prints: Invalid number format
}
```

## Panic

For unrecoverable errors, use `panic()` to abort the program:

```cpp
import "std/io";

fun critical_operation() {
    if invalid_state {
        panic("Critical error: invalid state detected!");
    }
}
```

`panic()` will:
1. Print the error message
2. Terminate the program immediately
3. Bypass normal cleanup (use sparingly)

## Pattern Examples

### optional Handling

```cpp
import "std/optional";

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
    if id > 0 {
        let user = new User(id, "Alice");
        return optional<User>::of(user);
    }
    return optional<User>::empty();
}

fun get_user_name(id: int64) -> optional<string> {
    let user_opt = find_user(id);
    
    if user_opt.has_value() {
        let user = user_opt.value();
        return optional<string>::of(user.name);
    } else {
        return optional<string>::empty();
    }
}

// Usage
fun main() {
    let name_opt = get_user_name(1);
    if name_opt.has_value() {
        println(name_opt.value());
    } else {
        println("User not found");
    }
}
```

### expected Chaining

When multiple fallible operations depend on each other:

```cpp
import "std/expected";
import "std/fs";

fun read_and_parse() -> expected<int64, string> {
    // First operation
    let file = new File("numbers.txt");
    if !file.exists() {
        return expected<int64, string>::unexpected("File not found");
    }
    
    let content = file.read();
    
    // Second operation (depends on first)
    let number = parse_int(content);
    if number.is_unexpected() {
        return expected<int64, string>::unexpected(number.unexpected_value());
    }
    
    // Success
    return expected<int64, string>::expect(number.expected_value());
}
```

### Nested expected with Meaningful Errors

```cpp
import "std/expected";

struct ParseError {
public:
    line: int64;
    column: int64;
    message: string;
    
    ParseError(line: int64, column: int64, message: string) {
        this.line = line;
        this.column = column;
        this.message = message;
    }
}

fun parse_config(path: string) -> expected<Config, ParseError> {
    // Try to read file
    let file = new File(path);
    if !file.exists() {
        let error = new ParseError(0, 0, "File not found");
        return expected<Config, ParseError>::unexpected(error);
    }
    
    let content = file.read();
    
    // Try to parse content
    let config = parse_config_text(content);
    return config;
}
```

## Best Practices

1. **Check explicitly** – Always use `has_value()` / `is_expected()` / `is_unexpected()` before consuming values
2. **Provide context** – Include helpful error information in `expected<T, E>`
3. **Fail fast** – Return errors early rather than propagating invalid states
4. **Use optional for simple cases** – When you only need to know if something exists
5. **Use expected for complex cases** – When you need to communicate failure reasons
6. **Avoid panics in libraries** – Let caller decide how to handle errors
7. **Document error cases** – Explain what errors an operation can produce
8. **Remember consuming methods** – `value()`, `expected_value()`, and `unexpected_value()` consume the container

## API Reference

### optional<T> Methods

- `optional<T>::of(data: T) -> optional<T>` – Create an optional containing a value
- `optional<T>::empty() -> optional<T>` – Create an empty optional
- `has_value(&this) -> bool` – Check if a value is present
- `value(this) -> T` – Consume and return the value (panics if empty)
- `value_or(this, default: T) -> T` – Consume and return the value or default

### expected<T, E> Methods

- `expected<T, E>::expect(data: T) -> expected<T, E>` – Create a successful expected
- `expected<T, E>::unexpected(error: E) -> expected<T, E>` – Create a failed expected
- `is_expected(&this) -> bool` – Check if this holds a value
- `is_unexpected(&this) -> bool` – Check if this holds an error
- `expected_value(this) -> T` – Consume and return the value (panics if error)
- `unexpected_value(this) -> E` – Consume and return the error (panics if value)
- `expected_value_or(this, default: T) -> T` – Consume and return the value or default
- `unexpected_value_or(this, default: E) -> E` – Consume and return the error or default

## Future Improvements

In the future, Atlas 77 may introduce:
- Discriminated unions for more flexible error types
- Error traits for better composability
- More ergonomic error propagation operators

However, the core design will remain **explicit and visible**, avoiding hidden control flow.

---

See also:
- [Language Reference](./language-reference.md) – Error handling in context
- [Memory Model](./memory-model.md) – Resource safety and ownership
- [Standard Library](./std.md) – Available error types and utilities
