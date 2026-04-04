# Installation

Atlas77 currently uses a Rust-based compiler frontend and emits C.

Typical prerequisites:

- Rust toolchain for atlas77 compiler builds
- A C compiler backend (tinycc, gcc, clang, or msvc)

Quick verification commands:

```c
atlas77 --help
atlas77 check src/main.atlas
```

If check runs, your environment is ready for basic development.
