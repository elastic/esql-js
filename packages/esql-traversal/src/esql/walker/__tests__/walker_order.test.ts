/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { Builder } from '@elastic/esql-ast';
import type {
  ESQLCommand,
  ESQLIdentifier,
  ESQLLiteral,
  ESQLStringLiteral,
} from '@elastic/esql-types';
import { walk, Walker } from '../walker';
import { expr, fromSources } from '../../../__tests__/builders';

/** `FROM index METADATA a, b, c` */
const fromWithMetadata = () =>
  Builder.expression.query([
    Builder.command({
      name: 'from',
      args: [
        expr.source.index('index'),
        Builder.option({
          name: 'metadata',
          args: ['a', 'b', 'c'].map((name) => expr.column(name)),
        }),
      ],
    }),
  ]);

/** `ROW a = [1, 2, 3]` */
const rowList = () =>
  Builder.expression.query([
    Builder.command({
      name: 'row',
      args: [
        expr.func.node({
          name: '=',
          subtype: 'binary-expression',
          args: [
            expr.column('a'),
            expr.list.literal({
              values: [1, 2, 3].map((value) => expr.literal.integer(value)),
            }),
          ],
        }),
      ],
    }),
  ]);

/** `ROW a.b.c = 123` */
const rowNestedColumn = () =>
  Builder.expression.query([
    Builder.command({
      name: 'row',
      args: [
        expr.func.node({
          name: '=',
          subtype: 'binary-expression',
          args: [expr.column(['a', 'b', 'c']), expr.literal.integer(123)],
        }),
      ],
    }),
  ]);

/** `ROW avg(1, 2)` */
const rowCall = () =>
  Builder.expression.query([
    Builder.command({
      name: 'row',
      args: [expr.func.call('avg', [expr.literal.integer(1), expr.literal.integer(2)])],
    }),
  ]);

/** `ROW avg(1, {"a": "b", "c": "d"})` */
const rowCallWithMap = () =>
  Builder.expression.query([
    Builder.command({
      name: 'row',
      args: [
        expr.func.call('avg', [
          expr.literal.integer(1),
          expr.map({
            entries: [
              expr.entry('a', expr.literal.string('b')),
              expr.entry('c', expr.literal.string('d')),
            ],
          }),
        ]),
      ],
    }),
  ]);

/** `FROM a | LIMIT 1` */
const fromLimit = () =>
  Builder.expression.query([
    Builder.command({ name: 'from', args: [expr.source.index('a')] }),
    Builder.command({ name: 'limit', args: [expr.literal.integer(1)] }),
  ]);

/** `FROM a:b` */
const fromSourceWithPrefix = () =>
  Builder.expression.query([
    Builder.command({ name: 'from', args: [expr.source.index('b', 'a')] }),
  ]);

/** `FROM a::b` */
const fromSourceWithSelector = () =>
  Builder.expression.query([
    Builder.command({ name: 'from', args: [expr.source.index('a', undefined, 'b')] }),
  ]);

