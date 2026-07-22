/*
 * Copyright Elasticsearch B.V. and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Escapes a value for safe use in ES|QL literals.
 * Uses JSON.stringify for strings (escapes quotes, backslashes, etc.).
 */
export function escapeValue(value: unknown): string {
  if (value === null) {
    return 'null';
  }
  if (typeof value === 'boolean') {
    return value.toString();
  }
  if (typeof value === 'number') {
    return value.toString();
  }
  if (value instanceof Date) {
    return `"${value.toISOString()}"`;
  }
  if (Array.isArray(value)) {
    return `[${value.map(escapeValue).join(', ')}]`;
  }
  return JSON.stringify(value);
}

/** ES|QL identifier pattern: must start with letter, underscore, or @; then letters, digits, underscore, or dot. */
const IDENTIFIER_REGEX = /^[a-zA-Z_@][a-zA-Z0-9_.]*$/;

/**
 * Returns true if the string is a valid ES|QL identifier (no backtick wrapping needed).
 */
export function isValidIdentifier(name: string): boolean {
  return IDENTIFIER_REGEX.test(name);
}

/**
 * Escapes an identifier for safe use in ES|QL.
 * Valid identifiers are returned as-is; others are wrapped in backticks with internal backticks doubled.
 */
export function escapeIdentifier(name: string): string {
  if (isValidIdentifier(name)) {
    return name;
  }
  return `\`${name.replace(/`/g, '``')}\``;
}
