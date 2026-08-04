/*
 * Copyright Elasticsearch B.V. and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseExpression } from '@elastic/elasticsearch-query-builder';
import { E, InstrumentedExpression } from '../expression';

describe('E()', () => {
  it('creates an expression from a field name', () => {
    expect(E('salary').toString()).toBe('salary');
  });

  it('escapes invalid identifiers', () => {
    expect(E('my field').toString()).toBe('`my field`');
  });

  it('returns an InstrumentedExpression', () => {
    expect(E('x')).toBeInstanceOf(InstrumentedExpression);
  });

  it('is detectable via BaseExpression.isExpression', () => {
    expect(BaseExpression.isExpression(E('x'))).toBe(true);
  });
});

describe('InstrumentedExpression', () => {
  describe('comparison methods', () => {
    it('eq', () => {
      expect(E('salary').eq(50000).toString()).toBe('salary == 50000');
    });

    it('ne', () => {
      expect(E('salary').ne(50000).toString()).toBe('salary != 50000');
    });

    it('gt', () => {
      expect(E('salary').gt(50000).toString()).toBe('salary > 50000');
    });

    it('gte', () => {
      expect(E('salary').gte(50000).toString()).toBe('salary >= 50000');
    });

    it('lt', () => {
      expect(E('salary').lt(50000).toString()).toBe('salary < 50000');
    });

    it('lte', () => {
      expect(E('salary').lte(50000).toString()).toBe('salary <= 50000');
    });

    it('isNull', () => {
      expect(E('name').isNull().toString()).toBe('name IS NULL');
    });

    it('isNotNull', () => {
      expect(E('name').isNotNull().toString()).toBe('name IS NOT NULL');
    });

    it('in with strings', () => {
      expect(E('status').in(['active', 'pending']).toString()).toBe(
        'status IN ("active", "pending")'
      );
    });

    it('in with numbers', () => {
      expect(E('code').in([1, 2, 3]).toString()).toBe('code IN (1, 2, 3)');
    });

    it('between', () => {
      expect(E('age').between(18, 65).toString()).toBe('age >= 18 AND age <= 65');
    });

    it('comparison with string value', () => {
      expect(E('name').eq('John').toString()).toBe('name == "John"');
    });

    it('comparison with boolean value', () => {
      expect(E('active').eq(true).toString()).toBe('active == true');
    });

    it('comparison with null', () => {
      expect(E('field').eq(null).toString()).toBe('field == null');
    });

    it('comparison with expression value', () => {
      expect(E('a').gt(E('b')).toString()).toBe('a > b');
    });
  });

  describe('string methods', () => {
    it('like', () => {
      expect(E('name').like('%John%').toString()).toBe('name LIKE "%John%"');
    });

    it('rlike', () => {
      expect(E('name').rlike('^J.*').toString()).toBe('name RLIKE "^J.*"');
    });

    it('startsWith', () => {
      expect(E('email').startsWith('admin').toString()).toBe('STARTS_WITH(email, "admin")');
    });

    it('endsWith', () => {
      expect(E('email').endsWith('.com').toString()).toBe('ENDS_WITH(email, ".com")');
    });
  });

  describe('arithmetic methods', () => {
    it('add', () => {
      expect(E('salary').add(1000).toString()).toBe('salary + 1000');
    });

    it('sub', () => {
      expect(E('salary').sub(1000).toString()).toBe('salary - 1000');
    });

    it('mul', () => {
      expect(E('salary').mul(1.1).toString()).toBe('salary * 1.1');
    });

    it('div', () => {
      expect(E('salary').div(12).toString()).toBe('salary / 12');
    });

    it('mod', () => {
      expect(E('salary').mod(100).toString()).toBe('salary % 100');
    });

    it('arithmetic with expression value', () => {
      expect(E('salary').add(E('bonus')).toString()).toBe('salary + bonus');
    });
  });

  describe('chaining', () => {
    it('arithmetic then comparison', () => {
      expect(E('salary').mul(12).gt(100000).toString()).toBe('salary * 12 > 100000');
    });

    it('multiple arithmetic operations', () => {
      expect(E('x').add(E('y')).mul(2).toString()).toBe('x + y * 2');
    });

    it('arithmetic with mixed expression and literal', () => {
      expect(E('salary').mul(12).add(E('bonus')).toString()).toBe('salary * 12 + bonus');
    });
  });

  describe('immutability', () => {
    it('methods return new instances', () => {
      const base = E('x');
      const added = base.add(1);
      expect(base.toString()).toBe('x');
      expect(added.toString()).toBe('x + 1');
      expect(base).not.toBe(added);
    });
  });
});
