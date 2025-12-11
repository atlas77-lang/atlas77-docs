# Getting Started with Atlas 77

Welcome to Atlas 77! This guide will help you install the language and write your first program.

## Your First Program

Here is a simple "Hello, Atlas!" program:

```cpp
import "std/io";

fun main() {
    println("Hello, Atlas!");
}
```

Save this code to a `.atlas` file, then run it with:

```bash
atlas_77 run <FILE_PATH>
```

For example:
```bash
atlas_77 run hello.atlas
```

## Creating a Project

To create a new Atlas 77 project with standard structure:

```bash
atlas_77 init my_project
cd my_project
atlas_77 run
```

This creates a basic project template with all necessary files.

## Next Steps

- Read [Hello, World!](./hello_world.md) for a detailed walkthrough
- Explore [Language Reference](./language-reference.md) for complete syntax documentation
- Try [Guessing Game](./guessing_game.md) for a practical example
- Check [Memory Model](./memory-model.md) to understand ownership and cleanup
- Browse [Standard Library](./std.md) for available modules and functions

## Comments

Comments document code and are ignored by the compiler.

### Single-line Comments

Single-line comments start with `//` and continue to the end of the line:

```cpp
// This is a comment
let x: int64 = 42;  // Comments can appear at the end of lines too
```

> **Note:** Multi-line comments are not yet implemented.

> In the future I'll add support for documentation comments, though the syntax is not yet decided.

## 4. Variables

Variables in Atlas77 are either mutable or immutable. The design follows in some sense TypeScript/JavaScript, with the
`const` & `let` keywords. Variables can be declared using the `let` keyword, which creates a mutable variable, or the
`const` keyword, which creates an immutable variable.

```cpp
import "std/io";

fun main() -> int64 {
    let x: int64 = 5;
    x = 10;
    print(x); // Output: 10

    const y: int64 = 5;
    y = 10; // Error: Cannot assign to a constant variable
}
```

## 5. Data Types

Atlas77 has several built-in data types, including integers, floating-point numbers, booleans, strings, and arrays. The
following table lists the built-in data types in Atlas77:

| Data Type | Description                         | State |
|-----------|-------------------------------------|-------|
| `int8`      | 8-bit signed integer                | 💤    |
| `int16`     | 16-bit signed integer               | 💤    |
| `int32`     | 32-bit signed integer               | 💤    |
| `int64`     | 64-bit signed integer               | ✅     |
| `isize`   | Platform-dependent signed integer   | 💤    |
| `uint8`      | 8-bit unsigned integer              | 💤    |
| `uint16`     | 16-bit unsigned integer             | 💤    |
| `uint32`     | 32-bit unsigned integer             | 💤    |
| `uint64`     | 64-bit unsigned integer             | ✅     |
| `usize`   | Platform-dependent unsigned integer | 💤    |
| `float32`     | 32-bit floating-point number        | 💤    |
| `float64`     | 64-bit floating-point number        | ✅     |
| `bool`    | Boolean value (`true` or `false`)   | ✅     |
| `char`    | Unicode character                   | ✅    |
| `string`     | String                              | ✅    |
| `array`   | Array (syntax: `[YourType]`)        | 💭    |

## 6. Functions

Functions in Atlas77 are defined using the `func` keyword, followed by the function name, parameters, return type, and
body. The return type of a function is specified after the `->` symbol. For example:

```cpp
import "std/io";

fun add(x: int64, y: int64) -> int64{
    return x + y;
}

fun main() -> int64 {
    let result: int64 = add(5, 10);
    print(result); // Output: 15
}
```

## 7. Control Structures

Atlas77 supports several control structures, including `if` statements, `match` expression, `while` loops, and `for`
loops. The syntax for these control structures is similar to other programming languages. For example:

| Control Structure  | Description                     | State |
|--------------------|---------------------------------|-------|
| `if` statement     | Conditional statement           | ✅     |
| `match` expression | Pattern matching expression     | 💤    |
| `while` loop       | Loop with a condition           | ✅     |
| `for` loop         | Loop over a range or collection | 💤    |


```cpp
import "std/io";

fun main() -> int64 {
    let x = 5;

    if x > 0 {
        print("x is positive");
    } else if x < 0 {
        print("x is negative");
    } else {
        print("x is zero");
    }
    

    let i = 0;
    while i < 5 {
        print(i);
        i += 1;
    }
}
```

## 8. The standard library

Atlas77 comes with a relatively small standard library, which includes functions & types for input/output, file
handling, string & list manipulation, time & math functions. The standard library is imported using the `import`
keyword, followed by the library name. For example:

```cpp
import "std/io";

fun main() {
    println("Hello, World!");
}
```

Check out the current state of the [standard library](./std.md).

## 9. Arrays

Arrays in Atlas77 are used to store multiple values of the same type. They are defined using square brackets `[]`. For example:
```cpp
import "std/io";

fun main() -> int64 {
    let numbers: [int64] = [1, 2, 3, 4, 5];
    let i = 0;
    while i < 5 {
        print(numbers[i]);
        i += 1;
    }
}
```

If you want, you can also allocate an empty array with a specific size:

```cpp
import "std/io";

fun main() -> int64 {
    let size: int64 = 5;
    // Allocates an array of 5 int64s initialized to 0
    let numbers: [int64] = new [int64; size];
    let i = 0;
    while i < size {
        numbers[i] = i * 2; // Assign values
        print(numbers[i]);
        i += 1;
    }
}
```


## 10. Enums

Enums in Atlas77 are used to define a type that can have a set of named values. They are defined using the `enum` keyword. For example:

```cpp
public enum Color {
    Red = 1;
    Yellow;
    Green = 3;
    Purple;
    Blue = 5;
}
```

## 11. Class & Structs

> WIP

Current state of `std/fs` would be a good enough example of how classes/structs work in Atlas77:

```cpp
private extern read_dir(path: string) -> [string];
private extern read_file(path: string) -> string;
private extern write_file(path: string, content: string);
private extern remove_file(path: string);
private extern file_exists(path: string) -> bool;
private extern close_file(path: string);

//NB: This struct works for now, but because of the lack of move/copy semantics in Atlas,
// it may lead to unexpected behavior.
public struct File {
private:
    content: string;
public:
    path: string;
public:
    /// Creates a new File object with the given path
    /// Note: The file is not opened until the open() method is called
    File(path: string) {
        this.content = "";
        this.path = path;
    }

    ~File() {
        //Following the RAII pattern, we close the file when it goes out of scope
        this.close();
    }

    fun read(this) -> string {
        let content = read_file(this.path);
        this.content = content;
        return this.content;
    }

    fun open(this) {
        this.content = read_file(this.path);
        return;
    }

    fun close(this) {
        close_file(this.path);
        return;
    }

    fun write(this, content: string) {
        write_file(this.path, content);
        return;
    }

    fun remove(this) {
        remove_file(this.path);
        return;
    }

    fun exists(this) -> bool {
        return file_exists(this.path);
    }

    fun read_dir(this, path: string) -> [string] {
        return read_dir(path);
    }

    fun read_file(this, path: string) -> string {
        return read_file(path);
    }
}
```

## 12. Generics

As of now you can define generic for external functions & structs. For example:

```cpp
extern identity<T>(value: T) -> T;
struct Box<T> {
    value: T;
    Box(value: T) {
        self.value = value;
    }
    fun get_value(this) -> T {
        return this.value;
    }
}
```

## 13. Concepts

> The name is still to be decided



