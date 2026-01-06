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
> [!Warning]
> Known issues, this method leaks memory if `T` is an object.
Consume the optional and return the value (panics if empty).

```cpp
let opt = optional<int64>::of(42);
let val = opt.value();  // 42
```

> **Warning:** This method panics if the optional is empty. Always check with `has_value()` first or use `value_or()`.

### `value_or(this, default: T) -> T`
> [!Warning]
> Known issues, this method leaks memory if `T` is an object.
Consume the optional and return the value or a default.

```cpp
let opt = optional<int64>::empty();
let val = opt.value_or(0);  // 0
```
