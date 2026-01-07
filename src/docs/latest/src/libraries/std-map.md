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
