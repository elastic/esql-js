/*
 * Copyright Elasticsearch B.V. and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseExpression, escapeValue } from '@elastic/elasticsearch-query-builder';
import { InstrumentedExpression } from './expression';

/**
 * Template literal tag for safe ES|QL composition.
 * Interpolated values are automatically escaped; {@link InstrumentedExpression}
 * objects pass through without escaping.
 *
 * @example
 * ```ts
 * const minSalary = 50000
 * const expr = esql`salary > ${minSalary} AND department == ${'Engineering'}`
 * ```
 */
export function esql(strings: TemplateStringsArray, ...values: unknown[]): InstrumentedExpression {
  const parts: string[] = [];
  for (let i = 0; i < strings.length; i++) {
    parts.push(strings[i] as string);
    if (i < values.length) {
      const value = values[i];
      parts.push(BaseExpression.isExpression(value) ? value.toString() : escapeValue(value));
    }
  }
  return new InstrumentedExpression(parts.join(''));
}
