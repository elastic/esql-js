/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

export type TemporalUnit = [unit: string, ...abbreviations: string[]];

/**
 * @see https://www.elastic.co/docs/reference/query-languages/esql/esql-time-spans#esql-time-spans-table
 */
export const temporalUnits: TemporalUnit[] = [
  ['YEAR', 'Y', 'YR', 'YEARS'],
  ['QUARTER', 'Q', 'QUARTERS'],
  ['MONTH', 'MO', 'MONTHS'],
  ['WEEK', 'W', 'WEEKS'],
  ['DAY', 'D', 'DAYS'],
  ['HOUR', 'H', 'HOURS'],
  ['MINUTE', 'M', 'MIN', 'MINUTES'],
  ['SECOND', 'S', 'SEC', 'SECONDS'],
  ['MILLISECOND', 'MS', 'MILLISECONDS'],
];

/**
 * @see https://github.com/elastic/elasticsearch/blob/a2dbb7b9174b109d89fa2da87645ecd4d4e8de14/x-pack/plugin/esql/src/main/java/org/elasticsearch/xpack/esql/type/EsqlDataTypeConverter.java#L174
 */
export const TIME_DURATION_UNITS = new Set([
  'millisecond',
  'milliseconds',
  'ms',
  'second',
  'seconds',
  'sec',
  's',
  'minute',
  'minutes',
  'min',
  'm',
  'hour',
  'hours',
  'h',
]);

/**
 * @see https://github.com/elastic/elasticsearch/blob/a2dbb7b9174b109d89fa2da87645ecd4d4e8de14/x-pack/plugin/esql/src/main/java/org/elasticsearch/xpack/esql/type/EsqlDataTypeConverter.java#L174
 */
export const DATE_PERIOD_UNITS = new Set([
  'year',
  'years',
  'yr',
  'y',
  'quarter',
  'quarters',
  'q',
  'month',
  'months',
  'mo',
  'week',
  'weeks',
  'w',
  'day',
  'days',
  'd',
]);

export const TIME_SPAN_UNITS = [...DATE_PERIOD_UNITS, ...TIME_DURATION_UNITS];
