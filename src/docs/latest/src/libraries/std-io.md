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
