# std/fs

File system operations for reading, writing, and managing files.

## Struct: `File`

Represents a file in the file system.

```cpp
struct File {
private:
    content: string;
public:
    path: string;
}
```

## Constructor

```cpp
import "std/fs";

let file = new File("data.txt");
```

Creates a File object. The file is not opened until `read()` or `open()` is called.

## Methods

### `read(&this) -> string`

Read the entire content of the file and store it internally.

```cpp
let file = new File("data.txt");
let content = file.read();
println(content);
```

### `open(&this)`

Open and read the file, storing content internally.

```cpp
let file = new File("data.txt");
file.open();
// File content is now loaded
```

### `write(&this, content: string)`

Write content to the file.

```cpp
let file = new File("output.txt");
file.write("Hello, World!");
```

### `close(this)`

Close the file (consumes the File object).

```cpp
let file = new File("data.txt");
file.read();
file.close();  // File is consumed
```

### `exists(&this) -> bool`

Check if the file exists.

```cpp
let file = new File("config.json");
if file.exists() {
    println("File found");
}
```

### `remove(&this)`

Delete the file from the file system.

```cpp
let file = new File("temp.txt");
file.remove();
```

### `read_dir(&this, path: string) -> [string]`

Read the contents of a directory (instance method).

```cpp
let file = new File(".");
let entries = file.read_dir("./src");
```

### `read_file(&this, path: string) -> string`

Read a file without modifying the File instance's content.

```cpp
let file = new File("dummy");
let content = file.read_file("actual.txt");
```

## Usage Examples

### Reading a File

```cpp
import "std/fs";
import "std/io";

fun main() {
    let file = new File("config.txt");
    
    if file.exists() {
        let content = file.read();
        println(content);
    } else {
        println("File not found");
    }
}
```

### Writing to a File

```cpp
import "std/fs";
import "std/io";

fun main() {
    let file = new File("output.txt");
    file.write("Hello from Atlas77!");
    println("File written successfully");
}
```

### Managing Files with RAII

```cpp
import "std/fs";
import "std/io";

fun process_file() {
    let file = new File("data.txt");
    let content = file.read();
    println(content);
    // File automatically closed when it goes out of scope
}
```

---

**See also:**
- [Standard Library Overview](./std.md)
- [Memory Model](./memory-model.md) - RAII and automatic cleanup
