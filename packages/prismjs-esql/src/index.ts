/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the MIT license (the "License"); you may
 * not use this file except in compliance with the License.
 */

import { commandNames } from '@elastic/esql-definitions/commandNames';
import { functionNames } from '@elastic/esql-definitions/functionNames';
import type { RefractorLanguageDefinition } from './types';

const keywords = [
  'BY',
  'ASC',
  'DESC',
  'FIRST',
  'LAST',
  'ON',
  'WITH',
  'METADATA',
  'NULLS',
  'SCORE',
  'KEY',
  'GROUP',
];

const namedBinaryOperators = ['AND', 'OR', 'IS', 'IN', 'AS', 'LIKE', 'RLIKE', 'RLIKE', 'WHERE'];

export const esql: RefractorLanguageDefinition = function esql(Prism) {
  Prism.languages.esql = {
    // Single line comment: // comment
    comment: {
      pattern: /\/\/.*/,
      greedy: true,
    },

    // Slash-star multiline comments: /* comment */
    'multiline-comment': {
      pattern: /\/\*[\s\S]*?\*\//,
      greedy: true,
      alias: ['comment'],
    },

    // Triple quoted strings: """string"""
    'triple-quoted-string': {
      pattern: /"""(?:\\.|[^\\"])*"""/,
      greedy: true,
      alias: ['string'],
    },

    // Single quoted strings: "string"
    string: {
      pattern: /"(?:\\.|[^\\"])*"/,
      greedy: true,
    },

    // ES|LQ params: "?paramName", "?1", "?"
    variable: /\?\w{1,999}/,

    // Command names
    command: {
      pattern: new RegExp('\\b(?:' + commandNames.join('|') + ')\\b', 'i'),
      alias: ['keyword'],
    },

    // List of well known keywords
    keyword: {
      pattern: new RegExp('\\b(?:' + keywords.join('|') + ')\\b', 'i'),
    },

    'named-binary-operator': {
      pattern: new RegExp('\\b(?:' + namedBinaryOperators.join('|') + ')\\b', 'i'),
      alias: ['keyword'],
    },

    // Highlight list of known functions
    function: {
      pattern: new RegExp('\\b(?:' + functionNames.join('|') + ')\\b', 'i'),
    },

    boolean: /\b(?:false|true)\b/i,

    // Floating point numbers (ES|QL "decimals")
    float: {
      pattern: /\b(?:\d{1,50}\.{1}\d{0,50}|\.\d{1,50})(?:[eE][+-]?\d+)?\b/,
      alias: ['number'],
    },

    // Integer numbers
    integer: {
      pattern: /\b\d+\b/,
      alias: ['number'],
    },

    // Cast expressions
    cast: {
      pattern: /::\s*\w+\b/,
      alias: ['operator'],
    },

    // General operators
    operator: /-|\+|\*|\||\/|%|==|=|<=|>=|<|>/,

    // Mark "|" and "," and some other symbols as punctuation
    punctuation: /\||,|\(|\)|\[|\]|\{|\}/,
  };
} as RefractorLanguageDefinition;

esql.displayName = 'esql';
esql.aliases = [];
