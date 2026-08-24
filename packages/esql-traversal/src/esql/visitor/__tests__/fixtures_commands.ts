/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { Builder } from '@elastic/esql-ast';
import type {
  ESQLAstChangePointCommand,
  ESQLAstCompletionCommand,
  ESQLAstDenseVectorCommand,
  ESQLAstIpLocationCommand,
  ESQLAstItem,
  ESQLAstJoinCommand,
  ESQLAstMmrCommand,
  ESQLAstQueryExpression,
  ESQLAstRegisteredDomainCommand,
  ESQLAstRerankCommand,
  ESQLAstUriPartsCommand,
  ESQLColumn,
  ESQLFunction,
} from '@elastic/esql-types';
import { expr } from '../../../__tests__/builders';

const from = (index = 'index') =>
  Builder.command({ name: 'from', args: [expr.source.index(index)] });

const limit = (value: number) =>
  Builder.command({ name: 'limit', args: [expr.literal.integer(value)] });

const call = (name: string, spelling: string, args: ESQLAstItem[]): ESQLFunction =>
  expr.func.node({
    name,
    operator: Builder.identifier(spelling),
    args,
    subtype: 'variadic-call',
  });

const binary = (name: string, args: [ESQLAstItem, ESQLAstItem]): ESQLFunction =>
  expr.func.node({ name, args, subtype: 'binary-expression' });

const assign = (target: ESQLColumn, value: ESQLAstItem): ESQLFunction =>
  binary('=', [target, value]);

// STATS 1, "str", [true], a = b BY field
const statsCommand = () =>
  Builder.command({
    name: 'stats',
    args: [
      expr.literal.integer(1),
      expr.literal.string('str'),
      expr.list.literal({ values: [expr.literal.boolean(true)] }),
      assign(expr.column('a'), [expr.column('b')]),
      Builder.option({ name: 'by', args: [expr.column('field')] }),
    ],
  });

// FROM index | STATS 1, "str", [true], a = b BY field | LIMIT 123
export const fromStatsLimit = (): ESQLAstQueryExpression =>
  Builder.expression.query([from(), statsCommand(), limit(123)]);

/**
 * `FROM index | STATS 1, "str", [true], a = b BY field | RIGHT JOIN abc ON xyz
 * | LIMIT 123`
 */
export const fromStatsJoinLimit = (): ESQLAstQueryExpression => {
  const join: ESQLAstJoinCommand = {
    ...Builder.command({
      name: 'join',
      args: [expr.source.index('abc'), Builder.option({ name: 'on', args: [expr.column('xyz')] })],
    }),
    commandType: 'right',
  };

  return Builder.expression.query([from(), statsCommand(), join, limit(123)]);
};

/**
 * `FROM k8s | STATS count=COUNT() BY @timestamp=BUCKET(@timestamp, 1 MINUTE)
 * | CHANGE_POINT count ON @timestamp AS type, pvalue | LIMIT 123`
 */
export const fromChangePoint = (): ESQLAstQueryExpression => {
  const stats = Builder.command({
    name: 'stats',
    args: [
      assign(expr.column('count'), [call('count', 'COUNT', [])]),
      Builder.option({
        name: 'by',
        args: [
          assign(expr.column('@timestamp'), [
            call('bucket', 'BUCKET', [
              expr.column('@timestamp'),
              expr.literal.timespan(1, 'MINUTE'),
            ]),
          ]),
        ],
      }),
    ],
  });

  const value = expr.column('count');
  const key = expr.column('@timestamp');
  const type = expr.column('type');
  const pvalue = expr.column('pvalue');

  const changePoint: ESQLAstChangePointCommand = {
    ...Builder.command({
      name: 'change_point',
      args: [
        value,
        Builder.option({ name: 'on', args: [key] }),
        Builder.option({ name: 'as', args: [type, pvalue] }),
      ],
    }),
    value,
    key,
    target: { type, pvalue },
  };

  return Builder.expression.query([from('k8s'), stats, changePoint, limit(123)]);
};

