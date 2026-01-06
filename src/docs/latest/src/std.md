# Standard Library

> **Note:**  
> The standard library is a work in progress. Some modules are complete while others are still in development. This documentation reflects the current state of the implemented modules.

## Overview

The Atlas77 standard library provides essential data structures, utilities, and I/O functions. The library is organized into modules that can be imported individually.

| Module           | Description                                    | Status |
|------------------|------------------------------------------------|--------|
| `std/io`         | Input/output and panic functions               | ✅ Stable |
| `std/fs`         | File system operations                         | ✅ Stable |
| `std/string`     | String manipulation and the String struct      | ✅ Stable |
| `std/vector`     | Dynamic array (Vector<T>)                      | ✅ Stable |
| `std/optional`   | optional<T> type for nullable values          | ✅ Stable |
| `std/expected`   | expected<T, E> for error handling             | ✅ Stable |
| `std/iter`       | Iterator utilities                             | ✅ Stable |
| `std/time`       | Time operations and formatting                 | ✅ Stable |
| `std/math`       | Mathematical functions                         | ✅ Stable |
| `std/map`        | Map<K, V> key-value container                  | ✅ Stable |
| `std/queue`      | Queue<T> FIFO data structure                   | ✅ Stable |
| `std/box`        | Box<T> container (deprecated)                  | ⚠️ Deprecated |
| `std/mem`        | Memory utilities                               | ✅ Stable |

## `std/io`

Basic input/output and program control functions.

### Functions

#### `print<T>(s: T)`
Print a value to standard output without a newline.

```cpp
import "std/io";

print("Hello");
print(" World!");
// Output: Hello World!
```

#### `println<T>(s: T)`
Print a value to standard output followed by a newline.

```cpp
import "std/io";

println("Hello, Atlas!");
// Output: Hello, Atlas!
//         (newline)
```

#### `input() -> string`
Read a line from standard input.

```cpp
import "std/io";

println("Enter your name:");
let name = input();
println("Hello, " + name);
```

#### `panic<T>(s: T)`
Abort the program with an error message.

```cpp
import "std/io";

fun divide(a: int64, b: int64) -> int64 {
    if b == 0 {
        panic("Division by zero!");
    }
    return a / b;
}
```

## `std/fs`

File system operations for reading, writing, and managing files.

### Struct: `File`

Represents a file in the file system.

```cpp
struct File {
private:
    content: string;
public:
    path: string;
}
```

#### Constructor

```cpp
import "std/fs";

let file = new File("data.txt");
```

Creates a File object. The file is not opened until `read()` or `open()` is called.

#### Methods

##### `read(&this) -> string`
Read the entire content of the file and store it internally.

```cpp
let file = new File("data.txt");
let content = file.read();
println(content);
```

##### `open(&this)`
Open and read the file, storing content internally.

```cpp
let file = new File("data.txt");
file.open();
// File content is now loaded
```

##### `write(&this, content: string)`
Write content to the file.

```cpp
let file = new File("output.txt");
file.write("Hello, World!");
```

##### `close(this)`
Close the file (consumes the File object).

```cpp
let file = new File("data.txt");
file.read();
file.close();  // File is consumed
```

##### `exists(&this) -> bool`
Check if the file exists.

```cpp
let file = new File("config.json");
if file.exists() {
    println("File found");
}
```

##### `remove(&this)`
Delete the file from the file system.

```cpp
let file = new File("temp.txt");
file.remove();
```

##### `read_dir(&this, path: string) -> [string]`
Read the contents of a directory (instance method).

```cpp
let file = new File(".");
let entries = file.read_dir("./src");
```

##### `read_file(&this, path: string) -> string`
Read a file without modifying the File instance's content.

```cpp
let file = new File("dummy");
let content = file.read_file("actual.txt");
```

## `std/string`

String manipulation functions and the String struct.

### External Functions

#### `str_len(s: &const string) -> uint64`
Get the length of a string primitive (in bytes).

```cpp
import "std/string";

let text = "Hello";
let length = str_len(&text);  // 5
```

#### `trim(s: string) -> string`
Remove leading and trailing whitespace.

```cpp
let text = "  hello  ";
let trimmed = trim(text);  // "hello"
```

#### `to_upper(s: string) -> string`
Convert a string to uppercase.

```cpp
let text = "hello";
let upper = to_upper(text);  // "HELLO"
```

#### `to_lower(s: string) -> string`
Convert a string to lowercase.

```cpp
let text = "HELLO";
let lower = to_lower(text);  // "hello"
```

#### `split(s: &string, sep: &string) -> [string]`
Split a string by a separator.

