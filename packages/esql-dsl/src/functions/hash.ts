/*
 * Copyright Elasticsearch B.V. and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ExpressionLike } from '@elastic/elasticsearch-query-builder';
import { InstrumentedExpression } from '../expression';
import { fn, renderArg, renderLiteralArg } from '../fn';

/** ES|QL `HASH` — hash value using specified algorithm. */
export function hash(algorithm: ExpressionLike, field: ExpressionLike): InstrumentedExpression {
  return new InstrumentedExpression(`HASH(${renderLiteralArg(algorithm)}, ${renderArg(field)})`);
}

/** ES|QL `MD5` — MD5 hash of value. */
export function md5(field: ExpressionLike): InstrumentedExpression {
  return fn('MD5', field);
}

/** ES|QL `SHA1` — SHA-1 hash of value. */
export function sha1(field: ExpressionLike): InstrumentedExpression {
  return fn('SHA1', field);
}

/** ES|QL `SHA256` — SHA-256 hash of value. */
export function sha256(field: ExpressionLike): InstrumentedExpression {
  return fn('SHA256', field);
}

/** ES|QL `URL_DECODE` — decodes URL-encoded string. */
export function urlDecode(field: ExpressionLike): InstrumentedExpression {
  return fn('URL_DECODE', field);
}

/** ES|QL `URL_ENCODE` — URL-encodes string. */
export function urlEncode(field: ExpressionLike): InstrumentedExpression {
  return fn('URL_ENCODE', field);
}

/** ES|QL `URL_ENCODE_COMPONENT` — URL-encodes component. */
export function urlEncodeComponent(field: ExpressionLike): InstrumentedExpression {
  return fn('URL_ENCODE_COMPONENT', field);
}
