/*
 * Copyright Elasticsearch B.V. and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ExpressionLike } from '@elastic/elasticsearch-query-builder';
import { InstrumentedExpression } from '../expression';
import { fn, renderArg, renderLiteralArg } from '../fn';

/** ES|QL `CIDR_MATCH` — returns true if IP is in any of the CIDR ranges. */
export function cidrMatch(ip: ExpressionLike, ...cidrs: ExpressionLike[]): InstrumentedExpression {
  const args = [renderArg(ip), ...cidrs.map(renderLiteralArg)];
  return new InstrumentedExpression(`CIDR_MATCH(${args.join(', ')})`);
}

/** ES|QL `IP_PREFIX` — extracts IP prefix. */
export function ipPrefix(
  ip: ExpressionLike,
  v4Prefix: ExpressionLike,
  v6Prefix: ExpressionLike
): InstrumentedExpression {
  return fn('IP_PREFIX', ip, v4Prefix, v6Prefix);
}

/** ES|QL `NETWORK_DIRECTION` — network traffic direction. */
export function networkDirection(
  source: ExpressionLike,
  destination: ExpressionLike,
  ...rest: ExpressionLike[]
): InstrumentedExpression {
  return fn('NETWORK_DIRECTION', source, destination, ...rest);
}
