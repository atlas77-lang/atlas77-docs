# The Atlas77 VM instruction set

The Atlas77 VM is a stack-based typed virtual machine that executes bytecode instructions, its design is similar to the Java Virtual Machine (JVM) and the .NET Common Language Runtime (CLR). It handles memory management with reference counting, and values don't carry additional data about their type. Instead, the type information is stored in the instruction set.

## Types

The Atlas77 VM supports the following types:
| Type          | Description                      | Status      |
|---------------|----------------------------------|:-----------:|
| `int8`        | 8-bit signed integer             | 🔧         |
| `int16`       | 16-bit signed integer            | 🔧         |
| `int32`       | 32-bit signed integer            | 🔧         |
| `int64`       | 64-bit signed integer            | ✅         |
| `uint8`       | 8-bit unsigned integer           | 🔧         |
| `uint16`      | 16-bit unsigned integer          | 🔧         |
| `uint32`      | 32-bit unsigned integer          | 🔧         |
| `uint64`      | 64-bit unsigned integer          | ✅         |
| `float32`     | 32-bit floating point number     | 🔧         |
| `float64`     | 64-bit floating point number     | ✅         |
| `[T]`         | Array of type T                  | ✅         |
| `bool`        | Boolean value (true or false)    | ✅         |
| `string`      | UTF-8 encoded string             | ✅         |
| `struct`      | Composite data type with fields  | ✅         |
| `extern_ptr`  | Pointer to external resource     | ❌         |
| `&T`          | Reference to type T              | ❌         |
| `function`    | Function pointer                 | ❌         |

> Types marked as "✅" are fully supported by the compiler and have dedicated instructions in the VM instruction set.
> 
> The types marked as "🔧" are currently technically working, but the compiler doesn't support them yet, and no instructions are specifically made to interact with them. So don't try to use them yet.
> 
> Types marked as "❌" are not implemented yet. They are planned for future releases.

## Memory Model

The Atlas77 VM uses a stack-based memory model. Each function call creates a new stack frame that contains local variables and the operand stack. The VM also maintains a heap for dynamic memory allocation, where objects and arrays are stored.

### Stack Frames

Each stack frame consists of:
- **Previous Program Counter (PC)**: The return address for the function call.
- **Previous Base Pointer (BP)**: Points to the base of the previous stack frame.
- **Arguments**: The parameters passed to the function, though arguments are considered to just be local variables.
- **Local Variables**: Space allocated for local variables.
- **Operand Stack**: Used for evaluating expressions and storing intermediate results.

You can visualize the stack frame layout as follows:

```
|-----------------------|
|   Previous PC         |
|-----------------------|
|   Previous BP         |
|-----------------------|
|   Arguments           |
|-----------------------|
|   Local Variables     |
|-----------------------|
|   Operand Stack       |
|-----------------------|
```

### Heap

The heap is used for dynamic memory allocation. Objects and arrays are allocated on the heap, and the VM uses reference counting to manage memory. When an object or array is no longer referenced, it is automatically deallocated. As for the cyclic references, the current implementation does not handle them, and they may lead to memory leaks. Though, there is a `delete` instruction that can be used to manually free memory.

### Constant Pool

The Atlas77 VM uses a constant pool to store literals and other constant values used in the bytecode. The constant pool is indexed, and instructions can reference constants by their index in the pool. The constant pool can contain:
- Integer literals
- Unsigned integer literals
- Floating-point literals
- String literals
- Function references
- Lists of constants (for arrays)

> NB: The constant pool will be refactored in future versions to allow better organization and separation of different constant types. To do so, we might introduce multiple constant pools (e.g., one for literals, one for function references, etc.) as well as more specific instructions to interact with them (e.g. ``LOAD_INT_CONST``, ``LOAD_STRING_CONST``, ...).

## Instruction Set

The Atlas77 instruction set is encoded in a 32-bit format, with each instruction consisting of an opcode followed by zero or more operands (at most three 8bit operands). 

### Constant loading

- `LOAD_CONST <constant_pool_idx>`: Loads a constant from the constant pool onto the stack.
> As mentionned, this will be refactored soon.

