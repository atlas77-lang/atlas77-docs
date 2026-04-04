# Generics

Generics let you write reusable code for multiple types.

```atlas77
public struct Pair<T> {
public:
    left: T;
    right: T;
}

fun pick_first<T>(a: T, _b: T) -> T {
    return a;
}
```

Monomorphization happens in the compiler pipeline before type checking and lowering to C.
