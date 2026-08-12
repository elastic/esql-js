/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { Builder, PromQLBuilder } from '@elastic/esql-ast';
import type {
  ESQLAstItem,
  ESQLAstPromqlCommand,
  ESQLAstQueryExpression,
  ESQLAstRerankCommand,
  ESQLBinaryExpression,
  ESQLCommandOption,
  ESQLFunction,
  ESQLIntegerLiteral,
  ESQLMap,
  ESQLNumericLiteral,
  ESQLStringLiteral,
  PromQLAstExpression,
  PromQLAstQueryExpression,
  PromQLEvaluation,
  PromQLLabel,
  PromQLLabelMap,
  PromQLLabelMatchOperator,
  PromQLLabelValue,
  PromQLSelector,
} from '@elastic/esql-types';
import { Walker } from '../walker';

const { expression: expr } = Builder;
const { expression: pexpr } = PromQLBuilder;

/**
 * Builds a binary expression the same way the parser does: binary operators
 * carry no synthetic `operator` identifier node.
 */
const binary = (name: string, left: ESQLAstItem, right: ESQLAstItem): ESQLFunction =>
  expr.func.node({ name, subtype: 'binary-expression', args: [left, right] });

const unary = (name: string, arg: ESQLAstItem): ESQLFunction =>
  expr.func.node({ name, subtype: 'unary-expression', args: [arg] });

const promqlCommand = (query: PromQLAstQueryExpression, params?: ESQLMap): ESQLAstPromqlCommand => {
  const command = Builder.command({ name: 'promql' }) as ESQLAstPromqlCommand;

  command.args = (params ? [params, query] : [query]) as ESQLAstPromqlCommand['args'];
  command.query = query;

  if (params) {
    command.params = params;
  }

  return command;
};

const pquery = (expression: PromQLAstExpression): PromQLAstQueryExpression =>
  pexpr.query(expression);

const pstr = (value: string) => pexpr.literal.string(value, `"${value}"`);

const psel = (
  metric: string,
  options: {
    labelMap?: PromQLLabelMap;
    duration?: PromQLAstExpression;
    evaluation?: PromQLEvaluation;
  } = {}
): PromQLSelector => pexpr.selector.node({ metric: PromQLBuilder.identifier(metric), ...options });

const plabel = (
  name: string,
  operator: PromQLLabelMatchOperator,
  value?: PromQLLabelValue
): PromQLLabel => PromQLBuilder.label(PromQLBuilder.identifier(name), operator, value);

/** `FROM index | STATS a = 123 | WHERE 123 | LIMIT 10 | RERANK "query" ON field WITH id` */
const fromStatsWhereLimitRerank = () =>
  Builder.expression.query([
    Builder.command({ name: 'from', args: [expr.source.index('index')] }),
    Builder.command({
      name: 'stats',
      args: [binary('=', expr.column('a'), expr.literal.integer(123))],
    }),
    Builder.command({ name: 'where', args: [expr.literal.integer(123)] }),
    Builder.command({ name: 'limit', args: [expr.literal.integer(10)] }),
    Builder.command({
      name: 'rerank',
      args: [
        expr.literal.string('query'),
        Builder.option({ name: 'on', args: [expr.column('field')] }),
        Builder.option({ name: 'with', args: [expr.map()] }),
      ],
    }),
  ]);

/** `ROW x = ?` */
const rowUnnamedParam = () =>
  Builder.expression.query([
    Builder.command({
      name: 'row',
      args: [binary('=', expr.column('x'), Builder.param.unnamed())],
    }),
  ]);

/** `PROMQL sum by (??labels) (bytes)` */
const promqlSumByDoubleParam = () =>
  Builder.expression.query([
    promqlCommand(
      pquery(
        pexpr.func.call(
          'sum',
          [psel('bytes')],
          PromQLBuilder.grouping('by', [pexpr.literal.param('labels', undefined, '??')]),
          'before'
        )
      )
    ),
  ]);

/** `PROMQL metric{job=?job}` */
const promqlNamedParamLabel = () =>
  Builder.expression.query([
    promqlCommand(
      pquery(
        psel('metric', {
          labelMap: PromQLBuilder.labelMap([plabel('job', '=', pexpr.literal.param('job'))]),
        })
      )
    ),
  ]);

/** `PROMQL metric{job=?1}` */
const promqlPositionalParamLabel = () =>
  Builder.expression.query([
    promqlCommand(
      pquery(
        psel('metric', {
          labelMap: PromQLBuilder.labelMap([plabel('job', '=', pexpr.literal.param(1))]),
        })
      )
    ),
  ]);

/** `PROMQL k=?v bytes_in{job="test"}` */
const promqlNamedArgument = () =>
  Builder.expression.query([
    promqlCommand(
      pquery(
        psel('bytes_in', {
          labelMap: PromQLBuilder.labelMap([plabel('job', '=', pstr('test'))]),
        })
      ),
      expr.map({
        representation: 'assignment',
        entries: [expr.entry(Builder.identifier('k'), Builder.param.build('?v'))],
      })
    ),
  ]);

/** `PROMQL step=?step sum by (??labels) (bytes) | WHERE x == ?other` */
const promqlStepSumByWhere = () =>
  Builder.expression.query([
    promqlCommand(
      pquery(
        pexpr.func.call(
          'sum',
          [psel('bytes')],
          PromQLBuilder.grouping('by', [pexpr.literal.param('labels', undefined, '??')]),
          'before'
        )
      ),
      expr.map({
        representation: 'assignment',
        entries: [expr.entry(Builder.identifier('step'), Builder.param.build('?step'))],
      })
    ),
    Builder.command({
      name: 'where',
      args: [binary('==', expr.column('x'), Builder.param.build('?other'))],
    }),
  ]);

/** `PROMQL sum by (??labels) (rate(bytes{host=?host})) | LIMIT ?lim` */
const promqlNestedParams = () =>
  Builder.expression.query([
    promqlCommand(
      pquery(
        pexpr.func.call(
          'sum',
          [
            pexpr.func.call('rate', [
              psel('bytes', {
                labelMap: PromQLBuilder.labelMap([
                  plabel('host', '=', pexpr.literal.param('host')),
                ]),
              }),
            ]),
          ],
          PromQLBuilder.grouping('by', [pexpr.literal.param('labels', undefined, '??')]),
          'before'
        )
      )
    ),
    Builder.command({ name: 'limit', args: [Builder.param.build('?lim')] }),
  ]);

