/*
 * Copyright Elasticsearch B.V. and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  BaseExpression,
  escapeIdentifier,
  escapeValue,
  Op,
} from '@elastic/elasticsearch-query-builder';

type WhereValue = unknown;
type FieldCondition = Record<symbol, WhereValue>;

/**
 * Plain object syntax for `where()` conditions using `Op` symbols.
 *
 * @example
 * ```ts
 * query.where({
 *   salary: { [Op.gt]: 50000 },
 *   department: 'Engineering',
 * })
 * ```
 */
export type WhereOptions = Record<string | symbol, WhereValue>;

const OP_SQL_MAP: Record<symbol, string> = {
  [Op.eq]: '==',
  [Op.ne]: '!=',
  [Op.gt]: '>',
  [Op.gte]: '>=',
  [Op.lt]: '<',
  [Op.lte]: '<=',
  [Op.like]: 'LIKE',
  [Op.rlike]: 'RLIKE',
};

function renderFieldValue(value: WhereValue): string {
  if (BaseExpression.isExpression(value)) {
    return value.toString();
  }
  return escapeValue(value);
}

function renderFieldCondition(field: string, condition: FieldCondition): string {
  const escapedField = escapeIdentifier(field);
  const parts: string[] = [];

  for (const sym of Object.getOwnPropertySymbols(condition)) {
    const value = condition[sym];
    const sqlOp = OP_SQL_MAP[sym];

    if (sqlOp) {
      parts.push(`${escapedField} ${sqlOp} ${renderFieldValue(value)}`);
    } else if (sym === Op.is) {
      parts.push(`${escapedField} IS ${renderFieldValue(value)}`);
    } else if (sym === Op.isNot) {
      parts.push(`${escapedField} IS NOT ${renderFieldValue(value)}`);
    } else if (sym === Op.in) {
      const items = (value as WhereValue[]).map(renderFieldValue).join(', ');
      parts.push(`${escapedField} IN (${items})`);
    } else if (sym === Op.between) {
      const [low, high] = value as [WhereValue, WhereValue];
      parts.push(
        `${escapedField} >= ${renderFieldValue(low)} AND ${escapedField} <= ${renderFieldValue(high)}`
      );
    }
  }

  return parts.join(' AND ');
}

/** Converts a {@link WhereOptions} object into an ES|QL WHERE clause string. */
export function renderWhereOptions(options: WhereOptions): string {
  const parts: string[] = [];

  for (const key of Object.keys(options)) {
    const value = options[key];

    if (
      typeof value === 'object' &&
      value !== null &&
      !Array.isArray(value) &&
      !(value instanceof Date) &&
      !BaseExpression.isExpression(value) &&
      Object.getOwnPropertySymbols(value).length > 0
    ) {
      parts.push(renderFieldCondition(key, value as FieldCondition));
    } else {
      parts.push(`${escapeIdentifier(key)} == ${renderFieldValue(value)}`);
    }
  }

  for (const sym of Object.getOwnPropertySymbols(options)) {
    const value = options[sym];

    if (sym === Op.or) {
      const branches = (value as WhereOptions[]).map((branch) => `(${renderWhereOptions(branch)})`);
      parts.push(branches.join(' OR '));
    } else if (sym === Op.and) {
      const branches = (value as WhereOptions[]).map((branch) => `(${renderWhereOptions(branch)})`);
      parts.push(branches.join(' AND '));
    } else if (sym === Op.not) {
      parts.push(`NOT (${renderWhereOptions(value as WhereOptions)})`);
    }
  }

  return parts.join(' AND ');
}
