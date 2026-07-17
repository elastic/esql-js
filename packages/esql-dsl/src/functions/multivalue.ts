/*
 * Copyright Elasticsearch B.V. and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ExpressionLike } from '@elastic/elasticsearch-query-builder';
import { InstrumentedExpression } from '../expression';
import { fn, fnLiteral, renderArg, renderLiteralArg } from '../fn';

/** ES|QL `MV_AVG` — average of multivalued field. */
export function mvAvg(field: ExpressionLike): InstrumentedExpression {
  return fn('MV_AVG', field);
}

/** ES|QL `MV_CONCAT` — concatenates multivalue with separator. */
export function mvConcat(field: ExpressionLike, separator: string): InstrumentedExpression {
  return fnLiteral('MV_CONCAT', field, separator);
}

/** ES|QL `MV_COUNT` — count of values in multivalued field. */
export function mvCount(field: ExpressionLike): InstrumentedExpression {
  return fn('MV_COUNT', field);
}

/** ES|QL `MV_DEDUPE` — removes duplicate values from multivalue. */
export function mvDedupe(field: ExpressionLike): InstrumentedExpression {
  return fn('MV_DEDUPE', field);
}

/** ES|QL `MV_FIRST` — first value of multivalued field. */
export function mvFirst(field: ExpressionLike): InstrumentedExpression {
  return fn('MV_FIRST', field);
}

/** ES|QL `MV_LAST` — last value of multivalued field. */
export function mvLast(field: ExpressionLike): InstrumentedExpression {
  return fn('MV_LAST', field);
}

/** ES|QL `MV_MAX` — maximum of multivalued field. */
export function mvMax(field: ExpressionLike): InstrumentedExpression {
  return fn('MV_MAX', field);
}

/** ES|QL `MV_MIN` — minimum of multivalued field. */
export function mvMin(field: ExpressionLike): InstrumentedExpression {
  return fn('MV_MIN', field);
}

/** ES|QL `MV_SUM` — sum of multivalued field. */
export function mvSum(field: ExpressionLike): InstrumentedExpression {
  return fn('MV_SUM', field);
}

/** ES|QL `MV_SORT` — sorts multivalued field. */
export function mvSort(field: ExpressionLike, order?: 'ASC' | 'DESC'): InstrumentedExpression {
  if (order) {
    return fn('MV_SORT', field, order);
  }
  return fn('MV_SORT', field);
}

/** ES|QL `MV_SLICE` — slices multivalue from start to end. */
export function mvSlice(
  field: ExpressionLike,
  start: ExpressionLike,
  end?: ExpressionLike
): InstrumentedExpression {
  if (end !== undefined) {
    return fn('MV_SLICE', field, start, end);
  }
  return fn('MV_SLICE', field, start);
}

/** ES|QL `MV_MEDIAN` — median of multivalued field. */
export function mvMedian(field: ExpressionLike): InstrumentedExpression {
  return fn('MV_MEDIAN', field);
}

/** ES|QL `MV_EXPAND` — expands multivalue into separate rows. */
export function mvExpand(field: ExpressionLike): InstrumentedExpression {
  return fn('MV_EXPAND', field);
}

/** ES|QL `MV_ZIP` — zips two multivalues with optional separator. */
export function mvZip(
  left: ExpressionLike,
  right: ExpressionLike,
  separator?: string
): InstrumentedExpression {
  if (separator !== undefined) {
    return fnLiteral('MV_ZIP', left, right, separator);
  }
  return fn('MV_ZIP', left, right);
}

/** ES|QL `MV_APPEND` — appends one multivalue to another. */
export function mvAppend(left: ExpressionLike, right: ExpressionLike): InstrumentedExpression {
  return fn('MV_APPEND', left, right);
}

/** ES|QL `MV_CONTAINS` — returns true if multivalue contains value. */
export function mvContains(field: ExpressionLike, value: ExpressionLike): InstrumentedExpression {
  return new InstrumentedExpression(`MV_CONTAINS(${renderArg(field)}, ${renderLiteralArg(value)})`);
}

/** ES|QL `MV_INTERSECTION` — intersection of two multivalues. */
export function mvIntersection(
  left: ExpressionLike,
  right: ExpressionLike
): InstrumentedExpression {
  return fn('MV_INTERSECTION', left, right);
}

/** ES|QL `MV_MEDIAN_ABSOLUTE_DEVIATION` — median absolute deviation of multivalue. */
export function mvMedianAbsoluteDeviation(field: ExpressionLike): InstrumentedExpression {
  return fn('MV_MEDIAN_ABSOLUTE_DEVIATION', field);
}

/** ES|QL `MV_PERCENTILE` — percentile of multivalued field. */
export function mvPercentile(field: ExpressionLike, p: number): InstrumentedExpression {
  return fn('MV_PERCENTILE', field, p);
}

/** ES|QL `MV_PSERIES_WEIGHTED_SUM` — power series weighted sum of multivalue. */
export function mvPseriesWeightedSum(field: ExpressionLike, p: number): InstrumentedExpression {
  return fn('MV_PSERIES_WEIGHTED_SUM', field, p);
}

/** ES|QL `MV_UNION` — union of two multivalues. */
export function mvUnion(left: ExpressionLike, right: ExpressionLike): InstrumentedExpression {
  return fn('MV_UNION', left, right);
}
