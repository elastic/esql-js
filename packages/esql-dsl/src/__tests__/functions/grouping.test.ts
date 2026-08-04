/*
 * Copyright Elasticsearch B.V. and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESQL, f } from '../..';

describe('grouping functions', () => {
  it('bucket with field and size', () => {
    expect(f.bucket('salary', 10000).toString()).toBe('BUCKET(salary, 10000)');
  });

  it('categorize', () => {
    expect(f.categorize('message').toString()).toBe('CATEGORIZE(message)');
  });

  it('bucket in stats by', () => {
    const q = ESQL.from('employees').stats({ total: f.count() }).by(f.bucket('salary', 10000));
    expect(q.render()).toBe('FROM employees\n| STATS total = COUNT(*) BY BUCKET(salary, 10000)');
  });

  it('categorize in stats by', () => {
    const q = ESQL.from('logs').stats({ total: f.count() }).by(f.categorize('message'));
    expect(q.render()).toBe('FROM logs\n| STATS total = COUNT(*) BY CATEGORIZE(message)');
  });
});
