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

## Usage Examples

### Creating and Using Vectors

```cpp
import "std/vector";
import "std/io";

fun main() {
    let numbers = new Vector<int64>([1, 2, 3]);
    
    // Add elements
    numbers.push(4);
    numbers.push(5);
    
    // Access elements
    println(*numbers.get(0u));  // 1
    
    // Modify elements
    numbers.set(0u, 10);
    println(*numbers.get(0u));  // 10
}
```

### Growing a Vector

```cpp
import "std/vector";
import "std/io";

fun main() {
    let vec = Vector<int64>::with_capacity(5u);
    
    let i = 0;
    while i < 10 {
        vec.push(i);
        i = i + 1;
    }
    
    println(vec.length);   // 10
    println(vec.capacity); // >= 10 (resized automatically)
}
```

### Iterating Over a Vector

```cpp
import "std/vector";
import "std/io";

fun main() {
    let numbers = new Vector<int64>([1, 2, 3, 4, 5]);
    let iter = numbers.into_iter();
    
    while iter.has_next() {
        let num = iter.next().value();
        println(num);
    }
}
```

### Working with Strings

```cpp
import "std/vector";
import "std/string";
import "std/io";

fun main() {
    let names = new Vector<String>([]);
    names.push(new String("Alice"));
    names.push(new String("Bob"));
    names.push(new String("Charlie"));
    
    let i = 0u;
    while i < names.length {
        println(names.get(i).to_str());
        i = i + 1u;
    }
}
```

## Performance Notes

- **Initial capacity**: Use `with_capacity()` when you know the size ahead of time to avoid reallocations
- **Growth strategy**: The vector doubles its capacity when full
- **Memory overhead**: The vector allocates more space than needed for efficient growth

---

**See also:**
- [Standard Library Overview](./std.md)
- [std/iter](./std-iter.md) - Iterating over vectors
- [Generics](./generics.md) - Understanding Vector<T>
