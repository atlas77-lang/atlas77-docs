# std/mem

Memory helpers and low-level intrinsics.

```atlas77
import "std/memory";

fun main() {
    let p = malloc<uint8>(64);
    free(p);
}
```

Core APIs:

- malloc
- free
- memcpy
- sizeof / size_of
- alignof / align_of
- move
