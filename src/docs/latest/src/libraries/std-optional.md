# std/optional

Type-safe nullable values.

## Struct: `optional<T>`

A lightweight container for an optional value of type `T`.

```cpp
union optional_storage<T> { 
    value: T;
    empty: unit;
}

struct optional<T> {
private:
    data: optional_storage<T>;
    has_value: bool;
public:
    ~optional();
    fun _copy(&const this) -> optional<T>;
}
```

When `has_value` is true, `data.value` is valid and will be dropped by the destructor.

## Static Methods

### `optional<T>::of(data: T) -> optional<T>`

Construct an `optional<T>` containing `data`.

```cpp
import "std/optional";

let some = optional<int64>::of(42);
```

### `optional<T>::empty() -> optional<T>`

Construct an empty `optional<T>` with no value.

```cpp
let none = optional<int64>::empty();
```

## Instance Methods

### `has_value(&const this) -> bool`

Returns true if a value is present.

```cpp
if opt.has_value() {
    println("has value");
}
```

### `is_empty(&const this) -> bool`

Returns true if no value is present.

```cpp
if opt.is_empty() {
    println("is empty");
}
```

### `value(this) -> T`

Consume the optional and return the contained value.

```cpp
let opt = optional<int64>::of(42);
let val = opt.value();  // 42
```

> **Panics** with a descriptive message when `has_value` is false. Consider using `value_or(default)` to avoid panics.

### `value_or(this, default: T) -> T`

Consume the optional and return the contained value or `default` if empty.

```cpp
let opt = optional<int64>::empty();
let n = opt.value_or(0);  // 0
```