```cpp
let text = "apple,banana,cherry";
let parts = split(&text, &",");
// ["apple", "banana", "cherry"]
```

#### `str_cmp(s1: &const string, s2: &const string) -> uint64`
Compare two strings lexicographically.

```cpp
let result = str_cmp(&"apple", &"banana");
```

#### `to_chars(s: &const string) -> [char]`
Convert a string to an array of characters.

```cpp
let text = "Hi";
let chars = to_chars(&text);  // ['H', 'i']
```

#### `from_chars(s: [char]) -> string`
Convert an array of characters to a string.

```cpp
let chars = ['H', 'i'];
let text = from_chars(chars);  // "Hi"
```

### Struct: `String`

A struct wrapper around the primitive string type with additional methods.

```cpp
struct String {
public:
    s: string;
    len: uint64;
}
```

#### Constructor

```cpp
import "std/string";

let str = new String("Hello");
```

#### Static Methods

##### `String::from_chars(s: [char]) -> String`
Create a String from an array of characters.

```cpp
let chars = ['H', 'i'];
let str = String::from_chars(chars);
```

##### `String::str_len(s: &const string) -> uint64`
Get the length of a string primitive.

```cpp
let length = String::str_len(&"Hello");  // 5
```

#### Instance Methods

##### `len(&this) -> uint64`
Get the length of the String.

```cpp
let str = new String("Hello");
println(str.len());  // 5
```

##### `is_empty(&this) -> bool`
Check if the String is empty.

```cpp
let str = new String("");
if str.is_empty() {
    println("String is empty");
}
```

##### `concat(&this, other: String) -> String`
Concatenate two Strings.

```cpp
let str1 = new String("Hello");
let str2 = new String(" World");
let result = str1.concat(str2);
```

##### `push(&this, c: char)`
Append a character to the String.

```cpp
let str = new String("Hello");
str.push('!');
```

##### `push_str(&this, s: String)`
Append another String.

```cpp
let str1 = new String("Hello");
let str2 = new String(" World");
str1.push_str(str2);
```

##### `get(&this, index: uint64) -> char`
Get a character at a specific index.

```cpp
let str = new String("Hello");
let ch = str.get(0u);  // 'H'
```

##### `set(&this, index: uint64, c: char)`
Set a character at a specific index.

```cpp
let str = new String("Hello");
str.set(0u, 'h');  // "hello"
```

##### `to_str(&this) -> string`
Convert the String struct to a string primitive.

```cpp
let str = new String("Hello");
let s = str.to_str();
```

##### `to_chars(&this) -> [char]`
Convert the String to an array of characters.

```cpp
let str = new String("Hi");
let chars = str.to_chars();
```

##### `to_upper(&this) -> String`
Convert to uppercase.

```cpp
let str = new String("hello");
let upper = str.to_upper();  // "HELLO"
```

##### `to_lower(&this) -> String`
Convert to lowercase.

```cpp
let str = new String("HELLO");
let lower = str.to_lower();  // "hello"
```

##### `trim(&this) -> String`
Remove leading and trailing whitespace.

```cpp
let str = new String("  hello  ");
let trimmed = str.trim();  // "hello"
```

##### `split(&this, sep: string) -> [String]`
Split the String by a separator.

```cpp
let str = new String("a,b,c");
let parts = str.split(",");
```

##### `into_iter(this) -> Iter<char>`
Consume the String and create an iterator over its characters.

```cpp
let str = new String("Hi");
let iter = str.into_iter();
```

## `std/vector`

Dynamic array with resizable capacity.

### External Functions

#### `len<T>(data: &const [T]) -> uint64`
Get the length of an array.

```cpp
import "std/vector";

let arr = [1, 2, 3];
let length = len(&arr);  // 3
```

#### `slice<T>(data: &const [T], start: uint64, end: uint64) -> [T]`
Extract a slice from an array.

```cpp
let arr = [1, 2, 3, 4, 5];
let sub = slice(&arr, 1u, 4u);  // [2, 3, 4]
```

### Struct: `Vector<T>`

A generic dynamic array.

```cpp
struct Vector<T> {
public:
    data: [T];
    length: uint64;
    capacity: uint64;
}
```

#### Constructor

```cpp
import "std/vector";

let vec = new Vector<int64>([1, 2, 3]);
```

#### Static Methods

##### `Vector::<T>::with_capacity(capacity: uint64) -> Vector<T>`
Create a vector with a specific initial capacity.

```cpp
let vec = Vector<int64>::with_capacity(10u);
```

#### Instance Methods

##### `get(&this, index: uint64) -> &const T`
Get a const reference to an element.

