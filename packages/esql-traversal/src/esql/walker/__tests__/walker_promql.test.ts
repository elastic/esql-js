/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { Builder, PromQLBuilder } from '@elastic/esql-ast';
import type {
  ESQLAstExpression,
  ESQLAstPromqlCommand,
  ESQLAstPromqlCommandQuery,
  ESQLAstQueryExpression,
  ESQLCommand,
  ESQLMap,
  PromQLAstExpression,
  PromQLAstNode,
  PromQLAstQueryExpression,
  PromQLFunction,
  PromQLSelector,
  PromQLBinaryExpression,
  PromQLLabelMap,
  PromQLLabel,
  PromQLIdentifier,
  PromQLLiteral,
  PromQLGrouping,
  PromQLSubquery,
  PromQLParens,
  PromQLUnaryExpression,
  PromQLEvaluation,
  PromQLOffset,
  PromQLAt,
  PromQLModifier,
  PromQLGroupModifier,
} from '@elastic/esql-types';
import { Walker } from '../walker';
import { promqlExpr as expr, id, label, sel, str, time } from '../../../__tests__/builders';

/** Wraps an ES|QL `PROMQL` command query into a single-command ES|QL query. */
const promqlCommand = (
  query: ESQLAstPromqlCommandQuery,
  params?: ESQLMap
): ESQLAstQueryExpression => {
  const command: ESQLAstPromqlCommand = {
    ...Builder.parserFields(),
    name: 'promql',
    type: 'command',
    args: (params ? [params, query] : [query]) as ESQLAstPromqlCommand['args'],
    ...(params ? { params } : {}),
    query,
  };

  return Builder.expression.query([command]);
};

/** `PROMQL <expression>` */
const promql = (expression: PromQLAstExpression, params?: ESQLMap): ESQLAstQueryExpression =>
  promqlCommand(expr.query(expression), params);

/** `PROMQL ( <expression> )`, where the parens are ES|QL parens. */
const promqlInParens = (expression: PromQLAstExpression): ESQLAstQueryExpression =>
  promqlCommand(Builder.expression.parens(expr.query(expression) as unknown as ESQLAstExpression));

/** `PROMQL <name> = ( <expression> )` */
const promqlNamed = (name: string, expression: PromQLAstExpression): ESQLAstQueryExpression =>
  promqlCommand(
    Builder.expression.func.binary(
      '=',
      [
        Builder.identifier({ name }),
        Builder.expression.parens(expr.query(expression) as unknown as ESQLAstExpression),
      ],
      {}
    )
  );

/** `PROMQL bytes_in` */
const bytesIn = () => promql(sel('bytes_in'));

/** `PROMQL http_requests_total` */
const httpRequestsTotal = () => promql(sel('http_requests_total'));

/** `PROMQL bytes_in{job="prometheus"}` */
const bytesInJobPrometheus = () =>
  promql(
    sel('bytes_in', {
      labelMap: PromQLBuilder.labelMap([label('job', '=', str('prometheus'))]),
    })
  );

/** `PROMQL rate(http_requests_total[5m])` */
const rateHttpRequests = () =>
  promql(expr.func.call('rate', [sel('http_requests_total', { duration: time('5m') })]));

/** `PROMQL sum(rate(http_requests_total[5m]))` */
const sumRateHttpRequests = () =>
  promql(
    expr.func.call('sum', [
      expr.func.call('rate', [sel('http_requests_total', { duration: time('5m') })]),
    ])
  );

/** `PROMQL sum by (job) (rate(http_requests_total[5m]))` */
const sumByJobRateHttpRequests = () =>
  promql(
    expr.func.call(
      'sum',
      [expr.func.call('rate', [sel('http_requests_total', { duration: time('5m') })])],
      PromQLBuilder.grouping('by', [id('job')]),
      'before'
    )
  );

/** `PROMQL a + b` */
const aPlusB = () => promql(expr.binary('+', sel('a'), sel('b')));

/** `PROMQL (a + b) * c` */
const aPlusBTimesC = () =>
  promql(expr.binary('*', expr.parens(expr.binary('+', sel('a'), sel('b'))), sel('c')));

/** `PROMQL a + on(job) b` */
const aPlusOnJobB = () =>
  promql(
    expr.binary('+', sel('a'), sel('b'), {
      bool: false,
      modifier: PromQLBuilder.modifier('on', [id('job')]),
    })
  );

