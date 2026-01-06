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
