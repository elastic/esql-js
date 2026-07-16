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
import {
  optionNames,
  literalNames,
  sortModifierNames,
  namedBinaryOperatorNames,
  namedUnaryOperatorNames,
} from '@elastic/esql-definitions/keywords';

export { temporalUnits, type TemporalUnit } from '@elastic/esql-definitions/temporalUnits';

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

export const literals = literalNames;

export const options = optionNames;

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
    binary: namedBinaryOperatorNames,
    other: [...sortModifierNames, ...namedUnaryOperatorNames],
  },
};