/** `PROMQL step=?step sum by (??labels) (bytes)` */
const promqlStepSumBy = () =>
  Builder.expression.query([
    promqlCommand(
      pquery(
        pexpr.func.call(
          'sum',
          [psel('bytes')],
          PromQLBuilder.grouping('by', [pexpr.literal.param('labels', undefined, '??')]),
          'before'
        )
      ),
      expr.map({
        representation: 'assignment',
        entries: [expr.entry(Builder.identifier('step'), Builder.param.build('?step'))],
      })
    ),
  ]);

/** `ROW x=1, time=2024-07-10 | stats z = avg(x) by bucket(time, 20, ?_tstart,?_tend)` */
const rowStatsBucketParams = () =>
  Builder.expression.query([
    Builder.command({
      name: 'row',
      args: [
        binary('=', expr.column('x'), expr.literal.integer(1)),
        binary(
          '=',
          expr.column('time'),
          binary(
            '-',
            binary('-', expr.literal.integer(2024), expr.literal.integer(7)),
            expr.literal.integer(10)
          )
        ),
      ],
    }),
    Builder.command({
      name: 'stats',
      args: [
        binary('=', expr.column('z'), expr.func.call('avg', [expr.column('x')])),
        Builder.option({
          name: 'by',
          args: [
            expr.func.call('bucket', [
              expr.column('time'),
              expr.literal.integer(20),
              Builder.param.build('?_tstart'),
              Builder.param.build('?_tend'),
            ]),
          ],
        }),
      ],
    }),
  ]);

/** `ROW ?a.?b` */
const rowParamColumn = () =>
  Builder.expression.query([Builder.command({ name: 'row', args: [expr.column(['?a', '?b'])] })]);

/** `ROW a.?b` */
const rowPartialParamColumn = () =>
  Builder.expression.query([Builder.command({ name: 'row', args: [expr.column(['a', '?b'])] })]);

/** `ROW ?.?0.?a` */
const rowAllParamTypesColumn = () =>
  Builder.expression.query([
    Builder.command({ name: 'row', args: [expr.column(['?', '?0', '?a'])] }),
  ]);

/** `FROM a | STATS ?lala()` */
const statsNamedParamFunctionName = () =>
  Builder.expression.query([
    Builder.command({ name: 'from', args: [expr.source.index('a')] }),
    Builder.command({
      name: 'stats',
      args: [expr.func.call(Builder.param.build('?lala'), [])],
    }),
  ]);

/** `FROM a | STATS ?()` */
const statsUnnamedParamFunctionName = () =>
  Builder.expression.query([
    Builder.command({ name: 'from', args: [expr.source.index('a')] }),
    Builder.command({
      name: 'stats',
      args: [expr.func.call(Builder.param.unnamed(), [])],
    }),
  ]);

/** `FROM a | STATS agg(test), ?123()` */
const statsPositionalParamFunctionName = () =>
  Builder.expression.query([
    Builder.command({ name: 'from', args: [expr.source.index('a')] }),
    Builder.command({
      name: 'stats',
      args: [
        expr.func.call('agg', [expr.column('test')]),
        expr.func.call(Builder.param.build('?123'), []),
      ],
    }),
  ]);

/**
 * `FROM a | WHERE MATCH( aws.s3.bucket.name, ?variable, {"minimum_should_match": ?min_should_match})`
 */
const whereMatchWithMapParams = () =>
  Builder.expression.query([
    Builder.command({ name: 'from', args: [expr.source.index('a')] }),
    Builder.command({
      name: 'where',
      args: [
        expr.func.call('MATCH', [
          expr.column(['aws', 's3', 'bucket', 'name']),
          Builder.param.build('?variable'),
          expr.map({
            entries: [expr.entry('minimum_should_match', Builder.param.build('?min_should_match'))],
          }),
        ]),
      ],
    }),
  ]);

/** `FROM b | STATS var0 = bucket(bytes, 1 hour), fn(1), fn(2), agg(true)` */
const statsFunctions = () =>
  Builder.expression.query([
    Builder.command({ name: 'from', args: [expr.source.index('b')] }),
    Builder.command({
      name: 'stats',
      args: [
        binary(
          '=',
          expr.column('var0'),
          expr.func.call('bucket', [expr.column('bytes'), expr.literal.timespan(1, 'hour')])
        ),
        expr.func.call('fn', [expr.literal.integer(1)]),
        expr.func.call('fn', [expr.literal.integer(2)]),
        expr.func.call('agg', [expr.literal.boolean(true)]),
      ],
    }),
  ]);

const rerankCommand = (inferenceId: string) =>
  Builder.command({
    name: 'rerank',
    args: [
      expr.literal.string('query'),
      Builder.option({ name: 'on', args: [expr.column('field')] }),
      Builder.option({
        name: 'with',
        args: [
          expr.map({ entries: [expr.entry('inference_id', expr.literal.string(inferenceId))] }),
        ],
      }),
    ],
  });

/**
 * `FROM b | RERANK "query" ON field WITH { "inference_id": "abc" } | RERANK "query" ON field
 * WITH { "inference_id": "my_id" } | LIMIT 10`
 */
const rerankQueries = () =>
  Builder.expression.query([
    Builder.command({ name: 'from', args: [expr.source.index('b')] }),
    rerankCommand('abc'),
    rerankCommand('my_id'),
    Builder.command({ name: 'limit', args: [expr.literal.integer(10)] }),
  ]);

/** `PROMQL sum by (job) (rate(bytes{host="a"}[5m])) | LIMIT 10` */
const promqlSumByJobRate = () =>
  Builder.expression.query([
    promqlCommand(
      pquery(
        pexpr.func.call(
          'sum',
          [
            pexpr.func.call('rate', [
              psel('bytes', {
                labelMap: PromQLBuilder.labelMap([plabel('host', '=', pstr('a'))]),
                duration: pexpr.literal.time('5m'),
              }),
            ]),
          ],
          PromQLBuilder.grouping('by', [PromQLBuilder.identifier('job')]),
          'before'
        )
      )
    ),
    Builder.command({ name: 'limit', args: [expr.literal.integer(10)] }),
  ]);

/** `PROMQL sum(bytes) | LIMIT 10` */
const promqlSumBytes = () =>
  Builder.expression.query([
    promqlCommand(pquery(pexpr.func.call('sum', [psel('bytes')]))),
    Builder.command({ name: 'limit', args: [expr.literal.integer(10)] }),
  ]);

/** `PROMQL sum(rate(bytes[5m])) | LIMIT 10` */
const promqlSumRateLimit = () =>
  Builder.expression.query([
    promqlCommand(
      pquery(
        pexpr.func.call('sum', [
          pexpr.func.call('rate', [psel('bytes', { duration: pexpr.literal.time('5m') })]),
        ])
      )
    ),
    Builder.command({ name: 'limit', args: [expr.literal.integer(10)] }),
  ]);

