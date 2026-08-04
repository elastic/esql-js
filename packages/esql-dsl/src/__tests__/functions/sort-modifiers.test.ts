/*
 * Copyright Elasticsearch B.V. and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { E, ESQL } from '../..';

describe('expression sort modifiers', () => {
  it('asc', () => {
    expect(E('name').asc().toString()).toBe('name ASC');
  });

  it('desc', () => {
    expect(E('salary').desc().toString()).toBe('salary DESC');
  });

  it('nullsFirst', () => {
    expect(E('name').nullsFirst().toString()).toBe('name NULLS FIRST');
  });

  it('nullsLast', () => {
    expect(E('name').nullsLast().toString()).toBe('name NULLS LAST');
  });

  it('asc + nullsFirst', () => {
    expect(E('name').asc().nullsFirst().toString()).toBe('name ASC NULLS FIRST');
  });

  it('desc + nullsLast', () => {
    expect(E('salary').desc().nullsLast().toString()).toBe('salary DESC NULLS LAST');
  });

  it('works with sort command', () => {
    const q = ESQL.from('employees').sort(E('salary').desc(), E('name').asc().nullsLast());
    expect(q.render()).toBe('FROM employees\n| SORT salary DESC, name ASC NULLS LAST');
  });
});
