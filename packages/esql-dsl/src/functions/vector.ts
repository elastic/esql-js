/*
 * Copyright Elasticsearch B.V. and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ExpressionLike } from '@elastic/elasticsearch-query-builder';
import type { InstrumentedExpression } from '../expression';
import { fn } from '../fn';

/** ES|QL `V_COSINE` — cosine similarity between vectors. */
export function vCosine(v1: ExpressionLike, v2: ExpressionLike): InstrumentedExpression {
  return fn('V_COSINE', v1, v2);
}

/** ES|QL `V_DOT_PRODUCT` — dot product of vectors. */
export function vDotProduct(v1: ExpressionLike, v2: ExpressionLike): InstrumentedExpression {
  return fn('V_DOT_PRODUCT', v1, v2);
}

/** ES|QL `V_HAMMING` — Hamming distance between vectors. */
export function vHamming(v1: ExpressionLike, v2: ExpressionLike): InstrumentedExpression {
  return fn('V_HAMMING', v1, v2);
}

/** ES|QL `V_L1_NORM` — L1 (Manhattan) distance between vectors. */
export function vL1Norm(v1: ExpressionLike, v2: ExpressionLike): InstrumentedExpression {
  return fn('V_L1_NORM', v1, v2);
}

/** ES|QL `V_L2_NORM` — L2 (Euclidean) distance between vectors. */
export function vL2Norm(v1: ExpressionLike, v2: ExpressionLike): InstrumentedExpression {
  return fn('V_L2_NORM', v1, v2);
}

/** ES|QL `V_MAGNITUDE` — magnitude (length) of vector. */
export function vMagnitude(v: ExpressionLike): InstrumentedExpression {
  return fn('V_MAGNITUDE', v);
}
