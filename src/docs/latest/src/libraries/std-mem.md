# std/mem

Memory management utilities and low-level operations.

## Functions

### `size_of<T>() -> uint64`
> [!Note]
> Not yet implemented.

Get the size in bytes of type T.

```cpp
import "std/mem";
import "std/io";

fun main() {
    println(size_of<int64>());    // 8
    println(size_of<float64>());  // 8
    println(size_of<bool>());     // 1
    println(size_of<char>());     // 1
}
```

### `align_of<T>() -> uint64`
> [!Note]
> Not yet implemented.

Get the alignment requirement in bytes of type T.

```cpp
import "std/mem";
import "std/io";

fun main() {
    println(align_of<int64>());   // 8
    println(align_of<float64>()); // 8
    println(align_of<bool>());    // 1
}
```

### `forget<T>(value: T)`
> [!Note]
> Not yet implemented. And it will probably have another name.

Prevent a value from being dropped, leaking its memory.

```cpp
import "std/mem";

fun main() {
    let data = new Vector<int64>([1, 2, 3]);
    
    forget(data);  // Memory is leaked!
    // data's destructor will never run
}
```

> **Warning:** This leaks memory! Only use this in very specific scenarios.

### `swap<T>(a: &T, b: &T)`
> [!Note]
> Not yet implemented.

Swap the values of two variables.

```cpp
import "std/mem";
import "std/io";

fun main() {
    let x = 10;
    let y = 20;
    
    swap(&x, &y);
    
    println(x);  // 20
    println(y);  // 10
}
```

### `replace<T>(dest: &T, src: T) -> T`
> [!Note]
> Not yet implemented.

Replace the value at dest with src, returning the old value.

```cpp
import "std/mem";
import "std/io";

fun main() {
    let x = 10;
    let old = replace(&x, 20);
    
    println(old);  // 10
    println(x);    // 20
}
```

### `memcpy<T>(value: &const T) -> T`

Create a shallow copy of a value from a reference.

```cpp
import "std/mem";
import "std/io";

fun main() {
    let x = 42;
    let y = memcpy(&x);
    
    println(x);  // 42
    println(y);  // 42
}
```
