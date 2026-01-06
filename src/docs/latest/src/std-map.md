# std/map

Key-value hash map for associating keys with values.

## Struct: `Map<K, V>`

Generic hash map that associates keys of type K with values of type V.

```cpp
struct Map<K, V> {
public:
    buckets: Vector<Vector<MapEntry<K, V>>>;
    size: uint64;
}
```

## Constructor

```cpp
import "std/map";

let map = new Map<string, int64>();
```

Creates an empty map.

## Instance Methods

### `insert(&this, key: K, value: V)`

Insert or update a key-value pair.

```cpp
let map = new Map<string, int64>();
map.insert("age", 25);
map.insert("score", 100);
map.insert("age", 26);  // Updates existing value
```

### `get(&this, key: K) -> optional<&const V>`

Get a reference to the value for a key.

```cpp
let map = new Map<string, int64>();
map.insert("age", 25);

let age_opt = map.get("age");
if age_opt.has_value() {
    let age_ref = age_opt.value();
    println(*age_ref);  // 25
}
```

Returns `optional::empty()` if the key doesn't exist.

### `get_mut(&this, key: K) -> optional<& V>`

Get a mutable reference to the value for a key.

```cpp
let map = new Map<string, int64>();
map.insert("score", 100);

let score_opt = map.get_mut("score");
if score_opt.has_value() {
    let score_ref = score_opt.value();
    *score_ref = *score_ref + 10;  // Increment by 10
}

let final_score = map.get("score").value();
println(*final_score);  // 110
```

### `remove(&this, key: K) -> optional<V>`

Remove a key-value pair, returning the value if it existed.

```cpp
let map = new Map<string, int64>();
map.insert("age", 25);

let removed = map.remove("age");
if removed.has_value() {
    println("Removed: " + removed.value());
}

let not_found = map.remove("age");  // Returns optional::empty()
```

### `contains(&this, key: K) -> bool`

Check if a key exists.

```cpp
let map = new Map<string, int64>();
map.insert("age", 25);

if map.contains("age") {
    println("Age is present");
}

if !map.contains("name") {
    println("Name is not present");
}
```

### `length(&this) -> uint64`

Get the number of key-value pairs.

```cpp
let map = new Map<string, int64>();
map.insert("a", 1);
map.insert("b", 2);

println(map.length());  // 2
```

### `is_empty(&this) -> bool`

Check if the map is empty.

```cpp
let map = new Map<string, int64>();
println(map.is_empty());  // true

map.insert("key", 42);
println(map.is_empty());  // false
```

### `clear(&this)`

Remove all key-value pairs.

```cpp
let map = new Map<string, int64>();
map.insert("a", 1);
map.insert("b", 2);

map.clear();
println(map.is_empty());  // true
```

## Usage Examples

### Basic Map Operations

```cpp
import "std/map";
import "std/io";

fun main() {
    let scores = new Map<string, int64>();
    
    // Insert values
    scores.insert("Alice", 95);
    scores.insert("Bob", 87);
    scores.insert("Charlie", 92);
    
    // Get value
    let alice_score = scores.get("Alice");
    if alice_score.has_value() {
        println("Alice's score: " + *alice_score.value());
    }
    
    // Check existence
    if scores.contains("Bob") {
        println("Bob is in the map");
    }
    
    // Update value
    scores.insert("Alice", 98);  // Update
    
    println("Total students: " + scores.length());
}
```

### Counting Occurrences

```cpp
import "std/map";
import "std/io";

fun main() {
    let words = ["apple", "banana", "apple", "orange", "banana", "apple"];
    let counts = new Map<string, int64>();
    
    let i = 0;
    while i < len(&words) {
        let word = words[i];
        let count_opt = counts.get(word);
        
        if count_opt.has_value() {
            let current = *count_opt.value();
            counts.insert(word, current + 1);
        } else {
            counts.insert(word, 1);
        }
        
        i = i + 1;
    }
    
    // Print counts
    println("apple: " + *counts.get("apple").value());     // 3
    println("banana: " + *counts.get("banana").value());   // 2
    println("orange: " + *counts.get("orange").value());   // 1
}
```

