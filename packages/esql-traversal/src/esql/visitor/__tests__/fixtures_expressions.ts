/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Query fixtures for the expression visitor tests, built with {@link Builder}
 * rather than parsed, since the parser sits above this package in the
 * dependency graph. The comment above each fixture is the ES|QL text it stands
 * in for.
 */

import { Builder } from '@elastic/esql-ast';
import type { ESQLAstItem, ESQLAstQueryExpression, ESQLFunction } from '@elastic/esql-types';
import { expr } from '../../../__tests__/builders';

const binary = (name: string, args: [left: ESQLAstItem, right: ESQLAstItem]): ESQLFunction =>
  expr.func.node({ name, subtype: 'binary-expression', args });

const assign = (target: string, value: ESQLAstItem): ESQLFunction =>
  binary('=', [expr.column(target), [value]]);

const from = (...indices: string[]) =>
  Builder.command({ name: 'from', args: indices.map((index) => expr.source.index(index)) });

const limit = (value: number) =>
  Builder.command({ name: 'limit', args: [expr.literal.integer(value)] });

const by = (column: string) => Builder.option({ name: 'by', args: [expr.column(column)] });

const sortDesc = (column: string) =>
  Builder.command({
    name: 'sort',
    args: [expr.order(expr.column(column), { order: 'DESC', nulls: '' })],
  });

// FROM index | STATS 1, "str", [true], a = b BY field | LIMIT 123
export const fromStatsMixedByLimit = (): ESQLAstQueryExpression =>
  Builder.expression.query([
    from('index'),
    Builder.command({
      name: 'stats',
      args: [
        expr.literal.integer(1),
        expr.literal.string('str'),
        expr.list.literal({ values: [expr.literal.boolean(true)] }),
        assign('a', expr.column('b')),
        by('field'),
      ],
    }),
    limit(123),
  ]);

// FROM index | STATS 0, 1, 2, 3 | LIMIT 123
export const fromStatsNumbersLimit = (): ESQLAstQueryExpression =>
  Builder.expression.query([
    from('index'),
    Builder.command({
      name: 'stats',
      args: [0, 1, 2, 3].map((value) => expr.literal.integer(value)),
    }),
    limit(123),
  ]);

// FROM index | STATS a
export const fromStatsColumn = (): ESQLAstQueryExpression =>
  Builder.expression.query([
    from('index'),
    Builder.command({ name: 'stats', args: [expr.column('a')] }),
  ]);

// ROW fn(1, {"a": 2})
export const rowFnWithMap = (): ESQLAstQueryExpression =>
  Builder.expression.query([
    Builder.command({
      name: 'row',
      args: [
        expr.func.call('fn', [
          expr.literal.integer(1),
          expr.map({ entries: [expr.entry('a', expr.literal.integer(2))] }),
        ]),
      ],
    }),
  ]);

// ROW fn(1, {"a": 2, "b": "3"})
export const rowFnWithTwoEntryMap = (): ESQLAstQueryExpression =>
  Builder.expression.query([
    Builder.command({
      name: 'row',
      args: [
        expr.func.call('fn', [
          expr.literal.integer(1),
          expr.map({
            entries: [
              expr.entry('a', expr.literal.integer(2)),
              expr.entry('b', expr.literal.string('3')),
            ],
          }),
        ]),
      ],
    }),
  ]);

// FROM index | STATS 1 WHERE 2 | LIMIT 123
export const fromStatsWhereLimit = (): ESQLAstQueryExpression =>
  Builder.expression.query([
    from('index'),
    Builder.command({
      name: 'stats',
      args: [expr.where([expr.literal.integer(1), expr.literal.integer(2)])],
    }),
    limit(123),
  ]);

// FROM index | RIGHT JOIN a ON c
export const fromRightJoin = (): ESQLAstQueryExpression =>
  Builder.expression.query([
    from('index'),
    Builder.command({
      name: 'join',
      commandType: 'right',
      args: [expr.source.index('a'), Builder.option({ name: 'on', args: [expr.column('c')] })],
    }),
  ]);

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
export const fromSubqueriesWhereStatsSort = (): ESQLAstQueryExpression =>
  Builder.expression.query([
    Builder.command({
      name: 'from',
      args: [
        expr.source.index('index1'),
        expr.parens(
          Builder.expression.query([
            from('index2'),
            Builder.command({
              name: 'where',
              args: [binary('>', [expr.column('a'), expr.literal.integer(10)])],
            }),
            Builder.command({
              name: 'eval',
              args: [assign('b', binary('*', [expr.column('a'), expr.literal.integer(2)]))],
            }),
            Builder.command({
              name: 'stats',
              args: [
                assign(
                  'cnt',
                  expr.func.node({
                    name: 'count',
                    subtype: 'variadic-call',
                    operator: Builder.identifier('COUNT'),
                    args: [expr.column('*')],
                  })
                ),
                by('c'),
              ],
            }),
            sortDesc('cnt'),
            limit(10),
          ])
        ),
        expr.source.index('index3'),
        expr.parens(
          Builder.expression.query([
            from('index4'),
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
      args: [assign('max', expr.func.call('max', [expr.column('*')])), by('e')],
    }),
    sortDesc('max'),
  ]);
