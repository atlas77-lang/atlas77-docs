# std/string

String manipulation functions and the String struct.

## External Functions

These functions work with the primitive `string` type.

### `str_len(s: &const string) -> uint64`

Get the length of a string primitive (in bytes).

```cpp
import "std/string";

let text = "Hello";
let length = str_len(&text);  // 5
```

### `trim(s: string) -> string`

Remove leading and trailing whitespace.

```cpp
let text = "  hello  ";
let trimmed = trim(text);  // "hello"
```

### `to_upper(s: string) -> string`

Convert a string to uppercase.

```cpp
let text = "hello";
let upper = to_upper(text);  // "HELLO"
```

### `to_lower(s: string) -> string`

Convert a string to lowercase.

```cpp
let text = "HELLO";
let lower = to_lower(text);  // "hello"
```

### `split(s: &string, sep: &string) -> [string]`

Split a string by a separator.

```cpp
let text = "apple,banana,cherry";
let parts = split(&text, &",");
// ["apple", "banana", "cherry"]
```

### `str_cmp(s1: &const string, s2: &const string) -> uint64`

Compare two strings lexicographically.

```cpp
let result = str_cmp(&"apple", &"banana");
```

### `to_chars(s: &const string) -> [char]`

Convert a string to an array of characters.

```cpp
let text = "Hi";
let chars = to_chars(&text);  // ['H', 'i']
```

### `from_chars(s: [char]) -> string`

Convert an array of characters to a string.

```cpp
let chars = ['H', 'i'];
let text = from_chars(chars);  // "Hi"
```

## Struct: `String`

A struct wrapper around the primitive string type with additional methods.

```cpp
struct String {
public:
    s: string;
    len: uint64;
}
```

### Constructor

```cpp
import "std/string";

let str = new String("Hello");
```

## Static Methods

### `String::from_chars(s: [char]) -> String`

Create a String from an array of characters.

```cpp
let chars = ['H', 'i'];
let str = String::from_chars(chars);
```

### `String::str_len(s: &const string) -> uint64`

Get the length of a string primitive.

```cpp
let length = String::str_len(&"Hello");  // 5
```

## Instance Methods

### `len(&this) -> uint64`

Get the length of the String.

```cpp
let str = new String("Hello");
println(str.len());  // 5
```

### `is_empty(&this) -> bool`

Check if the String is empty.

```cpp
let str = new String("");
if str.is_empty() {
    println("String is empty");
}
```

### `concat(&this, other: String) -> String`

Concatenate two Strings.

```cpp
let str1 = new String("Hello");
let str2 = new String(" World");
let result = str1.concat(str2);
```

### `push(&this, c: char)`

Append a character to the String.

```cpp
let str = new String("Hello");
str.push('!');
```

### `push_str(&this, s: String)`

Append another String.

```cpp
let str1 = new String("Hello");
let str2 = new String(" World");
str1.push_str(str2);
```

### `get(&this, index: uint64) -> char`

Get a character at a specific index.

```cpp
let str = new String("Hello");
let ch = str.get(0u);  // 'H'
```

### `set(&this, index: uint64, c: char)`

Set a character at a specific index.

```cpp
let str = new String("Hello");
str.set(0u, 'h');  // "hello"
```

### `to_str(&this) -> string`

Convert the String struct to a string primitive.

```cpp
let str = new String("Hello");
let s = str.to_str();
```

### `to_chars(&this) -> [char]`

Convert the String to an array of characters.

```cpp
let str = new String("Hi");
let chars = str.to_chars();
```

### `to_upper(&this) -> String`

Convert to uppercase.

```cpp
let str = new String("hello");
let upper = str.to_upper();  // "HELLO"
```

### `to_lower(&this) -> String`

Convert to lowercase.

```cpp
let str = new String("HELLO");
let lower = str.to_lower();  // "hello"
```

### `trim(&this) -> String`

Remove leading and trailing whitespace.

```cpp
let str = new String("  hello  ");
let trimmed = str.trim();  // "hello"
```

### `split(&this, sep: string) -> [String]`

Split the String by a separator.

```cpp
let str = new String("a,b,c");
let parts = str.split(",");
```

### `into_iter(this) -> Iter<char>`

Consume the String and create an iterator over its characters.

```cpp
let str = new String("Hi");
let iter = str.into_iter();
```
