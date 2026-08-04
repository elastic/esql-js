/*
 * Copyright Elasticsearch B.V. and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { col } from '../col';
import { InstrumentedExpression } from '../expression';

describe('col()', () => {
  it('creates an expression from a column name', () => {
    expect(col('salary').toString()).toBe('salary');
  });

  it('escapes invalid identifiers', () => {
    expect(col('my field').toString()).toBe('`my field`');
  });

  it('returns an InstrumentedExpression', () => {
    expect(col('x')).toBeInstanceOf(InstrumentedExpression);
  });

  it('supports chaining like E()', () => {
    expect(col('salary').gt(50000).toString()).toBe('salary > 50000');
  });
});
