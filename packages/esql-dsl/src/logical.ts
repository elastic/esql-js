/*
 * Copyright Elasticsearch B.V. and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { InstrumentedExpression } from './expression';

/**
 * Combines one or more expressions with `AND`.
 * Each expression is wrapped in parentheses for correct precedence.
 */
export function and_(...expressions: InstrumentedExpression[]): InstrumentedExpression {
  if (expressions.length === 0) {
    throw new Error('and_() requires at least one expression');
  }
  const joined = expressions.map((e) => `(${e.toString()})`).join(' AND ');
  return new InstrumentedExpression(joined);
}

/**
 * Combines one or more expressions with `OR`.
 * Each expression is wrapped in parentheses for correct precedence.
 */
export function or_(...expressions: InstrumentedExpression[]): InstrumentedExpression {
  if (expressions.length === 0) {
    throw new Error('or_() requires at least one expression');
  }
  const joined = expressions.map((e) => `(${e.toString()})`).join(' OR ');
  return new InstrumentedExpression(joined);
}

/** Negates an expression with `NOT`. */
export function not_(expression: InstrumentedExpression): InstrumentedExpression {
  if (!expression) {
    throw new Error('not_() requires an expression');
  }
  return new InstrumentedExpression(`NOT (${expression.toString()})`);
}
