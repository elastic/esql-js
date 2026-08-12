/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { Builder, isAssignment } from '@elastic/esql-ast';
import type {
  ESQLAstItem,
  ESQLColumn,
  ESQLCommand,
  ESQLCommandOption,
  ESQLFunction,
  ESQLLiteral,
  ESQLSource,
  ESQLList,
  ESQLInlineCast,
  ESQLUnknownItem,
  ESQLIdentifier,
  ESQLMap,
  ESQLMapEntry,
  ESQLOrderExpression,
  ESQLAstHeaderCommand,
  ESQLSingleAstItem,
  ESQLStringLiteral,
} from '@elastic/esql-types';
import { walk, Walker } from '../walker';

const { expression: expr } = Builder;

/**
 * The parser does not mint an `operator` identifier node for binary expressions
 * (except for the `=` inside header commands and the `WHERE` operator of the
 * `STATS` command), so `Builder.expression.func.node` is used here instead of
 * `Builder.expression.func.binary`, which would synthesize one.
 */
const binary = (name: string, args: ESQLAstItem[]): ESQLFunction =>
  expr.func.node({ name, subtype: 'binary-expression', args });

const unary = (name: string, arg: ESQLAstItem): ESQLFunction =>
  expr.func.node({ name, subtype: 'unary-expression', args: [arg] });

const unknown = (): ESQLUnknownItem => ({
  ...Builder.parserFields({ incomplete: true }),
  type: 'unknown',
  name: 'unknown',
});

/** `TS index | EVAL a(b(c(foo)))` */
const tsEvalNestedCalls = () =>
  expr.query([
    Builder.command({ name: 'ts', args: [expr.source.index('index')] }),
    Builder.command({
      name: 'eval',
      args: [
        expr.func.call('a', [expr.func.call('b', [expr.func.call('c', [expr.column('foo')])])]),
      ],
    }),
  ]);

/** `TS source | STATS var0 = bucket(bytes, 1 hour)` */
const tsStatsBucket = () =>
  expr.query([
    Builder.command({ name: 'ts', args: [expr.source.index('source')] }),
    Builder.command({
      name: 'stats',
      args: [
        binary('=', [
          expr.column('var0'),
          expr.func.call('bucket', [expr.column('bytes'), expr.literal.timespan(1, 'hour')]),
        ]),
      ],
    }),
  ]);

/** `FROM index` */
const fromIndex = () =>
  expr.query([Builder.command({ name: 'from', args: [expr.source.index('index')] })]);

/** `FROM index | STATS a = 123 | WHERE 123 | LIMIT 10` */
const fromStatsWhereLimit = () =>
  expr.query([
    Builder.command({ name: 'from', args: [expr.source.index('index')] }),
    Builder.command({
      name: 'stats',
      args: [binary('=', [expr.column('a'), expr.literal.integer(123)])],
    }),
    Builder.command({ name: 'where', args: [expr.literal.integer(123)] }),
    Builder.command({ name: 'limit', args: [expr.literal.integer(10)] }),
  ]);

/** `FROM index | WHERE field IN (FROM sub_index | KEEP sub_field)` */
const fromWhereInSubquery = () =>
  expr.query([
    Builder.command({ name: 'from', args: [expr.source.index('index')] }),
    Builder.command({
      name: 'where',
      args: [
        binary('in', [
          expr.column('field'),
          expr.parens(
            expr.query([
              Builder.command({ name: 'from', args: [expr.source.index('sub_index')] }),
              Builder.command({ name: 'keep', args: [expr.column('sub_field')] }),
            ])
          ),
        ]),
      ],
    }),
  ]);

/** `FROM index | LEFT JOIN a ON c, d` */
const fromLeftJoin = () =>
  expr.query([
    Builder.command({ name: 'from', args: [expr.source.index('index')] }),
    Builder.command({
      name: 'join',
      commandType: 'left',
      args: [
        expr.source.index('a'),
        Builder.option({ name: 'on', args: [expr.column('c'), expr.column('d')] }),
      ],
    }),
  ]);

/** `FROM index | SAMPLE 0.25` */
const fromSample = () =>
  expr.query([
    Builder.command({ name: 'from', args: [expr.source.index('index')] }),
    Builder.command({ name: 'sample', args: [expr.literal.decimal(0.25)] }),
  ]);

/** `FROM index | SORT field` */
const fromSortField = () =>
  expr.query([
    Builder.command({ name: 'from', args: [expr.source.index('index')] }),
    Builder.command({ name: 'sort', args: [expr.column('field')] }),
  ]);

/** `FROM index | SORT field DESC, another_field ASC` */
const fromSortFieldDescAsc = () =>
  expr.query([
    Builder.command({ name: 'from', args: [expr.source.index('index')] }),
    Builder.command({
      name: 'sort',
      args: [
        expr.order(expr.column('field'), { order: 'DESC', nulls: '' }),
        expr.order(expr.column('another_field'), { order: 'ASC', nulls: '' }),
      ],
    }),
  ]);

/** `FROM index | SORT field DESC NULLS FIRST, another_field ASC NULLS LAST` */
const fromSortFieldWithNulls = () =>
  expr.query([
    Builder.command({ name: 'from', args: [expr.source.index('index')] }),
    Builder.command({
      name: 'sort',
      args: [
        expr.order(expr.column('field'), { order: 'DESC', nulls: 'NULLS FIRST' }),
        expr.order(expr.column('another_field'), { order: 'ASC', nulls: 'NULLS LAST' }),
      ],
    }),
  ]);

/** `FROM index METADATA _index` */
const fromIndexMetadata = () =>
  expr.query([
    Builder.command({
      name: 'from',
      args: [
        expr.source.index('index'),
        Builder.option({ name: 'metadata', args: [expr.column('_index')] }),
      ],
    }),
  ]);

/** `ROW f(0, {"a": 0})` */
const rowMap = () =>
  expr.query([
    Builder.command({
      name: 'row',
      args: [
        expr.func.call('f', [
          expr.literal.integer(0),
          expr.map(
            {
              entries: [
                expr.entry('a', expr.literal.integer(0), { location: { min: 10, max: 15 } }),
              ],
            },
            { location: { min: 9, max: 16 } }
          ),
        ]),
      ],
    }),
  ]);

