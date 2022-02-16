/**
 * @license
 * Copyright (c) ULIVZ. All Rights Reserved.
 */

import { File } from "majo";

/**
 * Get the raw type string of a value, e.g., [object Object].
 */
const _toString = Object.prototype.toString;

/**
 * Strict object type check. Only returns true for plain JavaScript objects.
 */
export function isPlainObject(obj: unknown): boolean {
  return _toString.call(obj) === "[object Object]";
}

/**
 * Create a majo file.
 */
export function createMajoFileSync(filepath: string, contents: string): File {
  return {
    contents: Buffer.from(contents),
    stats: null,
    path: filepath,
  } as File;
}
