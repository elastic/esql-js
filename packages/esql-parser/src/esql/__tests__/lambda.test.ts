/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { EsqlLexer } from '@elastic/esql-grammar';
import { parse, Parser } from '..';
import type { EsqlParsingTarget } from '../types';
import type { ESQLFunction, ESQLLambda } from '@elastic/esql-types';

const firstEvalFn = (src: string) => {
  const { ast, errors } = parse(src);
  return { fn: ast[1].args[0] as ESQLFunction, errors };
};

/**
 * Parses `src` starting directly at the `lambda` grammar rule. Within a full
 * query, any syntax error inside a function call makes ANTLR fail prediction
 * for the enclosing expression, so no lambda node is produced at all; parsing
 * the rule directly is the only way to reach a lambda with a broken body.
 */
const parseLambda = (src: string) => {
  const parser = new Parser(src);

  parser.lexer.pushMode(EsqlLexer.EXPRESSION_MODE);

  // `fromLambda` is private, so it is not part of `EsqlParsingTarget`.
  return parser.parseTarget<ESQLLambda>(['lambda', 'fromLambda'] as unknown as EsqlParsingTarget);
};

const types = (fn: ESQLFunction) => fn.args.map((a) => (a as { type: string }).type);

describe('lambda function arguments', () => {
  it('parses a single param lambda', () => {
    const { fn, errors } = firstEvalFn('FROM a | EVAL MV_FILTER(arr, v -> v > 1)');

    expect(errors.length).toBe(0);
    expect(types(fn)).toEqual(['column', 'lambda']);

    const lambda = fn.args[1] as ESQLLambda;

    expect(lambda.params.map((p) => p.name)).toEqual(['v']);
    expect(lambda.parenthesized).toBeUndefined();
    expect(lambda.body).toMatchObject({ type: 'function', name: '>' });
  });

  it('parses a multi param lambda', () => {
    const { fn, errors } = firstEvalFn('FROM a | EVAL MV_REDUCE(arr, (acc, v) -> acc + v, 0)');

    expect(errors.length).toBe(0);
    expect(types(fn)).toEqual(['column', 'lambda', 'literal']);

    const lambda = fn.args[1] as ESQLLambda;

    expect(lambda.params.map((p) => p.name)).toEqual(['acc', 'v']);
    expect(lambda.parenthesized).toBe(true);
  });

  it('parses a zero param lambda', () => {
    const { fn, errors } = firstEvalFn('FROM a | EVAL f(() -> 1)');

    expect(errors.length).toBe(0);
    expect(fn.args).toHaveLength(1);
    expect((fn.args[0] as ESQLLambda).params).toEqual([]);
  });

  it('keeps argument order', () => {
    const { fn, errors } = firstEvalFn('FROM a | EVAL f(a, x -> x, b)');

    expect(errors.length).toBe(0);
    expect(types(fn)).toEqual(['column', 'lambda', 'column']);
  });

  it('keeps a trailing map after a lambda', () => {
    const { fn, errors } = firstEvalFn('FROM a | EVAL f(x -> x, {"a": 1})');

    expect(errors.length).toBe(0);
    expect(types(fn)).toEqual(['lambda', 'map']);
  });

  it('reports a syntax error for an incomplete lambda, like any incomplete argument', () => {
    const { errors } = parse('FROM a | EVAL f(v -> )');
    const { errors: plainErrors } = parse('FROM a | EVAL f(v + )');

    expect(errors.length).toBeGreaterThan(0);
    expect(plainErrors.length).toBeGreaterThan(0);
  });
});

describe('lambda incompleteness', () => {
  it.each(['v -> v > 1', '(acc, v) -> acc + v', '() -> 1'])(
    'does not mark a complete lambda as incomplete: %s',
    (src) => {
      const { root, errors } = parseLambda(src);

      expect(errors.length).toBe(0);
      expect(root.type).toBe('lambda');
      expect(root.incomplete).toBe(false);
    }
  );

  it.each(['v -> ', 'v -> v +', '(acc, v) -> ', '(acc, v) -> acc +', 'v -> f(v'])(
    'marks the lambda incomplete when its body is incomplete: %s',
    (src) => {
      const { root, errors } = parseLambda(src);

      expect(errors.length).toBeGreaterThan(0);
      expect(root.type).toBe('lambda');
      expect(root.body.incomplete).toBe(true);
      expect(root.incomplete).toBe(true);
    }
  );

  it.each(['v', '(acc, v'])('marks the lambda incomplete when the arrow is missing: %s', (src) => {
    const { root, errors } = parseLambda(src);

    expect(errors.length).toBeGreaterThan(0);
    expect(root.type).toBe('lambda');
    expect(root.incomplete).toBe(true);
  });
});