/** `ROW f(0, {"a": {"b": 0}})` */
const rowNestedMap = () =>
  expr.query([
    Builder.command({
      name: 'row',
      args: [
        expr.func.call('f', [
          expr.literal.integer(0),
          expr.map(
            {
              entries: [
                expr.entry(
                  'a',
                  expr.map(
                    {
                      entries: [
                        expr.entry('b', expr.literal.integer(0), {
                          location: { min: 16, max: 21 },
                        }),
                      ],
                    },
                    { location: { min: 15, max: 22 } }
                  ),
                  { location: { min: 10, max: 22 } }
                ),
              ],
            },
            { location: { min: 9, max: 23 } }
          ),
        ]),
      ],
    }),
  ]);

/** `ROW f(0, {"a":0, "foo" : /* 1 *\/ "bar"})` */
const rowMapWithComment = () =>
  expr.query([
    Builder.command({
      name: 'row',
      args: [
        expr.func.call('f', [
          expr.literal.integer(0),
          expr.map(
            {
              entries: [
                expr.entry('a', expr.literal.integer(0), { location: { min: 10, max: 14 } }),
                expr.entry('foo', expr.literal.string('bar'), { location: { min: 17, max: 37 } }),
              ],
            },
            { location: { min: 9, max: 38 } }
          ),
        ]),
      ],
    }),
  ]);

/** `FROM a:b` */
const fromPrefixedSource = () =>
  expr.query([Builder.command({ name: 'from', args: [expr.source.index('b', 'a')] })]);

/** `TS index, index2, index3, index4` */
const tsFourSources = () =>
  expr.query([
    Builder.command({
      name: 'ts',
      args: ['index', 'index2', 'index3', 'index4'].map((name) => expr.source.index(name)),
    }),
  ]);

/** `FROM index | STATS a = 123 WHERE c == d` */
const fromStatsWhereBinary = () =>
  expr.query([
    Builder.command({ name: 'from', args: [expr.source.index('index')] }),
    Builder.command({
      name: 'stats',
      args: [
        expr.where([
          binary('=', [expr.column('a'), expr.literal.integer(123)]),
          binary('==', [expr.column('c'), expr.column('d')]),
        ]),
      ],
    }),
  ]);

/** `ROW x = 1` */
const rowAssignment = () =>
  expr.query([
    Builder.command({
      name: 'row',
      args: [binary('=', [expr.column('x'), expr.literal.integer(1)])],
    }),
  ]);

/** `FROM index | STATS a = 123, b = 456` */
const fromStatsTwoAssignments = () =>
  expr.query([
    Builder.command({ name: 'from', args: [expr.source.index('index')] }),
    Builder.command({
      name: 'stats',
      args: [
        binary('=', [expr.column('a'), expr.literal.integer(123)]),
        binary('=', [expr.column('b'), expr.literal.integer(456)]),
      ],
    }),
  ]);

/** `FROM index | KEEP [index].[a]` */
const fromKeepQualifiedColumn = () =>
  expr.query([
    Builder.command({ name: 'from', args: [expr.source.index('index')] }),
    Builder.command({ name: 'keep', args: [expr.column('a', 'index')] }),
  ]);

/** `FROM a | STATS fn(1), agg(true)` */
const fromStatsTwoCalls = () =>
  expr.query([
    Builder.command({ name: 'from', args: [expr.source.index('a')] }),
    Builder.command({
      name: 'stats',
      args: [
        expr.func.call('fn', [expr.literal.integer(1)]),
        expr.func.call('agg', [expr.literal.boolean(true)]),
      ],
    }),
  ]);

/** `FROM index | STATS a = 123, b = "foo", c = true AND false, d = 1 day, e = 4 seconds` */
const fromStatsAllLiterals = () =>
  expr.query([
    Builder.command({ name: 'from', args: [expr.source.index('index')] }),
    Builder.command({
      name: 'stats',
      args: [
        binary('=', [expr.column('a'), expr.literal.integer(123)]),
        binary('=', [expr.column('b'), expr.literal.string('foo')]),
        binary('=', [
          expr.column('c'),
          binary('and', [expr.literal.boolean(true), expr.literal.boolean(false)]),
        ]),
        binary('=', [expr.column('d'), expr.literal.timespan(1, 'day')]),
        binary('=', [expr.column('e'), expr.literal.timespan(4, 'seconds')]),
      ],
    }),
  ]);

/** `FROM index | STATS f(1, "2", g(true) + false, h(j(k(3.14))))` */
const fromStatsNestedCallLiterals = () =>
  expr.query([
    Builder.command({ name: 'from', args: [expr.source.index('index')] }),
    Builder.command({
      name: 'stats',
      args: [
        expr.func.call('f', [
          expr.literal.integer(1),
          expr.literal.string('2'),
          binary('+', [
            expr.func.call('g', [expr.literal.boolean(true)]),
            expr.literal.boolean(false),
          ]),
          expr.func.call('h', [
            expr.func.call('j', [expr.func.call('k', [expr.literal.decimal(3.14)])]),
          ]),
        ]),
      ],
    }),
  ]);

/** `ROW x = [1, 2]` */
const rowNumericList = () =>
  expr.query([
    Builder.command({
      name: 'row',
      args: [
        binary('=', [
          expr.column('x'),
          expr.list.literal({ values: [expr.literal.integer(1), expr.literal.integer(2)] }),
        ]),
      ],
    }),
  ]);

/** `ROW x = [1, 2] + [3.3]` */
const rowNumericListSum = () =>
  expr.query([
    Builder.command({
      name: 'row',
      args: [
        binary('=', [
          expr.column('x'),
          binary('+', [
            expr.list.literal({ values: [expr.literal.integer(1), expr.literal.integer(2)] }),
            expr.list.literal({ values: [expr.literal.decimal(3.3)] }),
          ]),
        ]),
      ],
    }),
  ]);

/** `ROW x = [true, false]` */
const rowBooleanList = () =>
  expr.query([
    Builder.command({
      name: 'row',
      args: [
        binary('=', [
          expr.column('x'),
          expr.list.literal({
            values: [expr.literal.boolean(true), expr.literal.boolean(false)],
          }),
        ]),
      ],
    }),
  ]);

/** `ROW x = [false, false], b([true, true, true])` */
const rowBooleanLists = () =>
  expr.query([
    Builder.command({
      name: 'row',
      args: [
        binary('=', [
          expr.column('x'),
          expr.list.literal({
            values: [expr.literal.boolean(false), expr.literal.boolean(false)],
          }),
        ]),
        expr.func.call('b', [
          expr.list.literal({
            values: [
              expr.literal.boolean(true),
              expr.literal.boolean(true),
              expr.literal.boolean(true),
            ],
          }),
        ]),
      ],
    }),
  ]);

