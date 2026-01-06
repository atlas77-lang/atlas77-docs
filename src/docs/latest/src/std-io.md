# std/io

Basic input/output and program control functions.

## Functions

### `print<T>(s: T)`

Print a value to standard output without a newline.

```cpp
import "std/io";

print("Hello");
print(" World!");
// Output: Hello World!
```

### `println<T>(s: T)`

Print a value to standard output followed by a newline.

```cpp
import "std/io";

println("Hello, Atlas!");
// Output: Hello, Atlas!
//         (newline)
```

### `input() -> string`

Read a line from standard input.

```cpp
import "std/io";

println("Enter your name:");
let name = input();
println("Hello, " + name);
```

### `panic<T>(s: T)`

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

## Usage Examples

### Basic Output

```cpp
import "std/io";

fun main() {
    println("Welcome to Atlas77!");
    print("Your score: ");
    println(42);
}
```

### Reading User Input

```cpp
import "std/io";

fun main() {
    println("What is your name?");
    let name = input();
    println("Hello, " + name + "!");
}
```

### Error Handling with panic

```cpp
import "std/io";

fun safe_divide(a: int64, b: int64) -> int64 {
    if b == 0 {
        panic("Cannot divide by zero");
    }
    return a / b;
}

fun main() {
    let result = safe_divide(10, 2);
    println(result);  // Output: 5
}
```

---

**See also:**
- [Standard Library Overview](./std.md)
- [Error Handling](./error-handling.md)
