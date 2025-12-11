# Standard Library

> [!Note] 
> All the standard library is a work in progress.
> Most of the modules aren't implement or finished yet. The documentation is here to give an idea of what the standard library will look like.

| Module       | Description                   |
|------------- |-------------------------------|
| `std/io`     | Input/output functions        |
| `std/fs`     | File handling functions       |
| `std/string` | String manipulation functions |
| `std/vector` | Vector manipulation functions |
| `std/time`   | Time functions                |
| `std/math`   | Math functions                |
| `std/option` | Option type and functions     |
| `std/result` | Result type and functions     |
| `std/box`    | Box type and functions        |
| `std/iter`   | Iterator type and functions   |
| `std/map`    | Map type and functions        |

You can see what is implemented with the checkboxes below.

## `std/io`

- [x] `print<T>(val: T) -> unit`: Print a value to the standard output.
- [x] `println<T>(val: T) -> unit`: Print a value to the standard output followed by a newline.
- [x] `input() -> str`: Read a line from the standard input.
- [x] `panic(msg: string) -> !`: Abort the program with an error message.

## `std/fs`

### Structs
- [x] `File`: A file type that can be used to read and write files.

> NB: `File` is not stable yet. BEWARE.
> 
> Lack of copy/move semantics makes it tricky to handle files safely.
```
struct File {
private:
    content: string;
public:
    path: string;
    File(path: string) {
        this.content = "";
        this.path = path;
    }
}
```

### Methods

- [x] `read(this: File) -> string`: Read the entire content of the file.
- [x] `open(path: string) -> File`: Open a file for reading and writing.
> Does the same shit as "read()" but it makes more sense to open once then use `read()` later if the file got updated
- [x] `close(this: File) -> unit`: Close the file.
> NB: This is called automatically in the destructor, BUT because of the current state of the memory, you might wanna do it manually just to be sure.
- [x] `exists(this: File) -> bool`: Check if the file exists.
- [x] `read_dir(this: File) -> [string]`: Read the contents of a directory.
- [x] `read_file(this: File) -> string`: Read the entire content of the file and returns it to you. It does not set `File.content` to the content of the file.

### Functions

- [x] `read_dir(path: string) -> [string]`: Read the contents of a directory.
- [x] `read_file(path: string) -> string`: Read the entire content of a file.
- [x] `write_file(path: string, content: string) -> unit`: Write content to a file.
- [x] `remove_file(path: string) -> unit`: Remove a file.
- [x] `file_exists(path: string) -> bool`: Check if a file exists.
- [x] `close_file(path: string) -> unit`: Close a file.

## `std/string`

### Structs
- [x] `String`: A string type that can be used to manipulate strings.
```
struct String {
    s: string;
    len: uint64;
    String(s: string) {
        self.s = s;
        self.len = str_len(s);
    }
}
```

#### Methods

- [x] `String::from_chars(chars: [char]) -> String`: Create a new `String` struct from a list of characters.
- [x] `String::str_len(s: string) -> uint64`: Get the length of a string primitive.
- [x] `len(this: String) -> uint64`: Get the length of the String.
- [x] `is_empty(this: String) -> bool`: Check if the String is empty.
- [x] `concat(this: String, other: String) -> String`: Concatenate two Strings.
- [x] `push(this: String, c: char) -> unit`: Add a character to the end of the String.
- [x] `push_str(this: String, s: String) -> unit`: Add a String to the end of the String.
- [ ] `find(this: String, sub_string: String) -> Option<uint64>`: Find the index of a substring in the String.
> Not stable yet. BEWARE.
- [x] `get(this: String, index: uint64) -> char`: Get a character from the String by index.
- [x] `set(this: String, index: uint64, c: char) -> unit`: Set a character in the String by index.
- [x] `to_str(this: String) -> string`: Convert the String struct to a string primitive.
- [x] `to_chars(this: String) -> [char]`: Convert the String struct to a list of characters.
- [x] `to_upper(this: String) -> String`: Convert the String to uppercase.
- [x] `to_lower(this: String) -> String`: Convert the String to lowercase
- [x] `trim(this: String) -> String`: Trim whitespace from both ends of the String.
- [x] `split(this: String, sep: string) -> [String]`: Split the String by a separator.
- [x] `into_iter(this: String) -> Iter<char>`: Create an iterator (from `std/iter`) over the characters of the String.

### Functions

