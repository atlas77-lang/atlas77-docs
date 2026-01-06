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

Returns `optional::empty()` if the queue is empty.
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

## Usage Examples

### Basic Queue Operations

```cpp
import "std/queue";
import "std/io";

fun main() {
    let queue = new Queue<int64>();
    
    // Add items
    queue.enqueue(10);
    queue.enqueue(20);
    queue.enqueue(30);
    
    println("Queue length: " + queue.size);  // 3
    
    // Remove items (FIFO order)
    while !queue.is_empty() {
        let item = queue.dequeue();
        println(item);
    }
    // Output: 10, 20, 30
}
```

### Task Queue

```cpp
import "std/queue";
import "std/string";
import "std/io";

fun main() {
    let tasks = new Queue<string>();
    
    // Add tasks
    tasks.enqueue("Process data");
    tasks.enqueue("Send email");
    tasks.enqueue("Update database");
    
    // Process tasks
    println("Processing tasks...");
    while !tasks.is_empty() {
        let task = tasks.dequeue();
        println("Doing: " + task);
    }
}
```

### Message Queue

```cpp
import "std/queue";
import "std/string";
import "std/io";

fun main() {
    let messages = new Queue<string>();
    
    // Simulate receiving messages
    messages.enqueue("Hello");
    messages.enqueue("How are you?");
    messages.enqueue("Goodbye");
    
    // Process messages in order
    println("Messages:");
    let i = 1;
    while !messages.is_empty() {
        let msg = messages.dequeue();
        println(i + ". " + msg);
        i = i + 1;
    }
}
```

### Job Scheduler

```cpp
import "std/queue";
import "std/io";

fun process_job(job_id: int64) {
    println("Processing job " + job_id);
}

fun main() {
    let job_queue = new Queue<int64>();
    
    // Add jobs
    job_queue.enqueue(101);
    job_queue.enqueue(102);
    job_queue.enqueue(103);
    
    println("Starting job processor...");
    
    while !job_queue.is_empty() {
        let job = job_queue.dequeue();
        process_job(job);
    }
    
    println("All jobs completed");
}
```

### Breadth-First Traversal

```cpp
import "std/queue";
import "std/io";

fun main() {
    // Simulate a tree level-order traversal
    let queue = new Queue<int64>();
    
    // Add root level
    queue.enqueue(1);
    
    // Process levels
    let level = 1;
    while !queue.is_empty() && level <= 3 {
        let size = queue.size;
        println("Level " + level + ":");
        
        let i = 0u;
        while i < size {
            let node = queue.dequeue();
            println("  Node: " + node);
            
            // Add children (simulated)
            if level < 3 {
                queue.enqueue(node * 2);
                queue.enqueue(node * 2 + 1);
            }
            
            i = i + 1u;
        }
        
        level = level + 1;
    }
}
```

### Request Queue with Limit

```cpp
import "std/queue";
import "std/io";

const MAX_QUEUE_SIZE: uint64 = 5u;

fun main() {
    let requests = new Queue<int64>();
    
    // Try to add requests
    let i = 1;
    while i <= 10 {
        if requests.size < MAX_QUEUE_SIZE {
            requests.enqueue(i);
            println("Added request " + i);
        } else {
            println("Queue full! Dropping request " + i);
        }
        i = i + 1;
    }
    
    // Process requests
    println("\nProcessing requests:");
    while !requests.is_empty() {
        let req = requests.dequeue();
        println("Processing request " + req);
    }
}
```

## Performance Characteristics

- **enqueue**: O(1) amortized (O(n) when vector resizes)
- **dequeue**: O(1)
- **is_empty**: O(1)

## Best Practices

1. **Check emptiness**: Always check `is_empty()` before calling `dequeue()`
3. **Bounded queues**: Consider implementing size limits to prevent unbounded growth
4. **Clear when done**: Call `clear()` to free memory when finished with a queue

## Common Patterns

### Producer-Consumer

```cpp
fun producer(queue: &Queue<int64>) {
    queue.enqueue(1);
    queue.enqueue(2);
    queue.enqueue(3);
}

fun consumer(queue: &Queue<int64>) {
    while !queue.is_empty() {
        let item = queue.dequeue();
        // Process item
    }
}
```

---

**See also:**
- [std/vector](./std-vector.md) - Queue is implemented using Vector
- [std/optional](./std-optional.md) - Queue methods return optional values
- [Standard Library Overview](./std.md)
