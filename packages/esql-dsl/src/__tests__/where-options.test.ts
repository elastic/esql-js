/*
 * Copyright Elasticsearch B.V. and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { Op } from '@elastic/elasticsearch-query-builder';
import { E, ESQL } from '..';
import { renderWhereOptions } from '../where-options';

describe('renderWhereOptions', () => {
  it('implicit equality', () => {
    expect(renderWhereOptions({ salary: 50000 })).toBe('salary == 50000');
  });

  it('implicit equality with string value', () => {
    expect(renderWhereOptions({ department: 'Engineering' })).toBe('department == "Engineering"');
  });

  it('single operator', () => {
    expect(renderWhereOptions({ salary: { [Op.gt]: 50000 } })).toBe('salary > 50000');
  });

  it('multiple operators on same field', () => {
    const result = renderWhereOptions({
      salary: { [Op.gt]: 50000, [Op.lt]: 100000 },
    });
    expect(result).toBe('salary > 50000 AND salary < 100000');
  });

  it('all comparison operators', () => {
    expect(renderWhereOptions({ x: { [Op.eq]: 1 } })).toBe('x == 1');
    expect(renderWhereOptions({ x: { [Op.ne]: 1 } })).toBe('x != 1');
    expect(renderWhereOptions({ x: { [Op.gt]: 1 } })).toBe('x > 1');
    expect(renderWhereOptions({ x: { [Op.gte]: 1 } })).toBe('x >= 1');
    expect(renderWhereOptions({ x: { [Op.lt]: 1 } })).toBe('x < 1');
    expect(renderWhereOptions({ x: { [Op.lte]: 1 } })).toBe('x <= 1');
  });

  it('like and rlike operators', () => {
    expect(renderWhereOptions({ name: { [Op.like]: '%john%' } })).toBe('name LIKE "%john%"');
    expect(renderWhereOptions({ name: { [Op.rlike]: '.*john.*' } })).toBe('name RLIKE ".*john.*"');
  });

  it('is and isNot operators', () => {
    expect(renderWhereOptions({ status: { [Op.is]: null } })).toBe('status IS null');
    expect(renderWhereOptions({ status: { [Op.isNot]: null } })).toBe('status IS NOT null');
  });

  it('in operator', () => {
    expect(renderWhereOptions({ dept: { [Op.in]: ['A', 'B', 'C'] } })).toBe(
      'dept IN ("A", "B", "C")'
    );
  });

  it('between operator', () => {
    expect(renderWhereOptions({ age: { [Op.between]: [18, 65] } })).toBe('age >= 18 AND age <= 65');
  });

  it('Op.or at top level', () => {
    const result = renderWhereOptions({
      [Op.or]: [{ status: 'active' }, { status: 'pending' }],
    });
    expect(result).toBe('(status == "active") OR (status == "pending")');
  });

  it('Op.and at top level', () => {
    const result = renderWhereOptions({
      [Op.and]: [{ x: 1 }, { y: 2 }],
    });
    expect(result).toBe('(x == 1) AND (y == 2)');
  });

  it('Op.not at top level', () => {
    const result = renderWhereOptions({
      [Op.not]: { status: 'deleted' },
    });
    expect(result).toBe('NOT (status == "deleted")');
  });

  it('mixed fields and logical operators', () => {
    const result = renderWhereOptions({
      salary: { [Op.gt]: 50000, [Op.lt]: 100000 },
      department: 'Engineering',
      [Op.or]: [{ status: 'active' }, { status: 'pending' }],
    });
    expect(result).toBe(
      'salary > 50000 AND salary < 100000 AND department == "Engineering" AND (status == "active") OR (status == "pending")'
    );
  });

  it('with InstrumentedExpression value', () => {
    const result = renderWhereOptions({ salary: E('bonus').mul(2) });
    expect(result).toBe('salary == bonus * 2');
  });

  it('null value uses implicit equality', () => {
    expect(renderWhereOptions({ x: null })).toBe('x == null');
  });

  it('boolean value', () => {
    expect(renderWhereOptions({ active: true })).toBe('active == true');
  });
});

describe('where() with POJO syntax', () => {
  it('renders simple POJO condition', () => {
    const q = ESQL.from('employees').where({ salary: 50000 });
    expect(q.render()).toBe('FROM employees\n| WHERE salary == 50000');
  });

  it('renders POJO with operators', () => {
    const q = ESQL.from('employees').where({
      salary: { [Op.gt]: 50000 },
    });
    expect(q.render()).toBe('FROM employees\n| WHERE salary > 50000');
  });

  it('renders complex POJO with logical ops', () => {
    const q = ESQL.from('employees').where({
      salary: { [Op.gt]: 50000, [Op.lt]: 100000 },
      department: 'Engineering',
      [Op.or]: [{ status: 'active' }, { status: 'pending' }],
    });
    expect(q.render()).toBe(
      'FROM employees\n| WHERE salary > 50000 AND salary < 100000 AND department == "Engineering" AND (status == "active") OR (status == "pending")'
    );
  });

  it('still works with string passthrough', () => {
    const q = ESQL.from('employees').where('salary > 50000');
    expect(q.render()).toBe('FROM employees\n| WHERE salary > 50000');
  });

  it('still works with InstrumentedExpression', () => {
    const q = ESQL.from('employees').where(E('salary').gt(50000));
    expect(q.render()).toBe('FROM employees\n| WHERE salary > 50000');
  });
});
