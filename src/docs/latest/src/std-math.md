# std/math

Mathematical functions for numerical operations.

## Functions

### Integer Functions

#### `abs(x: int64) -> int64`

Absolute value of an integer.

```cpp
import "std/math";

let result = abs(-5);   // 5
let result2 = abs(10);  // 10
```

#### `min(x: int64, y: int64) -> int64`

Minimum of two integers.

```cpp
let result = min(5, 10);   // 5
let result2 = min(-3, 2);  // -3
```

#### `max(x: int64, y: int64) -> int64`

Maximum of two integers.

```cpp
let result = max(5, 10);   // 10
let result2 = max(-3, 2);  // 2
```

#### `pow(x: int64, y: int64) -> int64`

Raise x to the power of y (integers).

```cpp
let result = pow(2, 10);  // 1024
let result2 = pow(5, 3);  // 125
```

### Floating-Point Functions

#### `abs_f(x: float64) -> float64`

Absolute value of a float.

```cpp
let result = abs_f(-3.14);  // 3.14
let result2 = abs_f(2.5);   // 2.5
```

#### `min_f(x: float64, y: float64) -> float64`

Minimum of two floats.

```cpp
let result = min_f(3.5, 2.1);    // 2.1
let result2 = min_f(-1.5, 0.0);  // -1.5
```

#### `max_f(x: float64, y: float64) -> float64`

Maximum of two floats.

```cpp
let result = max_f(3.5, 2.1);    // 3.5
let result2 = max_f(-1.5, 0.0);  // 0.0
```

#### `pow_f(x: float64, y: int64) -> float64`

Raise x to the power of y (float base, integer exponent).

```cpp
let result = pow_f(2.0, 3);   // 8.0
let result2 = pow_f(1.5, 2);  // 2.25
```

#### `round(x: float64) -> int64`

Round a float to the nearest integer.

```cpp
let result = round(3.7);   // 4
let result2 = round(3.2);  // 3
let result3 = round(3.5);  // 4
```

### Trigonometric Functions

#### `sin_f(x: float64) -> float64`

Sine of x (in radians).

```cpp
let result = sin_f(0.0);              // 0.0
let result2 = sin_f(3.14159 / 2.0);   // ~1.0
```

#### `cos_f(x: float64) -> float64`

Cosine of x (in radians).

```cpp
let result = cos_f(0.0);       // 1.0
let result2 = cos_f(3.14159);  // ~-1.0
```

### Random Number Generation

#### `random(min: int64, max: int64) -> int64`

Generate a random integer in the range [min, max] (inclusive).

```cpp
let num = random(1, 10);    // Random number between 1 and 10
let dice = random(1, 6);    // Simulate a dice roll
```

## Usage Examples

### Basic Arithmetic

```cpp
import "std/math";
import "std/io";

fun main() {
    let a = -42;
    let b = 17;
    
    println(abs(a));        // 42
    println(min(a, b));     // -42
    println(max(a, b));     // 17
    println(pow(2, 8));     // 256
}
```

### Working with Floats

```cpp
import "std/math";
import "std/io";

fun main() {
    let x = -3.14;
    let y = 2.5;
    
    println(abs_f(x));       // 3.14
    println(min_f(x, y));    // -3.14
    println(max_f(x, y));    // 2.5
    println(pow_f(2.0, 10)); // 1024.0
    println(round(3.7));     // 4
}
```

### Trigonometry

```cpp
import "std/math";
import "std/io";

fun main() {
    let pi = 3.14159265359;
    
    // Calculate sine and cosine
    let sin_val = sin_f(pi / 2.0);  // ~1.0
    let cos_val = cos_f(0.0);        // 1.0
    
    println(sin_val);
    println(cos_val);
}
```

### Random Numbers

```cpp
import "std/math";
import "std/io";

fun main() {
    // Generate 10 random numbers
    let i = 0;
    while i < 10 {
        let num = random(1, 100);
        println(num);
        i = i + 1;
    }
}
```

### Dice Rolling Game

```cpp
import "std/math";
import "std/io";

fun roll_dice() -> int64 {
    return random(1, 6);
}

fun main() {
    println("Rolling two dice...");
    
    let dice1 = roll_dice();
    let dice2 = roll_dice();
    let total = dice1 + dice2;
    
    println("Dice 1: " + dice1);
    println("Dice 2: " + dice2);
    println("Total: " + total);
    
    if total == 7 {
        println("Lucky seven!");
    }
}
```

### Finding Maximum in Array

```cpp
import "std/math";
import "std/io";

fun find_max(arr: [int64]) -> int64 {
    let max_val = arr[0];
    let i = 1;
    
    while i < len(&arr) {
        max_val = max(max_val, arr[i]);
        i = i + 1;
    }
    
    return max_val;
}

fun main() {
    let numbers = [3, 7, 2, 9, 1, 5];
    let maximum = find_max(numbers);
    println("Maximum: " + maximum);  // 9
}
```

### Distance Calculation

```cpp
import "std/math";
import "std/io";

fun distance(x1: float64, y1: float64, x2: float64, y2: float64) -> float64 {
    let dx = abs_f(x2 - x1);
    let dy = abs_f(y2 - y1);
    
    // Simplified distance (without sqrt)
    let dist_squared = pow_f(dx, 2) + pow_f(dy, 2);
    return dist_squared;
}

fun main() {
    let dist = distance(0.0, 0.0, 3.0, 4.0);
    println(dist);  // 25.0 (actual distance would be 5.0 after sqrt)
}
```

### Rounding Numbers

```cpp
import "std/math";
import "std/io";

fun main() {
    let prices = [3.14, 7.89, 2.51, 9.99];
    
    let i = 0;
    while i < len(&prices) {
        let rounded = round(prices[i]);
        println(rounded);
        i = i + 1;
    }
    // Output: 3, 8, 3, 10
}
```

## Constants

You can define mathematical constants in your code:

```cpp
import "std/math";

const PI: float64 = 3.14159265359;
const E: float64 = 2.71828182846;

fun main() {
    let circle_area = PI * pow_f(5.0, 2);  // Area of circle with radius 5
    println(circle_area);
}
```

## Notes

- **Angles in radians**: Trigonometric functions use radians, not degrees
- **Integer overflow**: `pow()` can overflow for large exponents
- **Random seed**: The random number generator is automatically seeded
- **Float precision**: Floating-point operations have limited precision

## Best Practices

1. **Use appropriate types**: Use integer functions for integers, float functions for floats
2. **Check ranges**: Ensure inputs are within valid ranges (e.g., avoid overflow in `pow()`)
3. **Cache constants**: Define mathematical constants as const values
4. **Consider precision**: Be aware of floating-point precision limitations

---

**See also:**
- [Standard Library Overview](./std.md)
- [Language Reference](./language-reference.md) - Operators and types
