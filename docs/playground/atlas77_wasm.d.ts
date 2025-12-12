/* tslint:disable */
/* eslint-disable */

export class ExecutionResult {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  readonly stderr: string;
  readonly stdout: string;
  readonly success: boolean;
  readonly exit_code: number;
}

/**
 * Validate syntax without execution
 */
export function check_syntax(source_code: string): boolean;

/**
 * Compile and execute Atlas 77 source code
 */
export function compile_and_run(source_code: string): ExecutionResult;

/**
 * Format source code (future feature)
 */
export function format_code(source_code: string): string;

/**
 * Get the compiler version
 */
export function get_version(): string;

/**
 * Initialize the WASM module
 */
export function init(): void;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_executionresult_free: (a: number, b: number) => void;
  readonly check_syntax: (a: number, b: number) => [number, number, number];
  readonly compile_and_run: (a: number, b: number) => [number, number, number];
  readonly executionresult_exit_code: (a: number) => number;
  readonly executionresult_stderr: (a: number) => [number, number];
  readonly executionresult_stdout: (a: number) => [number, number];
  readonly executionresult_success: (a: number) => number;
  readonly format_code: (a: number, b: number) => [number, number, number, number];
  readonly get_version: () => [number, number];
  readonly init: () => void;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_externrefs: WebAssembly.Table;
  readonly __externref_table_dealloc: (a: number) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
