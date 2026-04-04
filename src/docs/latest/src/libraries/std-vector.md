# std/vector

Vector<T> is a growable heap-backed sequence.

```atlas77
import "std/vector";

fun main() {
    let v = Vector<int64>::with_capacity(1);
    v.push(10);
    v.push(20);
    let x = v.pop();
}
```

Current behavior:

- Tracks length and capacity
- Grows by doubling capacity
- Deletes elements on destructor
