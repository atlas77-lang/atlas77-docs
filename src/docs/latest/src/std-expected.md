# std/expected

Result type for operations that can fail with error information.

## Struct: `expected<T, E>`

Represents either a success value or an error.

```cpp
union expected_storage<T, E> { 
    expected_value: T;
    unexpected_value: E;
}

struct expected<T, E> {
private:
    data: expected_storage<T, E>;
    has_expected_value: bool;
}
```

## Static Methods

### `expected<T, E>::expect(data: T) -> expected<T, E>`

Create a successful expected.

```cpp
import "std/expected";

let result = expected<int64, string>::expect(42);
```

### `expected<T, E>::unexpected(error: E) -> expected<T, E>`

Create a failed expected.

```cpp
let result = expected<int64, string>::unexpected("Error occurred");
```

## Instance Methods

### `is_expected(&this) -> bool`

Check if this contains a value.

```cpp
let result = expected<int64, string>::expect(42);
if result.is_expected() {
    println("Success");
}
```

### `is_unexpected(&this) -> bool`

Check if this contains an error.

```cpp
if result.is_unexpected() {
    println("Error occurred");
}
```

### `expected_value(this) -> T`

Consume and return the value (panics if error).

```cpp
let result = expected<int64, string>::expect(42);
let val = result.expected_value();  // 42
```

> **Warning:** This method panics if the expected contains an error. Always check with `is_expected()` first or use `expected_value_or()`.

### `unexpected_value(this) -> E`

Consume and return the error (panics if value).

```cpp
let result = expected<int64, string>::unexpected("Error");
let err = result.unexpected_value();  // "Error"
```

### `expected_value_or(this, default: T) -> T`

Consume and return the value or a default.

```cpp
let result = expected<int64, string>::unexpected("Error");
let val = result.expected_value_or(0);  // 0
```

### `unexpected_value_or(this, default: E) -> E`

Consume and return the error or a default.

```cpp
let result = expected<int64, string>::expect(42);
let err = result.unexpected_value_or("No error");  // "No error"
```

## Usage Examples

### Basic Error Handling

```cpp
import "std/expected";
import "std/io";

fun divide(a: int64, b: int64) -> expected<int64, string> {
    if b == 0 {
        return expected<int64, string>::unexpected("Division by zero");
    }
    return expected<int64, string>::expect(a / b);
}

fun main() {
    let result = divide(10, 2);
    
    if result.is_expected() {
        println(result.expected_value());  // 5
    } else {
        println(result.unexpected_value());
    }
}
```

### File Operations with Error Context

```cpp
import "std/expected";
import "std/fs";
import "std/io";

fun read_config() -> expected<string, string> {
    let file = new File("config.txt");
    
    if !file.exists() {
        return expected<string, string>::unexpected("Config file not found");
    }
    
    let content = file.read();
    return expected<string, string>::expect(content);
}

fun main() {
    let result = read_config();
    
    if result.is_expected() {
        let config = result.expected_value();
        println("Config loaded");
    } else {
        let error = result.unexpected_value();
        println("Error: " + error);
    }
}
```

### Custom Error Types

```cpp
import "std/expected";
import "std/io";

struct ParseError {
public:
    line: int64;
    message: string;
    
    ParseError(line: int64, message: string) {
        this.line = line;
        this.message = message;
    }
}

fun parse_number(s: string, line: int64) -> expected<int64, ParseError> {
    if s == "42" {
        return expected<int64, ParseError>::expect(42);
    }
    
    let error = new ParseError(line, "Invalid number format");
    return expected<int64, ParseError>::unexpected(error);
}

fun main() {
    let result = parse_number("abc", 10);
    
    if result.is_unexpected() {
        let error = result.unexpected_value();
        println("Error at line " + error.line + ": " + error.message);
    }
}
```

### Chaining Operations

```cpp
import "std/expected";
import "std/io";

fun parse_int(s: string) -> expected<int64, string> {
    if s == "42" {
        return expected<int64, string>::expect(42);
    }
    return expected<int64, string>::unexpected("Parse failed");
}

fun validate_positive(n: int64) -> expected<int64, string> {
    if n > 0 {
        return expected<int64, string>::expect(n);
    }
    return expected<int64, string>::unexpected("Number must be positive");
}

fun main() {
    let parse_result = parse_int("42");
    
    if parse_result.is_expected() {
        let num = parse_result.expected_value();
        let validate_result = validate_positive(num);
        
        if validate_result.is_expected() {
            println("Valid number: " + validate_result.expected_value());
        } else {
            println("Validation error: " + validate_result.unexpected_value());
        }
    } else {
        println("Parse error: " + parse_result.unexpected_value());
    }
}
```

### Using Defaults

```cpp
import "std/expected";
import "std/io";

fun get_port() -> expected<int64, string> {
    return expected<int64, string>::unexpected("Port not configured");
}

fun main() {
    let port = get_port().expected_value_or(8080);
    println(port);  // 8080
}
```

## When to Use expected

Use `expected<T, E>` when:
- An operation can fail and you need to communicate why
- You want to propagate error information up the call stack
- Different failure modes need to be distinguished
- Error recovery depends on the type of error

For simple presence/absence checks without error context, use [`optional<T>`](./std-optional.md) instead.

## Best Practices

1. **Check before unwrapping**: Always use `is_expected()` or `is_unexpected()` before extracting values
2. **Use meaningful error types**: Create custom error structs when simple strings aren't enough
3. **Fail early**: Return errors as soon as they're detected
4. **Document error cases**: Clearly document what errors a function can return
5. **Prefer expected_value_or()**: When you have a sensible fallback, use `expected_value_or()`

---

**See also:**
- [std/optional](./std-optional.md) - For simple nullable values
- [Error Handling](./error-handling.md) - Complete error handling guide
- [Standard Library Overview](./std.md)
