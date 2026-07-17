/*
 * Copyright Elasticsearch B.V. and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESQL, f } from '../..';

describe('IP and network functions', () => {
  it('cidrMatch with single CIDR', () => {
    expect(f.cidrMatch('ip', '10.0.0.0/8').toString()).toBe('CIDR_MATCH(ip, "10.0.0.0/8")');
  });

  it('cidrMatch with multiple CIDRs', () => {
    expect(f.cidrMatch('ip', '10.0.0.0/8', '172.16.0.0/12').toString()).toBe(
      'CIDR_MATCH(ip, "10.0.0.0/8", "172.16.0.0/12")'
    );
  });

  it('ipPrefix', () => {
    expect(f.ipPrefix('ip_field', 24, 48).toString()).toBe('IP_PREFIX(ip_field, 24, 48)');
  });

  it('networkDirection', () => {
    expect(f.networkDirection('source.ip', 'destination.ip').toString()).toBe(
      'NETWORK_DIRECTION(source.ip, destination.ip)'
    );
  });

  it('works in where clause', () => {
    const q = ESQL.from('logs')
      .where(f.cidrMatch('client.ip', '10.0.0.0/8'))
      .keep('client.ip', 'message');
    expect(q.render()).toBe(
      'FROM logs\n| WHERE CIDR_MATCH(client.ip, "10.0.0.0/8")\n| KEEP client.ip, message'
    );
  });

  it('ipPrefix in eval', () => {
    const q = ESQL.from('logs').eval({ subnet: f.ipPrefix('ip', 24, 48) });
    expect(q.render()).toBe('FROM logs\n| EVAL subnet = IP_PREFIX(ip, 24, 48)');
  });
});