/** `PROMQL sum(rate(bytes[5m])) | STATS avg(x)` */
const promqlSumRateStats = () =>
  Builder.expression.query([
    promqlCommand(
      pquery(
        pexpr.func.call('sum', [
          pexpr.func.call('rate', [psel('bytes', { duration: pexpr.literal.time('5m') })]),
        ])
      )
    ),
    Builder.command({ name: 'stats', args: [expr.func.call('avg', [expr.column('x')])] }),
  ]);

/** `PROMQL sum(rate(bytes[5m]))` */
const promqlSumRate = () =>
  Builder.expression.query([
    promqlCommand(
      pquery(
        pexpr.func.call('sum', [
          pexpr.func.call('rate', [psel('bytes', { duration: pexpr.literal.time('5m') })]),
        ])
      )
    ),
  ]);

/** `FROM index | WHERE 123 == add(1 + fn(NOT 10 + -(a.b.c::ip)::INTEGER /* comment *\/))` */
const whereDeeplyNestedColumn = () =>
  Builder.expression.query([
    Builder.command({ name: 'from', args: [expr.source.index('index')] }),
    Builder.command({
      name: 'where',
      args: [
        binary(
          '==',
          expr.literal.integer(123),
          expr.func.call('add', [
            binary(
              '+',
              expr.literal.integer(1),
              expr.func.call('fn', [
                unary(
                  'not',
                  binary(
                    '+',
                    expr.literal.integer(10),
                    unary(
                      '-',
                      expr.inlineCast({
                        castType: 'integer',
                        value: expr.inlineCast({
                          castType: 'ip',
                          value: expr.column(['a', 'b', 'c']),
                        }),
                      })
                    )
                  )
                ),
              ])
            ),
          ])
        ),
      ],
    }),
  ]);

/** `ROW F(1, {"b": ?var, "a": 123})` */
const rowFunctionWithMap = () =>
  Builder.expression.query([
    Builder.command({
      name: 'row',
      args: [
        expr.func.call('F', [
          expr.literal.integer(1),
          expr.map({
            entries: [
              expr.entry('b', Builder.param.build('?var')),
              expr.entry('a', expr.literal.integer(123)),
            ],
          }),
        ]),
      ],
    }),
  ]);

/** `FROM index | LEFT JOIN a | RIGHT JOIN b` */
const joins = () =>
  Builder.expression.query([
    Builder.command({ name: 'from', args: [expr.source.index('index')] }),
    Builder.command({
      name: 'join',
      commandType: 'left',
      args: [expr.source.index('a')],
    }),
    Builder.command({
      name: 'join',
      commandType: 'right',
      args: [expr.source.index('b')],
    }),
  ]);

/** `PROMQL step=1m sum by (job) (rate(bytes{host="a"}[5m])) | LIMIT 10` */
const promqlStepLiteralSumByJobRate = () =>
  Builder.expression.query([
    promqlCommand(
      pquery(
        pexpr.func.call(
          'sum',
          [
            pexpr.func.call('rate', [
              psel('bytes', {
                labelMap: PromQLBuilder.labelMap([plabel('host', '=', pstr('a'))]),
                duration: pexpr.literal.time('5m'),
              }),
            ]),
          ],
          PromQLBuilder.grouping('by', [PromQLBuilder.identifier('job')]),
          'before'
        )
      ),
      expr.map({
        representation: 'assignment',
        entries: [
          expr.entry(
            Builder.identifier('step'),
            expr.list.bare({ values: [expr.source.index('1m')] })
          ),
        ],
      })
    ),
    Builder.command({ name: 'limit', args: [expr.literal.integer(10)] }),
  ]);

/** `FROM index | WHERE a > 1 | LIMIT 10` */
const fromWhereGreaterLimit = () =>
  Builder.expression.query([
    Builder.command({ name: 'from', args: [expr.source.index('index')] }),
    Builder.command({
      name: 'where',
      args: [binary('>', expr.column('a'), expr.literal.integer(1))],
    }),
    Builder.command({ name: 'limit', args: [expr.literal.integer(10)] }),
  ]);

/** `FROM a | STATS bucket(bytes, 1 hour)` */
const statsBucket = () =>
  Builder.expression.query([
    Builder.command({ name: 'from', args: [expr.source.index('a')] }),
    Builder.command({
      name: 'stats',
      args: [expr.func.call('bucket', [expr.column('bytes'), expr.literal.timespan(1, 'hour')])],
    }),
  ]);

/** `FROM b | STATS var0 == bucket(bytes, 1 hour)` */
const statsBucketEquality = () =>
  Builder.expression.query([
    Builder.command({ name: 'from', args: [expr.source.index('b')] }),
    Builder.command({
      name: 'stats',
      args: [
        binary(
          '==',
          expr.column('var0'),
          expr.func.call('bucket', [expr.column('bytes'), expr.literal.timespan(1, 'hour')])
        ),
      ],
    }),
  ]);

/** `FROM a | STATS a(b(1), c(2), d(3))` */
const statsNestedCalls = () =>
  Builder.expression.query([
    Builder.command({ name: 'from', args: [expr.source.index('a')] }),
    Builder.command({
      name: 'stats',
      args: [
        expr.func.call('a', [
          expr.func.call('b', [expr.literal.integer(1)]),
          expr.func.call('c', [expr.literal.integer(2)]),
          expr.func.call('d', [expr.literal.integer(3)]),
        ]),
      ],
    }),
  ]);

/** `FROM index` */
const fromIndex = () =>
  Builder.expression.query([Builder.command({ name: 'from', args: [expr.source.index('index')] })]);

/** `PROMQL rate(bytes{host="a"}[5m])` */
const promqlRateWithLabel = () =>
  Builder.expression.query([
    promqlCommand(
      pquery(
        pexpr.func.call('rate', [
          psel('bytes', {
            labelMap: PromQLBuilder.labelMap([plabel('host', '=', pstr('a'))]),
            duration: pexpr.literal.time('5m'),
          }),
        ])
      )
    ),
  ]);

/** `PROMQL rate(bytes[5m])` */
const promqlRate = () =>
  Builder.expression.query([
    promqlCommand(
      pquery(pexpr.func.call('rate', [psel('bytes', { duration: pexpr.literal.time('5m') })]))
    ),
  ]);

