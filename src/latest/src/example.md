List of all of the keywords in the language:
- class
- struct
- enum
- concept
- package
- import
- fn
- let
- const (both for `const T` and `const t: T`, one is constant type and the other is constant variable)
- new
- delete
- if/else/while/for
- return
- break/continue
- operator
- extern
- public/private
- override (but not sure, it'll probably part of a future comptime thingy that user can define manually to add more checks)
- as (for casting)
- comptime (for compile-time evaluation)
- self
- int8/int16/int32/int64
- uint8/uint16/uint32/uint64
- float32/float64
- bool
- str
- char
- unit/null
- true/false
> Primitive types are considered as keywords, but I do plan to change that, because it risks to bloat the keyword list.

```c
// Nothing to see here yet, just a placeholder for now.
```