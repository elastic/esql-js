/*
 * Copyright Elasticsearch B.V. and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ExpressionLike } from '@elastic/elasticsearch-query-builder';
import type { InstrumentedExpression } from '../expression';
import { fn } from '../fn';

/** ES|QL `ST_DISTANCE` — distance between two geometries. */
export function stDistance(geo1: ExpressionLike, geo2: ExpressionLike): InstrumentedExpression {
  return fn('ST_DISTANCE', geo1, geo2);
}

/** ES|QL `ST_INTERSECTS` — returns true if geometries intersect. */
export function stIntersects(geo1: ExpressionLike, geo2: ExpressionLike): InstrumentedExpression {
  return fn('ST_INTERSECTS', geo1, geo2);
}

/** ES|QL `ST_CONTAINS` — returns true if geo1 contains geo2. */
export function stContains(geo1: ExpressionLike, geo2: ExpressionLike): InstrumentedExpression {
  return fn('ST_CONTAINS', geo1, geo2);
}

/** ES|QL `ST_WITHIN` — returns true if geo1 is within geo2. */
export function stWithin(geo1: ExpressionLike, geo2: ExpressionLike): InstrumentedExpression {
  return fn('ST_WITHIN', geo1, geo2);
}

/** ES|QL `ST_X` — X coordinate of point. */
export function stX(point: ExpressionLike): InstrumentedExpression {
  return fn('ST_X', point);
}

/** ES|QL `ST_Y` — Y coordinate of point. */
export function stY(point: ExpressionLike): InstrumentedExpression {
  return fn('ST_Y', point);
}

/** ES|QL `ST_DISJOINT` — returns true if geometries do not intersect. */
export function stDisjoint(geo1: ExpressionLike, geo2: ExpressionLike): InstrumentedExpression {
  return fn('ST_DISJOINT', geo1, geo2);
}

/** ES|QL `ST_ENVELOPE` — bounding box of geometry. */
export function stEnvelope(geo: ExpressionLike): InstrumentedExpression {
  return fn('ST_ENVELOPE', geo);
}

/** ES|QL `ST_EXTENT_AGG` — aggregate geometries to bounding box. */
export function stExtentAgg(field: ExpressionLike): InstrumentedExpression {
  return fn('ST_EXTENT_AGG', field);
}

/** ES|QL `ST_NPOINTS` — number of points in geometry. */
export function stNpoints(geo: ExpressionLike): InstrumentedExpression {
  return fn('ST_NPOINTS', geo);
}

/** ES|QL `ST_SIMPLIFY` — simplifies geometry by tolerance. */
export function stSimplify(geo: ExpressionLike, tolerance: ExpressionLike): InstrumentedExpression {
  return fn('ST_SIMPLIFY', geo, tolerance);
}

/** ES|QL `ST_GEOHASH` — geohash of geometry at precision. */
export function stGeohash(geo: ExpressionLike, precision: ExpressionLike): InstrumentedExpression {
  return fn('ST_GEOHASH', geo, precision);
}

/** ES|QL `ST_GEOHASH_TO_LONG` — geohash as long. */
export function stGeohashToLong(hash: ExpressionLike): InstrumentedExpression {
  return fn('ST_GEOHASH_TO_LONG', hash);
}

/** ES|QL `ST_GEOHASH_TO_STRING` — geohash as string. */
export function stGeohashToString(hash: ExpressionLike): InstrumentedExpression {
  return fn('ST_GEOHASH_TO_STRING', hash);
}

/** ES|QL `ST_GEOHEX` — geohex of geometry at precision. */
export function stGeohex(geo: ExpressionLike, precision: ExpressionLike): InstrumentedExpression {
  return fn('ST_GEOHEX', geo, precision);
}

/** ES|QL `ST_GEOHEX_TO_LONG` — geohex as long. */
export function stGeohexToLong(hex: ExpressionLike): InstrumentedExpression {
  return fn('ST_GEOHEX_TO_LONG', hex);
}

export function stGeohexToString(hex: ExpressionLike): InstrumentedExpression {
  return fn('ST_GEOHEX_TO_STRING', hex);
}

/** ES|QL `ST_GEOTILE` — geotile of geometry at precision. */
export function stGeotile(geo: ExpressionLike, precision: ExpressionLike): InstrumentedExpression {
  return fn('ST_GEOTILE', geo, precision);
}

/** ES|QL `ST_GEOTILE_TO_LONG` — geotile as long. */
export function stGeotileToLong(tile: ExpressionLike): InstrumentedExpression {
  return fn('ST_GEOTILE_TO_LONG', tile);
}

/** ES|QL `ST_GEOTILE_TO_STRING` — geotile as string. */
export function stGeotileToString(tile: ExpressionLike): InstrumentedExpression {
  return fn('ST_GEOTILE_TO_STRING', tile);
}

/** ES|QL `ST_XMAX` — maximum X of geometry bounds. */
export function stXmax(geo: ExpressionLike): InstrumentedExpression {
  return fn('ST_XMAX', geo);
}

/** ES|QL `ST_XMIN` — minimum X of geometry bounds. */
export function stXmin(geo: ExpressionLike): InstrumentedExpression {
  return fn('ST_XMIN', geo);
}

/** ES|QL `ST_YMAX` — maximum Y of geometry bounds. */
export function stYmax(geo: ExpressionLike): InstrumentedExpression {
  return fn('ST_YMAX', geo);
}

/** ES|QL `ST_YMIN` — minimum Y of geometry bounds. */
export function stYmin(geo: ExpressionLike): InstrumentedExpression {
  return fn('ST_YMIN', geo);
}
