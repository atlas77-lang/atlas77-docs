# Standard Library

> [!Note] 
> All the standard library is a work in progress.
> Most of the modules aren't implement or finished yet. The documentation is here to give an idea of what the standard library will look like.

| Module       | Description                   |
|------------- |-------------------------------|
| `std/io`     | Input/output functions        |
| `std/fs`     | File handling functions       |
| `std/string` | String manipulation functions |
| `std/list`   | List manipulation functions   |
| `std/time`   | Time functions                |
| `std/math`   | Math functions                |
| `std/vec`    | Vector functions              |

You can see what is implemented with the checkboxes below.

## `std/io`

- [x] `print<T>(val: T) -> unit`: Print a string to the standard output.
- [x] `println<T>(val: T) -> unit`: Print a string to the standard output followed by a newline.
- [x] `input() -> str`: Read a line from the standard input.

## `std/fs`

- [ ] `File`: A file type that can be used to read and write files.

> NB: The `File` type is not implemented yet.

- [ ] `open(filename: str, mode: str) -> File`: Open a file in the specified mode.
- [ ] `read(file: File) -> str`: Read the content of a file.
- [ ] `write(file: File, content: str) -> unit`: Write content to a file.
- [ ] `close(file: File) -> unit`: Close a file.
- [ ] `exists(filename: str) -> bool`: Check if a file exists.
- [ ] `remove(filename: str) -> unit`: Remove a file.
- [ ] `rename(old: str, new: str) -> unit`: Rename a file.

## `std/str`

- `String`: A string type that can be used to manipulate strings.

> NB: The `String` type is not implemented yet.

### Implements

- `Indexable<char>`: A trait that defines the `get` and `set` methods.

> NB: The `Indexable` trait is not implemented yet.

### Methods

- [x] `str_len(s: String) -> uint64`: Get the length of a string.
- [ ] `concat(s1: String, s2: String) -> String`: Concatenate two strings.
- [x] `split(s: String, sep: str) -> List`: Split a string into a list of substrings.
- [ ] `join(lst: List, sep: str) -> String`: Join a list of strings into a single string.
- [ ] `replace(s: String, old: str, new: str) -> String`: Replace all occurrences of a substring in a string.
- [x] `to_upper(s: String) -> String`: Convert a string to uppercase.
- [x] `to_lower(s: String) -> String`: Convert a string to lowercase.
- [ ] `trim(s: String) -> String`: Remove leading and trailing whitespace from a string.
- [ ] `starts_with(s: String, prefix: str) -> bool`: Check if a string starts with a prefix.
- [ ] `ends_with(s: String, suffix: str) -> bool`: Check if a string ends with a suffix.
- [ ] `contains(s: String, sub: str) -> bool`: Check if a string contains a substring.
- [ ] `find(s: String, sub: str) -> int64`: Find the index of the first occurrence of a substring in a string.
- [ ] `rfind(s: String, sub: str) -> int64`: Find the index of the last occurrence of a substring in a string.
- [ ] `slice(s: String, start: int64, end: int64) -> String`: Get a substring of a string.

### Operators

- [ ] `+`: Concatenate two strings.
- [ ] `[]`: Get a character from a string by index.
- [ ] `[]=`: Set a character in a string by index.

## `std/list`

- [ ] `len<T>(lst: [T]) -> uint64`: Get the length of a list.
- [ ] `push<T>(lst: [T], val: T) -> unit`: Add an element to the end of a list.
- [ ] `pop<T>(lst: [T]) -> T`: Remove and return the last element of a list.
- [ ] `slice<T>(lst: [T], start: uint64, end: uint64) -> [T]`: Get a slice of a list.
- [ ] `remove<T>(lst: [T], index: uint64) -> T`: Remove and return an element from a list by index.

## `std/vec`

- [ ] `Vec<T>`: A vector is a dynamic array that can grow or shrink in size. It has a bunch of methods to manipulate the data.

### Implements
- [ ] `Indexable<T>`: A trait that defines the `get` and `set` methods.

### Methods

- [ ] `Vec(data: [T]) -> Vec<T>`: Create a new vector from a list.
- [ ] `len() -> uint64`: Get the length of the vector.
- [ ] `is_empty() -> bool`: Check if the vector is empty.
- [ ] `push(val: T) -> unit`: Add an element to the end of the vector.
- [ ] `pop() -> T`: Remove and return the last element of the vector.
- [ ] `get(index: uint64) -> T`: Get an element from the vector by index.
- [ ] `set(index: uint64, val: T) -> unit`: Set an element in the vector by index.

### Operators

- [ ] `[]`: Get an element from the vector by index.
- [ ] `[]=`: Set an element in the vector by index.


## `std/time`

- [ ] `Time`: A time type that can be used to represent time.


- [ ] `now() -> Time`: Get the current time.
- [ ] `format(t: Time, fmt: str) -> str`: Format a time value as a string.
- [ ] `sleep(ms: uint64) -> unit`: Sleep for the specified number of milliseconds.
- [ ] `sleep_us(us: uint64) -> unit`: Sleep for the specified number of microseconds.
- [ ] `sleep_ns(ns: uint64) -> unit`: Sleep for the specified number of nanoseconds.
- [ ] `elapsed(start: Time, end: Time) -> uint64`: Calculate the elapsed time between two time values in milliseconds.
- [ ] `elapsed_us(start: Time, end: Time) -> uint64`: Calculate the elapsed time between two time values in microseconds.
- [ ] `elapsed_ns(start: Time, end: Time) -> uint64`: Calculate the elapsed time between two time values in nanoseconds.
- [ ] `parse(s: str, fmt: str) -> Time`: Parse a string into a time value.
- [ ] `add(t: Time, ms: uint64) -> Time`: Add milliseconds to a time value.

## `std/math`

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

