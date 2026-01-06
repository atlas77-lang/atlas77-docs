# std/iter

Iterator utilities for traversing collections.

## Struct: `Iter<T>`

Generic iterator over elements of type T.

```cpp
struct Iter<T> {
public:
    data: Vector<T>;
    index: uint64;
}
```

## Constructor

```cpp
import "std/iter";
import "std/vector";

let vec = new Vector<int64>([1, 2, 3]);
let iter = new Iter<int64>(vec);
```

## Static Methods

### `Iter<T>::from_array(data: [T]) -> Iter<T>`

Create an iterator from an array.

```cpp
let arr = [1, 2, 3];
let iter = Iter<int64>::from_array(arr);
```

### `Iter<char>::from_string(data: String) -> Iter<char>`

Create an iterator from a String.

```cpp
import "std/string";

let str = new String("Hi");
let iter = Iter<char>::from_string(str);
```

### `Iter<char>::from_str(data: &const string) -> Iter<char>`

Create an iterator from a string primitive.

```cpp
let text = "Hi";
let iter = Iter<char>::from_str(&text);
```

## Instance Methods

### `next(&this) -> optional<T>`

Get the next item (returns empty if exhausted).

```cpp
let iter = Iter<int64>::from_array([1, 2]);
let first = iter.next();   // optional::of(1)
let second = iter.next();  // optional::of(2)
let third = iter.next();   // optional::empty()
```

### `peek(&this) -> optional<&const T>`

Peek at the next item without advancing.

```cpp
let iter = Iter<int64>::from_array([1, 2]);
let peeked = iter.peek();  // optional::of(&1)
let next = iter.next();     // optional::of(1)
```

### `has_next(&this) -> bool`

Check if there are more items.

```cpp
while iter.has_next() {
    let item = iter.next().value();
    println(item);
}
```

## Usage Examples

### Iterating Over an Array

```cpp
import "std/iter";
import "std/io";

fun main() {
    let numbers = [1, 2, 3, 4, 5];
    let iter = Iter<int64>::from_array(numbers);
    
    while iter.has_next() {
        let num = iter.next().value();
        println(num);
    }
}
```

### Iterating Over a String

```cpp
import "std/iter";
import "std/string";
import "std/io";

fun main() {
    let text = "Hello";
    let iter = Iter<char>::from_str(&text);
    
    while iter.has_next() {
        let ch = iter.next().value();
        println(ch);
    }
}
```

### Using peek()

```cpp
import "std/iter";
import "std/io";

fun main() {
    let numbers = [1, 2, 3];
    let iter = Iter<int64>::from_array(numbers);
    
    while iter.has_next() {
        let peeked = iter.peek();
        if peeked.has_value() {
            let val = *peeked.value();
            if val > 1 {
                println("Found number > 1");
            }
        }
        iter.next();
    }
}
```

### Consuming a Vector

```cpp
import "std/vector";
import "std/iter";
import "std/io";

fun main() {
    let vec = new Vector<int64>([10, 20, 30]);
    let iter = vec.into_iter();  // Consumes the vector
    
    while iter.has_next() {
        let num = iter.next().value();
        println(num * 2);
    }
    // vec is no longer accessible here
}
```

### Filtering with Iterators

```cpp
import "std/iter";
import "std/io";

fun main() {
    let numbers = [1, 2, 3, 4, 5, 6];
    let iter = Iter<int64>::from_array(numbers);
    
    // Print only even numbers
    while iter.has_next() {
        let num = iter.next().value();
        if num % 2 == 0 {
            println(num);
        }
    }
}
```

### Collecting from Iterator

```cpp
import "std/iter";
import "std/vector";
import "std/io";

fun main() {
    let source = [1, 2, 3, 4, 5];
    let iter = Iter<int64>::from_array(source);
    
    let result = Vector<int64>::with_capacity(5u);
    
    while iter.has_next() {
        let num = iter.next().value();
        if num % 2 == 0 {
            result.push(num);
        }
    }
    
    // result now contains [2, 4]
    println(result.length);  // 2
}
```

## Performance Considerations

- **Memory ownership**: Iterators created with `into_iter()` take ownership of the collection
- **Reference iterators**: `from_array()` and `from_str()` create iterators that reference existing data
- **Peek overhead**: `peek()` is efficient as it doesn't advance the iterator

## Best Practices

1. **Use has_next()**: Always check `has_next()` before calling `next()` in loops
2. **Handle optional returns**: Remember that `next()` returns `optional<T>`
3. **Understand ownership**: Know when iterators consume their source
4. **Prefer iterators**: Use iterators over manual indexing for cleaner code

---

**See also:**
- [std/vector](./std-vector.md) - Vector's `into_iter()` method
- [std/string](./std-string.md) - String's `into_iter()` method
- [std/optional](./std-optional.md) - Iterator returns optional values
- [Standard Library Overview](./std.md)