- [x] `str_len(s: string) -> uint64`: Get the length of a string primitive.
- [x] `trim(s: string) -> string`: Trim whitespace from both ends of a string.
- [x] `to_upper(s: string) -> string`: Convert a string to uppercase.
- [x] `to_lower(s: string) -> string`: Convert a string to lowercase.
- [x] `split(s: string, sep: string) -> [string]`: Split a string by a separator.
- [x] `str_cmp(s1: string, s2: string) -> uint64`: Compare two strings.
- [x] `to_chars(s: string) -> [char]`: Convert a string to a list of characters.
- [x] `from_chars(s: [char]) -> string`: Convert a list of characters to a string.

## `std/vector`

### Structs
- [x] `Vector<T>`: A vector is a dynamic array that can grow or shrink in size. It has a bunch of methods to manipulate the data.
```
struct Vector<T> {
private:
    data: [T];
public:
    length: uint64;
    capacity: uint64;
    Vector(data: [T]) {
        this.length = len(data);
        this.capacity = this.length;
        this.data = data;
    }
}
```

### Methods

- [x] `len(this: Vector<T>) -> uint64`: Get the length of the vector.
- [x] `is_empty(this: Vector<T>) -> bool`: Check if the vector is empty.
- [x] `push(this: Vector<T>, val: T) -> unit`: Add an element to the end of the vector.
- [x] `pop(this: Vector<T>) -> T`: Remove and return the last element of the vector.
- [x] `get(this: Vector<T>, index: uint64) -> T`: Get an element from the vector by index.
- [x] `set(this: Vector<T>, index: uint64, val: T) -> unit`: Set an element in the vector by index.
- [x] `into_iter(this: Vector<T>) -> Iter<T>`: Create an iterator (from `std/iter`) over the elements of the vector.
- [x] `Vector::<T>::with_capacity(capacity: uint64) -> Vector<T>`: Create a new vector with a specified capacity.

### Functions

- [x] `len<T>(lst: [T]) -> uint64`: Get the length of a list.
- [x] `slice<T>(lst: [T], start: uint64, end: uint64) -> [T]`: Get a slice of a list from start to end.

## `std/time`

### Structs
- [x] `Time`: A time type that can be used to represent time.
```
struct Time {
public:
    sec: int64;
    nsec: int64;
    Time(sec: int64, nsec: int64) {
        this.sec = sec;
        this.nsec = nsec;
    }
}
```

### Methods
- [x] `Time::now() -> Time`: Get the current time.
- [x] `format(this: Time, fmt: str) -> str`: Format the time as a string.
- [x] `to_iso_string(this: Time) -> str`: Convert the time to an ISO 8601 string.
> Yeah well, I don't know why this function exists, but who knows, maybe it will be useful one day.
- [x] `sleep(this: Time) -> unit`: Sleep for the specified time.
> NB: This is a blocking sleep. Might not work. BEWARE.
- [x] `elapsed(this: Time, since: Time) -> uint64`: Calculate the elapsed time between two time values in milliseconds.

### Functions
- [x] `now() -> Time`: Get the current time.
- [x] `sleep(t: Time) -> unit`: Sleep for the specified time.
> NB: This is a blocking sleep. Might not work. BEWARE.
- [x] `format_time(t: Time, fmt: str) -> str`: Format the time as a string.

## `std/math`

### Functions

- [x] `abs(x: int64) -> int64`: Compute the absolute value of a integer number.
- [x] `abs_f(x: float64) -> float64`: Compute the absolute value of a floating-point number.
- [x] `round(x: float64) -> int64`: Round a floating-point number to the nearest integer.
- [x] `random(min: int64, max: int64) -> int64`: Generate a random integer number in the range `[min, max]`.
- [x] `pow(x: int64, y: int64) -> int64`: Compute `x` raised to the power of `y`.
- [x] `pow_f(x: float64, y: float64) -> float64`: Compute `x` raised to the power of `y`.
- [x] `min(x: int64, y: int64) -> int64`: Compute the minimum of two integer numbers.
- [x] `min_f(x: float64, y: float64) -> float64`: Compute the minimum of two floating-point numbers.
- [x] `max(x: int64, y: int64) -> int64`: Compute the maximum of two integer numbers.
- [x] `max_f(x: float64, y: float64) -> float64`: Compute the maximum of two floating-point numbers.

## `std/option`

### Structs
- [x] `Option<T>`: A type that represents an optional value, which can either be `SOME` or `NONE`.
```
private enum OptionTag {
	NONE = 0;
	SOME = 256;
}

struct Option<T> {
private:
  	tag: OptionTag;
  	data: T;
  	Option(data: T, tag: OptionTag) {
		this.tag = tag;
		this.data = data;
	}
}
```

