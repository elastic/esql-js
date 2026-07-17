/*
 * Copyright Elasticsearch B.V. and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { f } from '../..';

describe('additional string functions', () => {
  it('bitLength', () => {
    expect(f.bitLength('field').toString()).toBe('BIT_LENGTH(field)');
  });

  it('byteLength', () => {
    expect(f.byteLength('field').toString()).toBe('BYTE_LENGTH(field)');
  });

  it('chunk', () => {
    expect(f.chunk('text').toString()).toBe('CHUNK(text)');
  });

  it('contains', () => {
    expect(f.contains('message', 'error').toString()).toBe('CONTAINS(message, "error")');
  });
});

describe('additional date functions', () => {
  it('dayName', () => {
    expect(f.dayName('@timestamp').toString()).toBe('DAY_NAME(@timestamp)');
  });

  it('monthName', () => {
    expect(f.monthName('@timestamp').toString()).toBe('MONTH_NAME(@timestamp)');
  });

  it('toDateNanos', () => {
    expect(f.toDateNanos('field').toString()).toBe('TO_DATE_NANOS(field)');
  });

  it('toDateperiod', () => {
    expect(f.toDateperiod('field').toString()).toBe('TO_DATEPERIOD(field)');
  });

  it('toTimeduration', () => {
    expect(f.toTimeduration('field').toString()).toBe('TO_TIMEDURATION(field)');
  });
});

describe('additional math functions', () => {
  it('cosh', () => {
    expect(f.cosh('x').toString()).toBe('COSH(x)');
  });

  it('sinh', () => {
    expect(f.sinh('x').toString()).toBe('SINH(x)');
  });

  it('tanh', () => {
    expect(f.tanh('x').toString()).toBe('TANH(x)');
  });

  it('clamp', () => {
    expect(f.clamp('value', 0, 100).toString()).toBe('CLAMP(value, 0, 100)');
  });

  it('clampMax', () => {
    expect(f.clampMax('value', 100).toString()).toBe('CLAMP_MAX(value, 100)');
  });

  it('clampMin', () => {
    expect(f.clampMin('value', 0).toString()).toBe('CLAMP_MIN(value, 0)');
  });

  it('copySign', () => {
    expect(f.copySign('mag', 'sign').toString()).toBe('COPY_SIGN(mag, sign)');
  });

  it('scalb', () => {
    expect(f.scalb('value', 2).toString()).toBe('SCALB(value, 2)');
  });

  it('toDegrees', () => {
    expect(f.toDegrees('radians').toString()).toBe('TO_DEGREES(radians)');
  });

  it('toRadians', () => {
    expect(f.toRadians('degrees').toString()).toBe('TO_RADIANS(degrees)');
  });

  it('roundTo', () => {
    expect(f.roundTo('value', 10).toString()).toBe('ROUND_TO(value, 10)');
  });
});

describe('additional multivalue functions', () => {
  it('mvContains', () => {
    expect(f.mvContains('tags', 'important').toString()).toBe('MV_CONTAINS(tags, "important")');
  });

  it('mvIntersection', () => {
    expect(f.mvIntersection('a', 'b').toString()).toBe('MV_INTERSECTION(a, b)');
  });

  it('mvMedianAbsoluteDeviation', () => {
    expect(f.mvMedianAbsoluteDeviation('values').toString()).toBe(
      'MV_MEDIAN_ABSOLUTE_DEVIATION(values)'
    );
  });

  it('mvPercentile', () => {
    expect(f.mvPercentile('values', 95).toString()).toBe('MV_PERCENTILE(values, 95)');
  });

  it('mvPseriesWeightedSum', () => {
    expect(f.mvPseriesWeightedSum('values', 2).toString()).toBe(
      'MV_PSERIES_WEIGHTED_SUM(values, 2)'
    );
  });

  it('mvUnion', () => {
    expect(f.mvUnion('a', 'b').toString()).toBe('MV_UNION(a, b)');
  });
});

describe('additional geo functions', () => {
  it('stEnvelope', () => {
    expect(f.stEnvelope('geo').toString()).toBe('ST_ENVELOPE(geo)');
  });

  it('stExtentAgg', () => {
    expect(f.stExtentAgg('geo').toString()).toBe('ST_EXTENT_AGG(geo)');
  });

  it('stNpoints', () => {
    expect(f.stNpoints('geo').toString()).toBe('ST_NPOINTS(geo)');
  });

  it('stSimplify', () => {
    expect(f.stSimplify('geo', 100).toString()).toBe('ST_SIMPLIFY(geo, 100)');
  });

  it('stGeohash', () => {
    expect(f.stGeohash('point', 5).toString()).toBe('ST_GEOHASH(point, 5)');
  });

  it('stGeohashToLong', () => {
    expect(f.stGeohashToLong('hash').toString()).toBe('ST_GEOHASH_TO_LONG(hash)');
  });

  it('stGeohashToString', () => {
    expect(f.stGeohashToString('hash').toString()).toBe('ST_GEOHASH_TO_STRING(hash)');
  });

  it('stGeohex', () => {
    expect(f.stGeohex('point', 5).toString()).toBe('ST_GEOHEX(point, 5)');
  });

  it('stGeohexToLong', () => {
    expect(f.stGeohexToLong('hex').toString()).toBe('ST_GEOHEX_TO_LONG(hex)');
  });

  it('stGeohexToString', () => {
    expect(f.stGeohexToString('hex').toString()).toBe('ST_GEOHEX_TO_STRING(hex)');
  });

  it('stGeotile', () => {
    expect(f.stGeotile('point', 5).toString()).toBe('ST_GEOTILE(point, 5)');
  });

  it('stGeotileToLong', () => {
    expect(f.stGeotileToLong('tile').toString()).toBe('ST_GEOTILE_TO_LONG(tile)');
  });

  it('stGeotileToString', () => {
    expect(f.stGeotileToString('tile').toString()).toBe('ST_GEOTILE_TO_STRING(tile)');
  });

  it('stXmax', () => {
    expect(f.stXmax('geo').toString()).toBe('ST_XMAX(geo)');
  });

  it('stXmin', () => {
    expect(f.stXmin('geo').toString()).toBe('ST_XMIN(geo)');
  });

  it('stYmax', () => {
    expect(f.stYmax('geo').toString()).toBe('ST_YMAX(geo)');
  });

  it('stYmin', () => {
    expect(f.stYmin('geo').toString()).toBe('ST_YMIN(geo)');
  });
});

describe('additional conversion functions', () => {
  it('toAggregateMetricDouble', () => {
    expect(f.toAggregateMetricDouble('field').toString()).toBe('TO_AGGREGATE_METRIC_DOUBLE(field)');
  });

  it('toDenseVector', () => {
    expect(f.toDenseVector('field').toString()).toBe('TO_DENSE_VECTOR(field)');
  });

  it('toGeohash', () => {
    expect(f.toGeohash('field').toString()).toBe('TO_GEOHASH(field)');
  });

  it('toGeohex', () => {
    expect(f.toGeohex('field').toString()).toBe('TO_GEOHEX(field)');
  });

  it('toGeotile', () => {
    expect(f.toGeotile('field').toString()).toBe('TO_GEOTILE(field)');
  });
});
