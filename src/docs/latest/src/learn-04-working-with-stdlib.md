# Working With The Standard Library

Start with a small subset of std and use it everywhere:

- std/io for input/output
- std/string for owned text
- std/vector for growable arrays
- std/optional and std/expected for safe control flow

## Input And Output

```atlas77
import "std/io";

fun main() {
    print("Your name: ");
    let name = input();
    println(name.c_str());
}
```

## String

```atlas77
import "std/string";

fun main() {
    let base = String::from_chars("atlas");
    let loud = base.to_upper();
    println(loud.c_str());
}
```

## Vector<T>

```atlas77
import "std/vector";

fun main() {
    let v = Vector<int64>::with_capacity(2);
    v.push(1);
    v.push(2);
    v.push(3);

    let last = v.pop();
}
```

## optional<T> And expected<T, E>

Use optional for "might be missing" values.

```atlas77
import "std/optional";

fun find_id(ok: bool) -> optional<int64> {
    if ok {
        return optional<int64>::of(42);
    }
    return optional<int64>::empty();
}
```

Use expected for "value or error" results.

```atlas77
import "std/expected";

fun parse_age(v: int64) -> expected<int64, *uint8> {
    if v < 0 {
        return expected<int64, *uint8>::unexpected("age cannot be negative");
    }
    return expected<int64, *uint8>::expect(v);
}
```
