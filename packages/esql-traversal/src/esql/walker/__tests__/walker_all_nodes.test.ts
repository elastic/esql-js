/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { Builder, isProperNode } from '@elastic/esql-ast';
import type {
  ESQLAstExpression,
  ESQLAstQueryExpression,
  ESQLProperNode,
} from '@elastic/esql-types';
import { Walker } from '../walker';

const { expression: expr } = Builder;

/** `FROM a` */
const smallest = (): ESQLAstQueryExpression =>
  expr.query([Builder.command({ name: 'from', args: [expr.source.index('a')] })]);

/**
 * ```
 * FROM employees
 * | KEEP first_name, last_name, height
 * | SORT height
 * ```
 */
const sortCommandFromDocs = (): ESQLAstQueryExpression =>
  expr.query([
    Builder.command({ name: 'from', args: [expr.source.index('employees')] }),
    Builder.command({
      name: 'keep',
      args: ['first_name', 'last_name', 'height'].map((name) => expr.column(name)),
    }),
    Builder.command({ name: 'sort', args: [expr.column('height')] }),
  ]);

/**
 * A deliberately rich query, which covers as many node types as possible:
 *
 * ```
 * SET setting = "value";
 * FROM metrics:index::failures, "another_index" METADATA _id, _index
 * | EVAL kb = bytes / 1024 * -1.23, weeks = 5 weeks, hours = 3 hours,
 *        str = "text", nil = NULL, bool = TRUE, unnamed = ?, named = ?named,
 *        positional = ?42, ??field = ?param
 * | WHERE (process.name LIKE "curl*") AND event_duration IS NOT NULL
 * | STATS bytes = (SUM(destination.bytes))::INTEGER BY languages, department
 * | WHERE MATCH(aws.s3.bucket.name, ?variable, {
 *     "minimum_should_match": ?min_should_match,
 *     "fuzziness": 2,
 *     key: "value"
 *   })
 * | WHERE num IN [1, 2, 3] AND (a, b) IN ((1, 2))
 * | SORT @timestamp DESC NULLS FIRST, kb ASC
 * | LIMIT 10
 * ```
 */
const large = (): ESQLAstQueryExpression =>
  expr.query(
    [
      Builder.command({
        name: 'from',
        args: [
          expr.source.index('index', 'metrics', 'failures'),
          expr.source.index('another_index'),
          Builder.option({
            name: 'metadata',
            args: [expr.column('_id'), expr.column('_index')],
          }),
        ],
      }),
      Builder.command({
        name: 'eval',
        args: [
          expr.func.binary('=', [
            expr.column('kb'),
            expr.func.binary('*', [
              expr.func.binary('/', [expr.column('bytes'), expr.literal.integer(1024)]),
              expr.func.unary('-', expr.literal.decimal(1.23)),
            ]),
          ]),
          expr.func.binary('=', [expr.column('weeks'), expr.literal.timespan(5, 'weeks')]),
          expr.func.binary('=', [expr.column('hours'), expr.literal.timespan(3, 'hours')]),
          expr.func.binary('=', [expr.column('str'), expr.literal.string('text')]),
          expr.func.binary('=', [expr.column('nil'), expr.literal.nil()]),
          expr.func.binary('=', [expr.column('bool'), expr.literal.boolean(true)]),
          expr.func.binary('=', [expr.column('unnamed'), Builder.param.unnamed()]),
          expr.func.binary('=', [expr.column('named'), Builder.param.named({ value: 'named' })]),
          expr.func.binary('=', [
            expr.column('positional'),
            Builder.param.positional({ value: 42 }),
          ]),
          expr.func.binary('=', [expr.column(['??field']), Builder.param.build('?param')]),
        ],
      }),
      Builder.command({
        name: 'where',
        args: [
          expr.func.binary('and', [
            expr.parens(
              expr.func.binary('like', [
                expr.column(['name'], 'process'),
                expr.literal.string('curl*'),
              ])
            ),
            expr.func.postfix('is not null', expr.column('event_duration')),
          ]),
        ],
      }),
      Builder.command({
        name: 'stats',
        args: [
          expr.func.binary('=', [
            expr.column('bytes'),
            expr.inlineCast({
              castType: 'integer',
              value: expr.parens(expr.func.call('SUM', [expr.column(['destination', 'bytes'])])),
            }),
          ]),
          Builder.option({
            name: 'by',
            args: [
              expr.list.bare({
                values: [expr.column('languages'), expr.column('department')],
              }),
            ],
          }),
        ],
      }),
      Builder.command({
        name: 'where',
        args: [
          expr.func.call('MATCH', [
            expr.column(['aws', 's3', 'bucket', 'name']),
            Builder.param.build('?variable'),
            expr.map({
              entries: [
                expr.entry('minimum_should_match', Builder.param.build('?min_should_match')),
                expr.entry('fuzziness', expr.literal.integer(2)),
                expr.entry(Builder.identifier('key'), expr.literal.string('value')),
              ],
            }),
          ]),
        ],
      }),
      Builder.command({
        name: 'where',
        args: [
          expr.func.binary('and', [
            expr.func.binary('in', [
              expr.column('num'),
              expr.list.literal({
                values: [expr.literal.integer(1), expr.literal.integer(2), expr.literal.integer(3)],
              }),
            ]),
            expr.func.binary('in', [
              expr.list.tuple({ values: [expr.column('a'), expr.column('b')] }),
              expr.list.tuple({
                values: [
                  expr.list.tuple({
                    values: [expr.literal.integer(1), expr.literal.integer(2)],
                  }),
                ],
              }),
            ]),
          ]),
        ],
      }),
      Builder.command({
        name: 'sort',
        args: [
          expr.order(expr.column('@timestamp'), { order: 'DESC', nulls: 'NULLS FIRST' }),
          expr.order(expr.column('kb'), { order: 'ASC', nulls: '' }),
        ],
      }),
      Builder.command({ name: 'limit', args: [expr.literal.integer(10)] }),
    ],
    undefined,
    [
      Builder.header.command.set([
        expr.func.binary('=', [Builder.identifier('setting'), expr.literal.string('value')]),
      ]),
    ]
  );

