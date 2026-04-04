# std/io

Module for terminal I/O and panic/printf interop helpers.

```atlas77
import "std/io";

fun main() {
    print("Name: ");
    let name = input();
    println(name.c_str());
}
```

Key APIs:

- print
- println
- input
- panic
- printf
