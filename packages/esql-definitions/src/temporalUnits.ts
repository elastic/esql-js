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
