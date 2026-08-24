/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { Parser } from '../parser';
import {
  assertQueryNesting,
  MAX_QUERY_NESTING_DEPTH,
  QUERY_NESTING_ERROR_CODE,
} from '../query_nesting';

const buildNestedStructure = (depth: number): string =>
  `${'('.repeat(depth)}true${')'.repeat(depth)}`;

const getTokens = (source: string) => {
  const parser = Parser.create(source);
  parser.tokens.fill();
  return parser.tokens.tokens;
};

describe('query nesting', () => {
  it('allows supported nesting', () => {
    const tokens = getTokens(`ROW result = ${buildNestedStructure(MAX_QUERY_NESTING_DEPTH)}`);

    expect(() => assertQueryNesting(tokens)).not.toThrow();
  });

  it('returns a structured error for unsupported nesting', () => {
    const result = Parser.parse(
      `ROW result = ${buildNestedStructure(MAX_QUERY_NESTING_DEPTH + 1)}`
    );

    expect(result.root.commands).toHaveLength(0);
    expect(result.errors).toEqual([
      expect.objectContaining({
        code: QUERY_NESTING_ERROR_CODE,
        message: 'ES|QL statement contains unsupported query nesting',
      }),
    ]);
  });

  it('reports unsupported nesting through parseErrors', () => {
    const errors = Parser.parseErrors(
      `ROW result = ${buildNestedStructure(MAX_QUERY_NESTING_DEPTH + 1)}`
    );

    expect(errors).toEqual([
      expect.objectContaining({
        code: QUERY_NESTING_ERROR_CODE,
      }),
    ]);
  });

  it('does not count non-code tokens toward nesting', () => {
    const nestedSyntax = '('.repeat(MAX_QUERY_NESTING_DEPTH + 1);
    const { errors } = Parser.parse(
      `ROW result = "${nestedSyntax}", \`field${nestedSyntax}\` /* ${nestedSyntax} */`
    );

    expect(errors).toHaveLength(0);
  });
});
