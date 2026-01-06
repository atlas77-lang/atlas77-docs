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

## Usage Examples

### Measuring Execution Time

```cpp
import "std/time";
import "std/io";

fun expensive_operation() {
    let i = 0;
    while i < 1000000 {
        i = i + 1;
    }
}

fun main() {
    let start = Time::now();
    expensive_operation();
    let end = Time::now();
    
    let elapsed = end.elapsed(start);
    println("Operation took " + elapsed.sec + " seconds");
}
```

### Formatting Timestamps

```cpp
import "std/time";
import "std/io";

fun main() {
    let now = Time::now();
    
    // Different formats
    let date = now.format("%Y-%m-%d");
    let time = now.format("%H:%M:%S");
    let full = now.format("%Y-%m-%d %H:%M:%S");
    
    println("Date: " + date);
    println("Time: " + time);
    println("Full: " + full);
}
```

### Sleeping Between Operations

```cpp
import "std/time";
import "std/io";

fun main() {
    let delay = new Time(1, 0);  // 1 second
    
    println("Starting...");
    delay.sleep();
    println("1 second later...");
    delay.sleep();
    println("2 seconds later...");
}
```

### Creating Timers

```cpp
import "std/time";
import "std/io";

fun main() {
    let timeout = new Time(5, 0);  // 5 second timeout
    let start = Time::now();
    
    let counter = 0;
    let running = true;
    
    while running {
        let now = Time::now();
        let elapsed = now.elapsed(start);
        
        if elapsed.sec >= timeout.sec {
            running = false;
            println("Timeout!");
        } else {
            counter = counter + 1;
        }
    }
    
    println("Counter reached: " + counter);
}
```

### Logging with Timestamps

```cpp
import "std/time";
import "std/io";

fun log(message: string) {
    let now = Time::now();
    let timestamp = now.format("%H:%M:%S");
    println("[" + timestamp + "] " + message);
}

fun main() {
    log("Application started");
    
    let delay = new Time(1, 0);
    delay.sleep();
    
    log("Processing data");
    delay.sleep();
    
    log("Application finished");
}
```

## Time Arithmetic

You can perform basic time arithmetic using the Time struct:

```cpp
import "std/time";
import "std/io";

fun main() {
    let time1 = new Time(10, 500000000);  // 10.5 seconds
    let time2 = new Time(5, 250000000);   // 5.25 seconds
    
    // Manual addition
    let total_sec = time1.sec + time2.sec;
    let total_nsec = time1.nsec + time2.nsec;
    
    // Handle nanosecond overflow
    if total_nsec >= 1000000000 {
        total_sec = total_sec + 1;
        total_nsec = total_nsec - 1000000000;
    }
    
    let result = new Time(total_sec, total_nsec);
    println(result.sec);   // 15
    println(result.nsec);  // 750000000
}
```

## Performance Notes

- **Blocking operations**: `sleep()` is a blocking operation that pauses execution
- **System calls**: `now()` makes a system call and has some overhead
- **Precision**: Nanosecond precision depends on the underlying system

## Best Practices

1. **Cache Time::now()**: Don't call `now()` repeatedly in tight loops
2. **Use elapsed()**: For measuring durations, use `elapsed()` instead of manual arithmetic
3. **Format once**: Format time strings once and reuse them when possible
4. **Handle overflow**: Be careful when doing manual time arithmetic with nanoseconds

---

**See also:**
- [Standard Library Overview](./std.md)
- [Getting Started](./getting_started.md) - Basic examples