interface JsonWalkerOptions {
  visitObject?: (node: Record<string, unknown>) => void;
  visitArray?: (node: unknown[]) => void;
  visitString?: (node: string) => void;
  visitNumber?: (node: number) => void;
  visitBigint?: (node: bigint) => void;
  visitBoolean?: (node: boolean) => void;
  visitNull?: () => void;
  visitUndefined?: () => void;
}

const walkJson = (json: unknown, options: JsonWalkerOptions = {}) => {
  switch (typeof json) {
    case 'string': {
      options.visitString?.(json);
      break;
    }
    case 'number': {
      options.visitNumber?.(json);
      break;
    }
    case 'bigint': {
      options.visitBigint?.(json as bigint);
      break;
    }
    case 'boolean': {
      options.visitBoolean?.(json);
      break;
    }
    case 'undefined': {
      options.visitUndefined?.();
      break;
    }
    case 'object': {
      if (!json) {
        options.visitNull?.();
      } else if (Array.isArray(json)) {
        options.visitArray?.(json);
        const length = json.length;

        for (let i = 0; i < length; i++) {
          walkJson(json[i], options);
        }
      } else {
        options.visitObject?.(json as Record<string, unknown>);
        const values = Object.values(json as Record<string, unknown>);
        const length = values.length;

        for (let i = 0; i < length; i++) {
          const value = values[i];
          walkJson(value, options);
        }
      }
    }
  }
};

const assertAllNodesAreVisited = (ast: ESQLAstQueryExpression) => {
  const allNodes = new Set<ESQLProperNode>();
  const allExpressionNodes = new Set<ESQLAstExpression>();
  const allWalkerAnyNodes = new Set<ESQLProperNode>();
  const allWalkerExpressionNodes = new Set<ESQLAstExpression>();

  walkJson(ast, {
    visitObject: (node) => {
      if (isProperNode(node)) {
        allNodes.add(node);
        if (node.type !== 'command' && node.type !== 'header-command') {
          allExpressionNodes.add(node);
        }
      }
    },
  });

  Walker.walk(ast, {
    visitAny: (node) => {
      allWalkerAnyNodes.add(node);
    },
    visitSingleAstItem: (node) => {
      allWalkerExpressionNodes.add(node);
    },
  });

  expect(allWalkerAnyNodes).toStrictEqual(allNodes);
  expect(allWalkerAnyNodes.size).toBe(allNodes.size);
  expect(allWalkerExpressionNodes).toStrictEqual(allExpressionNodes);
  expect(allWalkerExpressionNodes.size).toBe(allExpressionNodes.size);
};

describe('Walker walks all nodes', () => {
  test('small query', () => {
    assertAllNodesAreVisited(smallest());
  });

  test('sample SORT command from docs', () => {
    assertAllNodesAreVisited(sortCommandFromDocs());
  });

  test('large query', () => {
    assertAllNodesAreVisited(large());
  });
});
