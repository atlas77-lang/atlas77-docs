# The Atlas77 VM instruction set

The Atlas77 VM is a stack-based typed virtual machine that executes bytecode instructions, its design is similar to the Java Virtual Machine (JVM) and the .NET Common Language Runtime (CLR). It handles memory management with reference counting, and values don't carry additional data about their type. Instead, the type information is stored in the instruction set.

## Types

The Atlas77 VM supports the following types:
- `int8`: 8-bit signed integer
- `int16`: 16-bit signed integer
- `int32`: 32-bit signed integer
- `int64`: 64-bit signed integer
- `uint8`: 8-bit unsigned integer
- `uint16`: 16-bit unsigned integer
- `uint32`: 32-bit unsigned integer
- `uint64`: 64-bit unsigned integer
- `float32`: 32-bit floating point number
- `float64`: 64-bit floating point number
- `bool`: boolean value (true or false)
- `str`: string value
- `char`: character value
- `unit`: unit type (similar to null or void in C/C++)

## Arithmetic Instructions

The Atlas77 VM supports the following arithmetic instructions:
- `add.<type>`: Adds two values of the same type and pushes the result onto the stack.
- `sub.<type>`: Subtracts the second value from the first value of the same type and pushes the result onto the stack.
- `mul.<type>`: Multiplies two values of the same type and pushes the result onto the stack.
- `div.<type>`: Divides the first value by the second value of the same type and pushes the result onto the stack.
- `mod.<type>`: Computes the modulus of the first value by the second value of the same type and pushes the result onto the stack.
- `neg.<type>`: Negates the value of the given type and pushes the result onto the stack.
- `inc.<type>`: Increments the value of the given type by 1 and pushes the result onto the stack.
- `dec.<type>`: Decrements the value of the given type by 1 and pushes the result onto the stack.

## Comparison Instructions

The Atlas77 VM supports the following comparison instructions:
- `eq.<type>`: Compares two values of the same type for equality and pushes the result (true or false) onto the stack.
- `ne.<type>`: Compares two values of the same type for inequality and pushes the result (true or false) onto the stack.
- `lt.<type>`: Compares two values of the same type to check if the first value is less than the second value and pushes the result (true or false) onto the stack.
- `le.<type>`: Compares two values of the same type to check if the first value is less than or equal to the second value and pushes the result (true or false) onto the stack.
- `gt.<type>`: Compares two values of the same type to check if the first value is greater than the second value and pushes the result (true or false) onto the stack.
- `ge.<type>`: Compares two values of the same type to check if the first value is greater than or equal to the second value and pushes the result (true or false) onto the stack.

## Bitwise Instructions

The Atlas77 VM supports the following bitwise instructions:
- `and.<type>`: Performs a bitwise AND operation on two values of the same type and pushes the result onto the stack. (Supported types: `int8`, `int16`, `int32`, `int64`, `uint8`, `uint16`, `uint32`, `uint64`)
- `or.<type>`: Performs a bitwise OR operation on two values of the same type and pushes the result onto the stack. (Supported types: `int8`, `int16`, `int32`, `int64`, `uint8`, `uint16`, `uint32`, `uint64`)
- `xor.<type>`: Performs a bitwise XOR operation on two values of the same type and pushes the result onto the stack. (Supported types: `int8`, `int16`, `int32`, `int64`, `uint8`, `uint16`, `uint32`, `uint64`)
- `not.<type>`: Performs a bitwise NOT operation on the value of the given type and pushes the result onto the stack. (Supported types: `int8`, `int16`, `int32`, `int64`, `uint8`, `uint16`, `uint32`, `uint64`)
- `shl.<type>`: Performs a left shift operation on the value of the given type and pushes the result onto the stack. (Supported types: `int8`, `int16`, `int32`, `int64`, `uint8`, `uint16`, `uint32`, `uint64`)
- `shr.<type>`: Performs a right shift operation on the value of the given type and pushes the result onto the stack. (Supported types: `int8`, `int16`, `int32`, `int64`, `uint8`, `uint16`, `uint32`, `uint64`)


