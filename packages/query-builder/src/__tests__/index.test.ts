/*
 * Copyright Elasticsearch B.V. and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  escapeIdentifier,
  escapeValue,
  isValidIdentifier,
  Op,
  type OpType,
  VERSION,
} from '../index';

describe('query-builder', () => {
  it('should export VERSION', () => {
    expect(VERSION).toBe('0.0.1');
  });

  it('should export Op from index', () => {
    expect(Op.eq).toBeDefined();
    expect(Op.gt).toBeDefined();
    expect(typeof Op.eq).toBe('symbol');
  });

  it('OpType is usable as type', () => {
    const _op: OpType = Op;
    expect(_op).toBe(Op);
  });

  it('should export escaping utilities from index', () => {
    expect(escapeValue("O'Brien")).toBe('"O\'Brien"');
    expect(isValidIdentifier('salary')).toBe(true);
    expect(escapeIdentifier('my field')).toBe('`my field`');
  });
});
