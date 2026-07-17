/*
 * Copyright Elasticsearch B.V. and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ExpressionLike } from '@elastic/elasticsearch-query-builder';
import { InstrumentedExpression } from '../expression';
import { fn, renderArg, renderLiteralArg } from '../fn';

class CaseBuilder {
  private readonly _clauses: Array<{ condition: string; result: string }> = [];

  when(condition: ExpressionLike, result: ExpressionLike): CaseBuilder {
    const next = new CaseBuilder();
    next._clauses.push(...this._clauses, {
      condition: renderArg(condition),
      result: renderLiteralArg(result),
    });
    return next;
  }

  else_(result: ExpressionLike): InstrumentedExpression {
    const parts = this._clauses.map((c) => `WHEN ${c.condition} THEN ${c.result}`);
    parts.push(`ELSE ${renderLiteralArg(result)} END`);
    return new InstrumentedExpression(`CASE ${parts.join(' ')}`);
  }

  build(): InstrumentedExpression {
    const parts = this._clauses.map((c) => `WHEN ${c.condition} THEN ${c.result}`);
    return new InstrumentedExpression(`CASE ${parts.join(' ')} END`);
  }
}

/** ES|QL `CASE` — conditional expression builder (WHEN/THEN/ELSE). */
export function case_(): CaseBuilder {
  return new CaseBuilder();
}

/** ES|QL `COALESCE` — returns first non-null value. */
export function coalesce(...values: ExpressionLike[]): InstrumentedExpression {
  return fn('COALESCE', ...values);
}

/** ES|QL `GREATEST` — returns the largest of the values. */
export function greatest(...values: ExpressionLike[]): InstrumentedExpression {
  return fn('GREATEST', ...values);
}

/** ES|QL `LEAST` — returns the smallest of the values. */
export function least(...values: ExpressionLike[]): InstrumentedExpression {
  return fn('LEAST', ...values);
}

/** ES|QL `NULLIF` — returns null if a equals b, else a. */
export function nullif(a: ExpressionLike, b: ExpressionLike): InstrumentedExpression {
  return fn('NULLIF', a, b);
}
