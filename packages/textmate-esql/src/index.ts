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
  processingCommandNames,
  sourceCommandNames,
} from '@elastic/esql-definitions/commandNames';
import { functionNames } from '@elastic/esql-definitions/functionNames';
import {
  literalNames,
  namedBinaryOperatorNames,
  namedUnaryOperatorNames,
  optionNames,
  sortModifierNames,
} from '@elastic/esql-definitions/keywords';
import { temporalUnits } from '@elastic/esql-definitions/temporalUnits';

// Sort alternations longest-first so shorter alternatives don't shadow longer ones.
const byLengthDesc = (a: string, b: string) => b.length - a.length;

// Convert space-separated multi-word names (e.g. "FULL JOIN") to regex alternatives.
const toAlt = (name: string) => name.replace(/ /g, '\\s+');

// Build a case-insensitive word-boundary alternation: (?i)\b(?:A|B|C)\b
const wordAlt = (names: readonly string[]) =>
  `(?i)\\b(?:${[...names].sort(byLengthDesc).map(toAlt).join('|')})\\b`;

// All time unit names flattened from [canonical, ...abbreviations] tuples.
const allTemporalUnitNames = temporalUnits.flatMap(([unit, ...abbrevs]) => [unit, ...abbrevs]);

// SHOW INFO is a two-word source command. It must precede plain SHOW in the
// alternation so the longer form matches first.
const allSourceCommands = ['SHOW INFO', ...sourceCommandNames];

export const grammar = {
  name: 'ES|QL',
  scopeName: 'source.esql',
  fileTypes: ['esql'],
  patterns: [
    { include: '#comment' },
    { include: '#string-triple' },
    { include: '#string-double' },
    { include: '#string-backtick' },
    { include: '#pipe' },
    { include: '#semicolon' },
    { include: '#function-call' },
    { include: '#source-command' },
    { include: '#processing-command' },
    { include: '#header-command' },
    { include: '#option-keyword' },
    { include: '#named-operator' },
    { include: '#literal' },
    { include: '#parameter' },
    { include: '#type-cast' },
    { include: '#time-interval' },
    { include: '#number' },
    { include: '#delimiter' },
    { include: '#bracket' },
  ],
  repository: {
    comment: {
      patterns: [
        {
          name: 'comment.block.documentation.esql',
          begin: '/\\*\\*(?!/)',
          end: '\\*/',
          beginCaptures: { '0': { name: 'punctuation.definition.comment.begin.esql' } },
          endCaptures: { '0': { name: 'punctuation.definition.comment.end.esql' } },
        },
        {
          name: 'comment.block.esql',
          begin: '/\\*',
          end: '\\*/',
          beginCaptures: { '0': { name: 'punctuation.definition.comment.begin.esql' } },
          endCaptures: { '0': { name: 'punctuation.definition.comment.end.esql' } },
        },
        {
          name: 'comment.line.double-slash.esql',
          match: '//.*$',
        },
      ],
    },
    'string-triple': {
      name: 'string.quoted.triple.esql',
      begin: '"""',
      end: '"""',
      beginCaptures: { '0': { name: 'punctuation.definition.string.begin.esql' } },
      endCaptures: { '0': { name: 'punctuation.definition.string.end.esql' } },
    },
    'string-double': {
      name: 'string.quoted.double.esql',
      begin: '"',
      end: '"',
      beginCaptures: { '0': { name: 'punctuation.definition.string.begin.esql' } },
      endCaptures: { '0': { name: 'punctuation.definition.string.end.esql' } },
      patterns: [
        {
          name: 'constant.character.escape.esql',
          match: '\\\\(?:[abfnrtv\\\\"\']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})',
        },
      ],
    },
    'string-backtick': {
      name: 'string.quoted.backtick.esql',
      begin: '`',
      end: '`',
      beginCaptures: { '0': { name: 'punctuation.definition.string.begin.esql' } },
      endCaptures: { '0': { name: 'punctuation.definition.string.end.esql' } },
      patterns: [{ name: 'constant.character.escape.esql', match: '\\\\.' }],
    },
    pipe: {
      name: 'keyword.operator.pipe.esql',
      match: '\\|',
    },
    semicolon: {
      name: 'punctuation.separator.semicolon.esql',
      match: ';',
    },
    'function-call': {
      match: `(?i)\\b(${[...functionNames].sort(byLengthDesc).join('|')})\\s*(\\()`,
      captures: {
        '1': { name: 'support.function.esql' },
        '2': { name: 'punctuation.bracket.round.begin.esql' },
      },
    },
    'source-command': {
      name: 'keyword.control.source.esql',
      match: wordAlt(allSourceCommands),
    },
    'processing-command': {
      name: 'keyword.control.processing.esql',
      match: wordAlt(processingCommandNames),
    },
    'header-command': {
      name: 'keyword.control.header.esql',
      match: wordAlt(headerCommandNames),
    },
    'option-keyword': {
      name: 'keyword.other.option.esql',
      match: wordAlt(optionNames),
    },
    'named-operator': {
      name: 'keyword.operator.word.esql',
      match: wordAlt([
        ...namedBinaryOperatorNames,
        ...namedUnaryOperatorNames,
        ...sortModifierNames,
      ]),
    },
    literal: {
      name: 'constant.language.esql',
      match: wordAlt(literalNames),
    },
    parameter: {
      patterns: [
        { name: 'variable.parameter.named.esql', match: '\\?{1,9}[a-zA-Z_][a-zA-Z_0-9]*' },
        { name: 'variable.parameter.positional.esql', match: '\\?{1,9}[0-9]+' },
        { name: 'variable.parameter.unnamed.esql', match: '\\?{1,9}' },
      ],
    },
    'type-cast': {
      name: 'storage.type.esql',
      match: '::\\w+\\b',
    },
    'time-interval': {
      name: 'constant.numeric.time.esql',
      match: `(?i)\\b\\d+(_+\\d+)*\\s*(?:${allTemporalUnitNames.sort(byLengthDesc).join('|')})\\b`,
    },
    number: {
      patterns: [
        { name: 'constant.numeric.float.esql', match: '\\b\\d+(_+\\d+)*[eE][-+]?\\d+(_+\\d+)*\\b' },
        {
          name: 'constant.numeric.float.esql',
          match: '\\b\\d*(_+\\d+)*\\.\\d+(_+\\d+)*([eE][-+]?\\d+(_+\\d+)*)?\\b',
        },
        { name: 'constant.numeric.integer.esql', match: '\\b\\d+(_+\\d+)*\\b' },
      ],
    },
    delimiter: {
      patterns: [
        { name: 'keyword.operator.comparison.esql', match: '=~|==|!=|<=|>=|<|>' },
        { name: 'keyword.operator.assignment.esql', match: '=' },
        { name: 'keyword.operator.arithmetic.esql', match: '\\+|-|\\*|/|%' },
        { name: 'punctuation.separator.comma.esql', match: ',' },
        { name: 'punctuation.accessor.dot.esql', match: '\\.' },
      ],
    },
    bracket: {
      patterns: [
        { match: '\\[', name: 'punctuation.bracket.square.begin.esql' },
        { match: '\\]', name: 'punctuation.bracket.square.end.esql' },
        { match: '\\(', name: 'punctuation.bracket.round.begin.esql' },
        { match: '\\)', name: 'punctuation.bracket.round.end.esql' },
        { match: '\\{', name: 'punctuation.bracket.curly.begin.esql' },
        { match: '\\}', name: 'punctuation.bracket.curly.end.esql' },
      ],
    },
  },
};
