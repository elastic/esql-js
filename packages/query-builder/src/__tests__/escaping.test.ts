/*
 * Copyright Elasticsearch B.V. and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { escapeIdentifier, escapeValue, isValidIdentifier } from '../escaping';

describe('escapeValue', () => {
  it('returns "null" for null', () => {
    expect(escapeValue(null)).toBe('null');
  });

  it('returns string representation for booleans', () => {
    expect(escapeValue(true)).toBe('true');
    expect(escapeValue(false)).toBe('false');
  });

  it('returns string representation for numbers', () => {
    expect(escapeValue(0)).toBe('0');
    expect(escapeValue(42)).toBe('42');
    expect(escapeValue(3.14)).toBe('3.14');
    expect(escapeValue(-1)).toBe('-1');
  });

  it('escapes strings with JSON.stringify (handles quotes and special chars)', () => {
    expect(escapeValue("O'Brien")).toBe('"O\'Brien"');
    expect(escapeValue('say "hello"')).toBe('"say \\"hello\\""');
    expect(escapeValue('')).toBe('""');
    expect(escapeValue('line\nbreak')).toBe('"line\\nbreak"');
  });

  it('wraps Date in quotes as ISO string', () => {
    const d = new Date('2024-01-15T12:00:00.000Z');
    expect(escapeValue(d)).toBe('"2024-01-15T12:00:00.000Z"');
  });

  it('recursively escapes arrays', () => {
    expect(escapeValue([1, 2, 3])).toBe('[1, 2, 3]');
    expect(escapeValue(['a', 'b'])).toBe('["a", "b"]');
    expect(escapeValue([1, 'two', true, null])).toBe('[1, "two", true, null]');
  });

  it('handles nested arrays', () => {
    expect(escapeValue([[1, 2], [3]])).toBe('[[1, 2], [3]]');
  });

  it('handles objects via JSON.stringify', () => {
    expect(escapeValue({ a: 1 })).toBe('{"a":1}');
  });
});

describe('isValidIdentifier', () => {
  it('accepts simple identifiers', () => {
    expect(isValidIdentifier('name')).toBe(true);
    expect(isValidIdentifier('_private')).toBe(true);
    expect(isValidIdentifier('field1')).toBe(true);
    expect(isValidIdentifier('@timestamp')).toBe(true);
    expect(isValidIdentifier('employee.department')).toBe(true);
  });

  it('rejects empty string', () => {
    expect(isValidIdentifier('')).toBe(false);
  });

  it('rejects identifiers starting with digit', () => {
    expect(isValidIdentifier('1field')).toBe(false);
  });

  it('rejects identifiers with spaces or special chars', () => {
    expect(isValidIdentifier('my field')).toBe(false);
    expect(isValidIdentifier('my-field')).toBe(false);
    expect(isValidIdentifier('my.field.name')).toBe(true);
  });

  it('rejects SQL injection attempts', () => {
    expect(isValidIdentifier('; DROP TABLE x')).toBe(false);
    expect(isValidIdentifier('name;--')).toBe(false);
  });

  it('rejects unicode (regex is ASCII per ES|QL spec)', () => {
    expect(isValidIdentifier('café')).toBe(false);
  });
});

describe('escapeIdentifier', () => {
  it('returns valid identifiers unchanged', () => {
    expect(escapeIdentifier('salary')).toBe('salary');
    expect(escapeIdentifier('_id')).toBe('_id');
    expect(escapeIdentifier('@timestamp')).toBe('@timestamp');
    expect(escapeIdentifier('user.name')).toBe('user.name');
  });

  it('wraps invalid identifiers in backticks', () => {
    expect(escapeIdentifier('my field')).toBe('`my field`');
  });

  it('doubles internal backticks and wraps in backticks', () => {
    expect(escapeIdentifier('`quoted`')).toBe('```quoted```');
    expect(escapeIdentifier('col`umn')).toBe('`col``umn`');
  });

  it('handles identifier with spaces', () => {
    expect(escapeIdentifier('my field')).toBe('`my field`');
  });
});
