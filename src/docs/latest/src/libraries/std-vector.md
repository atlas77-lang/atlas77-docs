# std/vector

Dynamic arrays with resizable capacity.

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

A generic dynamic array that automatically resizes as elements are added.

```cpp
struct Vector<T> {
private:
    data: [T];
public:
    length: uint64;
    capacity: uint64;
}
```

## Constructor

```cpp
import "std/vector";

let vec = new Vector<int64>([1, 2, 3]);
```

Creates a vector from an array, setting both length and capacity to the array's length.

## Destructor

The vector's destructor automatically cleans up all elements within `data[0..length]` and frees the underlying array.

## Static Methods

### `Vector<T>::with_capacity(capacity: uint64) -> Vector<T>`

Create a vector with a specific initial capacity.

```cpp
let vec = Vector<int64>::with_capacity(10u);
```

The vector starts with length 0 but has pre-allocated space for 10 elements.

## Instance Methods

### `len(&const this) -> uint64`

Get the number of elements in the vector.

```cpp
println(vec.len());
```

### `get(&this, index: uint64) -> &const T`

Get a const reference to an element.

```cpp
let vec = new Vector<int64>([1, 2, 3]);
let val = vec.get(1u);  // &2
```

**Panics** if index is out of bounds.

### `get_mut(&this, index: uint64) -> &T`

Get a mutable reference to an element.

```cpp
let vec = new Vector<int64>([1, 2, 3]);
let val = vec.get_mut(1u);
*val = 10;
```

**Panics** if index is out of bounds.

### `set(&this, index: uint64, val: T)`

Set an element at a specific index.

```cpp
vec.set(1u, 10);
```

**Panics** if index is out of bounds.

### `push(&this, val: T)`

Add an element to the end of the vector.

```cpp
vec.push(42);
```

Automatically resizes the vector if capacity is reached (doubles the capacity).

### `pop(&this) -> T`

Remove and return the last element.

```cpp
let last = vec.pop();
```

**Panics** if the vector is empty.

### `take(&this, index: uint64) -> T`

Takes an element out of the vector at the specified index, shifting subsequent elements to the left.

```cpp
let item = vec.take(2u);  // Removes element at index 2
```

**Panics** if index is out of bounds.

### `get_slice(&this, start: uint64, end: uint64) -> [T]`

Get a slice of the vector as an array.

```cpp
let slice = vec.get_slice(1u, 4u);
```

**Panics** if indices are out of bounds or if `start > end`.

### `into_iter(this) -> Iter<T>`

Consume the vector and create an iterator.

```cpp
let vec = new Vector<int64>([1, 2, 3]);
let iter = vec.into_iter();
```

The vector cannot be used after calling this method.

### `_copy(&const this) -> Vector<T>`

Create a copy of the vector.

```cpp
let vec1 = new Vector<int64>([1, 2, 3]);
let vec2 = vec1._copy();
```

