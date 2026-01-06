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

## Usage Examples

### Getting Type Sizes

```cpp
import "std/mem";
import "std/string";
import "std/io";

struct Point {
public:
    x: int64;
    y: int64;
}

fun main() {
    println("int64: " + size_of<int64>() + " bytes");
    println("float64: " + size_of<float64>() + " bytes");
    println("bool: " + size_of<bool>() + " bytes");
    println("Point: " + size_of<Point>() + " bytes");
}
```

### Swapping Values

```cpp
import "std/mem";
import "std/io";

fun main() {
    let first = "Alice";
    let second = "Bob";
    
    println("Before: " + first + ", " + second);
    
    swap(&first, &second);
    
    println("After: " + first + ", " + second);
    // Output: "After: Bob, Alice"
}
```

### Replacing Values

```cpp
import "std/mem";
import "std/vector";
import "std/io";

fun main() {
    let vec = new Vector<int64>([1, 2, 3]);
    let new_vec = new Vector<int64>([4, 5, 6]);
    
    let old_vec = replace(&vec, new_vec);
    
    // old_vec now contains [1, 2, 3]
    // vec now contains [4, 5, 6]
    
    println(vec.length);      // 3
    println(old_vec.length);  // 3
}
```

### Memory Leak (Forget)

```cpp
import "std/mem";
import "std/io";

fun main() {
    let data = new Vector<int64>([1, 2, 3]);
    
    // This is intentional memory leak!
    // Use only when you need to pass ownership to external code
    // or keep data alive beyond program scope
    forget(data);
    
    println("Data memory leaked");
}
```

### Sorting with Swap

```cpp
import "std/mem";
import "std/io";

fun bubble_sort(arr: &[int64]) {
    let n = len(arr);
    let i = 0;
    
    while i < n {
        let j = 0;
        while j < n - 1 {
            if arr[j] > arr[j + 1] {
                swap(&arr[j], &arr[j + 1]);
            }
            j = j + 1;
        }
        i = i + 1;
    }
}

fun main() {
    let numbers = [5, 2, 8, 1, 9];
    bubble_sort(&numbers);
    
    let i = 0;
    while i < len(&numbers) {
        println(numbers[i]);
        i = i + 1;
    }
    // Output: 1, 2, 5, 8, 9
}
```

### Ring Buffer with Replace

```cpp
import "std/mem";
import "std/io";

const BUFFER_SIZE: int64 = 5;

fun main() {
    let buffer = [0, 0, 0, 0, 0];
    let index = 0;
    
    // Add values to ring buffer
    let values = [1, 2, 3, 4, 5, 6, 7, 8];
    let i = 0;
    
    while i < len(&values) {
        let old_value = replace(&buffer[index], values[i]);
        println("Replaced " + old_value + " with " + values[i]);
        
        index = (index + 1) % BUFFER_SIZE;
        i = i + 1;
    }
    
    // Print final buffer
    println("Final buffer:");
    let j = 0;
    while j < BUFFER_SIZE {
        println(buffer[j]);
        j = j + 1;
    }
}
```

## Low-Level Operations

The mem module provides low-level memory operations. Use these carefully:

### Size and Alignment

Understanding type sizes and alignment is important for:
- **FFI (Foreign Function Interface)**: When interfacing with C code
- **Manual memory layout**: When you need precise control over memory
- **Performance optimization**: Understanding memory layout for cache efficiency

### Forget and Memory Leaks

`forget()` prevents automatic cleanup. Valid use cases:
- Transferring ownership to external systems
- Implementing custom smart pointers
- FFI where external code takes ownership

**Never use forget() unless you have a specific reason!**

## Performance Notes

- **size_of** and **align_of**: Compile-time constants, zero runtime cost
- **swap**: Efficient, moves values without copies
- **replace**: Efficient, returns old value without extra allocations
- **copy**: Creates a full copy, potentially expensive for large types
- **drop** and **forget**: Minimal runtime overhead

## Best Practices

1. **Prefer automatic drops**: Let Atlas77 handle cleanup automatically
2. **Use swap for exchanges**: More efficient than temporary variables
3. **Understand ownership**: Know when values are moved vs. copied
4. **Avoid forget**: Only use when absolutely necessary
5. **Check copyability**: Use `copy()` only on types that are copyable

## Safety Considerations

The mem module contains potentially unsafe operations:

- **forget()**: Leaks memory, breaks RAII
- **drop()**: Using a value after drop causes undefined behavior
- **replace()**: Ensure the replaced value is handled correctly

Always prefer high-level abstractions when possible.

---

**See also:**
- [Memory Model](./memory-model.md) - Ownership and move semantics
- [Generics](./generics.md) - std::copyable constraint
- [Standard Library Overview](./std.md)
