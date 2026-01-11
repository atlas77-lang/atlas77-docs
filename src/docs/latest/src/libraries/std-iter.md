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
> [!Warning]
> `Iter<T>` uses a `Vector<T>` under the hood and every `.next()` calls use the `Vector<T>.take(i)` method, which moves out `T` then collapses the vector to not have empty holes. It's very inefficient for long iterator. `Iter<T>` should be reworked to use `[T]` under the hood and manage it by itself.

## Constructor

```cpp
import "std/iter";
import "std/vector";

let vec = new Vector<int64>([1, 2, 3]);
let iter = new Iter<int64>(vec);
```

## Copy Constructor
> [!NOTE]
> Most copy constructors need `T` to be copyable, it is not yet properly enforced by the compiler. Currently you will get a weird error akin to "use of moved value" somewhere in the std lib code.
```cpp
import "std/iter";
import "std/vector";

let vec = new Vector<int64>([1, 2, 3]);
let iter = new Iter<int64>(vec);
let iter_copy = new Iter<int64>(&iter);
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
