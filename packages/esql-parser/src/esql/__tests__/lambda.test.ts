/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { parse } from '..';
import type { ESQLFunction, ESQLLambda } from '@elastic/esql-types';

const firstEvalFn = (src: string) => {
  const { ast, errors } = parse(src);
  return { fn: ast[1].args[0] as ESQLFunction, errors };
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
