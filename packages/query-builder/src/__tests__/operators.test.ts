/*
 * Copyright Elasticsearch B.V. and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { Op, type OpType } from '../operators';

describe('Op symbols', () => {
  const operatorKeys = [
    'eq',
    'ne',
    'gt',
    'gte',
    'lt',
    'lte',
    'is',
    'isNot',
    'like',
    'rlike',
    'in',
    'between',
    'and',
    'or',
    'not',
  ] as const;

  it('defines all 15 operators', () => {
    expect(operatorKeys).toHaveLength(15);
    for (const key of operatorKeys) {
      expect(Op[key]).toBeDefined();
      expect(typeof Op[key]).toBe('symbol');
    }
  });

  it('uses Symbol.for() so symbols are stable across lookups', () => {
    for (const key of operatorKeys) {
      const sym = Op[key];
      const recreated = Symbol.for((sym as symbol).description ?? '');
      expect(sym).toBe(recreated);
    }
  });

  it('each operator has a unique symbol', () => {
    const symbols = new Set(operatorKeys.map((k) => Op[k]));
    expect(symbols.size).toBe(15);
  });

  it('symbol descriptions use elastic.op.* namespace', () => {
    for (const key of operatorKeys) {
      const desc = (Op[key] as symbol).description;
      expect(desc).toMatch(/^elastic\.op\./);
      expect(desc).toBe(`elastic.op.${key}`);
    }
  });

  it('OpType is the type of Op', () => {
    const op: OpType = Op;
    expect(op).toBe(Op);
  });
});
