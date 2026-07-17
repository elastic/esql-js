/*
 * Copyright Elasticsearch B.V. and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { formatIdentifier } from '../identifier';

describe('formatIdentifier', () => {
  it('without allowPatterns, behaves like escapeIdentifier', () => {
    expect(formatIdentifier('name')).toBe('name');
    expect(formatIdentifier('my field')).toBe('`my field`');
  });

  it('with allowPatterns: true, passes through names containing *', () => {
    expect(formatIdentifier('logs-*', { allowPatterns: true })).toBe('logs-*');
    expect(formatIdentifier('metrics-*', { allowPatterns: true })).toBe('metrics-*');
    expect(formatIdentifier('*', { allowPatterns: true })).toBe('*');
  });

  it('with allowPatterns: true, still escapes names without *', () => {
    expect(formatIdentifier('my field', { allowPatterns: true })).toBe('`my field`');
    expect(formatIdentifier('employees', { allowPatterns: true })).toBe('employees');
  });
});
