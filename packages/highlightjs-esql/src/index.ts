/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the MIT license (the "License"); you may
 * not use this file except in compliance with the License.
 */

/*
Language: ES|QL
Description: language definition for Elastic ES|QL language
Website: https://www.elastic.co/guide/en/elasticsearch/reference/current/esql.html
Category: enterprise
*/

import { commandNames } from '@elastic/esql-definitions/commandNames';
import { functionNames } from '@elastic/esql-definitions/functionNames';
import {
  literalNames,
  namedBinaryOperatorNames,
  namedUnaryOperatorNames,
  optionNames,
  sortModifierNames,
} from '@elastic/esql-definitions/keywords';
import type { HLJSApi, Language, Mode } from 'highlight.js';

const source = (re: RegExp | string): string => (typeof re === 'string' ? re : re.source);

const concat = (...args: Array<RegExp | string>): string => args.map(source).join('');

const either = (...args: Array<RegExp | string>): string => '(' + args.map(source).join('|') + ')';

const dedupe = (names: readonly string[]): string[] => [...new Set(names)];

const commandWords = dedupe(['SHOW INFO', ...commandNames].flatMap((name) => name.split(' ')));

const functionAlternatives = [...functionNames].sort((a, b) => b.length - a.length);

export const esql = (hljs: HLJSApi): Language => {
  const OPERATOR: Mode = {
    className: 'operator',
    match: /\|\+\-%\*\//,
  };

  const STRING: Mode = {
    className: 'string',
    begin: /"/,
    end: /"/,
    contains: [hljs.BACKSLASH_ESCAPE],
  };

  const FUNCTION_CALL: Mode = {
    className: 'function',
    begin: concat(/\b/, either(...functionAlternatives), /\s*\(/),
    keywords: {
      keyword: [...functionNames],
    },
  };

  const DOCTAGS: Mode = hljs.COMMENT('/\\*', '\\*/', {
    contains: [
      {
        scope: 'doctag',
        begin: '@\\w+',
      },
    ],
  });

  const PARAM: Mode = {
    className: 'variable',
    begin: '\\?(\\w+)?',
  };

  const CAST: Mode = {
    className: 'type',
    begin: '::\\w+',
  };

  const PUNCTUATION: Mode = {
    scope: 'punctuation',
    match: /[,;{}\[\]\(\)]/,
  };

  return {
    name: 'esql',
    aliases: ['es|ql'],
    case_insensitive: true,
    keywords: {
      $pattern: /\b[\w\.]+\b/,
      keyword: dedupe([...optionNames, ...commandWords]),
      built_in: [...namedBinaryOperatorNames, ...namedUnaryOperatorNames, ...sortModifierNames],
      literal: [...literalNames],
    },
    contains: [
      DOCTAGS,
      hljs.C_BLOCK_COMMENT_MODE,
      hljs.C_LINE_COMMENT_MODE,
      hljs.QUOTE_STRING_MODE,
      hljs.C_NUMBER_MODE,
      OPERATOR,
      FUNCTION_CALL,
      STRING,
      PARAM,
      CAST,
      PUNCTUATION,
    ],
    illegal: /[{}]|<\//,
  };
};

export default esql;
