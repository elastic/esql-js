/*
 * Copyright Elasticsearch B.V. and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ExpressionLike } from '@elastic/elasticsearch-query-builder';
import { InstrumentedExpression } from '../expression';
import { fn, renderArg, renderLiteralArg } from '../fn';

/** ES|QL `NOW` — returns current date/time. */
export function now(): InstrumentedExpression {
  return new InstrumentedExpression('NOW()');
}

/** ES|QL `DATE_DIFF` — returns difference between two dates in given unit. */
export function dateDiff(
  unit: string,
  start: ExpressionLike,
  end: ExpressionLike
): InstrumentedExpression {
  return new InstrumentedExpression(
    `DATE_DIFF(${renderLiteralArg(unit)}, ${renderArg(start)}, ${renderArg(end)})`
  );
}

/** ES|QL `DATE_EXTRACT` — extracts a part (year, month, etc.) from a date. */
export function dateExtract(part: string, date: ExpressionLike): InstrumentedExpression {
  return new InstrumentedExpression(`DATE_EXTRACT(${renderLiteralArg(part)}, ${renderArg(date)})`);
}

/** ES|QL `DATE_FORMAT` — formats date with given pattern. */
export function dateFormat(date: ExpressionLike, format?: string): InstrumentedExpression {
  if (format !== undefined) {
    return new InstrumentedExpression(
      `DATE_FORMAT(${renderArg(date)}, ${renderLiteralArg(format)})`
    );
  }
  return fn('DATE_FORMAT', date);
}

/** ES|QL `DATE_PARSE` — parses string to date using format. */
export function dateParse(date: ExpressionLike, format: string): InstrumentedExpression {
  return new InstrumentedExpression(
    `DATE_PARSE(${renderLiteralArg(date)}, ${renderLiteralArg(format)})`
  );
}

/** ES|QL `DATE_TRUNC` — truncates date to given interval. */
export function dateTrunc(date: ExpressionLike, interval: string): InstrumentedExpression {
  return new InstrumentedExpression(
    `DATE_TRUNC(${renderArg(date)}, ${renderLiteralArg(interval)})`
  );
}

/** ES|QL `TO_DATETIME` — converts value to datetime. */
export function toDatetime(value: ExpressionLike): InstrumentedExpression {
  return fn('TO_DATETIME', value);
}

/** ES|QL `DATE_ADD` — adds amount of given unit to date. */
export function dateAdd(
  date: ExpressionLike,
  amount: ExpressionLike,
  unit: string
): InstrumentedExpression {
  return new InstrumentedExpression(
    `DATE_ADD(${renderArg(date)}, ${renderArg(amount)}, ${renderLiteralArg(unit)})`
  );
}

/** ES|QL `DAY_NAME` — returns the day-of-week name. */
export function dayName(date: ExpressionLike): InstrumentedExpression {
  return fn('DAY_NAME', date);
}

/** ES|QL `MONTH_NAME` — returns the month name. */
export function monthName(date: ExpressionLike): InstrumentedExpression {
  return fn('MONTH_NAME', date);
}

/** ES|QL `TO_DATE_NANOS` — converts value to date_nanos. */
export function toDateNanos(value: ExpressionLike): InstrumentedExpression {
  return fn('TO_DATE_NANOS', value);
}

/** ES|QL `TO_DATEPERIOD` — converts value to date_period. */
export function toDateperiod(value: ExpressionLike): InstrumentedExpression {
  return fn('TO_DATEPERIOD', value);
}

/** ES|QL `TO_TIMEDURATION` — converts value to time_duration. */
export function toTimeduration(value: ExpressionLike): InstrumentedExpression {
  return fn('TO_TIMEDURATION', value);
}