describe('traversal order', () => {
  describe('command arguments', () => {
    test('by default walks in "forward" order', () => {
      const ast = fromSources();
      const sources: string[] = [];

      walk(ast, {
        visitSource: (src) => sources.push(src.name),
      });

      expect(sources).toStrictEqual(['a', 'b', 'c']);
    });

    test('can explicitly specify "forward" order', () => {
      const ast = fromSources();
      const sources: string[] = [];

      walk(ast, {
        visitSource: (src) => sources.push(src.name),
        order: 'forward',
      });

      expect(sources).toStrictEqual(['a', 'b', 'c']);
    });

    test('can walk sources in "backward" order', () => {
      const ast = fromSources();
      const sources: string[] = [];

      walk(ast, {
        visitSource: (src) => sources.push(src.name),
        order: 'backward',
      });

      expect(sources).toStrictEqual(['c', 'b', 'a']);
    });
  });

  describe('array of expressions', () => {
    test('by default walks in "forward" order', () => {
      const ast = fromSources();
      const sources: string[] = [];
      const walker = new Walker({
        visitSource: (src) => sources.push(src.name),
      });

      walker.walkExpression(ast.commands[0].args);

      expect(sources).toStrictEqual(['a', 'b', 'c']);
    });

    test('can explicitly specify "forward" order', () => {
      const ast = fromSources();
      const sources: string[] = [];
      const walker = new Walker({
        visitSource: (src) => sources.push(src.name),
        order: 'forward',
      });

      walker.walkExpression(ast.commands[0].args);

      expect(sources).toStrictEqual(['a', 'b', 'c']);
    });

    test('can walk sources in "backward" order', () => {
      const ast = fromSources();
      const sources: string[] = [];
      const walker = new Walker({
        visitSource: (src) => sources.push(src.name),
        order: 'backward',
      });

      walker.walkExpression(ast.commands[0].args);

      expect(sources).toStrictEqual(['c', 'b', 'a']);
    });
  });

  describe('option arguments', () => {
    test('by default walks in "forward" order', () => {
      const ast = fromWithMetadata();
      const sources: string[] = [];

      walk(ast, {
        visitColumn: (src) => sources.push(src.name),
      });

      expect(sources).toStrictEqual(['a', 'b', 'c']);
    });

    test('can explicitly specify "forward" order', () => {
      const ast = fromWithMetadata();
      const sources: string[] = [];

      walk(ast, {
        visitColumn: (src) => sources.push(src.name),
        order: 'forward',
      });

      expect(sources).toStrictEqual(['a', 'b', 'c']);
    });

    test('can walk fields in "backward" order', () => {
      const ast = fromWithMetadata();
      const sources: string[] = [];

      walk(ast, {
        visitColumn: (src) => sources.push(src.name),
        order: 'backward',
      });

      expect(sources).toStrictEqual(['c', 'b', 'a']);
    });
  });

  describe('list elements', () => {
    test('by default walks in "forward" order', () => {
      const ast = rowList();
      const numbers = Walker.matchAll(ast, { type: 'literal' }) as ESQLLiteral[];

      expect(numbers.map((n) => n.value)).toStrictEqual([1, 2, 3]);
    });

    test('in "backward" order', () => {
      const ast = rowList();
      const numbers = Walker.matchAll(
        ast,
        { type: 'literal' },
        { order: 'backward' }
      ) as ESQLLiteral[];

      expect(numbers.map((n) => n.value)).toStrictEqual([3, 2, 1]);
    });
  });

  describe('column fields', () => {
    test('in "forward" order', () => {
      const ast = rowNestedColumn();
      const numbers = Walker.matchAll(ast, { type: 'identifier' }) as ESQLIdentifier[];

      expect(numbers.map((n) => n.name)).toStrictEqual(['a', 'b', 'c']);
    });

    test('in "backward" order', () => {
      const ast = rowNestedColumn();
      const numbers = Walker.matchAll(
        ast,
        { type: 'identifier' },
        { order: 'backward' }
      ) as ESQLIdentifier[];

      expect(numbers.map((n) => n.name)).toStrictEqual(['c', 'b', 'a']);
    });
  });

  describe('function arguments', () => {
    test('in "forward" order', () => {
      const ast = rowCall();
      const numbers = Walker.matchAll(ast, { type: 'literal' }) as ESQLLiteral[];

      expect(numbers.map((n) => n.value)).toStrictEqual([1, 2]);
    });

    test('in "backward" order', () => {
      const ast = rowCall();
      const numbers = Walker.matchAll(
        ast,
        { type: 'literal' },
        { order: 'backward' }
      ) as ESQLLiteral[];

      expect(numbers.map((n) => n.value)).toStrictEqual([2, 1]);
    });
  });

  describe('map entries', () => {
    test('in "forward" order', () => {
      const ast = rowCallWithMap();
      const numbers = Walker.matchAll(ast, {
        type: 'literal',
        literalType: 'keyword',
      }) as ESQLStringLiteral[];

      expect(numbers.map((n) => n.valueUnquoted)).toStrictEqual(['a', 'b', 'c', 'd']);
    });

    test('in "backward" order', () => {
      const ast = rowCallWithMap();
      const numbers = Walker.matchAll(
        ast,
        {
          type: 'literal',
          literalType: 'keyword',
        },
        { order: 'backward' }
      ) as ESQLStringLiteral[];

      expect(numbers.map((n) => n.valueUnquoted)).toStrictEqual(['d', 'c', 'b', 'a']);
    });
  });

  describe('commands', () => {
    test('in "forward" order', () => {
      const ast = fromLimit();
      const numbers = Walker.matchAll(
        ast,
        {
          type: 'command',
        },
        { order: 'forward' }
      ) as ESQLCommand[];

      expect(numbers.map((n) => n.name)).toStrictEqual(['from', 'limit']);
    });

    test('in "backward" order', () => {
      const ast = fromLimit();
      const numbers = Walker.matchAll(
        ast,
        {
          type: 'command',
        },
        { order: 'backward' }
      ) as ESQLCommand[];

      expect(numbers.map((n) => n.name)).toStrictEqual(['limit', 'from']);
    });
  });

  describe('source components', () => {
    test('in "forward" order', () => {
      const ast = fromSourceWithPrefix();
      const numbers = Walker.matchAll(
        ast,
        { type: 'literal' },
        { order: 'forward' }
      ) as ESQLLiteral[];

      expect(numbers.map((n) => n.value)).toStrictEqual(['a', 'b']);
    });

    test('in "forward" order (selector)', () => {
      const ast = fromSourceWithSelector();
      const numbers = Walker.matchAll(
        ast,
        { type: 'literal' },
        { order: 'forward' }
      ) as ESQLLiteral[];

      expect(numbers.map((n) => n.value)).toStrictEqual(['a', 'b']);
    });

    test('in "backward" order', () => {
      const ast = fromSourceWithPrefix();
      const numbers = Walker.matchAll(
        ast,
        { type: 'literal' },
        { order: 'backward' }
      ) as ESQLLiteral[];

      expect(numbers.map((n) => n.value)).toStrictEqual(['b', 'a']);
    });

    test('in "backward" order (selector)', () => {
      const ast = fromSourceWithSelector();
      const numbers = Walker.matchAll(
        ast,
        { type: 'literal' },
        { order: 'backward' }
      ) as ESQLLiteral[];

      expect(numbers.map((n) => n.value)).toStrictEqual(['b', 'a']);
    });
  });
});