```cpp
let vec = new Vector<int64>([1, 2, 3]);
let val = vec.get(1u);  // &2
```

##### `get_mut(&this, index: uint64) -> &T`
Get a mutable reference to an element.

```cpp
let vec = new Vector<int64>([1, 2, 3]);
let val = vec.get_mut(1u);
*val = 10;
```

##### `set(&this, index: uint64, val: T)`
Set an element at a specific index.

```cpp
let vec = new Vector<int64>([1, 2, 3]);
vec.set(1u, 10);
```

##### `push(&this, val: T)`
Add an element to the end of the vector.

```cpp
let vec = new Vector<int64>([1, 2]);
vec.push(3);
```

##### `pop(&this) -> T`
Remove and return the last element.

```cpp
let vec = new Vector<int64>([1, 2, 3]);
let last = vec.pop();  // 3
```

##### `into_iter(this) -> Iter<T>`
Consume the vector and create an iterator.

```cpp
let vec = new Vector<int64>([1, 2, 3]);
let iter = vec.into_iter();
```

## `std/optional`

Type-safe nullable values.

### Struct: `optional<T>`

Represents a value that may or may not be present.

#### Static Methods

##### `optional<T>::of(data: T) -> optional<T>`
Create an optional containing a value.

```cpp
import "std/optional";

let opt = optional<int64>::of(42);
```

##### `optional<T>::empty() -> optional<T>`
Create an empty optional.

```cpp
let opt = optional<int64>::empty();
```

#### Instance Methods

##### `has_value(&this) -> bool`
Check if the optional contains a value.

```cpp
let opt = optional<int64>::of(42);
if opt.has_value() {
    println("Has value");
}
```

##### `value(this) -> T`
Consume the optional and return the value (panics if empty).

```cpp
let opt = optional<int64>::of(42);
let val = opt.value();  // 42
```

##### `value_or(this, default: T) -> T`
Consume the optional and return the value or a default.

```cpp
let opt = optional<int64>::empty();
let val = opt.value_or(0);  // 0
```

See [Error Handling](./error-handling.md) for more examples.

## `std/expected`

Result type for operations that can fail.

### Struct: `expected<T, E>`

Represents either a success value or an error.

#### Static Methods

##### `expected<T, E>::expect(data: T) -> expected<T, E>`
Create a successful expected.

```cpp
import "std/expected";

let result = expected<int64, string>::expect(42);
```

##### `expected<T, E>::unexpected(error: E) -> expected<T, E>`
Create a failed expected.

```cpp
let result = expected<int64, string>::unexpected("Error");
```

#### Instance Methods

##### `is_expected(&this) -> bool`
Check if this contains a value.

```cpp
let result = expected<int64, string>::expect(42);
if result.is_expected() {
    println("Success");
}
```

##### `is_unexpected(&this) -> bool`
Check if this contains an error.

```cpp
if result.is_unexpected() {
    println("Error occurred");
}
```

##### `expected_value(this) -> T`
Consume and return the value (panics if error).

```cpp
let result = expected<int64, string>::expect(42);
let val = result.expected_value();  // 42
```

##### `unexpected_value(this) -> E`
Consume and return the error (panics if value).

```cpp
let result = expected<int64, string>::unexpected("Error");
let err = result.unexpected_value();  // "Error"
```

##### `expected_value_or(this, default: T) -> T`
Consume and return the value or a default.

```cpp
let result = expected<int64, string>::unexpected("Error");
let val = result.expected_value_or(0);  // 0
```

See [Error Handling](./error-handling.md) for more examples.

## `std/iter`

Iterator utilities for traversing collections.

### Struct: `Iter<T>`

Generic iterator over elements of type T.

```cpp
struct Iter<T> {
public:
    data: Vector<T>;
    index: uint64;
}
```

#### Constructor

```cpp
import "std/iter";
import "std/vector";

let vec = new Vector<int64>([1, 2, 3]);
let iter = new Iter<int64>(vec);
```

#### Static Methods

##### `Iter<T>::from_array(data: [T]) -> Iter<T>`
Create an iterator from an array.

```cpp
let arr = [1, 2, 3];
let iter = Iter<int64>::from_array(arr);
```

##### `Iter<char>::from_string(data: String) -> Iter<char>`
Create an iterator from a String.

```cpp
let str = new String("Hi");
let iter = Iter<char>::from_string(str);
```

##### `Iter<char>::from_str(data: &const string) -> Iter<char>`
Create an iterator from a string primitive.

```cpp
let text = "Hi";
let iter = Iter<char>::from_str(&text);
```

#### Instance Methods

##### `next(&this) -> optional<T>`
Get the next item (returns empty if exhausted).

