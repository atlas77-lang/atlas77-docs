# Error Handling in Atlas 77

Atlas 77 provides explicit error handling through `Option<T>` and `Result<T, E>` types. There is **no implicit error propagation**; errors must be handled explicitly to avoid "hidden magic."

## Philosophy

Error handling in Atlas 77 is **explicit and intentional**:
- No automatic exception throwing or catching
- No implicit `try`/`?` operator for error propagation
- Errors must be checked and handled at the point they occur
- This gives you **maximum control** over error recovery

## Option Type

The `Option<T>` type represents a value that may or may not exist:

```cpp
struct Option<T> {
public:
    has_value: bool;
    value: T;  // Only valid when has_value is true
}
```

Use `Option<T>` for fallible operations that don't need error details:

```cpp
fun find_user(id: int64) -> Option<User> {
    if id > 0 {
        // Found user
        let user: User = User(id);
        return Option(true, user);
    } else {
        // Not found
        return Option(false, User(0));  // Default user
    }
}
```

### Checking Option Values

```cpp
let user_opt: Option<User> = find_user(42);

// Check if value exists
if user_opt.is_some() {
    let user: User = user_opt.unwrap();
    println("Found user: " + user.name);
} else {
    println("User not found");
}
```

## Result Type

The `Result<T, E>` type represents either a success with a value, or a failure with an error:

```cpp
enum ResultTag {
    ERR = 0;
    OK = 256;
}
struct Result<T, E> {
private:
    tag: ResultTag;
    ok_value: T;
    err_value: E;
}
```

Use `Result<T, E>` when operations can fail and you need to communicate why:

```cpp
fun parse_int(s: string) -> Result<int64, string> {
    // Try to parse string to integer
    if is_valid_number(s) {
        let number: int64 = convert_to_int(s);
        return Result::<int64, string>::ok(number);
    } else {
        return Result::<int64, string>::err("Invalid number format");
    }
}
```

### Checking Result Values

```cpp
let result: Result<int64, string> = parse_int("42");

// Explicit check with is_ok
if result.is_ok() {
    let number: int64 = result.unwrap();
    println("Parsed: " + number);
} else {
    let error: string = result.unwrap_err();
    println("Error: " + error);
}
```

### Unwrapping Results

If you're confident a `Result` is `Ok`, you can unwrap directly (at your own risk):

```cpp
let result: Result<int64, string> = parse_int("42");
let number: int64 = result.unwrap();  // Unwrap without check (risky!)

// If is_ok is false, you'll get a default/undefined value
// Use only when you're certain the operation succeeded
```

> **Warning:** Unwrapping without checking can lead to using garbage values if the operation failed. Always check `is_ok` first unless you have a strong reason not to.

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

### Option Handling

```cpp
struct User {
public:
    id: int64;
    name: string;
}

fun get_user_name(id: int64) -> Option<string> {
    let user: Option<User> = find_user(id);
    
    if user.is_some() {
        return Option::<string>::ok(user.unwrap().name);
    } else {
        return Option::<string>::none();
    }
}

// Usage
let name_opt: Option<string> = get_user_name(1);
if name_opt.is_some() {
    print("User: ");
    println(name_opt.unwrap().value);
} else {
    println("User not found");
}
```

### Result Chaining

When multiple fallible operations depend on each other:

```cpp
fun read_and_parse() -> Result<int64, string> {
    // First operation
    let content: Result<string, string> = read_file("numbers.txt");
    if !content.is_ok() {
        return Result::<int64, string>::err(content.unwrap_err());
    }
    
    // Second operation (depends on first)
    let number: Result<int64, string> = parse_int(content.ok_value);
    if !number.is_ok() {
        return Result::<int64, string>::err(number.unwrap_err());
    }
    
    // Success
    return Result::<int64, string>::ok(number.unwrap());
}
```

### Nested Results with Meaningful Errors

```cpp
struct ParseError {
public:
    line: int64;
    column: int64;
    message: string;
}

fun parse_config(path: string) -> Result<Config, ParseError> {
    // Try to read file
    let content: Result<string, string> = read_file(path);
    if !content.is_ok() {
        let error: ParseError = new ParseError(0, 0, content.unwrap_err());
        return Result::<Config, ParseError>::err(error);
    }
    
    // Try to parse content
    let config: Result<Config, ParseError> = parse_config_text(content.unwrap());
    return config;
}
```

## Best Practices

1. **Check explicitly** – Always use `is_ok()`/`is_err()` checks before accessing values
2. **Provide context** – Include helpful error information in `Result<T, E>`
3. **Fail fast** – Return errors early rather than propagating invalid states
4. **Use Option for simple cases** – When you only need to know if something exists
5. **Use Result for complex cases** – When you need to communicate failure reasons
6. **Avoid panics in libraries** – Let caller decide how to handle errors
7. **Document error cases** – Explain what errors an operation can produce

## Future Improvements

In the future, Atlas 77 may introduce:
- Discriminated unions for more flexible error types
- Error traits for better composability

However, the core design will remain **explicit and visible**, avoiding hidden control flow.

---

See also:
- [Language Reference](./language-reference.md) – Error handling in context
- [Memory Model](./memory-model.md) – Resource safety
- [Standard Library](./std.md) – Available error types