/** `ROW x = ["a", "b"], b(["c", "d", "e"])` */
const rowStringLists = () =>
  expr.query([
    Builder.command({
      name: 'row',
      args: [
        binary('=', [
          expr.column('x'),
          expr.list.literal({
            values: [expr.literal.string('a'), expr.literal.string('b')],
          }),
        ]),
        expr.func.call('b', [
          expr.list.literal({
            values: [expr.literal.string('c'), expr.literal.string('d'), expr.literal.string('e')],
          }),
        ]),
      ],
    }),
  ]);

/** `FROM index | STATS a = 123::integer` */
const fromStatsInlineCast = () =>
  expr.query([
    Builder.command({ name: 'from', args: [expr.source.index('index')] }),
    Builder.command({
      name: 'stats',
      args: [
        binary('=', [
          expr.column('a'),
          expr.inlineCast({ castType: 'integer', value: expr.literal.integer(123) }),
        ]),
      ],
    }),
  ]);

/** `FROM index | WHERE 123 == add(1 + fn(NOT -(a.b.c)::INTEGER /* comment *\/))` */
const fromWhereDeepInlineCast = () =>
  expr.query([
    Builder.command({ name: 'from', args: [expr.source.index('index')] }),
    Builder.command({
      name: 'where',
      args: [
        binary('==', [
          expr.literal.integer(123),
          expr.func.call('add', [
            binary('+', [
              expr.literal.integer(1),
              expr.func.call('fn', [
                unary('not', [
                  binary('*', [
                    expr.literal.integer(-1),
                    expr.inlineCast({
                      castType: 'integer',
                      value: expr.column(['a', 'b', 'c']),
                    }),
                  ]),
                ]),
              ]),
            ]),
          ]),
        ]),
      ],
    }),
  ]);

/** `FROM a | WHERE a IN ()` and `FROM a | WHERE a IN (` */
const fromWhereInIncomplete = () =>
  expr.query([
    Builder.command({ name: 'from', args: [expr.source.index('a')] }),
    Builder.command({ name: 'where', args: [unknown()] }),
  ]);

/** `ROW a(1), b(2)` */
const rowTwoCalls = () =>
  expr.query([
    Builder.command({
      name: 'row',
      args: [
        expr.func.call('a', [expr.literal.integer(1)]),
        expr.func.call('b', [expr.literal.integer(2)]),
      ],
    }),
  ]);

/** `FROM a, b` */
const fromTwoSources = () =>
  expr.query([
    Builder.command({
      name: 'from',
      args: [expr.source.index('a'), expr.source.index('b')],
    }),
  ]);

/** `ROW a | LIMIT 10` */
const rowColumnLimit = () =>
  expr.query([
    Builder.command({ name: 'row', args: [expr.column('a')] }),
    Builder.command({ name: 'limit', args: [expr.literal.integer(10)] }),
  ]);

/** `SET timeout = "30s"; FROM index` */
const setTimeoutFromIndex = () =>
  expr.query([Builder.command({ name: 'from', args: [expr.source.index('index')] })], undefined, [
    Builder.header.command.set([
      expr.func.binary('=', [Builder.identifier('timeout'), expr.literal.string('30s')]),
    ]),
  ]);

/** `SET complex_setting = "value"; FROM index` */
const setComplexSettingFromIndex = () =>
  expr.query([Builder.command({ name: 'from', args: [expr.source.index('index')] })], undefined, [
    Builder.header.command.set([
      expr.func.binary('=', [Builder.identifier('complex_setting'), expr.literal.string('value')]),
    ]),
  ]);

/** `SET a = 1; SET b = 2; FROM index` */
const setABFromIndex = () =>
  expr.query([Builder.command({ name: 'from', args: [expr.source.index('index')] })], undefined, [
    Builder.header.command.set([
      expr.func.binary('=', [Builder.identifier('a'), expr.literal.integer(1)]),
    ]),
    Builder.header.command.set([
      expr.func.binary('=', [Builder.identifier('b'), expr.literal.integer(2)]),
    ]),
  ]);

/** `SET a = 1; FROM index` */
const setAFromIndex = () =>
  expr.query([Builder.command({ name: 'from', args: [expr.source.index('index')] })], undefined, [
    Builder.header.command.set([
      expr.func.binary('=', [Builder.identifier('a'), expr.literal.integer(1)]),
    ]),
  ]);

/** `SET a = 1; SET b = 2; SET c = 3; FROM index` */
const setABCFromIndex = () =>
  expr.query(
    [Builder.command({ name: 'from', args: [expr.source.index('index')] })],
    undefined,
    [1, 2, 3].map((value, i) =>
      Builder.header.command.set([
        expr.func.binary('=', [
          Builder.identifier(['a', 'b', 'c'][i]),
          expr.literal.integer(value),
        ]),
      ])
    )
  );

/** `SET a = 1; SET b = "value"; SET c = true; FROM index` */
const setMixedFromIndex = () =>
  expr.query([Builder.command({ name: 'from', args: [expr.source.index('index')] })], undefined, [
    Builder.header.command.set([
      expr.func.binary('=', [Builder.identifier('a'), expr.literal.integer(1)]),
    ]),
    Builder.header.command.set([
      expr.func.binary('=', [Builder.identifier('b'), expr.literal.string('value')]),
    ]),
    Builder.header.command.set([
      expr.func.binary('=', [Builder.identifier('c'), expr.literal.boolean(true)]),
    ]),
  ]);

/** `SET a = 1; SET b = 2; FROM index | LIMIT 10` */
const setABFromIndexLimit = () =>
  expr.query(
    [
      Builder.command({ name: 'from', args: [expr.source.index('index')] }),
      Builder.command({ name: 'limit', args: [expr.literal.integer(10)] }),
    ],
    undefined,
    [
      Builder.header.command.set([
        expr.func.binary('=', [Builder.identifier('a'), expr.literal.integer(1)]),
      ]),
      Builder.header.command.set([
        expr.func.binary('=', [Builder.identifier('b'), expr.literal.integer(2)]),
      ]),
    ]
  );

/**
 * ```
 * FROM index1,
 *      (FROM index2
 *       | WHERE a > 10
 *       | EVAL b = a * 2
 *       | STATS cnt = COUNT(*) BY c
 *       | SORT cnt desc
 *       | LIMIT 10),
 *      index3,
 *      (FROM index4 | STATS count(*))
 * | WHERE d > 10
 * | STATS max = max(*) BY e
 * | SORT max desc
 * ```
 */
