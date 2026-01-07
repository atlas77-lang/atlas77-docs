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
