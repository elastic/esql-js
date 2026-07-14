/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the MIT license (the "License"); you may
 * not use this file except in compliance with the License.
 */

import {
  headerCommandNames,
  sourceCommandNames,
  processingCommandNames,
  legacyCommandNames,
} from '@elastic/esql-definitions/commandNames';
import { functionNames } from '@elastic/esql-definitions/functionNames';

const byLengthDesc = (a: string, b: string) => b.length - a.length;

export const headerCommands = headerCommandNames;

export const sourceCommands = ['SHOW INFO', ...sourceCommandNames].sort(byLengthDesc);

export const processingCommands = [
  ...processingCommandNames,
  ...legacyCommandNames,
  'INFO',
  'LEFT',
  'RIGHT',
].sort(byLengthDesc);

export const options = ['BY', 'ON', 'WITH', 'METADATA', 'WHERE', 'SCORE', 'KEY', 'GROUP', 'LIMIT'];

export const literals = ['TRUE', 'FALSE', 'NULL'];

export const functions = functionNames;

export const delimiters = [
  '/',
  '.',
  ',',
  ';',
  '=~',
  '<=',
  '>=',
  '==',
  '!=',
  '===',
  '!==',
  '=>',
  '+',
  '-',
  '**',
  '*',
  '/',
  '%',
  '++',
  '--',
  '<<',
  '</',
  '>>',
  '>>>',
  '&',
  '|',
  '^',
  '!',
  '~',
  '&&',
  '||',
  '?',
  ':',
  '=',
  '+=',
  '-=',
  '*=',
  '**=',
  '/=',
  '%=',
  '<<=',
  '>>=',
  '>>>=',
  '&=',
  '|=',
  '^=',
  '@',
];

export const operators = {
  named: {
    binary: ['AND', 'OR', 'IS', 'IN', 'AS', 'LIKE', 'RLIKE'],
    other: ['ASC', 'DESC', 'FIRST', 'LAST', 'NULLS', 'NOT'],
  },
};

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
