/*
 * Copyright Elasticsearch B.V. and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ExpressionLike } from '@elastic/elasticsearch-query-builder';
import type { InstrumentedExpression } from '../expression';
import { fn } from '../fn';

/** ES|QL `TO_BOOLEAN` — converts value to boolean. */
export function toBoolean(value: ExpressionLike): InstrumentedExpression {
  return fn('TO_BOOLEAN', value);
}

/** ES|QL `TO_DOUBLE` — converts value to double. */
export function toDouble(value: ExpressionLike): InstrumentedExpression {
  return fn('TO_DOUBLE', value);
}

/** ES|QL `TO_INTEGER` — converts value to integer. */
export function toInteger(value: ExpressionLike): InstrumentedExpression {
  return fn('TO_INTEGER', value);
}

/** ES|QL `TO_LONG` — converts value to long. */
export function toLong(value: ExpressionLike): InstrumentedExpression {
  return fn('TO_LONG', value);
}

/** ES|QL `TO_STRING` — converts value to string. */
export function toString_(value: ExpressionLike): InstrumentedExpression {
  return fn('TO_STRING', value);
}

/** ES|QL `TO_IP` — converts value to IP. */
export function toIp(value: ExpressionLike): InstrumentedExpression {
  return fn('TO_IP', value);
}

/** ES|QL `TO_VERSION` — converts value to version. */
export function toVersion(value: ExpressionLike): InstrumentedExpression {
  return fn('TO_VERSION', value);
}

/** ES|QL `TO_UNSIGNED_LONG` — converts value to unsigned long. */
export function toUnsignedLong(value: ExpressionLike): InstrumentedExpression {
  return fn('TO_UNSIGNED_LONG', value);
}

/** ES|QL `TO_GEOPOINT` — converts value to geo_point. */
export function toGeoPoint(value: ExpressionLike): InstrumentedExpression {
  return fn('TO_GEOPOINT', value);
}

/** ES|QL `TO_GEOSHAPE` — converts value to geo_shape. */
export function toGeoShape(value: ExpressionLike): InstrumentedExpression {
  return fn('TO_GEOSHAPE', value);
}

/** ES|QL `TO_CARTESIANPOINT` — converts value to cartesian_point. */
export function toCartesianPoint(value: ExpressionLike): InstrumentedExpression {
  return fn('TO_CARTESIANPOINT', value);
}

/** ES|QL `TO_CARTESIANSHAPE` — converts value to cartesian_shape. */
export function toCartesianShape(value: ExpressionLike): InstrumentedExpression {
  return fn('TO_CARTESIANSHAPE', value);
}

/** ES|QL `TO_AGGREGATE_METRIC_DOUBLE` — converts aggregate metric to double. */
export function toAggregateMetricDouble(value: ExpressionLike): InstrumentedExpression {
  return fn('TO_AGGREGATE_METRIC_DOUBLE', value);
}

/** ES|QL `TO_DENSE_VECTOR` — converts value to dense_vector. */
export function toDenseVector(value: ExpressionLike): InstrumentedExpression {
  return fn('TO_DENSE_VECTOR', value);
}

/** ES|QL `TO_GEOHASH` — converts value to geohash. */
export function toGeohash(value: ExpressionLike): InstrumentedExpression {
  return fn('TO_GEOHASH', value);
}

/** ES|QL `TO_GEOHEX` — converts value to geohex. */
export function toGeohex(value: ExpressionLike): InstrumentedExpression {
  return fn('TO_GEOHEX', value);
}

/** ES|QL `TO_GEOTILE` — converts value to geotile. */
export function toGeotile(value: ExpressionLike): InstrumentedExpression {
  return fn('TO_GEOTILE', value);
}