const fromWithSubqueries = () =>
  expr.query([
    Builder.command({
      name: 'from',
      args: [
        expr.source.index('index1'),
        expr.parens(
          expr.query([
            Builder.command({ name: 'from', args: [expr.source.index('index2')] }),
            Builder.command({
              name: 'where',
              args: [binary('>', [expr.column('a'), expr.literal.integer(10)])],
            }),
            Builder.command({
              name: 'eval',
              args: [
                binary('=', [
                  expr.column('b'),
                  binary('*', [expr.column('a'), expr.literal.integer(2)]),
                ]),
              ],
            }),
            Builder.command({
              name: 'stats',
              args: [
                binary('=', [
                  expr.column('cnt'),
                  expr.func.call(Builder.identifier('COUNT'), [expr.column('*')]),
                ]),
                Builder.option({ name: 'by', args: [expr.column('c')] }),
              ],
            }),
            Builder.command({
              name: 'sort',
              args: [expr.order(expr.column('cnt'), { order: 'DESC', nulls: '' })],
            }),
            Builder.command({ name: 'limit', args: [expr.literal.integer(10)] }),
          ])
        ),
        expr.source.index('index3'),
        expr.parens(
          expr.query([
            Builder.command({ name: 'from', args: [expr.source.index('index4')] }),
            Builder.command({
              name: 'stats',
              args: [expr.func.call('count', [expr.column('*')])],
            }),
          ])
        ),
      ],
    }),
    Builder.command({
      name: 'where',
      args: [binary('>', [expr.column('d'), expr.literal.integer(10)])],
    }),
    Builder.command({
      name: 'stats',
      args: [
        binary('=', [expr.column('max'), expr.func.call('max', [expr.column('*')])]),
        Builder.option({ name: 'by', args: [expr.column('e')] }),
      ],
    }),
    Builder.command({
      name: 'sort',
      args: [expr.order(expr.column('max'), { order: 'DESC', nulls: '' })],
    }),
  ]);