const assignmentCommand = <Name extends string>(
  name: Name,
  targetName: string,
  expressionName: string
) => {
  const targetField = expr.column(targetName);
  const expression = expr.column(expressionName);

  return {
    ...Builder.command({
      name,
      args: [binary('=', [targetField, expression])],
    }),
    targetField,
    expression,
  };
};

// FROM index | REGISTERED_DOMAIN parts = host
export const fromRegisteredDomain = (): ESQLAstQueryExpression => {
  const command: ESQLAstRegisteredDomainCommand = assignmentCommand(
    'registered_domain',
    'parts',
    'host'
  );

  return Builder.expression.query([from(), command]);
};

// FROM index | IP_LOCATION geo = client_ip
export const fromIpLocation = (): ESQLAstQueryExpression => {
  const command: ESQLAstIpLocationCommand = assignmentCommand('ip_location', 'geo', 'client_ip');

  return Builder.expression.query([from(), command]);
};

// FROM index | URI_PARTS parts = url
export const fromUriParts = (): ESQLAstQueryExpression => {
  const command: ESQLAstUriPartsCommand = assignmentCommand('uri_parts', 'parts', 'url');

  return Builder.expression.query([from(), command]);
};

const missingInferenceId = () =>
  expr.literal.string('', { name: 'inferenceId' }, { incomplete: true });

/**
 * `FROM movies | RERANK "star wars" ON title=X(title, 2),
 * description=X(description, 1.5) WITH {"inferenceId":"rerankerInferenceId",
 * "scoreColumn":"rerank_score"} | LIMIT 123`
 */
export const fromRerankLimit = (): ESQLAstQueryExpression => {
  const query = expr.literal.string('star wars');
  const fields = [
    assign(expr.column('title'), [call('x', 'X', [expr.column('title'), expr.literal.integer(2)])]),
    assign(expr.column('description'), [
      call('x', 'X', [expr.column('description'), expr.literal.decimal(1.5)]),
    ]),
  ];

  const rerank: ESQLAstRerankCommand = {
    ...Builder.command({
      name: 'rerank',
      args: [
        query,
        Builder.option({ name: 'on', args: [...fields] }),
        Builder.option({
          name: 'with',
          args: [
            expr.map({
              entries: [
                expr.entry('inferenceId', expr.literal.string('rerankerInferenceId')),
                expr.entry('scoreColumn', expr.literal.string('rerank_score')),
              ],
            }),
          ],
        }),
      ],
    }),
    query,
    fields,
    inferenceId: missingInferenceId(),
  };

  return Builder.expression.query([from('movies'), rerank, limit(123)]);
};

// FROM index | COMPLETION "test" WITH inferenceId
export const fromCompletion = (): ESQLAstQueryExpression => {
  const prompt = expr.literal.string('test');
  const completion: ESQLAstCompletionCommand = {
    ...Builder.command({
      name: 'completion',
      args: [
        prompt,
        Builder.option(
          { name: 'with', args: [expr.map({}, { incomplete: true })] },
          { incomplete: true }
        ),
      ],
    }),
    prompt,
    inferenceId: missingInferenceId(),
  };

  return Builder.expression.query([from(), completion]);
};

