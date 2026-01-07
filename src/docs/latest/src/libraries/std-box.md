# std/box

> **Deprecated**: The box module is deprecated and should not be used in new code. Use stack allocation or Vector<T> instead.

## Struct: `Box<T>`

Heap-allocated single value container.

```cpp
struct Box<T> {
public:
    value: T;
}
```

## Constructor

```cpp
import "std/box";

let boxed = new Box<int64>(42);
```

## Instance Methods

### `get(&this) -> &const T`

Get a const reference to the value.

```cpp
let boxed = new Box<int64>(42);
let value_ref = boxed.get();
println(*value_ref);  // 42
```

### `get_mut(&this) -> &T`

Get a mutable reference to the value.

```cpp
let boxed = new Box<int64>(42);
let value_ref = boxed.get_mut();
*value_ref = 100;
println(*boxed.get());  // 100
```

### `set(&this, new_value: T)`

Set the value.

```cpp
let boxed = new Box<int64>(42);
boxed.set(100);
println(*boxed.get());  // 100
```