describe('structurally can walk all nodes', () => {
  test('can walk all functions', () => {
    const root = tsEvalNestedCalls();
    const functions: string[] = [];

    walk(root, {
      visitFunction: (fn) => functions.push(fn.name),
    });

    expect(functions.sort()).toStrictEqual(['a', 'b', 'c']);
  });

  test('can find assignment expression', () => {
    const root = tsStatsBucket();
    const functions: ESQLFunction[] = [];

    Walker.walk(root, {
      visitFunction: (fn) => {
        if (fn.name === '=') {
          functions.push(fn);
        }
      },
    });

    expect(functions.length).toBe(1);
    expect(functions[0].name).toBe('=');
    expect(functions[0].args.length).toBe(2);
    expect((functions[0].args[0] as ESQLIdentifier).name).toBe('var0');
  });

  describe('commands', () => {
    test('can visit a single source command', () => {
      const ast = fromIndex().commands;
      const commands: ESQLCommand[] = [];

      walk(ast, {
        visitCommand: (cmd) => commands.push(cmd),
      });

      expect(commands.map(({ name }) => name).sort()).toStrictEqual(['from']);
    });

    test('can visit all commands', () => {
      const ast = fromStatsWhereLimit().commands;
      const commands: ESQLCommand[] = [];

      walk(ast, {
        visitCommand: (cmd) => commands.push(cmd),
      });

      expect(commands.map(({ name }) => name).sort()).toStrictEqual([
        'from',
        'limit',
        'stats',
        'where',
      ]);
    });

    test('can visit commands inside an IN subquery', () => {
      const ast = fromWhereInSubquery().commands;
      const commands: ESQLCommand[] = [];

      walk(ast, {
        visitCommand: (cmd) => commands.push(cmd),
      });

      expect(commands.map(({ name }) => name)).toStrictEqual(['from', 'where', 'from', 'keep']);
    });

    test('can traverse JOIN command', () => {
      const ast = fromLeftJoin().commands;
      const commands: ESQLCommand[] = [];
      const sources: ESQLSource[] = [];
      const identifiers: ESQLIdentifier[] = [];
      const columns: ESQLColumn[] = [];

      walk(ast, {
        visitCommand: (cmd) => commands.push(cmd),
        visitSource: (id) => sources.push(id),
        visitIdentifier: (id) => identifiers.push(id),
        visitColumn: (col) => columns.push(col),
      });

      expect(commands.map(({ name }) => name).sort()).toStrictEqual(['from', 'join']);
      expect(sources.map(({ name }) => name).sort()).toStrictEqual(['a', 'index']);
      expect(identifiers.map(({ name }) => name).sort()).toStrictEqual(['c', 'd']);
      expect(columns.map(({ name }) => name).sort()).toStrictEqual(['c', 'd']);
    });

    test('can traverse SAMPLE command', () => {
      const root = fromSample();
      const commands: ESQLCommand[] = [];
      const literals: ESQLLiteral[] = [];

      walk(root, {
        visitCommand: (cmd) => commands.push(cmd),
        visitLiteral: (lit) => literals.push(lit),
      });

      expect(commands.map(({ name }) => name).sort()).toStrictEqual(['from', 'sample']);
      expect(literals.length).toBe(2);
      expect(literals[0].value).toBe('index');
      expect(literals[1].value).toBe(0.25);
    });

    test('"visitAny" can capture command nodes', () => {
      const ast = fromStatsWhereLimit().commands;
      const commands: ESQLCommand[] = [];

      walk(ast, {
        visitAny: (node) => {
          if (node.type === 'command') commands.push(node);
        },
      });

      expect(commands.map(({ name }) => name).sort()).toStrictEqual([
        'from',
        'limit',
        'stats',
        'where',
      ]);
    });

    describe('SORT command', () => {
      test('can visit a SORT field', () => {
        const ast = fromSortField();
        const nodes: ESQLColumn[] = [];

        walk(ast, {
          visitColumn: (node) => nodes.push(node),
        });

        expect(nodes).toMatchObject([
          {
            type: 'column',
            name: 'field',
          },
        ]);
      });

      test('can visit a SORT field with DESC order', () => {
        const ast = fromSortFieldDescAsc();
        const nodes: ESQLColumn[] = [];

        walk(ast, {
          visitColumn: (node) => nodes.push(node),
        });

        expect(nodes).toMatchObject([
          {
            type: 'column',
            name: 'field',
          },
          {
            type: 'column',
            name: 'another_field',
          },
        ]);
      });

      test('can visit a SORT command "order" node', () => {
        const ast = fromSortFieldWithNulls();
        const nodes: ESQLOrderExpression[] = [];

        walk(ast, {
          visitOrder: (node) => nodes.push(node),
        });

        expect(nodes).toMatchObject([
          {
            type: 'order',
            order: 'DESC',
            nulls: 'NULLS FIRST',
          },
          {
            type: 'order',
            order: 'ASC',
            nulls: 'NULLS LAST',
          },
        ]);
      });
    });

    describe('command options', () => {
      test('can visit command options', () => {
        const ast = fromIndexMetadata().commands;
        const options: ESQLCommandOption[] = [];

        walk(ast, {
          visitCommandOption: (opt) => options.push(opt),
        });

        expect(options.length).toBe(1);
        expect(options[0].name).toBe('metadata');
      });

      test('"visitAny" can capture an options node', () => {
        const ast = fromIndexMetadata().commands;
        const options: ESQLCommandOption[] = [];

        walk(ast, {
          visitAny: (node) => {
            if (node.type === 'option') options.push(node);
          },
        });

        expect(options.length).toBe(1);
        expect(options[0].name).toBe('metadata');
      });
    });
  });

  describe('expressions', () => {
    describe('maps', () => {
      test('can visit a "map" expression', () => {
        const src = 'ROW f(0, {"a": 0})';
        const ast = rowMap().commands;
        const nodes: ESQLMap[] = [];

        walk(ast, {
          visitMap: (node) => nodes.push(node),
        });

        expect(nodes).toMatchObject([
          {
            type: 'map',
          },
        ]);
        expect(src.slice(nodes[0].location!.min, nodes[0].location!.max + 1)).toBe('{"a": 0}');
      });

      test('can nested "map" expression', () => {
        const src = 'ROW f(0, {"a": {"b": 0}})';
        const ast = rowNestedMap().commands;
        const nodes: ESQLMap[] = [];

        walk(ast, {
          visitMap: (node) => nodes.push(node),
        });

        expect(nodes.length).toBe(2);
        expect(src.slice(nodes[0].location!.min, nodes[0].location!.max + 1)).toBe(
          '{"a": {"b": 0}}'
        );
        expect(src.slice(nodes[1].location!.min, nodes[1].location!.max + 1)).toBe('{"b": 0}');
      });

      test('can visit a "map-entry" expression', () => {
        const src = 'ROW f(0, {"a":0, "foo" : /* 1 */ "bar"})';
        const ast = rowMapWithComment().commands;
        const nodes: ESQLMapEntry[] = [];

        walk(ast, {
          visitMapEntry: (node) => nodes.push(node),
        });

        expect(nodes).toMatchObject([
          {
            type: 'map-entry',
          },
          {
            type: 'map-entry',
          },
        ]);
        expect(src.slice(nodes[0].location!.min, nodes[0].location!.max + 1)).toBe('"a":0');
        expect(src.slice(nodes[1].location!.min, nodes[1].location!.max + 1)).toBe(
          '"foo" : /* 1 */ "bar"'
        );
      });
    });

    describe('sources', () => {
      test('can visit "source" components', () => {
        const ast = fromPrefixedSource().commands;
        const nodes: ESQLLiteral[] = [];

        walk(ast, {
          visitLiteral: (node) => nodes.push(node),
        });

        expect(nodes).toMatchObject([
          {
            type: 'literal',
            valueUnquoted: 'a',
          },
          {
            type: 'literal',
            valueUnquoted: 'b',
          },
        ]);
      });

      test('iterates through a single source', () => {
        const ast = fromIndex().commands;
        const sources: ESQLSource[] = [];

        walk(ast, {
          visitSource: (opt) => sources.push(opt),
        });

        expect(sources.length).toBe(1);
        expect(sources[0].name).toBe('index');
      });

      test('"visitAny" can capture a source node', () => {
        const ast = fromIndex().commands;
        const sources: ESQLSource[] = [];

        walk(ast, {
          visitAny: (node) => {
            if (node.type === 'source') sources.push(node);
          },
        });

        expect(sources.length).toBe(1);
        expect(sources[0].name).toBe('index');
      });

      test('iterates through all sources', () => {
        const ast = tsFourSources().commands;
        const sources: ESQLSource[] = [];

        walk(ast, {
          visitSource: (opt) => sources.push(opt),
        });

        expect(sources.length).toBe(4);
        expect(sources.map(({ name }) => name).sort()).toEqual([
          'index',
          'index2',
          'index3',
          'index4',
        ]);
      });

      test('can walk through "WHERE" binary expression', () => {
        const root = fromStatsWhereBinary();
        const expressions: ESQLFunction[] = [];

        walk(root, {
          visitFunction: (node) => {
            if (node.name === 'where') {
              expressions.push(node);
            }
          },
        });

        expect(expressions.length).toBe(1);
        expect(expressions[0]).toMatchObject({
          type: 'function',
          subtype: 'binary-expression',
          name: 'where',
          args: [
            {
              type: 'function',
              name: '=',
            },
            {
              type: 'function',
              name: '==',
            },
          ],
        });
      });
    });

    describe('columns', () => {
      test('can walk through a single column', () => {
        const ast = rowAssignment().commands;
        const columns: ESQLColumn[] = [];

        walk(ast, {
          visitColumn: (node) => columns.push(node),
        });

        expect(columns).toMatchObject([
          {
            type: 'column',
            name: 'x',
          },
        ]);
      });

      test('"visitAny" can capture a column', () => {
        const ast = rowAssignment().commands;
        const columns: ESQLColumn[] = [];

        walk(ast, {
          visitAny: (node) => {
            if (node.type === 'column') columns.push(node);
          },
        });

        expect(columns).toMatchObject([
          {
            type: 'column',
            name: 'x',
          },
        ]);
      });

      test('can walk through multiple columns', () => {
        const ast = fromStatsTwoAssignments().commands;
        const columns: ESQLColumn[] = [];

        walk(ast, {
          visitColumn: (node) => columns.push(node),
        });

        expect(columns).toMatchObject([
          {
            type: 'column',
            name: 'a',
          },
          {
            type: 'column',
            name: 'b',
          },
        ]);
      });

      test('can walk thtough columns with qualified names', () => {
        const ast = fromKeepQualifiedColumn().commands;
        const columns: ESQLColumn[] = [];
        walk(ast, {
          visitColumn: (node) => columns.push(node),
        });
        expect(columns).toMatchObject([
          {
            type: 'column',
            name: '[index].[a]',
            qualifier: { name: 'index' },
          },
        ]);
      });
    });

    describe('functions', () => {
      test('can walk through functions', () => {
        const ast = fromStatsTwoCalls().commands;
        const nodes: ESQLFunction[] = [];

        walk(ast, {
          visitFunction: (node) => nodes.push(node),
        });

        expect(nodes).toMatchObject([
          {
            type: 'function',
            name: 'fn',
          },
          {
            type: 'function',
            name: 'agg',
          },
        ]);
      });

      test('"visitAny" can capture function nodes', () => {
        const ast = fromStatsTwoCalls().commands;
        const nodes: ESQLFunction[] = [];

        walk(ast, {
          visitAny: (node) => {
            if (node.type === 'function') nodes.push(node);
          },
        });

        expect(nodes).toMatchObject([
          {
            type: 'function',
            name: 'fn',
          },
          {
            type: 'function',
            name: 'agg',
          },
        ]);
      });
    });

    describe('literals', () => {
      test('can walk a single literal', () => {
        const ast = rowAssignment().commands;
        const columns: ESQLLiteral[] = [];

        walk(ast, {
          visitLiteral: (node) => columns.push(node),
        });

        expect(columns).toMatchObject([
          {
            type: 'literal',
            name: '1',
          },
        ]);
      });

      test('can walk through all literals', () => {
        const ast = fromStatsAllLiterals().commands;
        const columns: ESQLLiteral[] = [];

        walk(ast, {
          visitLiteral: (node) => columns.push(node),
        });

        expect(columns).toMatchObject<Array<Partial<ESQLLiteral>>>([
          {
            type: 'literal',
            literalType: 'keyword',
            value: 'index',
          },
          {
            type: 'literal',
            literalType: 'integer',
            value: 123,
          },
          {
            type: 'literal',
            literalType: 'keyword',
            value: '"foo"',
          },
          {
            type: 'literal',
            literalType: 'boolean',
            value: 'true',
          },
          {
            type: 'literal',
            literalType: 'boolean',
            value: 'false',
          },
          {
            type: 'literal',
            literalType: 'date_period',
            unit: 'day',
            quantity: 1,
          },
          {
            type: 'literal',
            literalType: 'time_duration',
            unit: 'seconds',
            quantity: 4,
          },
        ]);
      });

      test('can walk through literals inside functions', () => {
        const ast = fromStatsNestedCallLiterals().commands;
        const columns: ESQLLiteral[] = [];

        walk(ast, {
          visitLiteral: (node) => columns.push(node),
        });

        expect(columns).toMatchObject([
          {
            type: 'literal',
            literalType: 'keyword',
            value: 'index',
          },
          {
            type: 'literal',
            literalType: 'integer',
            name: '1',
          },
          {
            type: 'literal',
            literalType: 'keyword',
            name: '"2"',
          },
          {
            type: 'literal',
            literalType: 'boolean',
            name: 'true',
          },
          {
            type: 'literal',
            literalType: 'boolean',
            name: 'false',
          },
          {
            type: 'literal',
            literalType: 'double',
            name: '3.14',
          },
        ]);
      });
    });

    describe('list literals', () => {
      describe('numeric', () => {
        test('can walk a single numeric list literal', () => {
          const ast = rowNumericList().commands;
          const lists: ESQLList[] = [];

          walk(ast, {
            visitListLiteral: (node) => lists.push(node),
          });

          expect(lists).toMatchObject([
            {
              type: 'list',
              values: [
                {
                  type: 'literal',
                  literalType: 'integer',
                  name: '1',
                },
                {
                  type: 'literal',
                  literalType: 'integer',
                  name: '2',
                },
              ],
            },
          ]);
        });

        test('"visitAny" can capture a list literal', () => {
          const ast = rowNumericList().commands;
          const lists: ESQLList[] = [];

          walk(ast, {
            visitAny: (node) => {
              if (node.type === 'list') lists.push(node);
            },
          });

          expect(lists.length).toBe(1);
        });

        test('can walk plain literals inside list literal', () => {
          const ast = rowNumericListSum().commands;
          const lists: ESQLList[] = [];
          const literals: ESQLLiteral[] = [];

          walk(ast, {
            visitListLiteral: (node) => lists.push(node),
            visitLiteral: (node) => literals.push(node),
          });

          expect(lists).toMatchObject([
            {
              type: 'list',
              values: [
                {
                  type: 'literal',
                  literalType: 'integer',
                  name: '1',
                },
                {
                  type: 'literal',
                  literalType: 'integer',
                  name: '2',
                },
              ],
            },
            {
              type: 'list',
              values: [
                {
                  type: 'literal',
                  literalType: 'double',
                  name: '3.3',
                },
              ],
            },
          ]);
          expect(literals).toMatchObject([
            {
              type: 'literal',
              literalType: 'integer',
              name: '1',
            },
            {
              type: 'literal',
              literalType: 'integer',
              name: '2',
            },
            {
              type: 'literal',
              literalType: 'double',
              name: '3.3',
            },
          ]);
        });
      });

      describe('boolean', () => {
        test('can walk a single numeric list literal', () => {
          const ast = rowBooleanList().commands;
          const lists: ESQLList[] = [];

          walk(ast, {
            visitListLiteral: (node) => lists.push(node),
          });

          expect(lists).toMatchObject([
            {
              type: 'list',
              values: [
                {
                  type: 'literal',
                  literalType: 'boolean',
                  name: 'true',
                },
                {
                  type: 'literal',
                  literalType: 'boolean',
                  name: 'false',
                },
              ],
            },
          ]);
        });

        test('can walk plain literals inside list literal', () => {
          const ast = rowBooleanLists().commands;
          const lists: ESQLList[] = [];
          const literals: ESQLLiteral[] = [];

          walk(ast, {
            visitListLiteral: (node) => lists.push(node),
            visitLiteral: (node) => literals.push(node),
          });

          expect(lists).toMatchObject([
            {
              type: 'list',
            },
            {
              type: 'list',
            },
          ]);
          expect(literals).toMatchObject([
            {
              type: 'literal',
              literalType: 'boolean',
              name: 'false',
            },
            {
              type: 'literal',
              literalType: 'boolean',
              name: 'false',
            },
            {
              type: 'literal',
              literalType: 'boolean',
              name: 'true',
            },
            {
              type: 'literal',
              literalType: 'boolean',
              name: 'true',
            },
            {
              type: 'literal',
              literalType: 'boolean',
              name: 'true',
            },
          ]);
        });
      });

      describe('string', () => {
        test('can walk string literals', () => {
          const ast = rowStringLists().commands;
          const lists: ESQLList[] = [];
          const literals: ESQLLiteral[] = [];

          walk(ast, {
            visitListLiteral: (node) => lists.push(node),
            visitLiteral: (node) => literals.push(node),
          });

          expect(lists).toMatchObject([
            {
              type: 'list',
            },
            {
              type: 'list',
            },
          ]);
          expect(literals).toMatchObject([
            {
              type: 'literal',
              literalType: 'keyword',
              name: '"a"',
            },
            {
              type: 'literal',
              literalType: 'keyword',
              name: '"b"',
            },
            {
              type: 'literal',
              literalType: 'keyword',
              name: '"c"',
            },
            {
              type: 'literal',
              literalType: 'keyword',
              name: '"d"',
            },
            {
              type: 'literal',
              literalType: 'keyword',
              name: '"e"',
            },
          ]);
        });
      });
    });

    describe('cast expression', () => {
      test('can visit cast expression', () => {
        const ast = fromStatsInlineCast().commands;

        const casts: ESQLInlineCast[] = [];

        walk(ast, {
          visitInlineCast: (node) => casts.push(node),
        });

        expect(casts).toMatchObject([
          {
            type: 'inlineCast',
            castType: 'integer',
            value: {
              type: 'literal',
              literalType: 'integer',
              value: 123,
            },
          },
        ]);
      });

      test('can visit a column inside a deeply nested inline cast', () => {
        const root = fromWhereDeepInlineCast();

        const columns: ESQLColumn[] = [];

        walk(root, {
          visitColumn: (node) => columns.push(node),
        });

        expect(columns).toMatchObject([
          {
            type: 'column',
            name: 'a.b.c',
          },
        ]);
      });

      test('"visitAny" can capture cast expression', () => {
        const ast = fromStatsInlineCast().commands;
        const casts: ESQLInlineCast[] = [];

        walk(ast, {
          visitAny: (node) => {
            if (node.type === 'inlineCast') casts.push(node);
          },
        });

        expect(casts).toMatchObject([
          {
            type: 'inlineCast',
            castType: 'integer',
            value: {
              type: 'literal',
              literalType: 'integer',
              value: 123,
            },
          },
        ]);
      });
    });
  });

  describe('unknown nodes', () => {
    test('can iterate through "unknown" nodes', () => {
      const ast = fromIndex().commands;
      let source: ESQLSource | undefined;

      walk(ast, {
        visitSource: (src) => (source = src),
      });

      (source! as unknown as ESQLUnknownItem).type = 'unknown';

      const unknowns: ESQLUnknownItem[] = [];

      walk(ast, {
        visitUnknown: (node) => unknowns.push(node),
      });

      expect(unknowns).toMatchObject([
        {
          type: 'unknown',
        },
      ]);
    });

    test.each(['FROM a | WHERE a IN ()', 'FROM a | WHERE a IN ('])(
      'visits incomplete IN expressions as unknown nodes: %s',
      (src) => {
        const ast = fromWhereInIncomplete().commands;
        const functions: ESQLFunction[] = [];
        const unknowns: ESQLUnknownItem[] = [];

        walk(ast, {
          visitFunction: (node) => functions.push(node),
          visitUnknown: (node) => unknowns.push(node),
        });

        expect(functions).toEqual([]);
        expect(unknowns).toMatchObject([
          {
            type: 'unknown',
            incomplete: true,
          },
        ]);
      }
    );
  });

  describe('returns parent nodes', () => {
    test('function arguments', () => {
      const ast = rowTwoCalls();
      const tuples: Array<[value: number, function: string]> = [];

      walk(ast, {
        visitLiteral: (node, parent) => {
          tuples.push([node.value as number, (parent as ESQLFunction).name]);
        },
      });

      expect(tuples).toStrictEqual([
        [1, 'a'],
        [2, 'b'],
      ]);
    });
  });

  test('source parent command', () => {
    const ast = fromTwoSources();
    const tuples: Array<[index: string, command: string]> = [];

    walk(ast, {
      visitSource: (node, parent) => {
        tuples.push([node.name, (parent as ESQLCommand).name]);
      },
    });

    expect(tuples).toStrictEqual([
      ['a', 'from'],
      ['b', 'from'],
    ]);
  });

  test('column parent', () => {
    const ast = rowColumnLimit();
    const tuples: Array<[index: string, command: string]> = [];

    walk(ast, {
      visitColumn: (node, parent) => {
        tuples.push([node.name, (parent as ESQLCommand).name]);
      },
      order: 'backward',
    });

    expect(tuples).toStrictEqual([['a', 'row']]);
  });
});

