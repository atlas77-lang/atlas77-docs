# std/queue

Queue (FIFO) data structure for ordered element processing.

## Struct: `Queue<T>`

A simple FIFO (first-in, first-out) queue data structure.

```cpp
struct Queue<T> {
private:
    items: [T];
    head: uint64;
    tail: uint64;
    size: uint64;
    count: uint64;
}
```

## Constructor

```cpp
import "std/queue";

let queue = new Queue<T>(items);
```

Creates a queue from an existing array.

## Static Methods

### `Queue<T>::with_capacity(size: uint64) -> Queue<T>`

Instantiates a queue with a predefined capacity.

```cpp
let queue = Queue<int64>::with_capacity(10u);
```

### `Queue<T>::from_vector(vec: Vector<T>) -> Queue<T>`

Creates a queue from a vector.

```cpp
let vec = new Vector<int64>([1, 2, 3]);
let queue = Queue<int64>::from_vector(vec);
```

## Instance Methods

### `enqueue(&this, item: T) -> optional<unit>`

Enqueues an item to the back of the queue.

```cpp
let result = queue.enqueue(42);
if result.is_empty() {
    println("Queue is full");
}
```

Returns `optional<unit>::empty()` if the queue is full.

### `enqueue_front(&this, item: T) -> optional<unit>`

Enqueues an item to the front of the queue.

```cpp
let result = queue.enqueue_front(42);
```

Returns `optional<unit>::empty()` if the queue is full.

### `dequeue(&this) -> optional<T>`

Dequeues an item from the front of the queue.

```cpp
let item = queue.dequeue();
if item.has_value() {
    println(item.value());
}
```

Returns `optional<T>::empty()` if the queue is empty.

### `dequeue_back(&this) -> optional<T>`

Dequeues an item from the back of the queue.

```cpp
let item = queue.dequeue_back();
```

Returns `optional<T>::empty()` if the queue is empty.

### `peek(&const this) -> optional<&const T>`

View the front item without removing it.

```cpp
let front = queue.peek();
if front.has_value() {
    println(*front.value());
}
```

### `peek_back(&const this) -> optional<&const T>`

View the back item without removing it.

```cpp
let back = queue.peek_back();
```

### `is_full(&const this) -> bool`

Check if the queue is at capacity.

```cpp
if queue.is_full() {
    println("Queue is full");
}
```

### `is_empty(&const this) -> bool`

Check if the queue is empty.

```cpp
if queue.is_empty() {
    println("Queue is empty");
}
```

### `len(&const this) -> uint64`

Get the number of items in the queue.

```cpp
println("Queue has " + queue.len() + " items");
```

### `to_vector(this) -> Vector<T>`

Consumes the queue and returns a vector containing all items.

```cpp
let vec = queue.to_vector();
```

---

**See also:**
- [std/vector](./std-vector.md) - Dynamic arrays
- [std/optional](./std-optional.md) - Queue methods return optional values
- [Standard Library Overview](../std.md)