/** `PROMQL a + on(job) group_left(instance) b` */
const aPlusOnJobGroupLeftInstanceB = () =>
  promql(
    expr.binary('+', sel('a'), sel('b'), {
      bool: false,
      modifier: PromQLBuilder.modifier(
        'on',
        [id('job')],
        PromQLBuilder.groupModifier('group_left', [id('instance')])
      ),
    })
  );

/** `PROMQL -http_requests_total` */
const negatedHttpRequests = () => promql(expr.unary('-', sel('http_requests_total')));

/** `PROMQL rate(http_requests_total[5m])[30m:1m]` */
const rateHttpRequestsSubquery = () =>
  promql(
    expr.subquery(
      expr.func.call('rate', [sel('http_requests_total', { duration: time('5m') })]),
      time('30m'),
      time('1m')
    )
  );

/** `PROMQL http_requests_total offset 5m` */
const httpRequestsOffset = () =>
  promql(
    sel('http_requests_total', {
      evaluation: PromQLBuilder.evaluation(PromQLBuilder.offset(time('5m'))),
    })
  );

/** `PROMQL http_requests_total @ 1609459200` */
const httpRequestsAt = () =>
  promql(
    sel('http_requests_total', {
      evaluation: PromQLBuilder.evaluation(undefined, PromQLBuilder.at(time('1609459200'))),
    })
  );

/** `PROMQL 42` */
const numericLiteral = () => promql(expr.literal.integer(42));

/** `PROMQL http_requests_total[5m]` */
const httpRequestsRange = () => promql(sel('http_requests_total', { duration: time('5m') }));

/** `PROMQL bytes_in{job="test"}` */
const bytesInJobTest = () =>
  promql(sel('bytes_in', { labelMap: PromQLBuilder.labelMap([label('job', '=', str('test'))]) }));

/** `PROMQL (bytes_in)` */
const bytesInEsqlParens = () => promqlInParens(sel('bytes_in'));

/** `PROMQL name = (bytes_in)` */
const namedBytesIn = () => promqlNamed('name', sel('bytes_in'));

/** `PROMQL k=v bytes_in{job="test"}` */
const bytesInWithParams = () =>
  promql(
    sel('bytes_in', { labelMap: PromQLBuilder.labelMap([label('job', '=', str('test'))]) }),
    Builder.expression.map({
      entries: [
        Builder.expression.entry(
          Builder.identifier({ name: 'k' }),
          Builder.expression.literal.string('v', { unquoted: true })
        ),
      ],
      representation: 'assignment',
    })
  );

/** `PROMQL rate(http_requests_total{job="api"}[5m])` */
const rateHttpRequestsJobApi = () =>
  promql(
    expr.func.call('rate', [
      sel('http_requests_total', {
        labelMap: PromQLBuilder.labelMap([label('job', '=', str('api'))]),
        duration: time('5m'),
      }),
    ])
  );

/** `PROMQL bytes_in{job=?job}` */
const bytesInJobParam = () =>
  promql(
    sel('bytes_in', {
      labelMap: PromQLBuilder.labelMap([label('job', '=', expr.literal.param('job'))]),
    })
  );

/** `PROMQL rate(sum(http_requests_total[5m]))` */
const rateSumHttpRequests = () =>
  promql(
    expr.func.call('rate', [
      expr.func.call('sum', [sel('http_requests_total', { duration: time('5m') })]),
    ])
  );

/** `PROMQL sum(bytes) + rate(reqs[5m])` */
const sumBytesPlusRateReqs = () =>
  promql(
    expr.binary(
      '+',
      expr.func.call('sum', [sel('bytes')]),
      expr.func.call('rate', [sel('reqs', { duration: time('5m') })])
    )
  );

/** `PROMQL rate(bytes[5m])` */
const rateBytes = () => promql(expr.func.call('rate', [sel('bytes', { duration: time('5m') })]));

