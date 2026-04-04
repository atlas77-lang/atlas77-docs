# Generics And Function Pointers

You can stay productive in Atlas77 without these features at first.
Learn them when your code starts repeating patterns.

## Generics

```atlas77
fun pick_first<T>(a: T, _b: T) -> T {
    return a;
}

fun main() {
    let x = pick_first<int64>(100, 200);
}
```

Generics let you write one function for many types.

## Function Pointers

This pattern is useful for callbacks and reusable behavior.

```atlas77
fun add(a: int32, b: int32) -> int32 {
    return a + b;
}

fun apply_twice(fn: fun(int32, int32) -> int32, a: int32, b: int32) -> int32 {
    return fn(a, b) + fn(b, a);
}

fun main() {
    let add_fn: fun(int32, int32) -> int32 = add;
    let r = apply_twice(add_fn, 4, 5);
}
```

Method pointers are also possible:

```atlas77
struct Foo {
public:
    const_add_pointer: fun(*const Foo, int32) -> int32;

    fun add_const(*const this, value: int32) -> int32 {
        return value + 100;
    }
}

fun main() {
    let foo = Foo { .const_add_pointer = Foo::add_const };
    let out = foo.const_add_pointer(&foo, 11);
}
```