### Stack manipulation

- `POP`: Removes the top value from the stack.
- `DUP`: Duplicates the top value on the stack.
- `SWAP`: Swaps the top two values on the stack.

### Variable operations

- `STORE_VAR <local_slot_idx>`: Stores the top value from the stack into a local variable slot.
> Top of the stack state: `... | value_to_store`
- `LOAD_VAR <local_slot_idx>`: Loads a value from a local variable slot onto the stack.

### Collections & Indexing

- `INDEX_LOAD`: Loads a value from an array at the index specified on the stack.
> Top of the stack state: `... | index | array_ptr`
- `INDEX_STORE`: Stores a value into an array at the index specified on the stack.
> Top of the stack state: `... | index | array_ptr | value_to_store`
- `STRING_LOAD`: Loads a character from a string at the index specified on the stack.
> Top of the stack state: `... | index | string_ptr`
- `STRING_STORE`: Stores a character into a string at the index specified on the stack.
> Top of the stack state: `... | index | string_ptr | char_to_store`
- `NEW_ARRAY`: Creates a new array with the size specified on the stack.
> Top of the stack state: `... | size`
> 
> NB: The type of the array is still not specified in the instruction set. This will be added in future versions.

### Arithmetic

- `INT_ADD`, `FLOAT_ADD`, `UINT_ADD`: Adds the top two values on the stack.
> Top of the stack state: `... | value1 | value2` becomes `... | (value1 + value2)`
- `INT_SUB`, `FLOAT_SUB`, `UINT_SUB`: Subtracts the top two values on the stack.
> Top of the stack state: `... | value1 | value2` becomes `... | (value1 - value2)`
- `INT_MUL`, `FLOAT_MUL`, `UINT_MUL`: Multiplies the top two values on the stack.
> Top of the stack state: `... | value1 | value2` becomes `... | (value1 * value2)`
- `INT_DIV`, `FLOAT_DIV`, `UINT_DIV`: Divides the top two values on the stack.
> Top of the stack state: `... | value1 | value2` becomes `... | (value1 / value2)`
- `INT_MOD`, `UINT_MOD`, `FLOAT_MOD`: Computes the modulus of the top two values on the stack.
> Top of the stack state: `... | value1 | value2` becomes `... | (value1 % value2)`

### Comparisons

- `INT_EQUAL`, `UINT_EQUAL`, `FLOAT_EQUAL`, `BOOL_EQUAL`: Compares the top two values on the stack for equality.
> Top of the stack state: `... | value1 | value2` becomes `... | (value1 == value2)`
- `INT_NOT_EQUAL`, `UINT_NOT_EQUAL`, `FLOAT_NOT_EQUAL`, `BOOL_NOT_EQUAL`: Compares the top two values on the stack for inequality.
> Top of the stack state: `... | value1 | value2` becomes `... | (value1 != value2)`
- `INT_GREATER_THAN`, `UINT_GREATER_THAN`, `FLOAT_GREATER_THAN`: Compares if the second value is greater than the top value on the stack.
> Top of the stack state: `... | value1 | value2` becomes `... | (value1 > value2)`
- `INT_GREATER_THAN_EQUAL`, `UINT_GREATER_THAN_EQUAL`, `FLOAT_GREATER_THAN_EQUAL`: Compares if the second value is greater than or equal to the top value on the stack.
> Top of the stack state: `... | value1 | value2` becomes `... | (value1 >= value2)`
- `INT_LESS_THAN`, `UINT_LESS_THAN`, `FLOAT_LESS_THAN`: Compares if the second value is less than the top value on the stack.
> Top of the stack state: `... | value1 | value2` becomes `... | (value1 < value2)`
- `INT_LESS_THAN_EQUAL`, `UINT_LESS_THAN_EQUAL`, `FLOAT_LESS_THAN_EQUAL`: Compares if the second value is less than or equal to the top value on the stack.
> Top of the stack state: `... | value1 | value2` becomes `... | (value1 <= value2)`
- `BOOL_AND`: Performs a logical AND on the top two boolean values on the stack.
> Top of the stack state: `... | bool1 | bool2` becomes `... | (bool1 && bool2)`
> 
> NB: Short-circuit evaluation is not implemented yet, so this instruction is only temporary.
- `BOOL_OR`: Performs a logical OR on the top two boolean values on the stack.
> Top of the stack state: `... | bool1 | bool2` becomes `... | (bool1 || bool2)`
> 
> NB: Short-circuit evaluation is not implemented yet, so this instruction is only temporary.

