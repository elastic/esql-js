/*
 * Copyright Elasticsearch B.V. and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { E, f } from '../..';

describe('multi-value functions', () => {
  it('mvAvg', () => {
    expect(f.mvAvg(E('values')).toString()).toBe('MV_AVG(values)');
  });

  it('mvConcat', () => {
    expect(f.mvConcat(E('tags'), ', ').toString()).toBe('MV_CONCAT(tags, ", ")');
  });

  it('mvCount', () => {
    expect(f.mvCount(E('values')).toString()).toBe('MV_COUNT(values)');
  });

  it('mvDedupe', () => {
    expect(f.mvDedupe(E('values')).toString()).toBe('MV_DEDUPE(values)');
  });

  it('mvFirst', () => {
    expect(f.mvFirst(E('values')).toString()).toBe('MV_FIRST(values)');
  });

  it('mvLast', () => {
    expect(f.mvLast(E('values')).toString()).toBe('MV_LAST(values)');
  });

  it('mvMax', () => {
    expect(f.mvMax(E('values')).toString()).toBe('MV_MAX(values)');
  });

  it('mvMin', () => {
    expect(f.mvMin(E('values')).toString()).toBe('MV_MIN(values)');
  });

  it('mvSum', () => {
    expect(f.mvSum(E('values')).toString()).toBe('MV_SUM(values)');
  });

  it('mvSort without order', () => {
    expect(f.mvSort(E('values')).toString()).toBe('MV_SORT(values)');
  });

  it('mvSort with order', () => {
    expect(f.mvSort(E('values'), 'ASC').toString()).toBe('MV_SORT(values, ASC)');
  });

  it('mvSlice with start only', () => {
    expect(f.mvSlice(E('arr'), 0).toString()).toBe('MV_SLICE(arr, 0)');
  });

  it('mvSlice with start and end', () => {
    expect(f.mvSlice(E('arr'), 0, 5).toString()).toBe('MV_SLICE(arr, 0, 5)');
  });

  it('mvMedian', () => {
    expect(f.mvMedian(E('values')).toString()).toBe('MV_MEDIAN(values)');
  });

  it('mvExpand', () => {
    expect(f.mvExpand(E('tags')).toString()).toBe('MV_EXPAND(tags)');
  });

  it('mvZip without separator', () => {
    expect(f.mvZip(E('a'), E('b')).toString()).toBe('MV_ZIP(a, b)');
  });

  it('mvZip with separator', () => {
    expect(f.mvZip(E('a'), E('b'), ':').toString()).toBe('MV_ZIP(a, b, ":")');
  });

  it('mvAppend', () => {
    expect(f.mvAppend(E('a'), E('b')).toString()).toBe('MV_APPEND(a, b)');
  });
});
