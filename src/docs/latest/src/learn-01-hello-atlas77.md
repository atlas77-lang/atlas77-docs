# Hello Atlas77

Atlas77 programs are built around a main function.

```atlas77
import "std/io";

fun main() {
    println("Hello, Atlas77!");
}
```

## Build And Run

For fast local iteration, start with TinyCC:

```c
atlas77 build src/main.atlas -c tinycc -o ./build
```

For stricter checks with common system toolchains:

```c
atlas77 build src/main.atlas -c gcc -r
atlas77 build src/main.atlas -c clang -r
```

To type-check without producing a final binary:

```c
atlas77 check src/main.atlas
```

## What To Remember

- Keep your first programs tiny.
- Compile frequently.
- Use check early to catch errors before code grows.
