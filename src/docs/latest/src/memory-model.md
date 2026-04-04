# Memory Model

Atlas77 uses explicit ownership and deterministic destruction.

Core ideas:

- Trivial values are copyable.
- Resource values are moved.
- move(x) invalidates the source value.
- Cleanup is inserted by compiler passes and lowered to generated C code.

```atlas77
let a = make_resource();
let b = move(a);
// a is invalid after move
```
