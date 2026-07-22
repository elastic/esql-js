/*
 * Copyright Elasticsearch B.V. and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESQL, f } from '../..';

describe('inlineStats', () => {
  it('renders basic inline stats', () => {
    const q = ESQL.from('data').inlineStats({ avg_val: f.avg('value') });
    expect(q.render()).toBe('FROM data\n| INLINESTATS avg_val = AVG(value)');
  });

  it('renders inline stats with BY', () => {
    const q = ESQL.from('data')
      .inlineStats({ avg_val: f.avg('value') })
      .by('category');
    expect(q.render()).toBe('FROM data\n| INLINESTATS avg_val = AVG(value) BY category');
  });

  it('renders inline stats with multiple aggregations', () => {
    const q = ESQL.from('data').inlineStats({
      avg_val: f.avg('value'),
      total: f.sum('value'),
    });
    expect(q.render()).toBe('FROM data\n| INLINESTATS avg_val = AVG(value), total = SUM(value)');
  });

  it('chains with subsequent commands', () => {
    const q = ESQL.from('data')
      .inlineStats({ avg_val: f.avg('value') })
      .by('category')
      .where('value > avg_val');
    expect(q.render()).toBe(
      'FROM data\n| INLINESTATS avg_val = AVG(value) BY category\n| WHERE value > avg_val'
    );
  });
});

describe('changePoint', () => {
  it('renders basic change point', () => {
    const q = ESQL.from('metrics').changePoint('cpu_usage');
    expect(q.render()).toBe('FROM metrics\n| CHANGE_POINT cpu_usage');
  });

  it('renders change point with ON', () => {
    const q = ESQL.from('metrics').changePoint('cpu_usage').on('host');
    expect(q.render()).toBe('FROM metrics\n| CHANGE_POINT cpu_usage ON host');
  });

  it('chains with subsequent commands', () => {
    const q = ESQL.from('metrics')
      .changePoint('cpu_usage')
      .on('host')
      .keep('host', 'cpu_usage', 'type');
    expect(q.render()).toBe(
      'FROM metrics\n| CHANGE_POINT cpu_usage ON host\n| KEEP host, cpu_usage, type'
    );
  });

  it('is immutable', () => {
    const base = ESQL.from('metrics').changePoint('cpu_usage');
    const c1 = base.on('host');
    const c2 = base.on('region');
    expect(c1.render()).toBe('FROM metrics\n| CHANGE_POINT cpu_usage ON host');
    expect(c2.render()).toBe('FROM metrics\n| CHANGE_POINT cpu_usage ON region');
  });
});

describe('sample', () => {
  it('renders sample with probability', () => {
    const q = ESQL.from('logs').sample(0.1);
    expect(q.render()).toBe('FROM logs\n| SAMPLE 0.1');
  });

  it('renders sample with 100%', () => {
    const q = ESQL.from('logs').sample(1);
    expect(q.render()).toBe('FROM logs\n| SAMPLE 1');
  });

  it('chains with subsequent commands', () => {
    const q = ESQL.from('logs')
      .sample(0.1)
      .stats({ total: f.count('*') });
    expect(q.render()).toBe('FROM logs\n| SAMPLE 0.1\n| STATS total = COUNT(*)');
  });
});
