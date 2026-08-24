/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { Parser } from '../parser';
import type { ESQLParens } from '@elastic/esql-types';

const parse = (src: string) => Parser.parse(src, { withParens: true }).root;
const firstArg = (src: string) => parse(src).commands[0].args[0];

describe('expression parens are dropped by default', () => {
  const firstArgDefault = (src: string) => Parser.parse(src).root.commands[0].args[0];

  it('does not wrap a literal in ESQLParens', () => {
    expect(firstArgDefault('ROW (123)')).toMatchObject({
      type: 'literal',
      value: 123,
    });
  });

  it('does not wrap a column reference in ESQLParens', () => {
    expect(firstArgDefault('ROW (a)')).toMatchObject({
      type: 'column',
      name: 'a',
    });
  });

  it('drops redundant parens around a binary expression', () => {
    expect(firstArgDefault('ROW (a + b)')).toMatchObject({
      type: 'function',
      name: '+',
    });
  });

  it('drops nested redundant parens', () => {
    expect(firstArgDefault('ROW ((a))')).toMatchObject({
      type: 'column',
      name: 'a',
    });
  });

  it('preserves operand structure without parens nodes', () => {
    expect(firstArgDefault('ROW (a + b) * c')).toMatchObject({
      type: 'function',
      name: '*',
      args: [
        { type: 'function', name: '+' },
        { type: 'column', name: 'c' },
      ],
    });
  });

  it('NOT (expr) argument is unwrapped', () => {
    expect(firstArgDefault('ROW NOT (a AND b)')).toMatchObject({
      type: 'function',
      name: 'not',
      args: [{ type: 'function', name: 'and' }],
    });
  });

  it('produces the same AST as the equivalent paren-free source', () => {
    const strip = (root: unknown) =>
      JSON.parse(
        JSON.stringify(root, (k, v) =>
          ['text', 'location', 'incomplete'].includes(k) ? undefined : v
        )
      );

    const withRedundantParens = strip(Parser.parse('ROW a + (b * c)').root);
    const parenFree = strip(Parser.parse('ROW a + b * c').root);

    expect(withRedundantParens).toEqual(parenFree);
  });
});

describe('expression parens preserved with { withParens: true }', () => {
  describe('AST structure', () => {
    it('wraps a literal in ESQLParens', () => {
      expect(firstArg('ROW (123)')).toMatchObject({
        type: 'parens',
        child: { type: 'literal', value: 123 },
      });
    });

    it('wraps a column reference in ESQLParens', () => {
      expect(firstArg('ROW (a)')).toMatchObject({
        type: 'parens',
        child: { type: 'column', name: 'a' },
      });
    });

    it('wraps a binary expression in ESQLParens', () => {
      expect(firstArg('ROW (a + b)')).toMatchObject({
        type: 'parens',
        child: { type: 'function', name: '+' },
      });
    });

    it('double parens produce nested ESQLParens', () => {
      expect(firstArg('ROW ((a))')).toMatchObject({
        type: 'parens',
        child: {
          type: 'parens',
          child: { type: 'column', name: 'a' },
        },
      });
    });

    it('NOT (expr) keeps parens as the argument', () => {
      expect(firstArg('ROW NOT (a AND b)')).toMatchObject({
        type: 'function',
        name: 'not',
        args: [
          {
            type: 'parens',
            child: { type: 'function', name: 'and' },
          },
        ],
      });
    });

    it('binary right operand with parens', () => {
      expect(firstArg('ROW a / (b * c)')).toMatchObject({
        type: 'function',
        name: '/',
        args: [
          { type: 'column', name: 'a' },
          { type: 'parens', child: { type: 'function', name: '*' } },
        ],
      });
    });

    it('binary left operand with parens', () => {
      expect(firstArg('ROW (a + b) * c')).toMatchObject({
        type: 'function',
        name: '*',
        args: [
          { type: 'parens', child: { type: 'function', name: '+' } },
          { type: 'column', name: 'c' },
        ],
      });
    });
  });

  describe('parser fields', () => {
    it('text includes the surrounding parens', () => {
      const expr = firstArg('ROW (123)') as ESQLParens;
      expect(expr.text).toBe('(123)');
    });

    it('location spans from opening to closing paren', () => {
      const expr = firstArg('ROW (123)') as ESQLParens;

      expect(expr.location.min).toBe(4);
      expect(expr.location.max).toBe(8);
    });

    it('text is the raw token text (no whitespace) of the parenthesized expression', () => {
      const expr = firstArg('ROW (a + b)') as ESQLParens;

      expect(expr.text).toBe('(a+b)');
    });
  });

  describe('parens produce structurally distinct ASTs', () => {
    const strip = (src: string) => {
      const { root } = Parser.parse(src, { withParens: true });

      return JSON.parse(
        JSON.stringify(root, (k, v) =>
          ['text', 'location', 'incomplete'].includes(k) ? undefined : v
        )
      );
    };

    it('a + (b + c) differs from a + b + c', () => {
      expect(strip('ROW a + (b + c)')).not.toEqual(strip('ROW a + b + c'));
    });

    it('(a + b) * c differs from a + b * c', () => {
      expect(strip('ROW (a + b) * c')).not.toEqual(strip('ROW a + b * c'));
    });

    it('NOT (a > b) differs from NOT a > b', () => {
      expect(strip('ROW NOT (a > b)')).not.toEqual(strip('ROW NOT a > b'));
    });
  });
});
