/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { Token } from 'antlr4';
import { Parser } from '..';
import { default as ESQLLexer } from '../antlr/esql_lexer';
import { DEFAULT_CHANNEL } from '../core/constants';
import {
  assertQueryNesting,
  MAX_QUERY_NESTING_DEPTH,
  QUERY_NESTING_ERROR_CODE,
  QueryNestingError,
} from '../core/query_nesting';

const buildNestedStructure = (depth: number): string =>
  `${'('.repeat(depth)}true${')'.repeat(depth)}`;

const getTokens = (source: string) => {
  const parser = Parser.create(source);
  parser.tokens.fill();
  return parser.tokens.tokens;
};

const expectNestingError = (errors: unknown) => {
  expect(errors).toEqual([
    expect.objectContaining({
      code: QUERY_NESTING_ERROR_CODE,
      message: 'ES|QL statement contains unsupported query nesting',
    }),
  ]);
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
    expectNestingError(result.errors);
  });

  it('reports unsupported nesting through parseErrors', () => {
    const errors = Parser.parseErrors(
      `ROW result = ${buildNestedStructure(MAX_QUERY_NESTING_DEPTH + 1)}`
    );

    expectNestingError(errors);
  });

  it('does not count non-code tokens toward nesting', () => {
    const nestedSyntax = '('.repeat(MAX_QUERY_NESTING_DEPTH + 1);
    const { errors } = Parser.parse(
      `ROW result = "${nestedSyntax}", \`field${nestedSyntax}\` /* ${nestedSyntax} */`
    );

    expect(errors).toHaveLength(0);
  });

  describe('depth boundary', () => {
    const allowed = `ROW result = ${buildNestedStructure(MAX_QUERY_NESTING_DEPTH)}`;
    const rejected = `ROW result = ${buildNestedStructure(MAX_QUERY_NESTING_DEPTH + 1)}`;

    it('allows depth 50 in Parser.parse', () => {
      const { root, errors } = Parser.parse(allowed);

      expect(errors).toHaveLength(0);
      expect(root.commands).toHaveLength(1);
    });

    it('allows depth 50 in Parser.parseErrors', () => {
      expect(Parser.parseErrors(allowed)).toHaveLength(0);
    });

    it('rejects depth 51 in Parser.parse', () => {
      const result = Parser.parse(rejected);

      expect(result.root.commands).toHaveLength(0);
      expectNestingError(result.errors);
    });

    it('rejects depth 51 in Parser.parseErrors', () => {
      expectNestingError(Parser.parseErrors(rejected));
    });

    it('rejects unclosed nesting', () => {
      const query = `ROW result = ${'('.repeat(MAX_QUERY_NESTING_DEPTH + 1)}`;

      expectNestingError(Parser.parse(query).errors);
      expectNestingError(Parser.parseErrors(query));
    });

    it('does not log to the console when rejecting', () => {
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

      Parser.parse(rejected);

      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });
  });

  describe('bypass attempts', () => {
    const closers = 20;
    const nested = '('.repeat(closers + 100);
    const closing = ')'.repeat(closers);

    const payloads: Record<string, string> = {
      'block comment': `/* ${closing} */`,
      'line comment': `// ${closing}\n`,
      'nested block comment': `/* /* */ ${closing} */`,
      'quoted string': `"${closing}"`,
      'triple-quoted string': `"""${closing}"""`,
      'backtick identifier': `\`${closing}\``,
    };

    for (const [name, payload] of Object.entries(payloads)) {
      it(`rejects nesting after closing parens in a ${name}`, () => {
        const query = `ROW a = ${payload} ${nested}true${')'.repeat(closers + 100)}`;

        expectNestingError(Parser.parse(query).errors);
        expectNestingError(Parser.parseErrors(query));
      });
    }
  });

  describe('non-code parentheses', () => {
    const parens = '('.repeat(200);
    const closing = ')'.repeat(200);

    const queries: Record<string, string> = {
      'quoted string': `ROW a = "${parens}"`,
      'triple-quoted string': `ROW a = """${parens}"""`,
      'backtick identifier': `ROW \`a${parens}\` = 1`,
      'block comment': `ROW a = 1 /* ${parens} */`,
      'line comment': `ROW a = 1 // ${parens}`,
      'unbalanced closing in string': `ROW a = "${closing}"`,
    };

    for (const [name, query] of Object.entries(queries)) {
      it(`does not reject parentheses in a ${name}`, () => {
        expect(Parser.parse(query).errors).toHaveLength(0);
        expect(Parser.parseErrors(query)).toHaveLength(0);
      });
    }
  });

  it('does not let a stray closing paren reduce the depth below zero', () => {
    const token = (type: number) => ({ type, channel: DEFAULT_CHANNEL }) as Token;
    const tokens = [
      ...Array.from({ length: 100 }, () => token(ESQLLexer.RP)),
      ...Array.from({ length: MAX_QUERY_NESTING_DEPTH + 1 }, () => token(ESQLLexer.LP)),
    ];

    expect(() => assertQueryNesting(tokens)).toThrow(QueryNestingError);
  });

  it('does not count square brackets', () => {
    const tokens = getTokens(`ROW a = ${'['.repeat(200)}${']'.repeat(200)}`);

    expect(() => assertQueryNesting(tokens)).not.toThrow();
  });

  it('rejects a query nested 2000 deep without running the ANTLR rule', () => {
    const query = `ROW result = ${buildNestedStructure(2000)}`;
    const start = Date.now();

    expectNestingError(Parser.parse(query).errors);
    expectNestingError(Parser.parseErrors(query));
    expect(Date.now() - start).toBeLessThan(1000);
  });
});
