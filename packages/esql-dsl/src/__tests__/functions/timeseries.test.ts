/*
 * Copyright Elasticsearch B.V. and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESQL, f } from '../..';

describe('rate/change functions', () => {
  it('rate', () => {
    expect(f.rate('bytes').toString()).toBe('RATE(bytes)');
  });

  it('delta', () => {
    expect(f.delta('value').toString()).toBe('DELTA(value)');
  });

  it('deriv', () => {
    expect(f.deriv('value').toString()).toBe('DERIV(value)');
  });

  it('idelta', () => {
    expect(f.idelta('value').toString()).toBe('IDELTA(value)');
  });

  it('increase', () => {
    expect(f.increase('counter').toString()).toBe('INCREASE(counter)');
  });

  it('irate', () => {
    expect(f.irate('counter').toString()).toBe('IRATE(counter)');
  });

  it('rate in stats', () => {
    const q = ESQL.ts('metrics')
      .stats({ bytes_rate: f.rate('bytes') })
      .by('host');
    expect(q.render()).toBe('TS metrics\n| STATS bytes_rate = RATE(bytes) BY host');
  });
});

describe('time bucketing functions', () => {
  it('tbucket', () => {
    expect(f.tbucket('@timestamp', '1h').toString()).toBe('TBUCKET(@timestamp, 1h)');
  });

  it('trange', () => {
    expect(f.trange('@timestamp', '24h').toString()).toBe('TRANGE(@timestamp, 24h)');
  });
});

describe('over_time aggregation functions', () => {
  it('avgOverTime', () => {
    expect(f.avgOverTime('cpu').toString()).toBe('AVG_OVER_TIME(cpu)');
  });

  it('countOverTime', () => {
    expect(f.countOverTime('events').toString()).toBe('COUNT_OVER_TIME(events)');
  });

  it('countDistinctOverTime', () => {
    expect(f.countDistinctOverTime('user').toString()).toBe('COUNT_DISTINCT_OVER_TIME(user)');
  });

  it('sumOverTime', () => {
    expect(f.sumOverTime('bytes').toString()).toBe('SUM_OVER_TIME(bytes)');
  });

  it('minOverTime', () => {
    expect(f.minOverTime('latency').toString()).toBe('MIN_OVER_TIME(latency)');
  });

  it('maxOverTime', () => {
    expect(f.maxOverTime('latency').toString()).toBe('MAX_OVER_TIME(latency)');
  });

  it('firstOverTime', () => {
    expect(f.firstOverTime('value').toString()).toBe('FIRST_OVER_TIME(value)');
  });

  it('lastOverTime', () => {
    expect(f.lastOverTime('value').toString()).toBe('LAST_OVER_TIME(value)');
  });

  it('percentileOverTime', () => {
    expect(f.percentileOverTime('latency', 99).toString()).toBe(
      'PERCENTILE_OVER_TIME(latency, 99)'
    );
  });

  it('absentOverTime', () => {
    expect(f.absentOverTime('metric').toString()).toBe('ABSENT_OVER_TIME(metric)');
  });

  it('presentOverTime', () => {
    expect(f.presentOverTime('metric').toString()).toBe('PRESENT_OVER_TIME(metric)');
  });

  it('stddevOverTime', () => {
    expect(f.stddevOverTime('value').toString()).toBe('STDDEV_OVER_TIME(value)');
  });

  it('varianceOverTime', () => {
    expect(f.varianceOverTime('value').toString()).toBe('VARIANCE_OVER_TIME(value)');
  });

  it('over_time in stats query', () => {
    const q = ESQL.ts('metrics')
      .stats({ avg_cpu: f.avgOverTime('cpu'), max_mem: f.maxOverTime('memory') })
      .by('host');
    expect(q.render()).toBe(
      'TS metrics\n| STATS avg_cpu = AVG_OVER_TIME(cpu), max_mem = MAX_OVER_TIME(memory) BY host'
    );
  });
});
