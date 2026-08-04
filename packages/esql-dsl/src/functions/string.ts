/*
 * Copyright Elasticsearch B.V. and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ExpressionLike } from '@elastic/elasticsearch-query-builder';
import { InstrumentedExpression } from '../expression';
import { fn, fnLiteral, renderArg, renderLiteralArg } from '../fn';

/** ES|QL `CONCAT` — concatenates strings. */
export function concat(...args: ExpressionLike[]): InstrumentedExpression {
  return fnLiteral('CONCAT', ...args);
}

/** ES|QL `LENGTH` — returns the length of a string in characters. */
export function length(str: ExpressionLike): InstrumentedExpression {
  return fn('LENGTH', str);
}

/** ES|QL `TO_UPPER` — converts string to uppercase. */
export function toUpper(str: ExpressionLike): InstrumentedExpression {
  return fn('TO_UPPER', str);
}

/** ES|QL `TO_LOWER` — converts string to lowercase. */
export function toLower(str: ExpressionLike): InstrumentedExpression {
  return fn('TO_LOWER', str);
}

/** ES|QL `TRIM` — removes leading and trailing whitespace. */
export function trim(str: ExpressionLike): InstrumentedExpression {
  return fn('TRIM', str);
}

/** ES|QL `LTRIM` — removes leading whitespace. */
export function ltrim(str: ExpressionLike): InstrumentedExpression {
  return fn('LTRIM', str);
}

/** ES|QL `RTRIM` — removes trailing whitespace. */
export function rtrim(str: ExpressionLike): InstrumentedExpression {
  return fn('RTRIM', str);
}

/** ES|QL `SUBSTRING` — extracts a substring from a string. */
export function substring(
  str: ExpressionLike,
  start: ExpressionLike,
  len?: ExpressionLike
): InstrumentedExpression {
  if (len !== undefined) {
    return fn('SUBSTRING', str, start, len);
  }
  return fn('SUBSTRING', str, start);
}

/** ES|QL `LEFT` — returns the leftmost N characters. */
export function left(str: ExpressionLike, len: ExpressionLike): InstrumentedExpression {
  return fn('LEFT', str, len);
}

/** ES|QL `RIGHT` — returns the rightmost N characters. */
export function right(str: ExpressionLike, len: ExpressionLike): InstrumentedExpression {
  return fn('RIGHT', str, len);
}

/** ES|QL `REPLACE` — replaces occurrences of a pattern with a replacement. */
export function replace(
  str: ExpressionLike,
  pattern: ExpressionLike,
  replacement: ExpressionLike
): InstrumentedExpression {
  return fnLiteral('REPLACE', str, pattern, replacement);
}

/** ES|QL `SPLIT` — splits a string by delimiter. */
export function split(str: ExpressionLike, delimiter: string): InstrumentedExpression {
  return fnLiteral('SPLIT', str, delimiter);
}

/** ES|QL `STARTS_WITH` — returns true if string starts with prefix. */
export function startsWith(str: ExpressionLike, prefix: ExpressionLike): InstrumentedExpression {
  return fnLiteral('STARTS_WITH', str, prefix);
}

/** ES|QL `ENDS_WITH` — returns true if string ends with suffix. */
export function endsWith(str: ExpressionLike, suffix: ExpressionLike): InstrumentedExpression {
  return fnLiteral('ENDS_WITH', str, suffix);
}

/** ES|QL `LOCATE` — returns position of substring in string. */
export function locate(str: ExpressionLike, substr: ExpressionLike): InstrumentedExpression {
  return fnLiteral('LOCATE', str, substr);
}

/** ES|QL `REPEAT` — repeats a string N times. */
export function repeat(str: ExpressionLike, count: ExpressionLike): InstrumentedExpression {
  return fn('REPEAT', str, count);
}

/** ES|QL `REVERSE` — reverses a string. */
export function reverse(str: ExpressionLike): InstrumentedExpression {
  return fn('REVERSE', str);
}

/** ES|QL `SPACE` — returns a string of N spaces. */
export function space(count: ExpressionLike): InstrumentedExpression {
  return fn('SPACE', count);
}

/** ES|QL `TO_BASE64` — encodes string to base64. */
export function toBase64(str: ExpressionLike): InstrumentedExpression {
  return fn('TO_BASE64', str);
}

/** ES|QL `FROM_BASE64` — decodes base64 string. */
export function fromBase64(str: ExpressionLike): InstrumentedExpression {
  return fn('FROM_BASE64', str);
}

/** ES|QL `BIT_LENGTH` — returns length in bits. */
export function bitLength(str: ExpressionLike): InstrumentedExpression {
  return fn('BIT_LENGTH', str);
}

/** ES|QL `BYTE_LENGTH` — returns length in bytes. */
export function byteLength(str: ExpressionLike): InstrumentedExpression {
  return fn('BYTE_LENGTH', str);
}

/** ES|QL `CHUNK` — splits string into chunks of given size. */
export function chunk(str: ExpressionLike, ...rest: ExpressionLike[]): InstrumentedExpression {
  return fn('CHUNK', str, ...rest);
}

/** ES|QL `CONTAINS` — returns true if string contains substring. */
export function contains(str: ExpressionLike, substr: ExpressionLike): InstrumentedExpression {
  return new InstrumentedExpression(`CONTAINS(${renderArg(str)}, ${renderLiteralArg(substr)})`);
}

/** ES|QL `LPAD` — left-pads string to given length with fill character. */
export function lpad(
  str: ExpressionLike,
  len: ExpressionLike,
  fill: ExpressionLike
): InstrumentedExpression {
  return fnLiteral('LPAD', str, len, fill);
}

/** ES|QL `RPAD` — right-pads string to given length with fill character. */
export function rpad(
  str: ExpressionLike,
  len: ExpressionLike,
  fill: ExpressionLike
): InstrumentedExpression {
  return fnLiteral('RPAD', str, len, fill);
}
