/*
 * Copyright Elasticsearch B.V. and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESQL } from '../..';

describe('changePoint AS clause', () => {
  it('renders without AS', () => {
    const q = ESQL.from('metrics').changePoint('cpu_usage').on('host');
    expect(q.render()).toBe('FROM metrics\n| CHANGE_POINT cpu_usage ON host');
  });

  it('renders with AS', () => {
    const q = ESQL.from('metrics')
      .changePoint('cpu_usage')
      .on('host')
      .as_('change_type', 'change_pvalue');
    expect(q.render()).toBe(
      'FROM metrics\n| CHANGE_POINT cpu_usage ON host AS change_type, change_pvalue'
    );
  });

  it('renders AS without ON', () => {
    const q = ESQL.from('metrics').changePoint('cpu_usage').as_('type_col', 'pval_col');
    expect(q.render()).toBe('FROM metrics\n| CHANGE_POINT cpu_usage AS type_col, pval_col');
  });

  it('is immutable', () => {
    const base = ESQL.from('metrics').changePoint('cpu').on('host');
    const c1 = base.as_('t1', 'p1');
    const c2 = base.as_('t2', 'p2');
    expect(c1.render()).toBe('FROM metrics\n| CHANGE_POINT cpu ON host AS t1, p1');
    expect(c2.render()).toBe('FROM metrics\n| CHANGE_POINT cpu ON host AS t2, p2');
  });

  it('chains with subsequent commands', () => {
    const q = ESQL.from('metrics')
      .changePoint('cpu')
      .on('host')
      .as_('type', 'pval')
      .keep('host', 'cpu', 'type', 'pval');
    expect(q.render()).toBe(
      'FROM metrics\n| CHANGE_POINT cpu ON host AS type, pval\n| KEEP host, cpu, type, pval'
    );
  });
});
