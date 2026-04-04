# Ownership Basics

Atlas77 uses ownership and deterministic cleanup.

You do not rely on a garbage collector.

## Copy vs Move

Simple values are copied:

```atlas77
let a: int64 = 10;
let b: int64 = a; // copy
```

Resource-like values are usually moved:

```atlas77
let f = open_file_handle();
let g = move(f);
// f is invalid after move
```

If you use f after move, the compiler will reject it.

## Destructors

Use a destructor when your type owns memory or a handle.

```atlas77
import "std/memory";

public struct Buffer {
private:
    raw: *uint8;
public:
    ~Buffer() {
        if this->raw != null {
            free(this->raw);
        }
    }
}
```

The compiler inserts cleanup at scope boundaries so values are released deterministically.

## Practical Rule

When in doubt:

1. Decide who owns each resource.
2. Move ownership only when needed.
3. Add a destructor for owned resources.
