# Core Syntax

This chapter covers the pieces you use constantly: values, functions, and structs.

## Variables And Types

```atlas77
fun main() {
    let age: int64 = 42;
    let score: float64 = 99.5;
    let active: bool = true;
    let letter: char = 'A';
    let name: *uint8 = "Atlas";
}
```

## Functions

```atlas77
fun add(a: int64, b: int64) -> int64 {
    return a + b;
}

fun greet(name: *uint8) -> unit {
    println(name);
}
```

If a function does not return data, use unit.

## Structs With Factory Functions

```atlas77
public struct User {
public:
    name: *uint8;
    level: int32;

    fun new(name: *uint8, level: int32) -> User {
        return User { .name = name, .level = level };
    }
}

fun main() {
    let u = User::new("Gip", 1);
    println(u.name);
}
```

Common style in Atlas77 is Type::new(...) instead of constructor syntax.
