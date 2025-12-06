# Atlas 77 Playground Implementation Guide

This document outlines the complete implementation plan for adding an interactive online playground to the Atlas 77 documentation website.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Phase 1: WASM Preparation](#phase-1-wasm-preparation)
3. [Phase 2: Frontend Integration](#phase-2-frontend-integration)
4. [Phase 3: Advanced Features](#phase-3-advanced-features)
5. [Security Considerations](#security-considerations)
6. [Deployment Strategy](#deployment-strategy)
7. [Performance Optimization](#performance-optimization)
8. [Troubleshooting](#troubleshooting)

---

## Architecture Overview

### Technology Stack

- **Compiler/Runtime**: Rust compiled to WebAssembly
- **Build Tool**: `wasm-pack` for WASM compilation
- **Frontend**: Vanilla JavaScript (no framework dependencies)
- **Code Editor**: Native `<textarea>` (upgradeable to Monaco/CodeMirror)
- **Deployment**: Static files served via GitHub Pages

### Component Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (Client)                      │
├─────────────────────────────────────────────────────────┤
│  Playground UI (playground.html)                        │
│  ├─ Code Editor (textarea)                              │
│  ├─ Toolbar (Run, Examples, Settings)                   │
│  └─ Output Panel (stdout, stderr, compilation errors)   │
├─────────────────────────────────────────────────────────┤
│  JavaScript Glue Code (playground.js)                   │
│  ├─ Event handlers                                      │
│  ├─ Example management                                  │
│  └─ WASM module loader                                  │
├─────────────────────────────────────────────────────────┤
│  WASM Module (pkg/atlas77_wasm.js + .wasm)             │
│  ├─ compile_and_run(source: String) -> Result          │
│  ├─ get_version() -> String                            │
│  └─ format_code(source: String) -> String              │
├─────────────────────────────────────────────────────────┤
│  Atlas 77 Core (Compiled to WASM)                       │
│  ├─ Lexer / Parser                                      │
│  ├─ Type Checker                                        │
│  ├─ Compiler                                            │
│  └─ Runtime / VM                                        │
└─────────────────────────────────────────────────────────┘
```

---

## Phase 1: WASM Preparation

### 1.1 Project Structure Setup

Create a workspace structure if you haven't already:

```toml
# Cargo.toml (workspace root)
[workspace]
members = [
    "atlas77-compiler",
    "atlas77-runtime", 
    "atlas77-wasm",
]
```

### 1.2 Create WASM Binding Crate

**File: `atlas77-wasm/Cargo.toml`**

```toml
[package]
name = "atlas77-wasm"
version = "0.6.0"
edition = "2021"

[lib]
crate-type = ["cdylib", "rlib"]

[dependencies]
atlas77-compiler = { path = "../atlas77-compiler" }
atlas77-runtime = { path = "../atlas77-runtime" }
wasm-bindgen = "0.2"
serde = { version = "1.0", features = ["derive"] }
serde-wasm-bindgen = "0.6"
console_error_panic_hook = "0.1"
wee_alloc = { version = "0.4", optional = true }

[dev-dependencies]
wasm-bindgen-test = "0.3"

[profile.release]
opt-level = "z"      # Optimize for size
lto = true           # Enable Link Time Optimization
codegen-units = 1    # Better optimization
panic = "abort"      # Smaller binary size

[features]
default = ["console_error_panic_hook"]
```

### 1.3 Implement WASM Bindings

**File: `atlas77-wasm/src/lib.rs`**

```rust
use wasm_bindgen::prelude::*;
use atlas77_compiler::{compile, CompileOptions};
use atlas77_runtime::{execute, RuntimeConfig};

// Set panic hook for better error messages in browser
#[cfg(feature = "console_error_panic_hook")]
pub use console_error_panic_hook::set_once as set_panic_hook;

#[wasm_bindgen]
pub struct ExecutionResult {
    success: bool,
    stdout: String,
    stderr: String,
    exit_code: i32,
}

#[wasm_bindgen]
impl ExecutionResult {
    #[wasm_bindgen(getter)]
    pub fn success(&self) -> bool {
        self.success
    }

    #[wasm_bindgen(getter)]
    pub fn stdout(&self) -> String {
        self.stdout.clone()
    }

    #[wasm_bindgen(getter)]
    pub fn stderr(&self) -> String {
        self.stderr.clone()
    }

    #[wasm_bindgen(getter)]
    pub fn exit_code(&self) -> i32 {
        self.exit_code
    }
}

/// Initialize the WASM module
#[wasm_bindgen(start)]
pub fn init() {
    #[cfg(feature = "console_error_panic_hook")]
    set_panic_hook();
}

/// Compile and execute Atlas 77 source code
#[wasm_bindgen]
pub fn compile_and_run(source_code: String) -> Result<ExecutionResult, String> {
    // Compile the source code
    let bytecode = match compile(&source_code, CompileOptions::default()) {
        Ok(bc) => bc,
        Err(e) => {
            return Ok(ExecutionResult {
                success: false,
                stdout: String::new(),
                stderr: format!("Compilation Error:\n{}", e),
                exit_code: 1,
            });
        }
    };

    // Execute the bytecode
    let config = RuntimeConfig {
        max_execution_time_ms: 5000, // 5 second timeout
        max_memory_bytes: 10 * 1024 * 1024, // 10MB limit
        allow_file_io: false, // Disable file I/O in playground
        allow_network: false, // Disable network access
    };

    match execute(&bytecode, config) {
        Ok(output) => Ok(ExecutionResult {
            success: true,
            stdout: output.stdout,
            stderr: output.stderr,
            exit_code: 0,
        }),
        Err(e) => Ok(ExecutionResult {
            success: false,
            stdout: String::new(),
            stderr: format!("Runtime Error:\n{}", e),
            exit_code: 1,
        }),
    }
}

/// Get the compiler version
#[wasm_bindgen]
pub fn get_version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}

/// Format source code (future feature)
#[wasm_bindgen]
pub fn format_code(source_code: String) -> Result<String, String> {
    // TODO: Implement code formatter
    Ok(source_code)
}

/// Validate syntax without execution
#[wasm_bindgen]
pub fn check_syntax(source_code: String) -> Result<bool, String> {
    match compile(&source_code, CompileOptions::check_only()) {
        Ok(_) => Ok(true),
        Err(e) => Err(format!("{}", e)),
    }
}
```

### 1.4 Build WASM Module

```bash
# Install wasm-pack if not already installed
cargo install wasm-pack

# Build the WASM module
cd atlas77-wasm
wasm-pack build --target web --out-dir ../docs/playground/pkg

# The output will be in docs/playground/pkg/:
# - atlas77_wasm.js (JavaScript bindings)
# - atlas77_wasm_bg.wasm (WebAssembly binary)
# - atlas77_wasm.d.ts (TypeScript definitions)
```

### 1.5 Optimize WASM Size

```bash
# Install wasm-opt (from binaryen)
# Ubuntu/Debian: sudo apt install binaryen
# macOS: brew install binaryen
# Windows: Download from https://github.com/WebAssembly/binaryen/releases

# Optimize the WASM binary
wasm-opt -Oz -o atlas77_wasm_bg_opt.wasm atlas77_wasm_bg.wasm

# Expected size reduction: 30-50%
```

---

## Phase 2: Frontend Integration

### 2.1 Update playground.html

Replace the TODO comments in `docs/playground.html`:

```javascript
// Add to <head>
<script type="module">
  import init, { compile_and_run, get_version } from './playground/pkg/atlas77_wasm.js';

  let wasmReady = false;

  // Initialize WASM module
  async function initWasm() {
    try {
      await init();
      wasmReady = true;
      console.log('Atlas 77 WASM module loaded successfully');
      document.getElementById('status').innerHTML = 
        '<span class="status-dot"></span>Ready (v' + get_version() + ')';
    } catch (err) {
      console.error('Failed to load WASM:', err);
      document.getElementById('status').innerHTML = 
        '<span class="status-dot"></span>Error loading compiler';
    }
  }

  // Initialize on page load
  initWasm();

  // Expose to global scope for button handlers
  window.runAtlas77Code = async function() {
    if (!wasmReady) {
      appendOutput('<span class="error">Error: Compiler not loaded yet</span>');
      return;
    }

    const code = document.getElementById('editor').value.trim();
    if (!code) {
      appendOutput('<span class="error">Error: No code to execute</span>');
      return;
    }

    setStatus('running', 'Compiling...');
    document.getElementById('run-btn').disabled = true;

    try {
      const result = compile_and_run(code);
      
      if (result.success) {
        appendOutput('<span class="success">✓ Compilation successful!</span>');
        appendOutput('<span class="info">--- Program Output ---</span>');
        if (result.stdout) {
          appendOutput(result.stdout);
        }
        if (result.stderr) {
          appendOutput('<span class="error">' + result.stderr + '</span>');
        }
        setStatus('success', 'Executed successfully');
      } else {
        appendOutput(result.stderr);
        setStatus('error', 'Compilation failed');
      }
    } catch (err) {
      appendOutput('<span class="error">Fatal Error: ' + err + '</span>');
      setStatus('error', 'Execution failed');
    } finally {
      document.getElementById('run-btn').disabled = false;
    }
  };
</script>
```

Update the run button:

```html
<button class="btn btn-success" id="run-btn" onclick="runAtlas77Code()">
  ▶ Run
</button>
```

### 2.2 Add Loading State

```html
<!-- Add after opening <body> tag -->
<div id="loading-overlay" style="
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  z-index: 9999;
  font-size: 1.2rem;
">
  <div style="text-align: center;">
    <div>Loading Atlas 77 Compiler...</div>
    <div style="font-size: 0.9rem; margin-top: 0.5rem; opacity: 0.7;">
      This may take a few seconds on first load
    </div>
  </div>
</div>

<script>
  // Hide loading overlay when WASM is ready
  window.addEventListener('wasmReady', () => {
    document.getElementById('loading-overlay').style.display = 'none';
  });
</script>
```

### 2.3 Error Handling & User Feedback

Add comprehensive error handling:

```javascript
function handleCompilationError(error) {
  // Parse error message and highlight relevant line
  const lineMatch = error.match(/line (\d+)/i);
  if (lineMatch) {
    const lineNum = parseInt(lineMatch[1]);
    highlightErrorLine(lineNum);
  }
  
  // Display formatted error
  appendOutput(`<span class="error">Compilation Error:</span>`);
  appendOutput(formatError(error));
}

function formatError(error) {
  // TODO: Implement syntax highlighting for errors
  return error.replace(/\n/g, '<br>');
}

function highlightErrorLine(lineNum) {
  const editor = document.getElementById('editor');
  const lines = editor.value.split('\n');
  
  // Scroll to error line
  // TODO: Add line number display and highlighting
}
```

---

## Phase 3: Advanced Features

### 3.1 Monaco Editor Integration (Optional)

Replace the basic `<textarea>` with Monaco for better UX:

```html
<!-- Add to <head> -->
<script src="https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs/loader.js"></script>

<script>
require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs' }});
require(['vs/editor/editor.main'], function() {
  const editor = monaco.editor.create(document.getElementById('editor-container'), {
    value: 'import std::io;\n\nfun main() {\n  println("Hello, Atlas 77!");\n}',
    language: 'rust', // Closest syntax until custom language support
    theme: 'vs-dark',
    minimap: { enabled: false },
    fontSize: 14,
    lineNumbers: 'on',
    automaticLayout: true,
  });

  // Define Atlas 77 language syntax (simplified)
  monaco.languages.register({ id: 'atlas77' });
  monaco.languages.setMonarchTokensProvider('atlas77', {
    keywords: ['fun', 'let', 'mut', 'if', 'else', 'for', 'while', 'return', 'import', 'new'],
    typeKeywords: ['String', 'Int', 'Float', 'Bool', 'File'],
    operators: ['+', '-', '*', '/', '=', '==', '!=', '<', '>', '<=', '>='],
    tokenizer: {
      root: [
        [/[a-z_$][\w$]*/, { cases: { '@typeKeywords': 'type', '@keywords': 'keyword', '@default': 'identifier' } }],
        [/".*?"/, 'string'],
        [/\/\/.*$/, 'comment'],
        [/\d+/, 'number'],
      ]
    }
  });
});
</script>
```

### 3.2 Shareable Links

Add URL hash encoding for code sharing:

```javascript
function encodePlayground() {
  const code = editor.getValue();
  const encoded = btoa(encodeURIComponent(code));
  window.location.hash = encoded;
  
  // Show "Link Copied" notification
  navigator.clipboard.writeText(window.location.href);
  showNotification('Shareable link copied to clipboard!');
}

function decodePlayground() {
  const hash = window.location.hash.slice(1);
  if (hash) {
    try {
      const decoded = decodeURIComponent(atob(hash));
      editor.setValue(decoded);
    } catch (e) {
      console.error('Failed to decode URL:', e);
    }
  }
}

// Load code from URL on page load
window.addEventListener('load', decodePlayground);
```

### 3.3 Local Storage for Auto-Save

```javascript
const STORAGE_KEY = 'atlas77_playground_code';

function saveToLocalStorage() {
  const code = editor.getValue();
  localStorage.setItem(STORAGE_KEY, code);
  localStorage.setItem(STORAGE_KEY + '_timestamp', Date.now());
}

function loadFromLocalStorage() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    editor.setValue(saved);
    const timestamp = localStorage.getItem(STORAGE_KEY + '_timestamp');
    if (timestamp) {
      const date = new Date(parseInt(timestamp));
      showNotification(`Restored code from ${date.toLocaleString()}`);
    }
  }
}

// Auto-save every 5 seconds
setInterval(saveToLocalStorage, 5000);

// Load on page init
loadFromLocalStorage();
```

### 3.4 Example Library

Expand the examples system:

```javascript
const exampleLibrary = {
  basics: {
    name: 'Basics',
    examples: {
      hello: { name: 'Hello World', code: '...' },
      variables: { name: 'Variables', code: '...' },
      types: { name: 'Type System', code: '...' },
    }
  },
  control_flow: {
    name: 'Control Flow',
    examples: {
      if_else: { name: 'If/Else', code: '...' },
      loops: { name: 'Loops', code: '...' },
      pattern_matching: { name: 'Pattern Matching', code: '...' },
    }
  },
  advanced: {
    name: 'Advanced',
    examples: {
      generics: { name: 'Generics', code: '...' },
      traits: { name: 'Traits', code: '...' },
      async: { name: 'Async/Await', code: '...' },
    }
  }
};

// Build category dropdown dynamically
function buildExampleMenu() {
  // TODO: Implement hierarchical menu
}
```

---

## Security Considerations

### 4.1 Resource Limits

Implement strict limits in the WASM runtime:

```rust
pub struct RuntimeConfig {
    /// Maximum execution time in milliseconds
    pub max_execution_time_ms: u64,
    
    /// Maximum memory allocation in bytes
    pub max_memory_bytes: usize,
    
    /// Maximum number of loop iterations
    pub max_iterations: u64,
    
    /// Maximum recursion depth
    pub max_recursion_depth: usize,
    
    /// Disable file system access
    pub allow_file_io: bool,
    
    /// Disable network access
    pub allow_network: bool,
}

impl Default for RuntimeConfig {
    fn default() -> Self {
        Self {
            max_execution_time_ms: 5000,      // 5 seconds
            max_memory_bytes: 10 * 1024 * 1024, // 10MB
            max_iterations: 1_000_000,         // 1 million iterations
            max_recursion_depth: 256,
            allow_file_io: false,
            allow_network: false,
        }
    }
}
```

### 4.2 Content Security Policy

Add to `playground.html` `<head>`:

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' https://cdn.jsdelivr.net;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data:;
  connect-src 'self';
  font-src 'self';
">
```

### 4.3 Input Sanitization

```javascript
function sanitizeOutput(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function appendOutput(text) {
  const sanitized = sanitizeOutput(text);
  // ... rest of output logic
}
```

---

## Deployment Strategy

### 5.1 GitHub Actions Workflow

Create `.github/workflows/build-playground.yml`:

```yaml
name: Build Playground

on:
  push:
    branches: [ main, master ]
    paths:
      - 'atlas77-wasm/**'
      - 'atlas77-compiler/**'
      - 'atlas77-runtime/**'
      - '.github/workflows/build-playground.yml'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install Rust
        uses: actions-rs/toolchain@v1
        with:
          toolchain: stable
          target: wasm32-unknown-unknown
      
      - name: Install wasm-pack
        run: cargo install wasm-pack
      
      - name: Build WASM
        run: |
          cd atlas77-wasm
          wasm-pack build --target web --out-dir ../docs/playground/pkg
      
      - name: Optimize WASM
        run: |
          # Install binaryen for wasm-opt
          sudo apt-get update && sudo apt-get install -y binaryen
          cd docs/playground/pkg
          wasm-opt -Oz -o atlas77_wasm_bg_opt.wasm atlas77_wasm_bg.wasm
          mv atlas77_wasm_bg_opt.wasm atlas77_wasm_bg.wasm
      
      - name: Commit built files
        run: |
          git config --local user.email "github-actions[bot]@users.noreply.github.com"
          git config --local user.name "github-actions[bot]"
          git add docs/playground/pkg
          git commit -m "Auto-build: Update playground WASM" || exit 0
          git push
```

### 5.2 GitHub Pages Configuration

Ensure GitHub Pages serves from the `docs/` folder:

1. Go to repository Settings → Pages
2. Source: Deploy from a branch
3. Branch: `master` or `main`, folder: `/docs`
4. Save

### 5.3 Custom Domain (Optional)

If using a custom domain like `play.atlas77.dev`:

1. Create CNAME file:
   ```bash
   echo "play.atlas77.dev" > docs/CNAME
   ```

2. Configure DNS:
   ```
   Type: CNAME
   Name: play
   Value: <your-username>.github.io
   ```

---

## Performance Optimization

### 6.1 WASM Lazy Loading

Split WASM loading to reduce initial page load:

```javascript
let wasmModule = null;

async function loadWasmOnDemand() {
  if (!wasmModule) {
    const { init, compile_and_run } = await import('./playground/pkg/atlas77_wasm.js');
    await init();
    wasmModule = { compile_and_run };
  }
  return wasmModule;
}

// Load on first interaction
document.getElementById('editor').addEventListener('focus', loadWasmOnDemand, { once: true });
```

### 6.2 Service Worker Caching

Create `docs/sw.js`:

```javascript
const CACHE_NAME = 'atlas77-playground-v1';
const urlsToCache = [
  '/playground.html',
  '/playground/pkg/atlas77_wasm.js',
  '/playground/pkg/atlas77_wasm_bg.wasm',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
```

Register in `playground.html`:

```javascript
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

### 6.3 Code Splitting

For larger compilers, split into multiple WASM modules:

```rust
// atlas77-wasm/src/lib.rs
#[wasm_bindgen]
pub async fn compile_only(source: String) -> Result<Vec<u8>, String> {
    // Lightweight compilation pass
}

// Separate heavy runtime into lazy-loaded module
#[wasm_bindgen]
pub async fn execute_bytecode(bytecode: Vec<u8>) -> Result<ExecutionResult, String> {
    // Heavy runtime execution
}
```

---

## Troubleshooting

### Common Issues

#### Issue 1: "Module not found" error

**Symptom**: `Uncaught TypeError: Failed to fetch dynamically imported module`

**Solution**:
- Ensure paths are correct: `./playground/pkg/atlas77_wasm.js` (relative)
- Check browser console for 404 errors
- Verify GitHub Pages is serving from `/docs` folder
- Clear browser cache

#### Issue 2: WASM module is too large (>10MB)

**Solution**:
```bash
# Aggressive optimization
wasm-opt -Oz --strip-debug --strip-dwarf atlas77_wasm_bg.wasm -o optimized.wasm

# Consider code splitting
# Implement on-demand feature loading
```

#### Issue 3: Infinite loops hang browser

**Solution**:
Implement timeout in Rust runtime:

```rust
use std::time::{Duration, Instant};

pub fn execute_with_timeout(bytecode: &[u8], timeout: Duration) -> Result<Output, Error> {
    let start = Instant::now();
    
    loop {
        if start.elapsed() > timeout {
            return Err(Error::ExecutionTimeout);
        }
        
        // Execute next instruction
        // ...
    }
}
```

#### Issue 4: Memory leaks

**Solution**:
```rust
// Use wee_alloc for smaller binary and better memory management
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

// Properly drop large allocations
#[wasm_bindgen]
pub fn compile_and_run(source: String) -> Result<ExecutionResult, String> {
    let result = {
        let bytecode = compile(&source)?;
        execute(&bytecode)?
    }; // bytecode dropped here
    
    Ok(result)
}
```

---

## Testing Strategy

### Unit Tests

```rust
#[cfg(test)]
mod tests {
    use super::*;
    use wasm_bindgen_test::*;

    #[wasm_bindgen_test]
    fn test_hello_world() {
        let code = r#"
            import std::io;
            fun main() {
                println("Hello!");
            }
        "#;
        
        let result = compile_and_run(code.to_string()).unwrap();
        assert!(result.success());
        assert_eq!(result.stdout(), "Hello!\n");
    }

    #[wasm_bindgen_test]
    fn test_compilation_error() {
        let code = "invalid syntax here";
        let result = compile_and_run(code.to_string()).unwrap();
        assert!(!result.success());
        assert!(result.stderr().contains("Error"));
    }
}
```

Run tests:
```bash
wasm-pack test --headless --firefox
```

---

## Roadmap

### v1.0 (MVP) - Q1 2025
- [x] Basic WASM compilation
- [x] Simple textarea editor
- [ ] Run button + output display
- [ ] 5-10 curated examples
- [ ] Basic error messages

### v1.1 - Q2 2025
- [ ] Monaco Editor integration
- [ ] Syntax highlighting
- [ ] Line numbers + error highlighting
- [ ] Shareable links (URL encoding)
- [ ] Auto-save to localStorage

### v1.2 - Q3 2025
- [ ] Advanced examples library (20+)
- [ ] Code formatter
- [ ] Execution metrics (time, memory)
- [ ] Dark/light theme toggle
- [ ] Mobile-responsive layout

### v2.0 - Q4 2025
- [ ] Multi-file projects
- [ ] Debugger integration
- [ ] Step-through execution
- [ ] Variable inspector
- [ ] Package/library imports
- [ ] User accounts + saved projects

---

## Resources

### Documentation
- [wasm-bindgen Guide](https://rustwasm.github.io/wasm-bindgen/)
- [wasm-pack Documentation](https://rustwasm.github.io/wasm-pack/)
- [MDN: WebAssembly](https://developer.mozilla.org/en-US/docs/WebAssembly)

### Example Playgrounds
- [Rust Playground](https://play.rust-lang.org/) - Reference implementation
- [Go Playground](https://go.dev/play/)
- [TypeScript Playground](https://www.typescriptlang.org/play)

### Tools
- [wasm-opt](https://github.com/WebAssembly/binaryen) - WASM optimizer
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - VS Code editor component
- [CodeMirror](https://codemirror.net/) - Lightweight code editor

---

## Support & Contribution

For questions or issues:
1. Open an issue on [GitHub](https://github.com/atlas77-lang/Atlas77/issues)
2. Join our Discord community (link in repo README)
3. Check existing playground implementations in `examples/` folder

Contributions welcome! See `CONTRIBUTING.md` for guidelines.

---

**Last Updated**: December 6, 2025  
**Version**: 1.0  
**Maintainer**: Atlas 77 Core Team
