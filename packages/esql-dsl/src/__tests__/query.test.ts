/*
 * Copyright Elasticsearch B.V. and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { E, ESQL } from '..';

describe('processing commands', () => {
  describe('where', () => {
    it('renders with expression', () => {
      const q = ESQL.from('employees').where(E('salary').gt(50000));
      expect(q.render()).toBe('FROM employees\n| WHERE salary > 50000');
    });

    it('renders with string passthrough', () => {
      const q = ESQL.from('employees').where('salary > 50000');
      expect(q.render()).toBe('FROM employees\n| WHERE salary > 50000');
    });

    it('chains with other commands', () => {
      const q = ESQL.from('employees').where(E('salary').gt(50000)).limit(10);
      expect(q.render()).toBe('FROM employees\n| WHERE salary > 50000\n| LIMIT 10');
    });
  });

  describe('eval', () => {
    it('renders with named expressions (object form)', () => {
      const q = ESQL.from('employees').eval({ bonus: 'salary * 0.1' });
      expect(q.render()).toBe('FROM employees\n| EVAL bonus = salary * 0.1');
    });

    it('renders with InstrumentedExpression values', () => {
      const q = ESQL.from('employees').eval({
        heightFeet: E('height').mul(3.281),
      });
      expect(q.render()).toBe('FROM employees\n| EVAL heightFeet = height * 3.281');
    });

    it('renders with multiple named columns', () => {
      const q = ESQL.from('employees').eval({
        bonus: 'salary * 0.1',
        tax: 'salary * 0.3',
      });
      expect(q.render()).toBe('FROM employees\n| EVAL bonus = salary * 0.1, tax = salary * 0.3');
    });

    it('renders with string passthrough (varargs form)', () => {
      const q = ESQL.from('employees').eval('salary * 12', 'height * 100');
      expect(q.render()).toBe('FROM employees\n| EVAL salary * 12, height * 100');
    });
  });

  describe('stats', () => {
    it('renders basic aggregation', () => {
      const q = ESQL.from('employees').stats({ avg_salary: 'AVG(salary)' });
      expect(q.render()).toBe('FROM employees\n| STATS avg_salary = AVG(salary)');
    });

    it('renders with by clause', () => {
      const q = ESQL.from('employees').stats({ avg_salary: 'AVG(salary)' }).by('dept');
      expect(q.render()).toBe('FROM employees\n| STATS avg_salary = AVG(salary) BY dept');
    });

    it('renders with multiple by columns', () => {
      const q = ESQL.from('employees').stats({ avg_salary: 'AVG(salary)' }).by('dept', 'level');
      expect(q.render()).toBe('FROM employees\n| STATS avg_salary = AVG(salary) BY dept, level');
    });

    it('chains after by()', () => {
      const q = ESQL.from('employees')
        .stats({ avg_salary: 'AVG(salary)' })
        .by('dept')
        .sort('avg_salary DESC')
        .limit(5);
      expect(q.render()).toBe(
        'FROM employees\n| STATS avg_salary = AVG(salary) BY dept\n| SORT avg_salary DESC\n| LIMIT 5'
      );
    });
  });

  describe('sort', () => {
    it('renders single column', () => {
      const q = ESQL.from('employees').sort('salary DESC');
      expect(q.render()).toBe('FROM employees\n| SORT salary DESC');
    });

    it('renders multiple columns', () => {
      const q = ESQL.from('employees').sort('dept ASC', 'salary DESC');
      expect(q.render()).toBe('FROM employees\n| SORT dept ASC, salary DESC');
    });
  });

  describe('limit', () => {
    it('renders limit', () => {
      const q = ESQL.from('employees').limit(10);
      expect(q.render()).toBe('FROM employees\n| LIMIT 10');
    });
  });

  describe('keep', () => {
    it('renders with column names', () => {
      const q = ESQL.from('employees').keep('a', 'b', 'c');
      expect(q.render()).toBe('FROM employees\n| KEEP a, b, c');
    });

    it('preserves wildcard patterns', () => {
      const q = ESQL.from('employees').keep('emp_no', 'first_*');
      expect(q.render()).toBe('FROM employees\n| KEEP emp_no, first_*');
    });
  });

  describe('drop', () => {
    it('renders single column', () => {
      const q = ESQL.from('employees').drop('x');
      expect(q.render()).toBe('FROM employees\n| DROP x');
    });

    it('renders multiple columns', () => {
      const q = ESQL.from('employees').drop('a', 'b');
      expect(q.render()).toBe('FROM employees\n| DROP a, b');
    });

    it('preserves wildcard patterns', () => {
      const q = ESQL.from('employees').drop('temp_*');
      expect(q.render()).toBe('FROM employees\n| DROP temp_*');
    });
  });

  describe('full pipeline chaining', () => {
    it('chains multiple processing commands', () => {
      const q = ESQL.from('employees')
        .where(E('salary').gt(50000))
        .eval({ bonus: 'salary * 0.1' })
        .keep('emp_no', 'salary', 'bonus')
        .sort('salary DESC')
        .limit(10);
      expect(q.render()).toBe(
        'FROM employees\n| WHERE salary > 50000\n| EVAL bonus = salary * 0.1\n| KEEP emp_no, salary, bonus\n| SORT salary DESC\n| LIMIT 10'
      );
    });

    it('preserves immutability when branching', () => {
      const base = ESQL.from('employees').where(E('salary').gt(50000));
      const a = base.limit(10);
      const b = base.limit(20);
      expect(a.render()).toBe('FROM employees\n| WHERE salary > 50000\n| LIMIT 10');
      expect(b.render()).toBe('FROM employees\n| WHERE salary > 50000\n| LIMIT 20');
    });

    it('works with ROW source', () => {
      const q = ESQL.row({ x: 1, y: 2 }).eval({ sum: 'x + y' });
      expect(q.render()).toBe('ROW x = 1, y = 2\n| EVAL sum = x + y');
    });

    it('works with metadata chaining', () => {
      const q = ESQL.from('logs').metadata('_id', '_version').where('status = 200').limit(5);
      expect(q.render()).toBe('FROM logs METADATA _id, _version\n| WHERE status = 200\n| LIMIT 5');
    });
  });
});
