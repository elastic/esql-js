/*
 * Copyright Elasticsearch B.V. and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { E, f } from '../..';

describe('additional aggregation functions', () => {
  it('absent', () => {
    expect(f.absent('field').toString()).toBe('ABSENT(field)');
  });

  it('present', () => {
    expect(f.present('field').toString()).toBe('PRESENT(field)');
  });

  it('first', () => {
    expect(f.first('field').toString()).toBe('FIRST(field)');
  });

  it('last', () => {
    expect(f.last('field').toString()).toBe('LAST(field)');
  });

  it('stdDev', () => {
    expect(f.stdDev('salary').toString()).toBe('STD_DEV(salary)');
  });

  it('variance', () => {
    expect(f.variance('salary').toString()).toBe('VARIANCE(salary)');
  });

  it('weightedAvg', () => {
    expect(f.weightedAvg('value', 'weight').toString()).toBe('WEIGHTED_AVG(value, weight)');
  });

  it('sample_', () => {
    expect(f.sample_('field').toString()).toBe('SAMPLE(field)');
  });

  it('allFirst', () => {
    expect(f.allFirst('field').toString()).toBe('ALL_FIRST(field)');
  });

  it('allLast', () => {
    expect(f.allLast('field').toString()).toBe('ALL_LAST(field)');
  });

  it('new aggregations support .where()', () => {
    expect(f.stdDev('salary').where(E('active').eq(true)).toString()).toBe(
      'STD_DEV(salary) WHERE active == true'
    );
  });
});
