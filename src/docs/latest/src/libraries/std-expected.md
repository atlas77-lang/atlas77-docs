# std/expected

expected<T, E> represents success (T) or error (E).

```atlas77
import "std/expected";

fun parse_age(age: int64) -> expected<int64, string> {
    if age < 0 {
        return expected<int64, string>::unexpected("invalid age");
    }
    return expected<int64, string>::expect(age);
}
```

Key APIs:

- expect
- unexpected
- is_expected
- is_unexpected
- expected_value / unexpected_value
- expected_value_or / unexpected_value_or
