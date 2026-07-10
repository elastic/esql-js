/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the MIT license (the "License"); you may
 * not use this file except in compliance with the License.
 */

import type { languages } from 'monaco-editor';
import { promQLStates } from './promql';

export type CreateDependencies = Partial<typeof import('./definitions')>;

export const create = (deps: CreateDependencies = {}): languages.IMonarchLanguage => {
  const {
    headerCommands = [],
    sourceCommands = [],
    processingCommands = [],
    options = [],
    literals = [],
    functions = [],
    delimiters = [],
    temporalUnits = [],
  } = deps;

  const timeUnits = withLowercaseVariants(temporalUnits.flat()).sort((a, b) => (a > b ? -1 : 1));

  return {
    // Uncomment when developing.
    // defaultToken: "invalid",

    // ES|QL is case-insensitive.
    ignoreCase: false,

    // Lists of known language keywords and built-ins.
    headerCommands: withLowercaseVariants(headerCommands),
    sourceCommands: withLowercaseVariants(sourceCommands),
    processingCommands: withLowercaseVariants(processingCommands),
    processingCommandsOnlyUppercase: processingCommands,
    options: withLowercaseVariants(options),
    literals: withLowercaseVariants(literals),
    functions: withLowercaseVariants(functions),
    delimiters,
    namedOperators: withLowercaseVariants([
      ...(deps.operators?.named?.binary ?? []),
      ...(deps.operators?.named?.other ?? []),
    ]),

    // Pre-defined regular expressions.
    escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
    digits: /\d+(_+\d+)*/,
    symbols: /[=><!~:&|+\-*/^%.,]+/,
    columnIdentifier: /[a-zA-Z0-9_*-]+/,

    brackets: [
      { open: '[', close: ']', token: 'delimiter.square' },
      { open: '(', close: ')', token: 'delimiter.parenthesis' },
      { open: '{', close: '}', token: 'delimiter.curly' },
      { open: '<', close: '>', token: 'delimiter.angle' },
    ],

    tokenizer: {
      root: [{ include: '@firstCommandName' }, { include: '@restOfQuery' }],

      // This block matches the first command name in the query, and identifies it as a source command.
      // Except if it's a header command.
      // This is useful to color querys that starts with "From" instead of "FROM".
      firstCommandName: [
        { include: '@whitespace' },
        [
          /[a-zA-Z]+/,
          {
            cases: {
              'PROMQL|promql': {
                token: 'keyword.command.source.promql',
                switchTo: '@promQLCommand',
              },
              '@headerCommands': {
                token: 'keyword.command.header.$0',
                switchTo: '@restOfQuery',
              },
              '@default': {
                token: 'keyword.command.source.$0',
                switchTo: '@restOfQuery',
              },
            },
          },
        ],
      ],

      restOfQuery: [
        { include: '@whitespace' },

        // Keywords
        [
          /@?[a-zA-Z_$][\w$]*(?![.\-:a-zA-Z_0-9])/,
          {
            cases: {
              '@headerCommands': { token: 'keyword.command.header.$0' },
              '@sourceCommands': { token: 'keyword.command.source.$0' },
              '@options': { token: 'keyword.option.$0' },
              '@processingCommandsOnlyUppercase': {
                token: 'keyword.command.processing.$0',
              },
              '@literals': { token: 'keyword.literal.$0' },
              '@functions': { token: 'identifier.function.$0' },
              '@namedOperators': { token: 'keyword.operator.$0' },
              '\\@{1}timestamp': 'identifier.timestamp',
              '@default': 'identifier',
            },
          },
        ],

        { include: '@expression' },

        // If we found a semicolon, means a header command finished.
        // We go back to root to parse the query.
        [/;/, { token: 'delimiter', switchTo: '@root' }],

        { include: '@processingCommand' },

        [/\[|\(|\)|\]/, '@brackets'],

        [
          /@symbols/,
          {
            cases: {
              '@delimiters': 'delimiter',
              '@default': '',
            },
          },
        ],
      ],

      // --------------------------------- Hidden channel: whitespace and comments

      whitespace: [
        [/[ \t\r\n]+/, ''],
        [/\/\*\*(?!\/)/, 'comment.doc', '@doc'],
        [/\/\*/, 'comment', '@comment'],
        [/\/\/.*$/, 'comment'],
      ],

      comment: [
        [/[^/*]+/, 'comment'],
        [/\*\//, 'comment', '@pop'],
        [/[/*]/, 'comment'],
      ],

      doc: [
        [/[^/*]+/, 'comment.doc'],
        [/\*\//, 'comment.doc', '@pop'],
        [/[/*]/, 'comment.doc'],
      ],

      // ---------------------------------------------------------------- Commands

      // This code block allows to color commands when they are followed by a pipe
      // character "|", this way all new processing commands are color even if
      // they are not part of the command name list.
      processingCommand: [
        [/\|/, { token: 'delimiter.pipe', switchTo: '@beforeMnemonicWhitespace' }],
        [
          /\(/,
          {
            token: 'delimiter.parenthesis',
            next: '@firstCommandNameInSubQuery',
          },
        ],
      ],

      beforeMnemonicWhitespace: [
        { include: '@whitespace' },
        ['', { token: '', switchTo: '@commandName' }],
      ],

      exactCommandName: [
        [
          'PROMQL|promql',
          {
            token: 'keyword.command.source.promql',
            switchTo: '@promQLCommand',
          },
        ],
        [
          withLowercaseVariants(headerCommands).join('|'),
          { token: 'keyword.command.header.$0', switchTo: '@restOfQuery' },
        ],
        [
          // prevents partial matches (e.g. "TS" matching inside "TS_INFO")
          `(?:${withLowercaseVariants(sourceCommands).join('|')})(?![_a-zA-Z0-9])`,
          { token: 'keyword.command.source.$0', switchTo: '@restOfQuery' },
        ],
        [
          withLowercaseVariants(processingCommands).join('|'),
          { token: 'keyword.command.processing.$0', switchTo: '@restOfQuery' },
        ],
      ],

      firstCommandNameInSubQuery: [
        { include: '@whitespace' },

        // Try to match an exact command name
        { include: '@exactCommandName' },

        // If not matched, go to the previous state
        ['', { token: '', next: '@pop' }],
      ],

      // Matches *command name*, i.e. the mnemonic.
      commandName: [
        // First tries to match all known command names.
        { include: '@exactCommandName' },

        // If command name is not well known, just matches the first word.
        [/\w+\b/, { token: 'keyword.command.processing.$0', switchTo: '@restOfQuery' }],
      ],

      // ------------------------------------------------------------- Expressions

      expression: [
        { include: '@whitespace' },
        { include: '@literal' },

        // Basic ES|QL columns (fields), e.g.: "field", "nested.field", etc.
        [/(@columnIdentifier)(\.(@columnIdentifier))*/, 'identifier.column'],

        // Inline casts: 1.3::INTEGER
        [/::\w+\b/, 'type'],

        // strings
        [/"""/, 'string.triple', '@string_triple'],
        [/"([^"\\]|\\.)*$/, 'string.invalid'], // non-terminated string
        [/'([^'\\]|\\.)*$/, 'string.invalid'], // non-terminated string
        [/"/, 'string', '@string'],

        // Escaped column parts: nested.`escaped`.column
        [/`/, 'string', '@column_escape_part'],
      ],

      literal: [
        { include: '@timeInterval' },
        { include: '@number' },

        // Params
        [
          /\?{1,9}(([a-zA-Z_][a-zA-Z_0-9]+)|[0-9]+)?/,
          {
            cases: {
              '\\?{1,9}': 'variable.name.unnamed',
              '\\?{1,9}([a-zA-Z_][a-zA-Z_0-9]+)?': 'variable.name.named',
              '\\?{1,9}([0-9]+)?': 'variable.name.positional',
            },
          },
        ],
      ],

      timeInterval: [[`(@digits)\\s*(${timeUnits.join('|')})\\b`, 'number.time']],

      number: [
        [/(@digits)[eE]([-+]?(@digits))?/, 'number.float'],
        [/(@digits)?\.(@digits)([eE][-+]?(@digits))?/, 'number.float'],
        [/(@digits)/, 'number'],
      ],

      // Single double-quote strings: "str"
      string: [
        [/[^\\"]+/, 'string'],
        [/@escapes/, 'string.escape'],
        [/\\./, 'string.escape.invalid'],
        [/"/, 'string', '@pop'],
      ],

      // Triple double-quoted strings: """str"""
      string_triple: [
        // Needed to avoid poping on these cases: | WHERE KQL("""log.level:"warning""""),
        //  without this it will pop on warning""", leaving ") as invalid tokens.
        [/"(?=""")/, 'string.triple'],
        // End string_triple when """ is found
        [/"""/, 'string.triple', '@pop'],
        // The following two rules match the string content, contemplating the apearance of isolated quotes.
        [/[^"]+/, 'string.triple'],
        [/"/, 'string.triple'],
      ],

      // Backtick quoted "strings". ES|QL does not have back-tick "strings"
      // *per se*, but column parts can have backtick-escaped parts.
      column_escape_part: [
        [/[^`]+/, 'string'],
        [/@escapes/, 'string.escape'],
        [/\\./, 'string.escape.invalid'],
        [/`/, 'string', '@pop'],
      ],

      // ------------------------------------------------------------- PROMQL
      ...promQLStates,
    },
  };
};

/**
 * Given a list of strings, returns a new list with both the original and their lowercase versions (no duplicates).
 */
function withLowercaseVariants(list: string[]): string[] {
  const set = new Set<string>(list);
  for (const item of list) {
    set.add(item.toLowerCase());
  }
  return Array.from(set);
}