### Configuration Storage

```cpp
import "std/map";
import "std/string";
import "std/io";

fun main() {
    let config = new Map<string, string>();
    
    config.insert("host", "localhost");
    config.insert("port", "8080");
    config.insert("debug", "true");
    
    // Retrieve configuration
    let host = config.get("host");
    let port = config.get("port");
    
    if host.has_value() && port.has_value() {
        println("Server: " + *host.value() + ":" + *port.value());
    }
}
```

### User Database

```cpp
import "std/map";
import "std/io";

fun main() {
    let user_ids = new Map<string, int64>();
    
    // Add users
    user_ids.insert("alice@example.com", 1001);
    user_ids.insert("bob@example.com", 1002);
    user_ids.insert("charlie@example.com", 1003);
    
    // Lookup user
    let email = "bob@example.com";
    let id_opt = user_ids.get(email);
    
    if id_opt.has_value() {
        println("User ID: " + *id_opt.value());
    } else {
        println("User not found");
    }
}
```

### Removing Entries

```cpp
import "std/map";
import "std/io";

fun main() {
    let inventory = new Map<string, int64>();
    
    inventory.insert("apples", 50);
    inventory.insert("oranges", 30);
    inventory.insert("bananas", 40);
    
    println("Initial count: " + inventory.length());  // 3
    
    // Remove an item
    let removed = inventory.remove("oranges");
    if removed.has_value() {
        println("Removed oranges: " + removed.value());
    }
    
    println("Final count: " + inventory.length());  // 2
}
```

### Mutating Values

```cpp
import "std/map";
import "std/io";

fun main() {
    let balances = new Map<string, int64>();
    
    balances.insert("Alice", 100);
    balances.insert("Bob", 50);
    
    // Add to Alice's balance
    let alice_opt = balances.get_mut("Alice");
    if alice_opt.has_value() {
        let balance_ref = alice_opt.value();
        *balance_ref = *balance_ref + 50;
    }
    
    println("Alice's balance: " + *balances.get("Alice").value());  // 150
}
```

### Clearing a Map

```cpp
import "std/map";
import "std/io";

fun main() {
    let cache = new Map<string, int64>();
    
    cache.insert("key1", 1);
    cache.insert("key2", 2);
    cache.insert("key3", 3);
    
    println("Cache size: " + cache.length());  // 3
    
    // Clear all entries
    cache.clear();
    
    println("After clear: " + cache.length());  // 0
    println("Is empty: " + cache.is_empty());   // true
}
```

## Performance Characteristics

- **Insert**: Average O(1), worst case O(n)
- **Get**: Average O(1), worst case O(n)
- **Remove**: Average O(1), worst case O(n)
- **Contains**: Average O(1), worst case O(n)

The map uses hash buckets internally. Performance degrades if many keys have hash collisions.

## Memory Management

Maps use dynamic allocation and grow as needed. The map owns its keys and values:

```cpp
let map = new Map<string, int64>();
map.insert("key", 42);
// Map owns both the string and the int64
// They are freed when the map is freed
```

## Best Practices

1. **Check before unwrapping**: Always use `has_value()` before calling `value()` on optional returns
2. **Use contains()**: For existence checks, `contains()` is clearer than checking `get()`
3. **Prefer get_mut()**: When modifying values, use `get_mut()` instead of remove + insert
4. **Handle missing keys**: Always handle the case where a key doesn't exist
5. **Clear when done**: Use `clear()` to free memory if reusing a map

---

**See also:**
- [std/optional](./std-optional.md) - Map methods return optional values
- [std/vector](./std-vector.md) - Maps are implemented using vectors
- [Standard Library Overview](./std.md)
