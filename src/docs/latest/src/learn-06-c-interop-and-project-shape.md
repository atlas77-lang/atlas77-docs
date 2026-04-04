# C Interop And Project Shape

Atlas77 is designed to work with C libraries through extern declarations.

## Declaring C Symbols

```atlas77
extern struct FILE {
    handle: uint64;
}

extern fun printf<T>(fmt: *uint8, value: T);

fun main() {
    printf("%s\n", "Hello from Atlas77");
}
```

Keep bindings small and test one function at a time.

## Real App Shape (Raylib-Style)

The current raylib wrapper in this repository is prototype-level, but the app shape is useful:

```atlas77
fun main() {
    InitWindow(800, 450, "demo");
    SetTargetFPS(60);

    while (!WindowShouldClose()) {
        // update
        // draw
    }

    CloseWindow();
}
```

This is a good default structure for games or interactive tools.

## Toolchain Guidance

```c
atlas77 build src/main.atlas -c tinycc -o ./build
atlas77 build src/main.atlas -c gcc -r --c-arg=-lraylib
```

- Use tinycc for quick iteration.
- Use gcc or clang for release checks and stricter diagnostics.