```cpp
let iter = Iter<int64>::from_array([1, 2]);
let first = iter.next();  // optional::of(1)
let second = iter.next();  // optional::of(2)
let third = iter.next();  // optional::empty()
```

##### `peek(&this) -> optional<&const T>`
Peek at the next item without advancing.

```cpp
let iter = Iter<int64>::from_array([1, 2]);
let peeked = iter.peek();  // optional::of(&1)
let next = iter.next();     // optional::of(1)
```

##### `has_next(&this) -> bool`
Check if there are more items.

```cpp
while iter.has_next() {
    let item = iter.next().value();
    println(item);
}
```

## `std/time`

Time operations and formatting.

### Struct: `Time`

Represents a point in time.

```cpp
struct Time {
public:
    sec: int64;
    nsec: int64;
}
```

#### Constructor

```cpp
import "std/time";

let time = new Time(1234567890, 0);
```

#### Static Methods

##### `Time::now() -> Time`
Get the current time.

```cpp
let now = Time::now();
```

#### Instance Methods

##### `format(&this, fmt: string) -> string`
Format the time as a string.

```cpp
let time = Time::now();
let formatted = time.format("%Y-%m-%d %H:%M:%S");
```

##### `to_iso_string(&this) -> string`
Convert to ISO 8601 format.

```cpp
let time = Time::now();
let iso = time.to_iso_string();
```

##### `sleep(&this)`
Sleep for the duration represented by this Time.

```cpp
let duration = new Time(2, 0);  // 2 seconds
duration.sleep();
```

##### `elapsed(&this, since: Time) -> Time`
Calculate elapsed time since another time.

```cpp
let start = Time::now();
// ... do work ...
let end = Time::now();
let duration = end.elapsed(start);
```

## `std/math`

Mathematical functions.

### Functions

#### `abs(x: int64) -> int64`
Absolute value of an integer.

```cpp
import "std/math";

let result = abs(-5);  // 5
```

#### `abs_f(x: float64) -> float64`
Absolute value of a float.

```cpp
let result = abs_f(-3.14);  // 3.14
```

#### `round(x: float64) -> int64`
Round a float to the nearest integer.

```cpp
let result = round(3.7);  // 4
```

#### `random(min: int64, max: int64) -> int64`
Generate a random integer in the range [min, max].

```cpp
let num = random(1, 10);
```

#### `sin_f(x: float64) -> float64`
Sine of x (radians).

```cpp
let result = sin_f(3.14159 / 2.0);  // ~1.0
```

#### `cos_f(x: float64) -> float64`
Cosine of x (radians).

```cpp
let result = cos_f(0.0);  // 1.0
```

#### `min(x: int64, y: int64) -> int64`
Minimum of two integers.

```cpp
let result = min(5, 10);  // 5
```

#### `min_f(x: float64, y: float64) -> float64`
Minimum of two floats.

```cpp
let result = min_f(3.5, 2.1);  // 2.1
```

#### `max(x: int64, y: int64) -> int64`
Maximum of two integers.

```cpp
let result = max(5, 10);  // 10
```

#### `max_f(x: float64, y: float64) -> float64`
Maximum of two floats.

```cpp
let result = max_f(3.5, 2.1);  // 3.5
```

#### `pow(x: int64, y: int64) -> int64`
Raise x to the power of y (integers).

```cpp
let result = pow(2, 10);  // 1024
```

#### `pow_f(x: float64, y: int64) -> float64`
Raise x to the power of y (float base).

```cpp
let result = pow_f(2.0, 3);  // 8.0
```

## `std/map`

Key-value map data structure.

### Struct: `Pair<K, V>`

A key-value pair.

```cpp
struct Pair<K, V> {
public:
    key: K;
    value: V;
}
```

#### Constructor

```cpp
import "std/map";

let pair = new Pair<int64, string>(1, "one");
```

#### Instance Methods

##### `get_first(&const this) -> K`
Get the key (requires K to be copyable).

```cpp
let pair = new Pair<int64, string>(1, "one");
let key = pair.get_first();  // 1
```

##### `get_second(&const this) -> V`
Get the value (requires V to be copyable).

```cpp
let value = pair.get_second();  // "one"
```

##### `swap(this) -> Pair<V, K>`
Consume the pair and return a new pair with swapped key and value.

```cpp
let pair = new Pair<int64, string>(1, "one");
let swapped = pair.swap();  // Pair<string, int64>
```

### Struct: `Map<K, V>`

A simple key-value map.

```cpp
struct Map<K, V> {
private:
    keys: Vector<K>;
    values: Vector<V>;
}
```

#### Constructor

