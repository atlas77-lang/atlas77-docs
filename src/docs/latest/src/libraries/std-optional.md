# std/optional

optional<T> represents an optional value.

```atlas77
import "std/optional";

fun maybe_value(ok: bool) -> optional<int64> {
    if ok { return optional<int64>::of(42); }
    return optional<int64>::empty();
}
```

Key APIs:

- of
- empty
- has_value
- is_empty
- value
- value_or
