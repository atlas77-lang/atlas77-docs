# Error Handling

Atlas77 standard style favors explicit result types.

Use optional<T> for maybe-present values:

```atlas77
import "std/optional";

fun find_id(ok: bool) -> optional<int64> {
    if ok { return optional<int64>::of(1); }
    return optional<int64>::empty();
}
```

Use expected<T, E> for value-or-error outcomes:

```atlas77
import "std/expected";

fun parse(x: int64) -> expected<int64, string> {
    if x < 0 { return expected<int64, string>::unexpected("negative"); }
    return expected<int64, string>::expect(x);
}
```