describe('header commands', () => {
  describe('visitHeaderCommand', () => {
    test('can visit a single SET header command', () => {
      const root = setTimeoutFromIndex();
      const headerCommands: ESQLAstHeaderCommand[] = [];

      walk(root, {
        visitHeaderCommand: (cmd) => headerCommands.push(cmd),
      });

      expect(headerCommands.length).toBe(1);
      expect(headerCommands[0]).toMatchObject({
        type: 'header-command',
        name: 'set',
      });
    });

    test('can visit multiple SET header commands', () => {
      const root = setABCFromIndex();
      const headerCommands: ESQLAstHeaderCommand[] = [];

      walk(root, {
        visitHeaderCommand: (cmd) => headerCommands.push(cmd),
      });

      expect(headerCommands.length).toBe(3);
      expect(headerCommands.map((cmd) => cmd.name)).toStrictEqual(['set', 'set', 'set']);
    });

    test('"visitAny" can capture header command nodes', () => {
      const root = setTimeoutFromIndex();
      const headerCommands: ESQLAstHeaderCommand[] = [];

      walk(root, {
        visitAny: (node) => {
          if (node.type === 'header-command') headerCommands.push(node);
        },
      });

      expect(headerCommands.length).toBe(1);
      expect(headerCommands[0]).toMatchObject({
        type: 'header-command',
        name: 'set',
      });
    });

    test('header commands are visited before regular commands', () => {
      const root = setABFromIndexLimit();
      const visitOrder: string[] = [];

      walk(root, {
        visitHeaderCommand: (cmd) => visitOrder.push(`header:${cmd.name}`),
        visitCommand: (cmd) => visitOrder.push(`command:${cmd.name}`),
      });

      expect(visitOrder).toStrictEqual([
        'header:set',
        'header:set',
        'command:from',
        'command:limit',
      ]);
    });
  });

  describe('header command arguments', () => {
    test('can visit arguments in a SET command', () => {
      const root = setTimeoutFromIndex();
      const identifiers: ESQLIdentifier[] = [];
      const literals: ESQLLiteral[] = [];
      const functions: ESQLFunction[] = [];

      walk(root, {
        visitHeaderCommand: (cmd) => {},
        visitIdentifier: (node) => {
          if (node.name !== '=') {
            identifiers.push(node);
          }
        },
        visitLiteral: (node) => {
          if ((node as ESQLStringLiteral).valueUnquoted === '30s') {
            literals.push(node);
          }
        },
        visitFunction: (node) => functions.push(node),
      });

      expect(identifiers).toMatchObject([{ name: 'timeout' }]);
      expect(literals).toMatchObject([{ valueUnquoted: '30s' }]);
      expect(functions).toMatchObject([{ name: '=' }]);
    });

    test('can visit arguments in multiple SET commands', () => {
      const root = setMixedFromIndex();
      const identifiers: ESQLIdentifier[] = [];
      const literals: ESQLLiteral[] = [];

      walk(root, {
        visitHeaderCommand: (cmd) => {
          walk(cmd.args, {
            visitIdentifier: (node) => {
              if (node.name !== '=') {
                identifiers.push(node);
              }
            },
            visitLiteral: (node) => literals.push(node),
          });
        },
      });

      expect(identifiers.map((i) => i.name)).toStrictEqual(['a', 'b', 'c']);
      expect(literals.length).toBe(3);
      expect(literals).toMatchObject([{ value: 1 }, { valueUnquoted: 'value' }, { value: 'true' }]);
    });

    test('assignment expressions in header commands are visited as functions', () => {
      const root = setTimeoutFromIndex();
      const functions: ESQLFunction[] = [];

      walk(root, {
        visitFunction: (fn) => {
          if (fn.name === '=') {
            functions.push(fn);
          }
        },
      });

      expect(functions.length).toBe(1);
      expect(functions[0]).toMatchObject({
        type: 'function',
        subtype: 'binary-expression',
        name: '=',
        args: expect.arrayContaining([
          expect.objectContaining({ type: 'identifier', name: 'timeout' }),
          expect.objectContaining({ type: 'literal' }),
        ]),
      });
    });

    test('can traverse nested expressions in header command args', () => {
      const root = setComplexSettingFromIndex();
      let headerCommand: ESQLAstHeaderCommand | undefined;
      const allNodeTypes = new Set<string>();

      walk(root, {
        visitAny: (node) => {
          allNodeTypes.add(node.type);
          if (node.type === 'header-command') {
            headerCommand = node;
          }
        },
      });

      expect(headerCommand).toBeDefined();
      expect(allNodeTypes.has('header-command')).toBe(true);
      expect(allNodeTypes.has('function')).toBe(true); // the assignment operator
      expect(allNodeTypes.has('identifier')).toBe(true); // complex_setting
      expect(allNodeTypes.has('literal')).toBe(true); // "value"
    });
  });

  describe('Walker.match with header commands', () => {
    test('can match header commands by type', () => {
      const root = setABFromIndex();
      const headerCommand = Walker.match(root, { type: 'header-command' });

      expect(headerCommand).toMatchObject({
        type: 'header-command',
        name: 'set',
      });
    });

    test('can match header commands by name', () => {
      const root = setTimeoutFromIndex();
      const setCommand = Walker.match(root, { type: 'header-command', name: 'set' });

      expect(setCommand).toMatchObject({
        type: 'header-command',
        name: 'set',
      });
    });

    test('can match all header commands', () => {
      const root = setABCFromIndex();
      const headerCommands = Walker.matchAll(root, { type: 'header-command' });

      expect(headerCommands.length).toBe(3);
      expect(headerCommands.every((cmd) => cmd.type === 'header-command')).toBe(true);
    });
  });

  describe('Walker.parent with header commands', () => {
    test('can find parent of header command', () => {
      const root = setAFromIndex();
      const headerCommand = Walker.match(root, { type: 'header-command' });
      const parent = Walker.parent(root, headerCommand!);

      expect(parent).toMatchObject({
        type: 'query',
      });
    });

    test('can find parent of identifier in header command', () => {
      const root = setTimeoutFromIndex();
      const identifier = Walker.match(root, { type: 'identifier', name: 'timeout' });
      const parent = Walker.parent(root, identifier!);

      // The identifier's parent is the assignment function
      expect(parent).toMatchObject({
        type: 'function',
        name: '=',
      });
    });
  });

  describe('backward traversal order with header commands', () => {
    test('walks header commands in backward order', () => {
      const root = setABCFromIndex();
      const headerOrder: string[] = [];

      walk(root, {
        visitHeaderCommand: (cmd) => {
          const identifier = cmd.args[0];
          if (isAssignment(identifier)) {
            headerOrder.push((identifier.args[0] as ESQLSingleAstItem).name);
          }
        },
        order: 'backward',
      });

      expect(headerOrder).toStrictEqual(['c', 'b', 'a']);
    });
  });

  describe('skipHeader option', () => {
    test('skips header commands when skipHeader is true', () => {
      const root = setABFromIndexLimit();
      const headerCommands: ESQLAstHeaderCommand[] = [];
      const regularCommands: ESQLCommand[] = [];

      walk(root, {
        visitHeaderCommand: (cmd) => headerCommands.push(cmd),
        visitCommand: (cmd) => regularCommands.push(cmd),
        skipHeader: true,
      });

      expect(headerCommands.length).toBe(0);
      expect(regularCommands.length).toBe(2);
      expect(regularCommands.map((cmd) => cmd.name)).toStrictEqual(['from', 'limit']);
    });

    test('processes header commands when skipHeader is false', () => {
      const root = setABFromIndexLimit();
      const headerCommands: ESQLAstHeaderCommand[] = [];
      const regularCommands: ESQLCommand[] = [];

      walk(root, {
        visitHeaderCommand: (cmd) => headerCommands.push(cmd),
        visitCommand: (cmd) => regularCommands.push(cmd),
        skipHeader: false,
      });

      expect(headerCommands.length).toBe(2);
      expect(regularCommands.length).toBe(2);
      expect(headerCommands.map((cmd) => cmd.name)).toStrictEqual(['set', 'set']);
      expect(regularCommands.map((cmd) => cmd.name)).toStrictEqual(['from', 'limit']);
    });
  });

  describe('parens (subquery)', () => {
    test('can visit complex subqueries with processing', () => {
      const ast = fromWithSubqueries().commands;
      let parensCount = 0;
      const sources: string[] = [];

      walk(ast, {
        visitParens: (node) => {
          parensCount++;
        },
        visitSource: (node) => {
          sources.push(node.name);
        },
      });

      expect(parensCount).toBe(2);
      expect(sources).toEqual(['index1', 'index2', 'index3', 'index4']);
    });
  });
});
