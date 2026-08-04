/*
 * Copyright Elasticsearch B.V. and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { E, ESQL } from '../..';

describe('rename', () => {
  it('renders a single rename', () => {
    const q = ESQL.from('employees').rename({ old_name: 'new_name' });
    expect(q.render()).toBe('FROM employees\n| RENAME old_name AS new_name');
  });

  it('renders multiple renames', () => {
    const q = ESQL.from('employees').rename({ first: 'given_name', last: 'surname' });
    expect(q.render()).toBe('FROM employees\n| RENAME first AS given_name, last AS surname');
  });

  it('escapes identifiers that need quoting', () => {
    const q = ESQL.from('employees').rename({ 'my field': 'my-alias' });
    expect(q.render()).toBe('FROM employees\n| RENAME `my field` AS `my-alias`');
  });

  it('chains with subsequent commands', () => {
    const q = ESQL.from('employees').rename({ salary: 'pay' }).where(E('pay').gt(50000)).limit(10);
    expect(q.render()).toBe(
      'FROM employees\n| RENAME salary AS pay\n| WHERE pay > 50000\n| LIMIT 10'
    );
  });

  it('is immutable', () => {
    const base = ESQL.from('employees');
    const r1 = base.rename({ a: 'b' });
    const r2 = base.rename({ x: 'y' });
    expect(r1.render()).toBe('FROM employees\n| RENAME a AS b');
    expect(r2.render()).toBe('FROM employees\n| RENAME x AS y');
  });
});

describe('mvExpand', () => {
  it('renders basic mv_expand', () => {
    const q = ESQL.from('employees').mvExpand('tags');
    expect(q.render()).toBe('FROM employees\n| MV_EXPAND tags');
  });

  it('escapes identifiers that need quoting', () => {
    const q = ESQL.from('employees').mvExpand('my field');
    expect(q.render()).toBe('FROM employees\n| MV_EXPAND `my field`');
  });

  it('chains with subsequent commands', () => {
    const q = ESQL.from('employees').mvExpand('tags').stats({ tag_count: 'COUNT(*)' }).by('tags');
    expect(q.render()).toBe(
      'FROM employees\n| MV_EXPAND tags\n| STATS tag_count = COUNT(*) BY tags'
    );
  });

  it('is immutable', () => {
    const base = ESQL.from('employees');
    const e1 = base.mvExpand('tags');
    const e2 = base.mvExpand('labels');
    expect(e1.render()).toBe('FROM employees\n| MV_EXPAND tags');
    expect(e2.render()).toBe('FROM employees\n| MV_EXPAND labels');
  });
});