describe('Walker PromQL support', () => {
  describe('basic PromQL traversal', () => {
    test('can walk a simple PromQL selector', () => {
      const ast = bytesIn();
      const promqlNodes: PromQLAstNode[] = [];

      Walker.walk(ast, {
        promql: {
          visitPromqlAny: (node) => {
            promqlNodes.push(node);
          },
        },
      });

      // query -> selector -> identifier (metric name)
      expect(promqlNodes.length).toBe(3);
      expect(promqlNodes[0].type).toBe('query');
      expect(promqlNodes[1].type).toBe('selector');
      expect(promqlNodes[2].type).toBe('identifier');
    });

    test('can walk PromQL selector with metric identifier', () => {
      const ast = httpRequestsTotal();
      const identifiers: PromQLIdentifier[] = [];

      Walker.walk(ast, {
        promql: {
          visitPromqlIdentifier: (node) => {
            identifiers.push(node);
          },
        },
      });

      expect(identifiers.length).toBe(1);
      expect(identifiers[0].name).toBe('http_requests_total');
    });

    test('can walk PromQL selector with labels', () => {
      const ast = bytesInJobPrometheus();
      const selectors: PromQLSelector[] = [];
      const labelMaps: PromQLLabelMap[] = [];
      const labels: PromQLLabel[] = [];
      const identifiers: PromQLIdentifier[] = [];
      const literals: PromQLLiteral[] = [];

      Walker.walk(ast, {
        promql: {
          visitPromqlSelector: (node) => selectors.push(node),
          visitPromqlLabelMap: (node) => labelMaps.push(node),
          visitPromqlLabel: (node) => labels.push(node),
          visitPromqlIdentifier: (node) => identifiers.push(node),
          visitPromqlLiteral: (node) => literals.push(node),
        },
      });

      expect(selectors.length).toBe(1);
      expect(labelMaps.length).toBe(1);
      expect(labels.length).toBe(1);
      expect(identifiers.length).toBe(2); // metric name + label name
      expect(literals.length).toBe(1); // label value
      expect(literals[0].literalType).toBe('string');
    });
  });

  describe('PromQL function traversal', () => {
    test('can walk PromQL function call', () => {
      const ast = rateHttpRequests();
      const functions: PromQLFunction[] = [];
      const selectors: PromQLSelector[] = [];

      Walker.walk(ast, {
        promql: {
          visitPromqlFunction: (node) => functions.push(node),
          visitPromqlSelector: (node) => selectors.push(node),
        },
      });

      expect(functions.length).toBe(1);
      expect(functions[0].name).toBe('rate');
      expect(selectors.length).toBe(1);
      expect(selectors[0].name).toBe('http_requests_total');
    });

    test('can walk nested PromQL functions', () => {
      const ast = sumRateHttpRequests();
      const functions: PromQLFunction[] = [];

      Walker.walk(ast, {
        promql: {
          visitPromqlFunction: (node) => functions.push(node),
        },
      });

      expect(functions.length).toBe(2);
      expect(functions.map((f) => f.name).sort()).toEqual(['rate', 'sum']);
    });

    test('can walk aggregation function with grouping', () => {
      const ast = sumByJobRateHttpRequests();
      const functions: PromQLFunction[] = [];
      const groupings: PromQLGrouping[] = [];

      Walker.walk(ast, {
        promql: {
          visitPromqlFunction: (node) => functions.push(node),
          visitPromqlGrouping: (node) => groupings.push(node),
        },
      });

      expect(functions.length).toBe(2);
      expect(groupings.length).toBe(1);
      expect(groupings[0].name).toBe('by');
    });
  });

  describe('PromQL binary expression traversal', () => {
    test('can walk PromQL binary expression', () => {
      const ast = aPlusB();
      const binaryExpressions: PromQLBinaryExpression[] = [];
      const selectors: PromQLSelector[] = [];

      Walker.walk(ast, {
        promql: {
          visitPromqlBinaryExpression: (node) => binaryExpressions.push(node),
          visitPromqlSelector: (node) => selectors.push(node),
        },
      });

      expect(binaryExpressions.length).toBe(1);
      expect(binaryExpressions[0].name).toBe('+');
      expect(selectors.length).toBe(2);
    });

    test('can walk complex PromQL binary expression', () => {
      const ast = aPlusBTimesC();
      const binaryExpressions: PromQLBinaryExpression[] = [];
      const parens: PromQLParens[] = [];

      Walker.walk(ast, {
        promql: {
          visitPromqlBinaryExpression: (node) => binaryExpressions.push(node),
          visitPromqlParens: (node) => parens.push(node),
        },
      });

      expect(binaryExpressions.length).toBe(2);
      expect(parens.length).toBe(1);
    });

    test('can walk binary expression with vector matching modifier', () => {
      const ast = aPlusOnJobB();
      const binaryExpressions: PromQLBinaryExpression[] = [];
      const modifiers: PromQLModifier[] = [];

      Walker.walk(ast, {
        promql: {
          visitPromqlBinaryExpression: (node) => binaryExpressions.push(node),
          visitPromqlModifier: (node) => modifiers.push(node),
        },
      });

      expect(binaryExpressions.length).toBe(1);
      expect(modifiers.length).toBe(1);
      expect(modifiers[0].name).toBe('on');
    });

    test('can walk binary expression with group modifier', () => {
      const ast = aPlusOnJobGroupLeftInstanceB();
      const modifiers: PromQLModifier[] = [];
      const groupModifiers: PromQLGroupModifier[] = [];

      Walker.walk(ast, {
        promql: {
          visitPromqlModifier: (node) => modifiers.push(node),
          visitPromqlGroupModifier: (node) => groupModifiers.push(node),
        },
      });

      expect(modifiers.length).toBe(1);
      expect(groupModifiers.length).toBe(1);
      expect(groupModifiers[0].name).toBe('group_left');
    });
  });

  describe('PromQL unary expression traversal', () => {
    test('can walk PromQL unary expression', () => {
      const ast = negatedHttpRequests();
      const unaryExpressions: PromQLUnaryExpression[] = [];

      Walker.walk(ast, {
        promql: {
          visitPromqlUnaryExpression: (node) => unaryExpressions.push(node),
        },
      });

      expect(unaryExpressions.length).toBe(1);
      expect(unaryExpressions[0].name).toBe('-');
    });
  });

  describe('PromQL subquery traversal', () => {
    test('can walk PromQL subquery', () => {
      const ast = rateHttpRequestsSubquery();
      const subqueries: PromQLSubquery[] = [];

      Walker.walk(ast, {
        promql: {
          visitPromqlSubquery: (node) => subqueries.push(node),
        },
      });

      expect(subqueries.length).toBe(1);
      expect(subqueries[0].type).toBe('subquery');
    });
  });

  describe('PromQL evaluation modifiers traversal', () => {
    test('can walk PromQL offset modifier', () => {
      const ast = httpRequestsOffset();
      const evaluations: PromQLEvaluation[] = [];
      const offsets: PromQLOffset[] = [];

      Walker.walk(ast, {
        promql: {
          visitPromqlEvaluation: (node) => evaluations.push(node),
          visitPromqlOffset: (node) => offsets.push(node),
        },
      });

      expect(evaluations.length).toBe(1);
      expect(offsets.length).toBe(1);
    });

    test('can walk PromQL @ modifier', () => {
      const ast = httpRequestsAt();
      const evaluations: PromQLEvaluation[] = [];
      const atModifiers: PromQLAt[] = [];

      Walker.walk(ast, {
        promql: {
          visitPromqlEvaluation: (node) => evaluations.push(node),
          visitPromqlAt: (node) => atModifiers.push(node),
        },
      });

      expect(evaluations.length).toBe(1);
      expect(atModifiers.length).toBe(1);
    });
  });

  describe('PromQL literal traversal', () => {
    test('can walk numeric literal', () => {
      const ast = numericLiteral();
      const literals: PromQLLiteral[] = [];

      Walker.walk(ast, {
        promql: {
          visitPromqlLiteral: (node) => literals.push(node),
        },
      });

      expect(literals.length).toBe(1);
      expect(literals[0].literalType).toBe('integer');
      expect(literals[0].value).toBe(42);
    });

    test('can walk time literal in selector', () => {
      const ast = httpRequestsRange();
      const literals: PromQLLiteral[] = [];

      Walker.walk(ast, {
        promql: {
          visitPromqlLiteral: (node) => literals.push(node),
        },
      });

      expect(literals.length).toBe(1);
      expect(literals[0].literalType).toBe('time');
    });
  });

  describe('combined ES|QL and PromQL traversal', () => {
    test('can walk both ES|QL and PromQL nodes', () => {
      const ast = bytesInJobTest();
      const commands: ESQLCommand[] = [];
      const promqlQueries: PromQLAstQueryExpression[] = [];
      const promqlSelectors: PromQLSelector[] = [];

      Walker.walk(ast, {
        visitCommand: (node) => commands.push(node),
        promql: {
          visitPromqlQuery: (node) => promqlQueries.push(node),
          visitPromqlSelector: (node) => promqlSelectors.push(node),
        },
      });

      expect(commands.length).toBe(1);
      expect(commands[0].name).toBe('promql');
      expect(promqlQueries.length).toBe(1);
      expect(promqlSelectors.length).toBe(1);
    });

    test('can walk PromQL query wrapped in ES|QL parens', () => {
      const ast = bytesInEsqlParens();
      const promqlSelectors: PromQLSelector[] = [];

      Walker.walk(ast, {
        promql: {
          visitPromqlSelector: (node) => promqlSelectors.push(node),
        },
      });

      // The parens in this case is an ES|QL parens wrapping the PromQL query
      expect(promqlSelectors.length).toBe(1);
    });

    test('can walk named PromQL query', () => {
      const ast = namedBytesIn();
      const promqlSelectors: PromQLSelector[] = [];

      Walker.walk(ast, {
        promql: {
          visitPromqlSelector: (node) => promqlSelectors.push(node),
        },
      });

      expect(promqlSelectors.length).toBe(1);
    });

    test('can walk PromQL query with params', () => {
      const ast = bytesInWithParams();
      const commands: ESQLCommand[] = [];
      const promqlSelectors: PromQLSelector[] = [];

      Walker.walk(ast, {
        visitCommand: (node) => commands.push(node),
        promql: {
          visitPromqlSelector: (node) => promqlSelectors.push(node),
        },
      });

      expect(commands.length).toBe(1);
      expect(promqlSelectors.length).toBe(1);
    });
  });

  describe('visitPromqlAny fallback', () => {
    test('visitPromqlAny is called for all PromQL node types', () => {
      const ast = rateHttpRequestsJobApi();
      const allNodes: PromQLAstNode[] = [];

      Walker.walk(ast, {
        promql: {
          visitPromqlAny: (node) => allNodes.push(node),
        },
      });

      // Should visit: query, function, selector, identifier (metric), label-map, label, identifier (label name), literal (label value), literal (time)
      expect(allNodes.length).toBeGreaterThan(5);

      const nodeTypes = allNodes.map((n) => n.type);
      expect(nodeTypes).toContain('query');
      expect(nodeTypes).toContain('function');
      expect(nodeTypes).toContain('selector');
      expect(nodeTypes).toContain('identifier');
      expect(nodeTypes).toContain('label-map');
      expect(nodeTypes).toContain('label');
      expect(nodeTypes).toContain('literal');
    });

    test('specific visitor takes precedence over visitPromqlAny', () => {
      const ast = httpRequestsTotal();
      const anyNodes: PromQLAstNode[] = [];
      const selectors: PromQLSelector[] = [];

      Walker.walk(ast, {
        promql: {
          visitPromqlAny: (node) => anyNodes.push(node),
          visitPromqlSelector: (node) => selectors.push(node),
        },
      });

      // visitPromqlSelector should be called for selector, so visitPromqlAny shouldn't include it
      expect(selectors.length).toBe(1);
      expect(anyNodes.find((n) => n.type === 'selector')).toBeUndefined();
    });
  });

  describe('label param literal traversal', () => {
    test('visitPromqlLiteral is called for a named param label value via Walker', () => {
      const ast = bytesInJobParam();
      const literals: PromQLLiteral[] = [];

      Walker.walk(ast, {
        promql: {
          visitPromqlLiteral: (node) => literals.push(node),
        },
      });

      expect(literals).toHaveLength(1);
      expect(literals[0].literalType).toBe('param');
      expect(literals[0].value).toBe('job');
    });
  });

  describe('abort functionality with PromQL', () => {
    test('can abort PromQL traversal', () => {
      const ast = rateSumHttpRequests();
      const functions: PromQLFunction[] = [];

      Walker.walk(ast, {
        promql: {
          visitPromqlFunction: (node, parent, walker) => {
            functions.push(node);
            if (functions.length === 1) {
              walker.abort();
            }
          },
        },
      });

      expect(functions.length).toBe(1);
    });
  });

  describe('skipChildren functionality with PromQL', () => {
    test('skipChildren prevents traversal into the current node, siblings still visited', () => {
      const ast = sumBytesPlusRateReqs();
      const selectors: string[] = [];

      Walker.walk(ast, {
        promql: {
          visitPromqlFunction: (node, parent, walker) => {
            if (node.name === 'sum') {
              walker.skipChildren();
            }
          },
          visitPromqlSelector: (node) => {
            selectors.push(node.name);
          },
        },
      });

      expect(selectors).toEqual(['reqs']);
    });

    test('skipChildren in a leaf visitor does not leak to subsequent nodes', () => {
      const ast = rateBytes();
      const visited: string[] = [];

      Walker.walk(ast, {
        promql: {
          visitPromqlIdentifier: (node, parent, walker) => {
            visited.push(`identifier:${node.name}`);
            walker.skipChildren();
          },
          visitPromqlLiteral: (node) => {
            visited.push(`literal:${node.value}`);
          },
        },
      });

      expect(visited).toEqual(['identifier:bytes', 'literal:5m']);
    });

    test('skipChildren on the PromQL query root skips the whole expression', () => {
      const ast = rateBytes();
      const functions: string[] = [];

      Walker.walk(ast, {
        promql: {
          visitPromqlQuery: (node, parent, walker) => {
            walker.skipChildren();
          },
          visitPromqlFunction: (node) => {
            functions.push(node.name);
          },
        },
      });

      expect(functions).toEqual([]);
    });
  });
});
