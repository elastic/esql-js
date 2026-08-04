/*
 * Copyright Elasticsearch B.V. and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  BaseExpression,
  type ExpressionLike,
  escapeIdentifier,
  escapeValue,
} from '@elastic/elasticsearch-query-builder';
import { AggregationExpression, InstrumentedExpression } from './expression';

/** Renders a value as a field reference (identifier) if it's a string, or as a literal otherwise. */
export function renderArg(value: ExpressionLike): string {
  if (BaseExpression.isExpression(value)) {
    return value.toString();
  }
  if (typeof value === 'string') {
    return escapeIdentifier(value);
  }
  return escapeValue(value);
}

/** Renders a value as a literal. Strings are quoted, expressions pass through. */
export function renderLiteralArg(value: ExpressionLike): string {
  if (BaseExpression.isExpression(value)) {
    return value.toString();
  }
  return escapeValue(value);
}

/** Creates an ES|QL function call expression with identifier-mode arguments. */
export function fn(name: string, ...args: ExpressionLike[]): InstrumentedExpression {
  return new InstrumentedExpression(`${name}(${args.map(renderArg).join(', ')})`);
}

/** Creates an ES|QL function call expression with literal-mode arguments. */
export function fnLiteral(name: string, ...args: ExpressionLike[]): InstrumentedExpression {
  return new InstrumentedExpression(`${name}(${args.map(renderLiteralArg).join(', ')})`);
}

/** Creates an ES|QL aggregation function call, returning an {@link AggregationExpression}. */
export function aggFn(name: string, ...args: ExpressionLike[]): AggregationExpression {
  return new AggregationExpression(`${name}(${args.map(renderArg).join(', ')})`);
}
