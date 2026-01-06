# std/queue

Queue (FIFO) data structure for ordered element processing.

## Struct: `Queue<T>`

Generic queue (first-in, first-out) for elements of type T.

```cpp
struct Queue<T> {
public:
    data: Vector<T>;
    front_index: uint64;
}
```

## Constructor

```cpp
import "std/queue";

let queue = new Queue<int64>();
```

Creates an empty queue.

## Instance Methods

### `enqueue(&this, item: T)`

Add an item to the back of the queue.

```cpp
let queue = new Queue<int64>();
queue.enqueue(1);
queue.enqueue(2);
queue.enqueue(3);
// Queue: [1, 2, 3] (front to back)
```

### `dequeue(&this) -> T`

Remove and return the front item.

```cpp
let queue = new Queue<int64>();
queue.enqueue(1);
queue.enqueue(2);

let first = queue.dequeue();   // 1
let second = queue.dequeue();  // 2
let third = queue.dequeue();   // panic: Queue is empty
```

Panics if the queue is empty.

> [!Note]
> In the future, `Queue<T>.dequeue` may return `optional<T>` to handle empty queues without panicking.

### `is_empty(&this) -> bool`

Check if the queue is empty.

```cpp
let queue = new Queue<int64>();
println(queue.is_empty());  // true

queue.enqueue(1);
println(queue.is_empty());  // false
```
### `is_full(&this) -> bool`

Check if the queue is full.

```cpp
let queue = new Queue<int64>();
println(queue.is_full());  // false

queue.enqueue(1);
queue.enqueue(2);
queue.enqueue(3);
println(queue.is_full());  // true
```