/** `FROM index | STATS a = agg(1 - b(3 + c(4)))` */
const statsNestedAgg = () =>
  Builder.expression.query([
    Builder.command({ name: 'from', args: [expr.source.index('index')] }),
    Builder.command({
      name: 'stats',
      args: [
        binary(
          '=',
          expr.column('a'),
          expr.func.call('agg', [
            binary(
              '-',
              expr.literal.integer(1),
              expr.func.call('b', [
                binary(
                  '+',
                  expr.literal.integer(3),
                  expr.func.call('c', [expr.literal.integer(4)])
                ),
              ])
            ),
          ])
        ),
      ],
    }),
  ]);

/** `PROMQL sum(rate(bytes{host="a"}[5m])) | LIMIT 10` */
const promqlSumRateWithLabel = () =>
  Builder.expression.query([
    promqlCommand(
      pquery(
        pexpr.func.call('sum', [
          pexpr.func.call('rate', [
            psel('bytes', {
              labelMap: PromQLBuilder.labelMap([plabel('host', '=', pstr('a'))]),
              duration: pexpr.literal.time('5m'),
            }),
          ]),
        ])
      )
    ),
    Builder.command({ name: 'limit', args: [expr.literal.integer(10)] }),
  ]);

/**
 * ```
 * // top comment
 * FROM index | LIMIT 10 // trailing comment
 * ```
 */
const commentedQuery = () => {
  const from = Builder.command({ name: 'from', args: [expr.source.index('index')] });
  const ten = expr.literal.integer(10);

  from.formatting = { top: [Builder.comment('single-line', ' top comment')] };
  ten.formatting = { rightSingleLine: Builder.comment('single-line', ' trailing comment') };

  return Builder.expression.query([from, Builder.command({ name: 'limit', args: [ten] })]);
};

/**
 * ```
 * PROMQL
 *   # top comment
 *   rate(bytes[5m]) # trailing comment
 * | LIMIT 10 // esql comment
 * ```
 */
const promqlCommentedQuery = () => {
  const rate = pexpr.func.call('rate', [psel('bytes', { duration: pexpr.literal.time('5m') })]);
  const ten = expr.literal.integer(10);

  rate.formatting = {
    top: [Builder.comment('single-line', ' top comment')],
    rightSingleLine: Builder.comment('single-line', ' trailing comment'),
  };
  ten.formatting = { rightSingleLine: Builder.comment('single-line', ' esql comment') };

  return Builder.expression.query([
    promqlCommand(pquery(rate)),
    Builder.command({ name: 'limit', args: [ten] }),
  ]);
};

/** `FROM index | WHERE a == 123` */
const fromWhereEquals123 = () =>
  Builder.expression.query([
    Builder.command({ name: 'from', args: [expr.source.index('index')] }),
    Builder.command({
      name: 'where',
      args: [binary('==', expr.column('a'), expr.literal.integer(123))],
    }),
  ]);

/** `FROM index | EVAL a = "x" | WHERE a == 123 | LIMIT 10` */
const fromEvalWhereLimit = () =>
  Builder.expression.query([
    Builder.command({ name: 'from', args: [expr.source.index('index')] }),
    Builder.command({
      name: 'eval',
      args: [binary('=', expr.column('a'), expr.literal.string('x'))],
    }),
    Builder.command({
      name: 'where',
      args: [binary('==', expr.column('a'), expr.literal.integer(123))],
    }),
    Builder.command({ name: 'limit', args: [expr.literal.integer(10)] }),
  ]);

/** `FROM index | WHERE a == 123 AND b > 123` */
const fromWhereEqualsAnd = () =>
  Builder.expression.query([
    Builder.command({ name: 'from', args: [expr.source.index('index')] }),
    Builder.command({
      name: 'where',
      args: [
        binary(
          'and',
          binary('==', expr.column('a'), expr.literal.integer(123)),
          binary('>', expr.column('b'), expr.literal.integer(123))
        ),
      ],
    }),
  ]);

/** `PROMQL rate(bytes{host=?host}[5m])` */
const promqlRateParamHost = () =>
  Builder.expression.query([
    promqlCommand(
      pquery(
        pexpr.func.call('rate', [
          psel('bytes', {
            labelMap: PromQLBuilder.labelMap([plabel('host', '=', pexpr.literal.param('host'))]),
            duration: pexpr.literal.time('5m'),
          }),
        ])
      )
    ),
  ]);

/** `PROMQL bytes{host=?x} | WHERE y == ?x` */
const promqlParamInBothDialects = () =>
  Builder.expression.query([
    promqlCommand(
      pquery(
        psel('bytes', {
          labelMap: PromQLBuilder.labelMap([plabel('host', '=', pexpr.literal.param('x'))]),
        })
      )
    ),
    Builder.command({
      name: 'where',
      args: [binary('==', expr.column('y'), Builder.param.build('?x'))],
    }),
  ]);

/**
 * Returns the integer literal values found in the AST, in traversal order. Used
 * in place of pretty-printing the mutated query.
 */
const integerValues = (ast: ESQLAstQueryExpression): number[] =>
  Walker.matchAll(ast, { type: 'literal', literalType: 'integer' }).map(
    (node) => (node as ESQLIntegerLiteral).value
  );

