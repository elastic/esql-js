/*
 * Copyright Elasticsearch B.V. and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { E, ESQL } from '../..';

describe('lookupJoin', () => {
  it('renders basic lookup join', () => {
    const q = ESQL.from('logs').lookupJoin('threat_list');
    expect(q.render()).toBe('FROM logs\n| LOOKUP JOIN threat_list');
  });

  it('renders lookup join with ON', () => {
    const q = ESQL.from('logs').lookupJoin('threat_list').on('source.ip');
    expect(q.render()).toBe('FROM logs\n| LOOKUP JOIN threat_list ON source.ip');
  });

  it('escapes identifiers that need quoting', () => {
    const q = ESQL.from('logs').lookupJoin('my-index').on('my field');
    expect(q.render()).toBe('FROM logs\n| LOOKUP JOIN `my-index` ON `my field`');
  });

  it('chains with subsequent commands', () => {
    const q = ESQL.from('logs')
      .lookupJoin('threat_list')
      .on('source.ip')
      .where(E('threat_level').gt(3))
      .keep('source.ip', 'threat_level')
      .limit(100);
    expect(q.render()).toBe(
      'FROM logs\n| LOOKUP JOIN threat_list ON source.ip\n| WHERE threat_level > 3\n| KEEP source.ip, threat_level\n| LIMIT 100'
    );
  });

  it('is immutable', () => {
    const base = ESQL.from('logs').lookupJoin('threat_list');
    const j1 = base.on('ip');
    const j2 = base.on('host');
    expect(j1.render()).toBe('FROM logs\n| LOOKUP JOIN threat_list ON ip');
    expect(j2.render()).toBe('FROM logs\n| LOOKUP JOIN threat_list ON host');
  });
});
