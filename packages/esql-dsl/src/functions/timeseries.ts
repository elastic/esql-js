/*
 * Copyright Elasticsearch B.V. and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ExpressionLike } from '@elastic/elasticsearch-query-builder';
import { type AggregationExpression, InstrumentedExpression } from '../expression';
import { aggFn, renderArg } from '../fn';

/** ES|QL `RATE` — rate of change over time. */
export function rate(field: ExpressionLike): AggregationExpression {
  return aggFn('RATE', field);
}

/** ES|QL `DELTA` — difference between consecutive values. */
export function delta(field: ExpressionLike): AggregationExpression {
  return aggFn('DELTA', field);
}

/** ES|QL `DERIV` — derivative over time. */
export function deriv(field: ExpressionLike): AggregationExpression {
  return aggFn('DERIV', field);
}

/** ES|QL `IDELTA` — integer delta between consecutive values. */
export function idelta(field: ExpressionLike): AggregationExpression {
  return aggFn('IDELTA', field);
}

/** ES|QL `INCREASE` — increase over time window. */
export function increase(field: ExpressionLike): AggregationExpression {
  return aggFn('INCREASE', field);
}

/** ES|QL `IRATE` — instantaneous rate of change. */
export function irate(field: ExpressionLike): AggregationExpression {
  return aggFn('IRATE', field);
}

/** ES|QL `TBUCKET` — buckets timestamp by interval. */
export function tbucket(
  timestamp: ExpressionLike,
  interval: ExpressionLike
): InstrumentedExpression {
  return new InstrumentedExpression(`TBUCKET(${renderArg(timestamp)}, ${interval})`);
}

/** ES|QL `TRANGE` — timestamp range. */
export function trange(timestamp: ExpressionLike, range: ExpressionLike): InstrumentedExpression {
  return new InstrumentedExpression(`TRANGE(${renderArg(timestamp)}, ${range})`);
}

/** ES|QL `AVG_OVER_TIME` — average over time window. */
export function avgOverTime(field: ExpressionLike): AggregationExpression {
  return aggFn('AVG_OVER_TIME', field);
}

/** ES|QL `COUNT_OVER_TIME` — count over time window. */
export function countOverTime(field: ExpressionLike): AggregationExpression {
  return aggFn('COUNT_OVER_TIME', field);
}

/** ES|QL `COUNT_DISTINCT_OVER_TIME` — count distinct over time window. */
export function countDistinctOverTime(field: ExpressionLike): AggregationExpression {
  return aggFn('COUNT_DISTINCT_OVER_TIME', field);
}

/** ES|QL `SUM_OVER_TIME` — sum over time window. */
export function sumOverTime(field: ExpressionLike): AggregationExpression {
  return aggFn('SUM_OVER_TIME', field);
}

/** ES|QL `MIN_OVER_TIME` — minimum over time window. */
export function minOverTime(field: ExpressionLike): AggregationExpression {
  return aggFn('MIN_OVER_TIME', field);
}

/** ES|QL `MAX_OVER_TIME` — maximum over time window. */
export function maxOverTime(field: ExpressionLike): AggregationExpression {
  return aggFn('MAX_OVER_TIME', field);
}

/** ES|QL `FIRST_OVER_TIME` — first value over time window. */
export function firstOverTime(field: ExpressionLike): AggregationExpression {
  return aggFn('FIRST_OVER_TIME', field);
}

/** ES|QL `LAST_OVER_TIME` — last value over time window. */
export function lastOverTime(field: ExpressionLike): AggregationExpression {
  return aggFn('LAST_OVER_TIME', field);
}

/** ES|QL `PERCENTILE_OVER_TIME` — percentile over time window. */
export function percentileOverTime(field: ExpressionLike, p: number): AggregationExpression {
  return aggFn('PERCENTILE_OVER_TIME', field, p);
}

/** ES|QL `ABSENT_OVER_TIME` — returns true when field absent over time. */
export function absentOverTime(field: ExpressionLike): AggregationExpression {
  return aggFn('ABSENT_OVER_TIME', field);
}

/** ES|QL `PRESENT_OVER_TIME` — returns true when field present over time. */
export function presentOverTime(field: ExpressionLike): AggregationExpression {
  return aggFn('PRESENT_OVER_TIME', field);
}

/** ES|QL `STDDEV_OVER_TIME` — standard deviation over time window. */
export function stddevOverTime(field: ExpressionLike): AggregationExpression {
  return aggFn('STDDEV_OVER_TIME', field);
}

/** ES|QL `VARIANCE_OVER_TIME` — variance over time window. */
export function varianceOverTime(field: ExpressionLike): AggregationExpression {
  return aggFn('VARIANCE_OVER_TIME', field);
}
