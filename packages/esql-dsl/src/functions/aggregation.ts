/*
 * Copyright Elasticsearch B.V. and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ExpressionLike } from '@elastic/elasticsearch-query-builder';
import { AggregationExpression } from '../expression';
import { aggFn, renderArg } from '../fn';

/** ES|QL `AVG` — returns the average of a numeric field. */
export function avg(field: ExpressionLike): AggregationExpression {
  return aggFn('AVG', field);
}

/** ES|QL `COUNT` — counts the number of rows (optionally for a field). */
export function count(field: ExpressionLike = '*'): AggregationExpression {
  if (field === '*') {
    return new AggregationExpression('COUNT(*)');
  }
  return aggFn('COUNT', field);
}

/** ES|QL `COUNT_DISTINCT` — counts distinct values of a field. */
export function countDistinct(field: ExpressionLike, precision?: number): AggregationExpression {
  if (precision !== undefined) {
    return aggFn('COUNT_DISTINCT', field, precision);
  }
  return aggFn('COUNT_DISTINCT', field);
}

/** ES|QL `MAX` — returns the maximum value of a field. */
export function max(field: ExpressionLike): AggregationExpression {
  return aggFn('MAX', field);
}

/** ES|QL `MIN` — returns the minimum value of a field. */
export function min(field: ExpressionLike): AggregationExpression {
  return aggFn('MIN', field);
}

/** ES|QL `SUM` — returns the sum of a numeric field. */
export function sum(field: ExpressionLike): AggregationExpression {
  return aggFn('SUM', field);
}

/** ES|QL `MEDIAN` — returns the median of a numeric field. */
export function median(field: ExpressionLike): AggregationExpression {
  return aggFn('MEDIAN', field);
}

/** ES|QL `MEDIAN_ABSOLUTE_DEVIATION` — returns the median absolute deviation of a field. */
export function medianAbsoluteDeviation(field: ExpressionLike): AggregationExpression {
  return aggFn('MEDIAN_ABSOLUTE_DEVIATION', field);
}

/** ES|QL `PERCENTILE` — returns the percentile value of a field at given percentage. */
export function percentile(field: ExpressionLike, p: number): AggregationExpression {
  return aggFn('PERCENTILE', field, p);
}

/** ES|QL `VALUES` — returns all unique values of a field. */
export function values(field: ExpressionLike): AggregationExpression {
  return aggFn('VALUES', field);
}

/** ES|QL `TOP` — returns top N values of a field in given order. */
export function top(
  field: ExpressionLike,
  limit: number,
  order: 'ASC' | 'DESC'
): AggregationExpression {
  return new AggregationExpression(`TOP(${renderArg(field)}, ${limit}, ${order})`);
}

/** ES|QL `ST_CENTROID_AGG` — aggregates geometries to their centroid. */
export function stCentroidAgg(field: ExpressionLike): AggregationExpression {
  return aggFn('ST_CENTROID_AGG', field);
}

/** ES|QL `ABSENT` — returns true when a field has no value. */
export function absent(field: ExpressionLike): AggregationExpression {
  return aggFn('ABSENT', field);
}

/** ES|QL `PRESENT` — returns true when a field has a value. */
export function present(field: ExpressionLike): AggregationExpression {
  return aggFn('PRESENT', field);
}

/** ES|QL `FIRST` — returns the first value of a field. */
export function first(field: ExpressionLike): AggregationExpression {
  return aggFn('FIRST', field);
}

/** ES|QL `LAST` — returns the last value of a field. */
export function last(field: ExpressionLike): AggregationExpression {
  return aggFn('LAST', field);
}

/** ES|QL `STD_DEV` — returns the standard deviation of a numeric field. */
export function stdDev(field: ExpressionLike): AggregationExpression {
  return aggFn('STD_DEV', field);
}

/** ES|QL `VARIANCE` — returns the variance of a numeric field. */
export function variance(field: ExpressionLike): AggregationExpression {
  return aggFn('VARIANCE', field);
}

/** ES|QL `WEIGHTED_AVG` — returns the weighted average of value by weight. */
export function weightedAvg(value: ExpressionLike, weight: ExpressionLike): AggregationExpression {
  return aggFn('WEIGHTED_AVG', value, weight);
}

/** ES|QL `SAMPLE` — returns a sample value of a field. */
export function sample_(field: ExpressionLike): AggregationExpression {
  return aggFn('SAMPLE', field);
}

/** ES|QL `ALL_FIRST` — returns the first value of a field per group. */
export function allFirst(field: ExpressionLike): AggregationExpression {
  return aggFn('ALL_FIRST', field);
}

/** ES|QL `ALL_LAST` — returns the last value of a field per group. */
export function allLast(field: ExpressionLike): AggregationExpression {
  return aggFn('ALL_LAST', field);
}
