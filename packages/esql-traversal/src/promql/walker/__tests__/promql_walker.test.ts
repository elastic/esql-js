/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { PromqlWalker } from '../walker';
import {
  at,
  binary,
  evaluation,
  func,
  grouping,
  groupModifier,
  id,
  int,
  label,
  labelMap,
  modifier,
  offset,
  param,
  parens,
  query,
  sel,
  str,
  subquery,
  time,
  unary,
} from './helpers';
import type {
  PromQLAstNode,
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

describe('Walker PromQL support', () => {
  describe('basic PromQL traversal', () => {
    test('can walk a simple PromQL selector', () => {
      const root = query(sel('bytes_in'));
      const promqlNodes: PromQLAstNode[] = [];

      PromqlWalker.walk(root, {
        visitPromqlAny: (node) => {
          promqlNodes.push(node);
        },
      });

      // query -> selector -> identifier (metric name)
      expect(promqlNodes.length).toBe(3);
      expect(promqlNodes[0].type).toBe('query');
      expect(promqlNodes[1].type).toBe('selector');
      expect(promqlNodes[2].type).toBe('identifier');
    });

    test('can walk PromQL selector with metric identifier', () => {
      const root = query(sel('http_requests_total'));
      const identifiers: PromQLIdentifier[] = [];

      PromqlWalker.walk(root, {
        visitPromqlIdentifier: (node) => {
          identifiers.push(node);
        },
      });

      expect(identifiers.length).toBe(1);
      expect(identifiers[0].name).toBe('http_requests_total');
    });

    test('can walk PromQL selector with labels', () => {
      // bytes_in{job="prometheus"}
      const root = query(
        sel('bytes_in', { labelMap: labelMap([label('job', '=', str('prometheus'))]) })
      );
      const selectors: PromQLSelector[] = [];
      const labelMaps: PromQLLabelMap[] = [];
      const labels: PromQLLabel[] = [];
      const identifiers: PromQLIdentifier[] = [];
      const literals: PromQLLiteral[] = [];

      PromqlWalker.walk(root, {
        visitPromqlSelector: (node) => selectors.push(node),
        visitPromqlLabelMap: (node) => labelMaps.push(node),
        visitPromqlLabel: (node) => labels.push(node),
        visitPromqlIdentifier: (node) => identifiers.push(node),
        visitPromqlLiteral: (node) => literals.push(node),
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
      // rate(http_requests_total[5m])
      const root = query(func('rate', [sel('http_requests_total', { duration: time('5m') })]));
      const functions: PromQLFunction[] = [];
      const selectors: PromQLSelector[] = [];

      PromqlWalker.walk(root, {
        visitPromqlFunction: (node) => functions.push(node),
        visitPromqlSelector: (node) => selectors.push(node),
      });

      expect(functions.length).toBe(1);
      expect(functions[0].name).toBe('rate');
      expect(selectors.length).toBe(1);
    });

    test('can walk nested PromQL functions', () => {
      // sum(rate(http_requests_total[5m]))
      const root = query(
        func('sum', [func('rate', [sel('http_requests_total', { duration: time('5m') })])])
      );
      const functions: PromQLFunction[] = [];

      PromqlWalker.walk(root, {
        visitPromqlFunction: (node) => functions.push(node),
      });

      expect(functions.length).toBe(2);
      expect(functions.map((f) => f.name).sort()).toEqual(['rate', 'sum']);
    });

    test('can walk aggregation function with grouping', () => {
      // sum by (job) (rate(http_requests_total[5m]))
      const root = query(
        func(
          'sum',
          [func('rate', [sel('http_requests_total', { duration: time('5m') })])],
          grouping('by', [id('job')]),
          'before'
        )
      );
      const functions: PromQLFunction[] = [];
      const groupings: PromQLGrouping[] = [];

      PromqlWalker.walk(root, {
        visitPromqlFunction: (node) => functions.push(node),
        visitPromqlGrouping: (node) => groupings.push(node),
      });

      expect(functions.length).toBe(2);
      expect(groupings.length).toBe(1);
      expect(groupings[0].name).toBe('by');
    });
  });

  describe('PromQL binary expression traversal', () => {
    test('can walk PromQL binary expression', () => {
      const root = query(binary('+', sel('a'), sel('b')));
      const binaryExpressions: PromQLBinaryExpression[] = [];
      const selectors: PromQLSelector[] = [];

      PromqlWalker.walk(root, {
        visitPromqlBinaryExpression: (node) => binaryExpressions.push(node),
        visitPromqlSelector: (node) => selectors.push(node),
      });

      expect(binaryExpressions.length).toBe(1);
      expect(binaryExpressions[0].name).toBe('+');
      expect(selectors.length).toBe(2);
    });

    test('can walk complex PromQL binary expression', () => {
      // (a + b) * c
      const root = query(binary('*', parens(binary('+', sel('a'), sel('b'))), sel('c')));
      const binaryExpressions: PromQLBinaryExpression[] = [];
      const parenNodes: PromQLParens[] = [];

      PromqlWalker.walk(root, {
        visitPromqlBinaryExpression: (node) => binaryExpressions.push(node),
        visitPromqlParens: (node) => parenNodes.push(node),
      });

      expect(binaryExpressions.length).toBe(2);
      expect(parenNodes.length).toBe(1);
    });

    test('can walk binary expression with vector matching modifier', () => {
      // a + on(job) b
      const root = query(
        binary('+', sel('a'), sel('b'), { modifier: modifier('on', [id('job')]) })
      );
      const binaryExpressions: PromQLBinaryExpression[] = [];
      const modifiers: PromQLModifier[] = [];

      PromqlWalker.walk(root, {
        visitPromqlBinaryExpression: (node) => binaryExpressions.push(node),
        visitPromqlModifier: (node) => modifiers.push(node),
      });

      expect(binaryExpressions.length).toBe(1);
      expect(modifiers.length).toBe(1);
      expect(modifiers[0].name).toBe('on');
    });

    test('can walk binary expression with group modifier', () => {
      // a + on(job) group_left(instance) b
      const root = query(
        binary('+', sel('a'), sel('b'), {
          modifier: modifier('on', [id('job')], groupModifier('group_left', [id('instance')])),
        })
      );
      const modifiers: PromQLModifier[] = [];
      const groupModifiers: PromQLGroupModifier[] = [];

      PromqlWalker.walk(root, {
        visitPromqlModifier: (node) => modifiers.push(node),
        visitPromqlGroupModifier: (node) => groupModifiers.push(node),
      });

      expect(modifiers.length).toBe(1);
      expect(groupModifiers.length).toBe(1);
      expect(groupModifiers[0].name).toBe('group_left');
    });
  });

  describe('PromQL unary expression traversal', () => {
    test('can walk PromQL unary expression', () => {
      const root = query(unary('-', sel('http_requests_total')));
      const unaryExpressions: PromQLUnaryExpression[] = [];

      PromqlWalker.walk(root, {
        visitPromqlUnaryExpression: (node) => unaryExpressions.push(node),
      });

      expect(unaryExpressions.length).toBe(1);
      expect(unaryExpressions[0].name).toBe('-');
    });
  });

  describe('PromQL subquery traversal', () => {
    test('can walk PromQL subquery', () => {
      // rate(http_requests_total[5m])[30m:1m]
      const root = query(
        subquery(
          func('rate', [sel('http_requests_total', { duration: time('5m') })]),
          time('30m'),
          time('1m')
        )
      );
      const subqueries: PromQLSubquery[] = [];

      PromqlWalker.walk(root, {
        visitPromqlSubquery: (node) => subqueries.push(node),
      });

      expect(subqueries.length).toBe(1);
      expect(subqueries[0].type).toBe('subquery');
    });
  });

  describe('PromQL evaluation modifiers traversal', () => {
    test('can walk PromQL offset modifier', () => {
      // http_requests_total offset 5m
      const root = query(
        sel('http_requests_total', { evaluation: evaluation(offset(time('5m'))) })
      );
      const evaluations: PromQLEvaluation[] = [];
      const offsets: PromQLOffset[] = [];

      PromqlWalker.walk(root, {
        visitPromqlEvaluation: (node) => evaluations.push(node),
        visitPromqlOffset: (node) => offsets.push(node),
      });

      expect(evaluations.length).toBe(1);
      expect(offsets.length).toBe(1);
    });

    test('can walk PromQL @ modifier', () => {
      // http_requests_total @ 1609459200
      const root = query(
        sel('http_requests_total', {
          evaluation: evaluation(undefined, at(time('1609459200'))),
        })
      );
      const evaluations: PromQLEvaluation[] = [];
      const atModifiers: PromQLAt[] = [];

      PromqlWalker.walk(root, {
        visitPromqlEvaluation: (node) => evaluations.push(node),
        visitPromqlAt: (node) => atModifiers.push(node),
      });

      expect(evaluations.length).toBe(1);
      expect(atModifiers.length).toBe(1);
    });
  });

  describe('PromQL literal traversal', () => {
    test('can walk numeric literal', () => {
      const root = query(int(42));
      const literals: PromQLLiteral[] = [];

      PromqlWalker.walk(root, {
        visitPromqlLiteral: (node) => literals.push(node),
      });

      expect(literals.length).toBe(1);
      expect(literals[0].literalType).toBe('integer');
      expect(literals[0].value).toBe(42);
    });

    test('can walk time literal in selector', () => {
      // http_requests_total[5m]
      const root = query(sel('http_requests_total', { duration: time('5m') }));
      const literals: PromQLLiteral[] = [];

      PromqlWalker.walk(root, {
        visitPromqlLiteral: (node) => literals.push(node),
      });

      expect(literals.length).toBe(1);
      expect(literals[0].literalType).toBe('time');
    });
  });

  describe('PromQL parens traversal', () => {
    test('can walk a PromQL query wrapped in parens', () => {
      const root = query(parens(sel('bytes_in')));
      const promqlSelectors: PromQLSelector[] = [];

      PromqlWalker.walk(root, {
        visitPromqlSelector: (node) => promqlSelectors.push(node),
      });

      expect(promqlSelectors.length).toBe(1);
    });
  });

  describe('visitPromqlAny fallback', () => {
    test('visitPromqlAny is called for all PromQL node types', () => {
      // rate(http_requests_total{job="api"}[5m])
      const root = query(
        func('rate', [
          sel('http_requests_total', {
            labelMap: labelMap([label('job', '=', str('api'))]),
            duration: time('5m'),
          }),
        ])
      );
      const allNodes: PromQLAstNode[] = [];

      PromqlWalker.walk(root, {
        visitPromqlAny: (node) => allNodes.push(node),
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
      const root = query(sel('http_requests_total'));
      const anyNodes: PromQLAstNode[] = [];
      const selectors: PromQLSelector[] = [];

      PromqlWalker.walk(root, {
        visitPromqlAny: (node) => anyNodes.push(node),
        visitPromqlSelector: (node) => selectors.push(node),
      });

      // visitPromqlSelector should be called for selector, so visitPromqlAny shouldn't include it
      expect(selectors.length).toBe(1);
      expect(anyNodes.find((n) => n.type === 'selector')).toBeUndefined();
    });
  });

  describe('label param literal traversal', () => {
    test('visitPromqlLiteral is called for a named param label value', () => {
      // bytes_in{job=?job}
      const root = query(
        sel('bytes_in', { labelMap: labelMap([label('job', '=', param('job'))]) })
      );
      const literals: PromQLLiteral[] = [];

      PromqlWalker.walk(root, {
        visitPromqlLiteral: (node) => literals.push(node),
      });

      expect(literals).toHaveLength(1);
      expect(literals[0].literalType).toBe('param');
      expect(literals[0].value).toBe('job');
    });

    test('visitPromqlLiteral is called for a double param in a grouping', () => {
      // sum by (??labels) (bytes_in)
      const root = query(
        func('sum', [sel('bytes_in')], grouping('by', [param('labels', undefined, '??')]), 'before')
      );
      const literals: PromQLLiteral[] = [];

      PromqlWalker.walk(root, {
        visitPromqlLiteral: (node) => literals.push(node),
      });

      expect(literals).toHaveLength(1);
      expect(literals[0].literalType).toBe('param');
      expect(literals[0].value).toBe('labels');
    });
  });

  describe('abort functionality with PromQL', () => {
    test('can abort PromQL traversal', () => {
      // rate(sum(http_requests_total[5m]))
      const root = query(
        func('rate', [func('sum', [sel('http_requests_total', { duration: time('5m') })])])
      );
      const functions: PromQLFunction[] = [];

      PromqlWalker.walk(root, {
        visitPromqlFunction: (node, parent, walker) => {
          functions.push(node);
          if (functions.length === 1) {
            walker.abort();
          }
        },
      });

      expect(functions.length).toBe(1);
    });
  });
});