### Methods
- [x] `is_some(this: Option<T>) -> bool`: Check if the option is `SOME`.
- [x] `is_none(this: Option<T>) -> bool`: Check if the option is `NONE`.
- [x] `unwrap(this: Option<T>) -> T`: Get the value inside the option if it is `SOME`, otherwise panic.
- [x] `unwrap_or(this: Option<T>, default: T) -> T`: Get the value inside the option if it is `SOME`, otherwise return the default value.
- [ ] `map<U>(this: Option<T>, f: (T) -> U) -> Option<U>`: Apply a function to the value inside the option if it is `SOME`, otherwise return `NONE`.
> Don't exist yet.

## `std/result`

### Structs
- [x] `Result<T, E>`: A type that represents either a success `OK` carrying the type `T` or an error `ERR` carrying the type `E`.
```
private enum ResultTag {
    OK = 0;
    ERR = 256;
}

struct Result<T, E> {
private:
    data: T;
    err: E;
    tag: ResultTag;
    Result(data: T, err: E, tag: ResultTag) {
        this.data = data;
        this.err = err;
        this.tag = tag;
    }
}
```

### Methods

- [x] `Result::<T, E>::ok(value: T) -> Result<T, E>`: Create a new `OK` result.
- [x] `Result::<T, E>::err(error: E) -> Result<T, E>`: Create a new `ERR` result.
- [x] `is_ok(this: Result<T, E>) -> bool`: Check if the result is `OK`.
- [x] `is_err(this: Result<T, E>) -> bool`: Check if the result is `ERR`.
- [x] `unwrap(this: Result<T, E>) -> T`: Get the value inside the result if it is `OK`, otherwise panic.
- [x] `unwrap_err(this: Result<T, E>) -> E`: Get the error inside the result if it is `ERR`, otherwise panic.
- [x] `unwrap_or(this: Result<T, E>, default: T) -> T`: Get the value inside the result if it is `OK`, otherwise return the default value.
- [x] `unwrap_err_or(this: Result<T, E>, default: E) -> E`: Get the error inside the result if it is `ERR`, otherwise return the default error.
- [ ] `map<U>(this: Result<T, E>, f: (T) -> U) -> Result<U, E>`: Apply a function to the value inside the result if it is `OK`, otherwise return the `ERR`.
> Don't exist yet.
- [ ] `map_err<F>(this: Result<T, E>, f: (E) -> F) -> Result<T, F>`: Apply a function to the error inside the result if it is `ERR`, otherwise return the `OK`.
> Don't exist yet.

## `std/box`

### Structs
- [x] `Box<T>`: A type that represents a heap-allocated value of type `T`.
```
struct Box<T> {
private:
    data: T;
public:
    Box(data: T) {
        this.data = data;
    }
}
```

### Methods

- [x] `get(this: Box<T>) -> T`: Get the value inside the box.
- [x] `set(this: Box<T>, value: T) -> unit`: Set the value inside the box.

## `std/iter`

### Structs
- [x] `Iter<T>`: An iterator type that can be used to iterate over a collection of type `T`. (as of now it only iters over a `Vector<T>`.)
```
struct Iter<T> {
private:
    data: Vector<T>;
    index: uint64;
public:
    Iter(data: Vector<T>) {
        this.data = data;
        this.index = 0_uint64;
    }
}
```

### Methods
- [x] `next(this: Iter<T>) -> Option<T>`: Get the next element in the iterator.
- [x] `peek(this: Iter<T>) -> Option<&const T>`: Peek at the next element in the iterator without advancing it.
- [x] `has_next(this: Iter<T>) -> bool`: Check if the iterator has more elements.
- [x] `Iter::<T>::from_array(data: [T]) -> Iter<T>`: Create a new iterator from an array.
- [x] `Iter::<T>::from_string(data: string) -> Iter<char>`: Create a new iterator from a primitive string.


## `std/map`

### Structs
- [x] `Map<K, V>`: A type that represents a key-value store.
```
struct Map<K, V> {
private:
    keys: Vector<K>;
    values: Vector<V>;
public:
    Map() {
        this.keys = new Vector<K>(new [K; 0]);
        this.values = new Vector<V>(new [V; 0]);
    }
}
```

### Methods
- [x] `insert(this: Map<K, V>, key: K, value: V) -> unit`: Insert a key-value pair into the map.
- [x] `get(this: Map<K, V>, key: K) -> Option<V>`: Get a value from the map by key.
- [x] `remove(this: Map<K, V>, key: K) -> unit`: Remove a key-value pair from the map.
- [x] `contains(this: Map<K, V>, key: K) -> bool`: Check if a key exists in the map.
- [x] `size(this: Map<K, V>) -> uint64`: Get the number of key-value pairs in the map.

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
