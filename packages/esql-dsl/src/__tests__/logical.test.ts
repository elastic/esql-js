/*
 * Copyright Elasticsearch B.V. and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { E, InstrumentedExpression } from '../expression';
import { and_, not_, or_ } from '../logical';

describe('logical operators', () => {
  describe('and_()', () => {
    it('combines two expressions', () => {
      expect(and_(E('x').gt(5), E('y').lt(10)).toString()).toBe('(x > 5) AND (y < 10)');
    });

    it('combines three expressions', () => {
      expect(and_(E('a').eq(1), E('b').eq(2), E('c').eq(3)).toString()).toBe(
        '(a == 1) AND (b == 2) AND (c == 3)'
      );
    });

    it('returns an InstrumentedExpression', () => {
      expect(and_(E('x').gt(5), E('y').lt(10))).toBeInstanceOf(InstrumentedExpression);
    });
  });

  describe('or_()', () => {
    it('combines two expressions', () => {
      expect(or_(E('a').eq(1), E('b').eq(2)).toString()).toBe('(a == 1) OR (b == 2)');
    });

    it('combines three expressions', () => {
      expect(or_(E('a').eq(1), E('b').eq(2), E('c').eq(3)).toString()).toBe(
        '(a == 1) OR (b == 2) OR (c == 3)'
      );
    });
  });

  describe('not_()', () => {
    it('negates an expression', () => {
      expect(not_(E('active').eq(true)).toString()).toBe('NOT (active == true)');
    });
  });

  describe('nesting', () => {
    it('and_ with nested or_', () => {
      expect(and_(E('x').gt(5), or_(E('a').eq(1), E('b').eq(2))).toString()).toBe(
        '(x > 5) AND ((a == 1) OR (b == 2))'
      );
    });

    it('complex nesting', () => {
      expect(
        and_(
          E('salary').gt(50000),
          or_(E('dept').eq('Engineering'), E('dept').eq('Product')),
          not_(E('contractor').eq(true))
        ).toString()
      ).toBe(
        '(salary > 50000) AND ((dept == "Engineering") OR (dept == "Product")) AND (NOT (contractor == true))'
      );
    });
  });
});