```cpp
let map = new Map<int64, string>();
```

#### Instance Methods

##### `get(&this, key: K) -> optional<&const V>`
Get a const reference to the value for a key.

```cpp
let map = new Map<int64, string>();
map.insert(1, "one");

let value_opt = map.get(1);
if value_opt.has_value() {
    let value_ref = value_opt.value();
    println(*value_ref);
}
```

##### `get_mut(&this, key: K) -> optional<&V>`
Get a mutable reference to the value for a key.

```cpp
let value_ref = map.get_mut(1);
if value_ref.has_value() {
    let val = value_ref.value();
    *val = "ONE";
}
```

##### `insert(&this, key: K, value: V)`
Insert or update a key-value pair.

```cpp
map.insert(1, "one");
map.insert(1, "ONE");  // Updates existing
```

##### `contains_key(&this, key: K) -> bool`
Check if a key exists.

```cpp
if map.contains_key(1) {
    println("Key found");
}
```

##### `remove(&this, key: K) -> optional<V>`
Remove and return the value for a key.

```cpp
let value = map.remove(1);
```

##### `len(&this) -> uint64`
Get the number of entries.

```cpp
let count = map.len();
```

##### `is_empty(&this) -> bool`
Check if the map is empty.

```cpp
if map.is_empty() {
    println("Map is empty");
}
```

## `std/queue`

FIFO queue data structure.

### Struct: `Queue<T>`

A first-in-first-out queue.

```cpp
struct Queue<T> {
private:
    items: [T];
public:
    head: uint64;
    tail: uint64;
    size: uint64;
    count: uint64;
}
```

#### Static Methods

##### `Queue::<T>::with_size(size: uint64) -> Queue<T>`
Create a queue with a fixed size.

```cpp
import "std/queue";

let queue = Queue<int64>::with_size(10u);
```

#### Instance Methods

##### `enqueue(&this, item: T)`
Add an item to the back of the queue.

```cpp
queue.enqueue(1);
queue.enqueue(2);
```

##### `dequeue(&this) -> T`
Remove and return the item at the front.

```cpp
let first = queue.dequeue();  // 1
```

##### `is_full(&this) -> bool`
Check if the queue is full.

```cpp
if queue.is_full() {
    println("Queue is full");
}
```

##### `is_empty(&this) -> bool`
Check if the queue is empty.

```cpp
if queue.is_empty() {
    println("Queue is empty");
}
```

## `std/box`

> **⚠️ Deprecated:** This module is deprecated and will be replaced by `std/experimental/smart_ptr` in the future.

### Struct: `Box<T>`

A simple container for a single value.

```cpp
struct Box<T> {
private:
    data: T;
}
```

#### Constructor

```cpp
import "std/box";

let box = new Box<int64>(42);
```

#### Instance Methods

##### `get(&this) -> T`
Get the contained value.

```cpp
let value = box.get();
```

##### `set(&this, data: T)`
Set the contained value.

```cpp
box.set(100);
```

## `std/mem`

Memory utilities.

### Functions

#### `memcpy<T>(data: &const T) -> T`
Create a shallow copy of a value.

```cpp
import "std/mem";

let x = 42;
let y = memcpy(&x);
```

> **Note:** This performs a shallow copy. For deep copies, implement `_copy` on type T.

#### `delete_from_ref<T>(data: &const T)`
Delete memory referenced by a pointer.

```cpp
// Use with extreme caution - can lead to undefined behavior
delete_from_ref(&some_value);
```

> **⚠️ Warning:** This function can lead to undefined behavior. Use with caution.

---

## See Also

- [Error Handling](./error-handling.md) – Using optional and expected
- [Memory Model](./memory-model.md) – Ownership and copy semantics
- [Language Reference](./language-reference.md) – Language syntax and features

## Experimental Modules (Not Yet Included)

The following modules are under active development and are **not included** in the current standard library:

### `std/rc_ptr`

**Status:** Experimental, work in progress

Reference-counted smart pointers for shared ownership:

```cpp
// Planned usage (not yet available):
// let ptr: rc_ptr<Data> = rc_ptr::new(Data());
// let cloned: rc_ptr<Data> = ptr.clone();  // Reference count increases
```

### `std/cast`

**Status:** Experimental, work in progress

Type casting and conversion utilities:

```cpp
// Planned usage (not yet available):
// let num: int64 = 42;
// let as_float: float64 = cast<float64>(num);
```

---

## Notes

- All modules are works in progress and subject to change.
- Most modules are not yet fully implemented or finalized.
- For experimental modules listed above, expect significant API changes.
- Standard library types may not be copyable; assume move semantics unless documented otherwise.
