# std/vector

Dynamic array with resizable capacity.

## External Functions

### `len<T>(data: &const [T]) -> uint64`

Get the length of an array.

```cpp
import "std/vector";

let arr = [1, 2, 3];
let length = len(&arr);  // 3
```

### `slice<T>(data: &const [T], start: uint64, end: uint64) -> [T]`

Extract a slice from an array.

```cpp
let arr = [1, 2, 3, 4, 5];
let sub = slice(&arr, 1u, 4u);  // [2, 3, 4]
```

## Struct: `Vector<T>`

A generic dynamic array.

```cpp
struct Vector<T> {
public:
    data: [T];
    length: uint64;
    capacity: uint64;
}
```

## Constructor

```cpp
import "std/vector";

let vec = new Vector<int64>([1, 2, 3]);
```

## Static Methods

### `Vector::<T>::with_capacity(capacity: uint64) -> Vector<T>`

Create a vector with a specific initial capacity.

```cpp
let vec = Vector<int64>::with_capacity(10u);
```

## Instance Methods

### `get(&this, index: uint64) -> &const T`

Get a const reference to an element.

```cpp
let vec = new Vector<int64>([1, 2, 3]);
let val = vec.get(1u);  // &2
```

### `get_mut(&this, index: uint64) -> &T`

Get a mutable reference to an element.

```cpp
let vec = new Vector<int64>([1, 2, 3]);
let val = vec.get_mut(1u);
*val = 10;
```

### `set(&this, index: uint64, val: T)`

Set an element at a specific index.

```cpp
let vec = new Vector<int64>([1, 2, 3]);
vec.set(1u, 10);
```

### `push(&this, val: T)`

Add an element to the end of the vector.

```cpp
let vec = new Vector<int64>([1, 2]);
vec.push(3);
```

### `pop(&this) -> T`

Remove and return the last element.

```cpp
let vec = new Vector<int64>([1, 2, 3]);
let last = vec.pop();  // 3
```

### `into_iter(this) -> Iter<T>`

Consume the vector and create an iterator.

```cpp
let vec = new Vector<int64>([1, 2, 3]);
let iter = vec.into_iter();
```

### `take(&this, idx: uint64) -> T`

Remove and return the element at the specified index.

```cpp
let vec = new Vector<int64>([1, 2, 3]);
let val = vec.take(1u);  // 2
```
