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

function renderValue(value: ExpressionLike): string {
  if (BaseExpression.isExpression(value)) {
    return value.toString();
  }
  return escapeValue(value);
}

/**
 * A chainable ES|QL expression that renders to a query fragment.
 * Supports comparisons, arithmetic, pattern matching, null checks, and sort modifiers.
 *
 * Created via the {@link E} helper function.
 */
export class InstrumentedExpression extends BaseExpression {
  protected readonly _expr: string;

  constructor(expr: string) {
    super();
    this._expr = expr;
  }

  /** `field == value` */
  eq(value: ExpressionLike): InstrumentedExpression {
    return new InstrumentedExpression(`${this._expr} == ${renderValue(value)}`);
  }

  /** `field != value` */
  ne(value: ExpressionLike): InstrumentedExpression {
    return new InstrumentedExpression(`${this._expr} != ${renderValue(value)}`);
  }

  /** `field > value` */
  gt(value: ExpressionLike): InstrumentedExpression {
    return new InstrumentedExpression(`${this._expr} > ${renderValue(value)}`);
  }

  /** `field >= value` */
  gte(value: ExpressionLike): InstrumentedExpression {
    return new InstrumentedExpression(`${this._expr} >= ${renderValue(value)}`);
  }

  /** `field < value` */
  lt(value: ExpressionLike): InstrumentedExpression {
    return new InstrumentedExpression(`${this._expr} < ${renderValue(value)}`);
  }

  /** `field <= value` */
  lte(value: ExpressionLike): InstrumentedExpression {
    return new InstrumentedExpression(`${this._expr} <= ${renderValue(value)}`);
  }

  /** `field IS NULL` */
  isNull(): InstrumentedExpression {
    return new InstrumentedExpression(`${this._expr} IS NULL`);
  }

  /** `field IS NOT NULL` */
  isNotNull(): InstrumentedExpression {
    return new InstrumentedExpression(`${this._expr} IS NOT NULL`);
  }

  /** `field IN (value1, value2, ...)` */
  in(values: ExpressionLike[]): InstrumentedExpression {
    if (!Array.isArray(values) || values.length === 0) {
      throw new Error('in() requires a non-empty array of values');
    }
    const rendered = values.map(renderValue).join(', ');
    return new InstrumentedExpression(`${this._expr} IN (${rendered})`);
  }

  /** `field >= low AND field <= high` */
  between(low: ExpressionLike, high: ExpressionLike): InstrumentedExpression {
    return new InstrumentedExpression(
      `${this._expr} >= ${renderValue(low)} AND ${this._expr} <= ${renderValue(high)}`
    );
  }

  /** `field LIKE "pattern"` */
  like(pattern: string): InstrumentedExpression {
    return new InstrumentedExpression(`${this._expr} LIKE ${escapeValue(pattern)}`);
  }

  /** `field RLIKE "pattern"` */
  rlike(pattern: string): InstrumentedExpression {
    return new InstrumentedExpression(`${this._expr} RLIKE ${escapeValue(pattern)}`);
  }

  /** `STARTS_WITH(field, "prefix")` */
  startsWith(prefix: string): InstrumentedExpression {
    return new InstrumentedExpression(`STARTS_WITH(${this._expr}, ${escapeValue(prefix)})`);
  }

  /** `ENDS_WITH(field, "suffix")` */
  endsWith(suffix: string): InstrumentedExpression {
    return new InstrumentedExpression(`ENDS_WITH(${this._expr}, ${escapeValue(suffix)})`);
  }

  /** `field + value` */
  add(value: ExpressionLike): InstrumentedExpression {
    return new InstrumentedExpression(`${this._expr} + ${renderValue(value)}`);
  }

  /** `field - value` */
  sub(value: ExpressionLike): InstrumentedExpression {
    return new InstrumentedExpression(`${this._expr} - ${renderValue(value)}`);
  }

  /** `field * value` */
  mul(value: ExpressionLike): InstrumentedExpression {
    return new InstrumentedExpression(`${this._expr} * ${renderValue(value)}`);
  }

  /** `field / value` */
  div(value: ExpressionLike): InstrumentedExpression {
    return new InstrumentedExpression(`${this._expr} / ${renderValue(value)}`);
  }

  /** `field % value` */
  mod(value: ExpressionLike): InstrumentedExpression {
    return new InstrumentedExpression(`${this._expr} % ${renderValue(value)}`);
  }

  /** `field ASC` — ascending sort modifier. */
  asc(): InstrumentedExpression {
    return new InstrumentedExpression(`${this._expr} ASC`);
  }

  /** `field DESC` — descending sort modifier. */
  desc(): InstrumentedExpression {
    return new InstrumentedExpression(`${this._expr} DESC`);
  }

  /** `field NULLS FIRST` — nulls sort before non-null values. */
  nullsFirst(): InstrumentedExpression {
    return new InstrumentedExpression(`${this._expr} NULLS FIRST`);
  }

  /** `field NULLS LAST` — nulls sort after non-null values. */
  nullsLast(): InstrumentedExpression {
    return new InstrumentedExpression(`${this._expr} NULLS LAST`);
  }

  toString(): string {
    return this._expr;
  }
}

/**
 * An expression returned by aggregation functions. Extends {@link InstrumentedExpression}
 * with a `.where()` method for conditional aggregations.
 */
export class AggregationExpression extends InstrumentedExpression {
  /** Adds a `WHERE` filter to this aggregation, e.g. `AVG(salary) WHERE dept == "Eng"`. */
  where(condition: ExpressionLike): AggregationExpression {
    return new AggregationExpression(`${this._expr} WHERE ${renderValue(condition)}`);
  }
}

/**
 * Creates an {@link InstrumentedExpression} from a field name.
 * The field name is escaped as an ES|QL identifier.
 *
 * @param field - The field or column name, or `"?"` for a query parameter placeholder.
 */
export function E(field: string): InstrumentedExpression {
  if (typeof field !== 'string' || field.length === 0) {
    throw new Error('E() requires a non-empty string');
  }
  return new InstrumentedExpression(escapeIdentifier(field));
}
