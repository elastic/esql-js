/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the MIT license (the "License"); you may
 * not use this file except in compliance with the License.
 */
import type { languages } from 'monaco-editor';

/**
 * In order to handle the PROMQL command we need to solve two problems:
 * 1. Detect when the params section ends and the query starts, so we can apply the promql query embedding.
 *    For this we tokenize the params section with dedicated states, before delegating to the promql query embedding.
 *
 * 2. We need to correctly tokenize ES|QL comments syntax within a promql query.
 *    For this we use the promQLQuery state, which is applied while tokenizing the query content.
 *    It will tell the embedded language when the query ends (when a pipe is found).
 *    And will switch to dedicated states for handling comments.
 */

/** Main state for PROMQL command. */
export const promQLCommand: languages.IMonarchLanguageRule[] = [
  { include: '@whitespace' },
  // Match param pattern: paramName = ...
  [/[a-zA-Z0-9_*?"`-]+\s*=\s*/, { token: '@rematch', next: '@promqlParam' }],
  // Start PromQL query embedding (no more params)
  [/.+/, { token: '@rematch', switchTo: '@promQLQuery', nextEmbedded: 'promql' }],
];

/**
 * State to tokenize param name, then switch to value
 */
export const promqlParam: languages.IMonarchLanguageRule[] = [
  // Match param name
  { include: '@expression' },
  // Tokenize assignment and go to value
  [/=\s*/, { token: 'delimiter.assignment', switchTo: '@promqlParamValue' }],
];

/**
 * State to parse param values.
 * The way of detecting a param value ended is by detecting whitespaces that are not followed by a comma.
 * Example of a value that contains a list of indexes: index-*, `index`, index::selector, ?param, "index"
 */
export const promqlParamValue: languages.IMonarchLanguageRule[] = [
  // Whitespace handling: comma continues list, otherwise pop
  [/\s+(?=,)/, ''], // Whitespace before comma - continue
  [/\s+/, { token: '', next: '@pop' }], // Whitespace not before comma - pop (query or next param)

  // Match value content
  { include: '@expression' },

  // Comma continues the list
  [/,\s*/, 'delimiter.comma'],

  // Fallback: pop if nothing else matches
  ['', { token: '', next: '@pop' }],
];

/**
 * These rules are applied while tokenizing the query content (inside the embedding language).
 * They run "in parallel" with the rules from the embedded language.
 * We use them the tell the embedded language when the query ends (when a pipe is found).
 * And to be able to tokenize ES|QL comments within the PROMQL query.
 */
export const promQLQuery: languages.IMonarchLanguageRule[] = [
  // Rules to delegate comments to ES|QL
  [
    /\/\*\*(?!\/)/,
    {
      token: 'comment.doc',
      next: '@promqlDocComment',
      nextEmbedded: '@pop',
    },
  ],
  [/\/\*/, { token: 'comment', next: '@promqlComment', nextEmbedded: '@pop' }],
  [
    /\/\//,
    {
      token: 'comment',
      next: '@promqlLineComment',
      nextEmbedded: '@pop',
    },
  ],

  // String handling, to avoid exiting when finding a pipe inside a string.
  [/"/, { token: 'string', next: '@promqlDoubleString', nextEmbedded: '@pop' }],
  [/`/, { token: 'string', next: '@promqlBacktickString', nextEmbedded: '@pop' }],

  // variables control handling
  [/\?{1,9}/, { token: '@rematch', next: '@promqlParamReference', nextEmbedded: '@pop' }],

  // Exit condition
  [
    /\|/,
    {
      token: 'delimiter.pipe',
      switchTo: '@beforeMnemonicWhitespace',
      nextEmbedded: '@pop',
    },
  ],
];

/**
 * These states are used for returning control to the promql embedding after a comment or string ends.
 */
const promQLQueryOverrideRules: {
  [name: string]: languages.IMonarchLanguageRule[];
} = {
  promqlDocComment: [
    [/[^/*]+/, 'comment.doc'],
    [/\*\//, { token: 'comment.doc', next: '@pop', nextEmbedded: 'promql' }],
    [/[/*]/, 'comment.doc'],
  ],

  promqlComment: [
    [/[^/*]+/, 'comment'],
    [/\*\//, { token: 'comment', next: '@pop', nextEmbedded: 'promql' }],
    [/[/*]/, 'comment'],
  ],

  promqlLineComment: [[/.*$/, { token: 'comment', next: '@pop', nextEmbedded: 'promql' }]],

  promqlDoubleString: [
    [/[^"\\]+/, 'string'],
    [/\\./, 'string.escape'],
    [/"/, { token: 'string', next: '@pop', nextEmbedded: 'promql' }],
  ],

  promqlBacktickString: [
    [/[^`\\]+/, 'string'],
    [/\\./, 'string.escape'],
    [/`/, { token: 'string', next: '@pop', nextEmbedded: 'promql' }],
  ],

  promqlParamReference: [
    [
      /\?{1,9}[a-zA-Z_][a-zA-Z_0-9]*/,
      { token: 'variable.name.named', next: '@pop', nextEmbedded: 'promql' },
    ],
    [
      /\?{1,9}[0-9]+/,
      {
        token: 'variable.name.positional',
        next: '@pop',
        nextEmbedded: 'promql',
      },
    ],
    [/\?{1,9}/, { token: 'variable.name.unnamed', next: '@pop', nextEmbedded: 'promql' }],
  ],
};

/**
 * All PromQL tokenizer states needed to tokenize a PROMQL command bundled in one object.
 */
export const promQLStates: {
  [name: string]: languages.IMonarchLanguageRule[];
} = {
  promQLCommand,
  promqlParam,
  promqlParamValue,
  promQLQuery,
  ...promQLQueryOverrideRules,
};