describe('Walker static methods', () => {
  describe('Walker.commands()', () => {
    test('can collect all commands', () => {
      const ast = fromStatsWhereLimitRerank();
      const commands = Walker.commands(ast);

      expect(commands.map(({ name }) => name).sort()).toStrictEqual([
        'from',
        'limit',
        'rerank',
        'stats',
        'where',
      ]);
    });
  });

  describe('Walker.params()', () => {
    test('can collect all params', () => {
      const ast = rowUnnamedParam();
      const params = Walker.params(ast);

      expect(params).toMatchObject([
        {
          type: 'literal',
          literalType: 'param',
          paramType: 'unnamed',
        },
      ]);
    });

    test('can collect double params from PromQL label lists', () => {
      const root = promqlSumByDoubleParam();
      const params = Walker.params(root);

      expect(params).toMatchObject([
        {
          dialect: 'promql',
          type: 'literal',
          literalType: 'param',
          paramKind: '??',
          paramType: 'named',
          value: 'labels',
        },
      ]);
    });

    test('can collect single named param from PromQL label matcher value', () => {
      const root = promqlNamedParamLabel();
      const params = Walker.params(root);

      expect(params).toMatchObject([
        {
          dialect: 'promql',
          type: 'literal',
          literalType: 'param',
          paramKind: '?',
          paramType: 'named',
          value: 'job',
        },
      ]);
    });

    test('can collect positional param from PromQL label matcher value', () => {
      const root = promqlPositionalParamLabel();
      const params = Walker.params(root);

      expect(params).toMatchObject([
        {
          dialect: 'promql',
          type: 'literal',
          literalType: 'param',
          paramKind: '?',
          paramType: 'positional',
          value: 1,
        },
      ]);
    });

    test('can collect param from PROMQL command named arguments', () => {
      const root = promqlNamedArgument();
      const params = Walker.params(root);

      expect(params).toMatchObject([
        {
          type: 'literal',
          literalType: 'param',
          paramType: 'named',
          value: 'v',
        },
      ]);
    });

    test('collects params from both ES|QL and PromQL parts of a query', () => {
      const root = promqlStepSumByWhere();
      const params = Walker.params(root);

      expect(params).toMatchObject([
        {
          type: 'literal',
          literalType: 'param',
          paramType: 'named',
          value: 'step',
        },
        {
          dialect: 'promql',
          type: 'literal',
          literalType: 'param',
          paramKind: '??',
          paramType: 'named',
          value: 'labels',
        },
        {
          type: 'literal',
          literalType: 'param',
          paramType: 'named',
          value: 'other',
        },
      ]);
    });

    test('can collect params from nested PromQL expressions', () => {
      const root = promqlNestedParams();
      const params = Walker.params(root);

      expect(params).toMatchObject([
        {
          dialect: 'promql',
          paramKind: '??',
          paramType: 'named',
          value: 'labels',
        },
        {
          dialect: 'promql',
          paramKind: '?',
          paramType: 'named',
          value: 'host',
        },
        {
          paramType: 'named',
          value: 'lim',
        },
      ]);
    });

    test('does not clobber caller-supplied literal visitors', () => {
      const root = promqlStepSumBy();
      const esqlLiterals: unknown[] = [];
      const promqlLiterals: unknown[] = [];

      const params = Walker.params(root, {
        visitLiteral: (node) => esqlLiterals.push(node),
        promql: {
          visitPromqlLiteral: (node) => promqlLiterals.push(node),
        },
      });

      expect(params).toMatchObject([{ value: 'step' }, { value: 'labels' }]);
      expect(esqlLiterals.length).toBeGreaterThanOrEqual(1);
      expect(promqlLiterals.length).toBeGreaterThanOrEqual(1);
    });

    test('can collect all params from grouping functions', () => {
      const ast = rowStatsBucketParams();
      const params = Walker.params(ast);

      expect(params).toMatchObject([
        {
          type: 'literal',
          literalType: 'param',
          paramType: 'named',
          value: '_tstart',
        },
        {
          type: 'literal',
          literalType: 'param',
          paramType: 'named',
          value: '_tend',
        },
      ]);
    });

    test('can collect params from column names', () => {
      const ast = rowParamColumn();
      const params = Walker.params(ast);

      expect(params).toMatchObject([
        {
          type: 'literal',
          literalType: 'param',
          paramType: 'named',
          value: 'a',
        },
        {
          type: 'literal',
          literalType: 'param',
          paramType: 'named',
          value: 'b',
        },
      ]);
    });

    test('can collect params from column names, where first part is not a param', () => {
      const ast = rowPartialParamColumn();
      const params = Walker.params(ast);

      expect(params).toMatchObject([
        {
          type: 'literal',
          literalType: 'param',
          paramType: 'named',
          value: 'b',
        },
      ]);
    });

    test('can collect all types of param from column name', () => {
      const ast = rowAllParamTypesColumn();
      const params = Walker.params(ast);

      expect(params).toMatchObject([
        {
          type: 'literal',
          literalType: 'param',
          paramType: 'unnamed',
        },
        {
          type: 'literal',
          literalType: 'param',
          paramType: 'positional',
          value: 0,
        },
        {
          type: 'literal',
          literalType: 'param',
          paramType: 'named',
          value: 'a',
        },
      ]);
    });

    test('can collect params from function names', () => {
      const ast = statsNamedParamFunctionName();
      const params = Walker.params(ast);

      expect(params).toMatchObject([
        {
          type: 'literal',
          literalType: 'param',
          paramType: 'named',
          value: 'lala',
        },
      ]);
    });

    test('can collect params from function names (unnamed)', () => {
      const ast = statsUnnamedParamFunctionName();
      const params = Walker.params(ast);

      expect(params).toMatchObject([
        {
          type: 'literal',
          literalType: 'param',
          paramType: 'unnamed',
        },
      ]);
    });

    test('can collect params from function names (positional)', () => {
      const ast = statsPositionalParamFunctionName();
      const params = Walker.params(ast);

      expect(params).toMatchObject([
        {
          type: 'literal',
          literalType: 'param',
          paramType: 'positional',
          value: 123,
        },
      ]);
    });

    test('can collect params from function trailing map argument', () => {
      const ast = whereMatchWithMapParams();
      const params = Walker.params(ast);

      expect(params).toMatchObject([
        {
          type: 'literal',
          literalType: 'param',
          paramType: 'named',
          value: 'variable',
        },
        {
          type: 'literal',
          literalType: 'param',
          paramType: 'named',
          value: 'min_should_match',
        },
      ]);
    });
  });

  describe('Walker.find()', () => {
    test('can find a bucket() function', () => {
      const fn = Walker.find(
        statsFunctions(),
        (node) => node.type === 'function' && node.name === 'bucket'
      );

      expect(fn).toMatchObject({
        type: 'function',
        name: 'bucket',
      });
    });

    test('can find RERANK by inference_id in WITH map', () => {
      const isWithOption = (arg: ESQLAstItem): arg is ESQLCommandOption =>
        !!arg && !Array.isArray(arg) && arg.type === 'option' && arg.name === 'with';

      const getWithString = (cmd: ESQLAstRerankCommand, key: string): string | undefined => {
        const map = cmd.args.find(isWithOption)!.args[0] as ESQLMap;
        const entry = map.entries.find(
          (e) =>
            e.key.type === 'literal' &&
            e.key.literalType === 'keyword' &&
            e.key.valueUnquoted === key
        );
        const { valueUnquoted } = entry?.value as ESQLStringLiteral;

        return valueUnquoted;
      };

      const command = Walker.find(
        rerankQueries(),
        (node) =>
          node.type === 'command' &&
          node.name === 'rerank' &&
          getWithString(node as ESQLAstRerankCommand, 'inference_id') === 'my_id'
      );

      expect(getWithString(command as ESQLAstRerankCommand, 'inference_id')).toBe('my_id');
    });

    test('finds the first "fn" function', () => {
      const fn = Walker.find(
        statsFunctions(),
        (node) => node.type === 'function' && node.name === 'fn'
      );

      expect(fn).toMatchObject({
        type: 'function',
        name: 'fn',
        args: [
          {
            type: 'literal',
            value: 1,
          },
        ],
      });
    });

    test('can find a function inside a PromQL expression', () => {
      const root = promqlSumByJobRate();
      const fn = Walker.find(root, (node) => node.type === 'function' && node.name === 'rate');

      expect(fn).toMatchObject({
        dialect: 'promql',
        type: 'function',
        name: 'rate',
      });
    });

    test('does not clobber caller-supplied any-node visitors', () => {
      const root = promqlSumBytes();
      const esqlNodes: unknown[] = [];
      const promqlNodes: unknown[] = [];

      const found = Walker.find(root, (node) => node.type === 'selector', {
        visitAny: (node) => esqlNodes.push(node),
        promql: {
          visitPromqlAny: (node) => promqlNodes.push(node),
        },
      });

      expect(found).toMatchObject({ dialect: 'promql', type: 'selector' });
      expect(esqlNodes.length).toBeGreaterThanOrEqual(1);
      expect(promqlNodes.length).toBeGreaterThanOrEqual(1);
    });

    test('aborts traversal once a PromQL node matches', () => {
      const root = promqlSumRateLimit();
      const seen: string[] = [];
      const found = Walker.find(root, (node) => {
        seen.push(node.type);
        return node.type === 'selector';
      });

      expect(found).toMatchObject({ dialect: 'promql', type: 'selector' });
      expect(seen.filter((type) => type === 'command')).toHaveLength(1);
    });
  });

  describe('Walker.findAll()', () => {
    test('find all "fn" functions', () => {
      const list = Walker.findAll(
        statsFunctions(),
        (node) => node.type === 'function' && node.name === 'fn'
      );

      expect(list).toMatchObject([
        {
          type: 'function',
          name: 'fn',
          args: [
            {
              type: 'literal',
              value: 1,
            },
          ],
        },
        {
          type: 'function',
          name: 'fn',
          args: [
            {
              type: 'literal',
              value: 2,
            },
          ],
        },
      ]);
    });

    test('collects functions from both dialects in source order', () => {
      const root = promqlSumRateStats();
      const list = Walker.findAll(root, (node) => node.type === 'function');

      expect(list).toMatchObject([
        { dialect: 'promql', name: 'sum' },
        { dialect: 'promql', name: 'rate' },
        { name: 'avg' },
      ]);
    });

    test('does not clobber caller-supplied any-node visitors', () => {
      const root = promqlSumBytes();
      const esqlNodes: unknown[] = [];
      const promqlNodes: unknown[] = [];

      const list = Walker.findAll(root, (node) => node.type === 'function', {
        visitAny: (node) => esqlNodes.push(node),
        promql: {
          visitPromqlAny: (node) => promqlNodes.push(node),
        },
      });

      expect(list).toMatchObject([{ dialect: 'promql', name: 'sum' }]);
      expect(esqlNodes.length).toBeGreaterThanOrEqual(1);
      expect(promqlNodes.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Walker.match()', () => {
    test('can find a bucket() function', () => {
      const fn = Walker.match(statsFunctions(), {
        type: 'function',
        name: 'bucket',
      });

      expect(fn).toMatchObject({
        type: 'function',
        name: 'bucket',
      });
    });

    test('finds the first "fn" function', () => {
      const fn = Walker.match(statsFunctions(), { type: 'function', name: 'fn' });

      expect(fn).toMatchObject({
        type: 'function',
        name: 'fn',
        args: [
          {
            type: 'literal',
            value: 1,
          },
        ],
      });
    });

    test('can find a deeply nested column', () => {
      const root = whereDeeplyNestedColumn();
      const res = Walker.match(root, {
        type: 'column',
        name: 'a.b.c',
      });

      expect(res).toMatchObject({
        type: 'column',
        name: 'a.b.c',
      });
    });

    test('can find map and inside map', () => {
      const root = rowFunctionWithMap();
      const map = Walker.match(root, {
        type: 'map',
      });
      const number = Walker.match(root, {
        type: 'literal',
        value: 123,
      });
      const param = Walker.match(root, {
        type: 'literal',
        literalType: 'param',
      });

      expect(map).toMatchObject({
        type: 'map',
      });
      expect(number).toMatchObject({
        type: 'literal',
        value: 123,
      });
      expect(param).toMatchObject({
        type: 'literal',
        literalType: 'param',
      });
    });

    test('can find WHERE command by its type', () => {
      const root = joins();

      const join1 = Walker.match(root, {
        type: 'command',
        name: 'join',
        commandType: 'left',
      })!;
      const source1 = Walker.match(join1, {
        type: 'source',
        name: 'a',
      })!;
      const join2 = Walker.match(root, {
        type: 'command',
        name: 'join',
        commandType: 'right',
      })!;
      const source2 = Walker.match(join2, {
        type: 'source',
        name: 'b',
      })!;

      expect(source1).toMatchObject({
        name: 'a',
      });
      expect(source2).toMatchObject({
        name: 'b',
      });
    });

    test('can match a PromQL node by template', () => {
      const root = promqlSumByJobRate();
      const selector = Walker.match(root, { type: 'selector' });

      expect(selector).toMatchObject({
        dialect: 'promql',
        type: 'selector',
        name: 'bytes',
      });
    });
  });

  describe('Walker.matchAll()', () => {
    test('find all "fn" functions', () => {
      const list = Walker.matchAll(statsFunctions(), {
        type: 'function',
        name: 'fn',
      });

      expect(list).toMatchObject([
        {
          type: 'function',
          name: 'fn',
          args: [
            {
              type: 'literal',
              value: 1,
            },
          ],
        },
        {
          type: 'function',
          name: 'fn',
          args: [
            {
              type: 'literal',
              value: 2,
            },
          ],
        },
      ]);
    });

    test('find all "fn" and "agg" functions', () => {
      const list = Walker.matchAll(statsFunctions(), {
        type: 'function',
        name: ['fn', 'agg'],
      });

      expect(list).toMatchObject([
        {
          type: 'function',
          name: 'fn',
          args: [
            {
              type: 'literal',
              value: 1,
            },
          ],
        },
        {
          type: 'function',
          name: 'fn',
          args: [
            {
              type: 'literal',
              value: 2,
            },
          ],
        },
        {
          type: 'function',
          name: 'agg',
        },
      ]);
    });

    test('find all functions which start with "b" or "a"', () => {
      const list = Walker.matchAll(statsFunctions(), {
        type: 'function',
        name: /^a|b/i,
      });

      expect(list).toMatchObject([
        {
          type: 'function',
          name: 'bucket',
        },
        {
          type: 'function',
          name: 'agg',
        },
      ]);
    });

    test('collects literals from both dialects in source order', () => {
      const root = promqlStepLiteralSumByJobRate();
      const literals = Walker.matchAll(root, { type: 'literal' });

      expect(literals).toMatchObject([
        { literalType: 'keyword', value: '1m' },
        { dialect: 'promql', literalType: 'string', value: '"a"' },
        { dialect: 'promql', literalType: 'time', value: '5m' },
        { literalType: 'integer', value: 10 },
      ]);
    });

    test('returns identical results for ES|QL-only queries', () => {
      const root = fromWhereGreaterLimit();
      const literals = Walker.matchAll(root, { type: 'literal' });

      expect(literals.some((node) => 'dialect' in node)).toBe(false);
      expect(literals).toMatchObject([{ value: 'index' }, { value: 1 }, { value: 10 }]);
    });
  });

  describe('Walker.findFunction()', () => {
    test('can find a function by name', () => {
      const has1 = Walker.hasFunction(statsBucket(), '==');
      const has2 = Walker.hasFunction(statsBucketEquality(), '==');

      expect(has1).toBe(false);
      expect(has2).toBe(true);
    });

    test('by default does not match PromQL functions', () => {
      const root = promqlSumRateStats();

      expect(Walker.findFunction(root, 'rate')).toBe(undefined);
      expect(Walker.findFunction(root, 'avg')).toMatchObject({ type: 'function', name: 'avg' });
    });

    test('matches PromQL functions when the "promql" dialect is included', () => {
      const root = promqlSumRateStats();
      const fn = Walker.findFunction(root, 'rate', { dialects: ['esql', 'promql'] });

      expect(fn).toMatchObject({
        dialect: 'promql',
        type: 'function',
        name: 'rate',
      });
    });

    test('does not match ES|QL functions when only the "promql" dialect is selected', () => {
      const root = promqlSumRateStats();

      expect(Walker.findFunction(root, 'avg', { dialects: ['promql'] })).toBe(undefined);
      expect(Walker.findFunction(root, 'sum', { dialects: ['promql'] })).toMatchObject({
        dialect: 'promql',
        name: 'sum',
      });
    });

    test('can find a PromQL function by predicate', () => {
      const root = promqlSumRate();
      const fn = Walker.findFunction(root, (node) => node.name.startsWith('ra'), {
        dialects: ['esql', 'promql'],
      });

      expect(fn).toMatchObject({ dialect: 'promql', name: 'rate' });
    });
  });

  describe('Walker.hasFunction()', () => {
    test('can find binary expression expression', () => {
      const ast = statsNestedCalls();
      const fn1 = Walker.findFunction(ast, 'a');
      const fn2 = Walker.findFunction(ast, 'b');
      const fn3 = Walker.findFunction(ast, 'c');
      const fn4 = Walker.findFunction(ast, 'd');

      expect(fn1).toMatchObject({ type: 'function', name: 'a' });
      expect(fn2).toMatchObject({ type: 'function', name: 'b' });
      expect(fn3).toMatchObject({ type: 'function', name: 'c' });
      expect(fn4).toMatchObject({ type: 'function', name: 'd' });
    });
  });

  describe('Walker.parent()', () => {
    test('can find parent node (FROM command) of a source', () => {
      const ast = fromIndex();
      const child = Walker.match(ast, { type: 'source' })!;
      const parent = Walker.parent(ast, child)!;
      const grandParent = Walker.parent(ast, parent);

      expect(child).toMatchObject({
        type: 'source',
        name: 'index',
      });
      expect(parent).toMatchObject({
        type: 'command',
        name: 'from',
      });
      expect(grandParent).toMatchObject({
        type: 'query',
      });
    });

    test('can find the parent of a PromQL node', () => {
      const root = promqlRateWithLabel();
      const selector = Walker.match(root, { type: 'selector' })!;
      const parent = Walker.parent(root, selector);

      expect(parent).toMatchObject({
        dialect: 'promql',
        type: 'function',
        name: 'rate',
      });
    });

    test('reports the PROMQL command as parent of the PromQL query root', () => {
      const root = promqlRate();
      const promqlQuery = Walker.find(root, (node) => 'dialect' in node && node.type === 'query')!;
      const parent = Walker.parent(root, promqlQuery);

      expect(parent).toMatchObject({
        type: 'command',
        name: 'promql',
      });
    });
  });

  describe('Walker.parents()', () => {
    test('can find all parents of a source', () => {
      const ast = fromIndex();
      const child = Walker.match(ast, { type: 'source' })!;
      const ancestry = Walker.parents(ast, child);

      expect(ancestry).toMatchObject([
        {
          type: 'command',
          name: 'from',
        },
        {
          type: 'query',
        },
      ]);
    });

    test('can find all parents of a nested function', () => {
      const ast = statsNestedAgg();
      const four = Walker.match(ast, { type: 'literal', value: 4 })!;
      const ancestry = Walker.parents(ast, four);

      expect(ancestry).toMatchObject([
        {
          type: 'function',
          name: 'c',
        },
        {
          type: 'function',
          name: '+',
        },
        {
          type: 'function',
          name: 'b',
        },
        {
          type: 'function',
          name: '-',
        },
        {
          type: 'function',
          name: 'agg',
        },
        {
          type: 'function',
          name: '=',
        },
        {
          type: 'command',
          name: 'stats',
        },
        {
          type: 'query',
        },
      ]);
    });

    test('ancestry of a PromQL node crosses the dialect boundary', () => {
      const root = promqlSumRateWithLabel();
      const label = Walker.match(root, { type: 'label' })!;
      const ancestry = Walker.parents(root, label);

      expect(ancestry).toMatchObject([
        { dialect: 'promql', type: 'label-map' },
        { dialect: 'promql', type: 'selector', name: 'bytes' },
        { dialect: 'promql', type: 'function', name: 'rate' },
        { dialect: 'promql', type: 'function', name: 'sum' },
        { dialect: 'promql', type: 'query' },
        { type: 'command', name: 'promql' },
        { type: 'query' },
      ]);
    });
  });

  describe('Walker.visitComments()', () => {
    test('visits ES|QL comments with their attachment', () => {
      const root = commentedQuery();
      const comments: string[] = [];

      Walker.visitComments(root, (comment, node, attachment) => {
        comments.push(`${node.type}/${attachment}:${comment.text.trim()}`);
      });

      expect(comments).toEqual([
        'command/top:top comment',
        'literal/rightSingleLine:trailing comment',
      ]);
    });

    test('visits comments inside embedded PromQL expressions', () => {
      const root = promqlCommentedQuery();
      const comments: string[] = [];

      Walker.visitComments(root, (comment, node, attachment) => {
        const dialect = 'dialect' in node ? node.dialect : 'esql';
        comments.push(`${dialect}/${attachment}:${comment.text.trim()}`);
      });

      expect(comments).toEqual([
        'promql/top:top comment',
        'promql/rightSingleLine:trailing comment',
        'esql/rightSingleLine:esql comment',
      ]);
    });
  });

  describe('Walker.replace()', () => {
    test('can replace a node with another node', () => {
      const ast = fromWhereEquals123();
      const newNode = Builder.expression.literal.integer(456);
      Walker.replace(ast, { type: 'literal', value: 123 }, newNode);

      const comparison = ast.commands[1].args[0] as ESQLBinaryExpression;

      expect(comparison.args[1]).toMatchObject({ type: 'literal', value: 456 }); // 'FROM index | WHERE a == 456'
      expect(integerValues(ast)).toStrictEqual([456]); // 'FROM index | WHERE a == 456'
    });

    test('can replace using a callback', () => {
      const ast = fromWhereEquals123();
      Walker.replace(ast, { type: 'literal', value: 123 }, (oldNode) => {
        const node = oldNode as ESQLIntegerLiteral;
        return Builder.expression.literal.integer(Number(node.value) * 2);
      });

      const comparison = ast.commands[1].args[0] as ESQLBinaryExpression;

      expect(comparison.args[1]).toMatchObject({ type: 'literal', value: 246 }); // 'FROM index | WHERE a == 246'
      expect(integerValues(ast)).toStrictEqual([246]); // 'FROM index | WHERE a == 246'
    });

    test('can find node by predicate function', () => {
      const ast = fromEvalWhereLimit();
      const newNode = Builder.expression.literal.integer(456);
      Walker.replace(ast, (n) => (n as ESQLNumericLiteral<'integer'>).value === 123, newNode);

      const assignment = ast.commands[1].args[0] as ESQLBinaryExpression;
      const comparison = ast.commands[2].args[0] as ESQLBinaryExpression;

      // 'FROM index | EVAL a = "x" | WHERE a == 456 | LIMIT 10'
      expect(assignment.args[1]).toMatchObject({ type: 'literal', valueUnquoted: 'x' });
      expect(comparison.args[1]).toMatchObject({ type: 'literal', value: 456 });
      expect(integerValues(ast)).toStrictEqual([456, 10]);
    });

    test('replaces only the first found node', () => {
      const ast = fromWhereEqualsAnd();
      const newNode = Builder.expression.literal.integer(456);

      Walker.replace(ast, { type: 'literal', value: 123 }, newNode);

      expect(integerValues(ast)).toStrictEqual([456, 123]); // 'FROM index | WHERE a == 456 AND b > 123'

      Walker.replace(ast, { type: 'literal', value: 123 }, newNode);

      expect(integerValues(ast)).toStrictEqual([456, 456]); // 'FROM index | WHERE a == 456 AND b > 456'
    });

    test('returns replaced node', () => {
      const ast = fromWhereEquals123();
      const newNode = Builder.expression.literal.integer(456);
      const replaced = Walker.replace(ast, { type: 'literal', value: 123 }, newNode);

      expect(replaced).toMatchObject({
        type: 'literal',
        value: 456,
      });
    });

    test('can inline a param inside a PromQL expression', () => {
      const root = promqlRateParamHost();
      const replaced = Walker.replace(
        root,
        { type: 'literal', literalType: 'param', value: 'host' },
        PromQLBuilder.expression.literal.string('web-01')
      );

      expect(replaced).toMatchObject({
        dialect: 'promql',
        type: 'literal',
        literalType: 'string',
      });

      const label = Walker.match(root, { type: 'label' }) as PromQLLabel;

      // 'PROMQL rate(bytes{host="web-01"}[5m])'
      expect(label.value).toMatchObject({
        dialect: 'promql',
        type: 'literal',
        literalType: 'string',
        valueUnquoted: 'web-01',
      });
    });
  });

  describe('Walker.replaceAll()', () => {
    test('replaces all instances of a match', () => {
      const ast = fromWhereEqualsAnd();
      const newNode = Builder.expression.literal.integer(456);

      Walker.replaceAll(ast, { type: 'literal', value: 123 }, newNode);

      expect(integerValues(ast)).toStrictEqual([456, 456]); // 'FROM index | WHERE a == 456 AND b > 456'
    });

    test('can replace using a callback all matches', () => {
      const ast = fromWhereEqualsAnd();
      Walker.replaceAll(ast, { type: 'literal', value: 123 }, (oldNode) => {
        const node = oldNode as ESQLIntegerLiteral;
        return Builder.expression.literal.integer(Number(node.value) * 2);
      });

      expect(integerValues(ast)).toStrictEqual([246, 246]); // 'FROM index | WHERE a == 246 AND b > 246'
    });

    test('returns list of updated nodes', () => {
      const ast = fromWhereEqualsAnd();
      const newNode = Builder.expression.literal.integer(456);

      const updatedNodes = Walker.replaceAll(ast, { type: 'literal', value: 123 }, newNode);

      expect(updatedNodes).toMatchObject([
        {
          type: 'literal',
          value: 456,
        },
        {
          type: 'literal',
          value: 456,
        },
      ]);
    });

    test('can replace a param used in both dialects', () => {
      const root = promqlParamInBothDialects();
      const updatedNodes = Walker.replaceAll(
        root,
        { type: 'literal', literalType: 'param', value: 'x' },
        (node) =>
          'dialect' in node
            ? PromQLBuilder.expression.literal.string('web-01')
            : Builder.expression.literal.string('web-01')
      );

      expect(updatedNodes).toHaveLength(2);

      const label = Walker.match(root, { type: 'label' }) as PromQLLabel;
      const comparison = root.commands[1].args[0] as ESQLBinaryExpression;

      // 'PROMQL bytes{host="web-01"} | WHERE y == "web-01"'
      expect(label.value).toMatchObject({
        dialect: 'promql',
        type: 'literal',
        literalType: 'string',
        valueUnquoted: 'web-01',
      });
      expect(comparison.args[1]).toMatchObject({
        type: 'literal',
        literalType: 'keyword',
        valueUnquoted: 'web-01',
      });
    });
  });
});