// FROM movies | MMR [0.5, 0.4, 0.3, 0.2]::dense_vector ON genre LIMIT 10 WITH { "lambda": 0.5 }
export const fromMmr = (): ESQLAstQueryExpression => {
  const queryVector = expr.inlineCast({
    castType: 'dense_vector',
    value: expr.list.literal({
      values: [0.5, 0.4, 0.3, 0.2].map((value) => expr.literal.decimal(value)),
    }),
  });
  const diversifyField = Builder.identifier('genre');
  const genre = expr.column({ args: [diversifyField] });
  const limitValue = expr.literal.integer(10);
  const namedParameters = expr.map({
    entries: [expr.entry('lambda', expr.literal.decimal(0.5))],
  });

  const mmr: ESQLAstMmrCommand = {
    ...Builder.command({
      name: 'mmr',
      args: [
        queryVector,
        Builder.option({ name: 'on', args: [genre] }),
        Builder.option({ name: 'limit', args: [limitValue] }),
        Builder.option({ name: 'with', args: [namedParameters] }),
      ],
    }),
    queryVector,
    diversifyField,
    limit: limitValue,
    namedParameters,
  };

  return Builder.expression.query([from('movies'), mmr]);
};

/**
 * `FROM index1,
 *     (FROM index2 | WHERE a > 10 | EVAL b = a * 2 | STATS cnt = COUNT(*) BY c | SORT cnt desc | LIMIT 10),
 *     index3,
 *     (FROM index4 | STATS count(*))
 *   | WHERE d > 10
 *   | STATS max = max(*) BY e
 *   | SORT max desc`
 */
export const fromSubqueries = (): ESQLAstQueryExpression => {
  const subquery1 = expr.parens(
    Builder.expression.query([
      from('index2'),
      Builder.command({
        name: 'where',
        args: [binary('>', [expr.column('a'), expr.literal.integer(10)])],
      }),
      Builder.command({
        name: 'eval',
        args: [
          assign(expr.column('b'), [binary('*', [expr.column('a'), expr.literal.integer(2)])]),
        ],
      }),
      Builder.command({
        name: 'stats',
        args: [
          assign(expr.column('cnt'), [call('count', 'COUNT', [expr.column('*')])]),
          Builder.option({ name: 'by', args: [expr.column('c')] }),
        ],
      }),
      Builder.command({
        name: 'sort',
        args: [expr.order(expr.column('cnt'), { order: 'DESC', nulls: '' })],
      }),
      limit(10),
    ])
  );

  const subquery2 = expr.parens(
    Builder.expression.query([
      from('index4'),
      Builder.command({
        name: 'stats',
        args: [call('count', 'count', [expr.column('*')])],
      }),
    ])
  );

  return Builder.expression.query([
    Builder.command({
      name: 'from',
      args: [expr.source.index('index1'), subquery1, expr.source.index('index3'), subquery2],
    }),
    Builder.command({
      name: 'where',
      args: [binary('>', [expr.column('d'), expr.literal.integer(10)])],
    }),
    Builder.command({
      name: 'stats',
      args: [
        assign(expr.column('max'), [call('max', 'max', [expr.column('*')])]),
        Builder.option({ name: 'by', args: [expr.column('e')] }),
      ],
    }),
    Builder.command({
      name: 'sort',
      args: [expr.order(expr.column('max'), { order: 'DESC', nulls: '' })],
    }),
  ]);
};

// FROM index | DEDUP | LIMIT 10
export const fromDedupLimit = (): ESQLAstQueryExpression =>
  Builder.expression.query([from(), Builder.command({ name: 'dedup' }), limit(10)]);

// FROM index | DEDUP
export const fromDedup = (): ESQLAstQueryExpression =>
  Builder.expression.query([from(), Builder.command({ name: 'dedup' })]);

// FROM index | DENSE_VECTOR vec_a, vec_b WITH { "dims": 128 } | LIMIT 10
export const fromDenseVector = (): ESQLAstQueryExpression => {
  const fields = [expr.column('vec_a'), expr.column('vec_b')];
  const namedParameters = expr.map({
    entries: [expr.entry('dims', expr.literal.integer(128))],
  });

  const denseVector: ESQLAstDenseVectorCommand = {
    ...Builder.command({
      name: 'dense_vector',
      args: [...fields, Builder.option({ name: 'with', args: [namedParameters] })],
    }),
    fields,
    namedParameters,
  };

  return Builder.expression.query([from(), denseVector, limit(10)]);
};