### Control Flow
- `JMP <where_to>`: Relative unconditional jump to the specified instruction offset.
- `JMP_Z <where_to>`: Relative jump to the specified instruction offset if the top value on the stack is zero (false).

### Functions
- `LOCAL_SPACE <local_space_size>`: Allocates space for local variables in the current stack frame.
- `CALL <func_id>`: Calls a function by its ID.
- `EXTERN_CALL <func_name_idx>`: Calls an external function by its name index in the constant pool.
- `RETURN`: Returns from the current function, restoring the previous stack frame.

### Objects

- `NEW_OBJ <obj_descriptor_id>`: Creates a new zeroed object based on the provided object descriptor ID.
> Top of the stack state: `... | ` becomes `... | obj_ptr`
- `GET_FIELD <obj_field_idx>`: Retrieves a field from an object.
> Top of the stack state: `... | obj_ptr` becomes `... | field_value
- `SET_FIELD <obj_field_idx>`: Sets a field in an object.
> Top of the stack state: `... | obj_ptr | field_value` becomes `...
- `DELETE_OBJ`: Deletes an object, decrementing its reference count and freeing memory if necessary.
> Top of the stack state: `... | obj_ptr` becomes `...`
> 
> NB: This does not call the object's destructor. You must manually call the destructor to handle any RAII that you want before using this instruction.

### Type Operations
- `CAST_TO <type>`: Casts the top value on the stack to the specified type.
> Top of the stack state: `... | value` becomes `... | casted_value`

### Miscellaneous
- `NoOp`: Does nothing. Can be used for padding or alignment.
- `Halt`: Stops the execution of the VM.

## Example Bytecode
Here is a simple example of Atlas77 VM bytecode for this fibonacci function:
```ts
import "std/io";

fun main() {
    println(fib(40));
}

fun fib(n: int64) -> int64 {
    if n <= 1 {
        return n;
    } else {
        return fib(n - 1) + fib(n - 2);
    }
}
```

```ts
section .config
	USE_STANDARD_LIB: true  // Use the standard library

section .data
	0000 = int64 : 1            // Constant pool first entry (int64 1)
	0001 = int64 : 2            // Constant pool second entry (int64 2)
	0002 = int64 : 40           // Constant pool third entry (int64 40)
	0003 = string : "println"   // Constant pool fourth entry (string "println")

section .structs
    ; No structs used in this example

section .functions
	fib @0000           // Function ID 0: fib
    // function main does not need to be declared here as its the entry point

section .text
fib:
	LOCAL_SPACE #1      // Allocate space for 1 local variable (n)
	LOAD_VAR @0         // Load n
	LOAD_CONST &0000    // Load constant 1
	INT_LESS_THAN_EQUAL // Check if n <= 1
	JMP_Z 3             // If false, jump to else branch
if_branch:
	LOAD_VAR @0         // Load n
	RETURN              // Return n
	JMP 11              // Jump to the end
else_branch:
	LOAD_VAR @0         // Load n
	LOAD_CONST &0000    // Load constant 1
	INT_SUB             // n - 1
	CALL @0000          // Call fib(n - 1)
	LOAD_VAR @0         // Load n
	LOAD_CONST &0001    // Load constant 2
	INT_SUB             // n - 2   
	CALL @0000          // Call fib(n - 2)
	INT_ADD             // Add the two results
	RETURN              // Return the result
main:
	LOAD_CONST &0002    // Load constant 40
	CALL @0000          // Call fib(40)
	EXTERN_CALL &0003   // Call println
	POP                 // Pop the return value of println as its a unit function
	HALT                // Halt the program

```