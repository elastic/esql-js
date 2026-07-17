/*
 * Copyright Elasticsearch B.V. and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { E, ESQL } from '../..';

describe('enrich', () => {
  it('renders basic enrich', () => {
    const q = ESQL.from('logs').enrich('ip_lookup');
    expect(q.render()).toBe('FROM logs\n| ENRICH ip_lookup');
  });

  it('renders enrich with ON', () => {
    const q = ESQL.from('logs').enrich('ip_lookup').on('client.ip');
    expect(q.render()).toBe('FROM logs\n| ENRICH ip_lookup ON client.ip');
  });

  it('renders enrich with ON and WITH', () => {
    const q = ESQL.from('logs').enrich('ip_lookup').on('client.ip').with('geo.city', 'geo.country');
    expect(q.render()).toBe(
      'FROM logs\n| ENRICH ip_lookup ON client.ip WITH geo.city, geo.country'
    );
  });

  it('renders enrich with WITH only', () => {
    const q = ESQL.from('logs').enrich('ip_lookup').with('geo.city');
    expect(q.render()).toBe('FROM logs\n| ENRICH ip_lookup WITH geo.city');
  });

  it('chains with subsequent commands', () => {
    const q = ESQL.from('logs')
      .enrich('ip_lookup')
      .on('client.ip')
      .with('geo.city')
      .keep('message', 'geo.city')
      .limit(10);
    expect(q.render()).toBe(
      'FROM logs\n| ENRICH ip_lookup ON client.ip WITH geo.city\n| KEEP message, geo.city\n| LIMIT 10'
    );
  });
});

describe('dissect', () => {
  it('renders basic dissect', () => {
    const q = ESQL.from('logs').dissect('message', '%{timestamp} %{level} %{msg}');
    expect(q.render()).toBe('FROM logs\n| DISSECT message "%{timestamp} %{level} %{msg}"');
  });

  it('renders dissect with expression input', () => {
    const q = ESQL.from('logs').dissect(E('message'), '%{ts} %{lvl}');
    expect(q.render()).toBe('FROM logs\n| DISSECT message "%{ts} %{lvl}"');
  });

  it('renders dissect with append separator', () => {
    const q = ESQL.from('logs').dissect('message', '%{a} %{b}', '-');
    expect(q.render()).toBe('FROM logs\n| DISSECT message "%{a} %{b}" APPEND_SEPARATOR="-"');
  });

  it('chains with subsequent commands', () => {
    const q = ESQL.from('logs')
      .dissect('message', '%{ts} %{level} %{msg}')
      .keep('ts', 'level', 'msg');
    expect(q.render()).toBe(
      'FROM logs\n| DISSECT message "%{ts} %{level} %{msg}"\n| KEEP ts, level, msg'
    );
  });
});

describe('grok', () => {
  it('renders basic grok', () => {
    const q = ESQL.from('logs').grok('message', '%{TIMESTAMP_ISO8601:timestamp} %{LOGLEVEL:level}');
    expect(q.render()).toBe(
      'FROM logs\n| GROK message "%{TIMESTAMP_ISO8601:timestamp} %{LOGLEVEL:level}"'
    );
  });

  it('renders grok with expression input', () => {
    const q = ESQL.from('logs').grok(E('message'), '%{IP:client}');
    expect(q.render()).toBe('FROM logs\n| GROK message "%{IP:client}"');
  });

  it('chains with subsequent commands', () => {
    const q = ESQL.from('logs')
      .grok('message', '%{IP:client}')
      .where(E('client').isNotNull())
      .limit(100);
    expect(q.render()).toBe(
      'FROM logs\n| GROK message "%{IP:client}"\n| WHERE client IS NOT NULL\n| LIMIT 100'
    );
  });
});
