# std/time

Time operations and formatting.

## Struct: `Time`

Represents a point in time or duration.

```cpp
struct Time {
public:
    sec: int64;
    nsec: int64;
}
```

## Constructor

```cpp
import "std/time";

let time = new Time(1234567890, 0);
```

Creates a Time with the specified seconds and nanoseconds.

## Static Methods

### `Time::now() -> Time`

Get the current time.

```cpp
let now = Time::now();
println(now.sec);
```

## Instance Methods

### `format(&this, fmt: string) -> string`

Format the time as a string using format specifiers.

```cpp
let time = Time::now();
let formatted = time.format("%Y-%m-%d %H:%M:%S");
println(formatted);  // e.g., "2026-01-06 14:30:45"
```

**Format Specifiers:**
- `%Y` - Year (e.g., 2026)
- `%m` - Month (01-12)
- `%d` - Day (01-31)
- `%H` - Hour (00-23)
- `%M` - Minute (00-59)
- `%S` - Second (00-59)

### `to_iso_string(&this) -> string`

Convert to ISO 8601 format.

```cpp
let time = Time::now();
let iso = time.to_iso_string();
println(iso);  // e.g., "2026-01-06T14:30:45"
```

### `sleep(&this)`

Sleep for the duration represented by this Time.

```cpp
let duration = new Time(2, 0);  // 2 seconds
duration.sleep();
println("2 seconds passed");
```

> **Note:** This is a blocking sleep operation.

### `elapsed(&this, since: Time) -> Time`

Calculate elapsed time since another time.

```cpp
let start = Time::now();
// ... do work ...
let end = Time::now();
let duration = end.elapsed(start);
println(duration.sec);  // Seconds elapsed
```
