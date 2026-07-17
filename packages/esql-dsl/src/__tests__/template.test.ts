/*
 * Copyright Elasticsearch B.V. and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { col } from '../col';
import { InstrumentedExpression } from '../expression';
import { esql } from '../template';

describe('esql template tag', () => {
  it('returns an InstrumentedExpression', () => {
    expect(esql`x > 5`).toBeInstanceOf(InstrumentedExpression);
  });

  it('passes through plain strings unchanged', () => {
    expect(esql`salary > 50000`.toString()).toBe('salary > 50000');
  });

  it('escapes string values', () => {
    expect(esql`name == ${"O'Brien"}`.toString()).toBe('name == "O\'Brien"');
  });

  it('escapes number values', () => {
    expect(esql`salary > ${50000}`.toString()).toBe('salary > 50000');
  });

  it('escapes boolean values', () => {
    expect(esql`active == ${true}`.toString()).toBe('active == true');
  });

  it('escapes null', () => {
    expect(esql`field == ${null}`.toString()).toBe('field == null');
  });

  it('passes through expressions without escaping', () => {
    expect(esql`${col('x')} > ${5}`.toString()).toBe('x > 5');
  });

  it('composes with col() and values', () => {
    const field = 'salary';
    expect(esql`${col(field)} > ${50000}`.toString()).toBe('salary > 50000');
  });

  it('handles injection attempts safely', () => {
    const malicious = '"; DROP TABLE employees; --';
    expect(esql`name == ${malicious}`.toString()).toBe('name == "\\"; DROP TABLE employees; --"');
  });

  it('handles multiple interpolations', () => {
    expect(esql`${col('a')} > ${1} AND ${col('b')} < ${10}`.toString()).toBe('a > 1 AND b < 10');
  });
});
