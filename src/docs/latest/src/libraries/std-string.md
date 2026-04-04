# std/string

String is an owning UTF-8 byte-buffer abstraction.

```atlas77
import "std/string";

fun main() {
    let s = String::from_chars("atlas");
    let up = s.to_upper();
    println(up.c_str());
}
```

Useful methods:

- String::new
- String::from_chars
- len
- trim
- to_upper / to_lower
- concat
- c_str
