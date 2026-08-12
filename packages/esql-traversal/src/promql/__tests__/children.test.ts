/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type {
  PromQLAstExpression,
  PromQLAstNode,
  PromQLEvaluation,
  PromQLGrouping,
  PromQLIdentifier,
  PromQLLabel,
  PromQLLabelMap,
  PromQLStringLiteral,
  PromQLTimeValue,
} from '@elastic/esql-types';
import { childrenOfPromqlNode } from '../children';

const base = {
  dialect: 'promql' as const,
  name: '',
  text: '',
  location: { min: 0, max: 0 },
  incomplete: false,
};

const ident = (name: string): PromQLIdentifier => ({ ...base, name, type: 'identifier' });

const str = (value: string): PromQLStringLiteral => ({
  ...base,
  name: value,
  type: 'literal',
  literalType: 'string',
  value: `"${value}"`,
  valueUnquoted: value,
});

const time = (value: string): PromQLTimeValue => ({
  ...base,
  name: value,
  type: 'literal',
  literalType: 'time',
  value,
});

const children = (node: PromQLAstNode): PromQLAstNode[] => [...childrenOfPromqlNode(node)];

describe('childrenOfPromqlNode', () => {
  test('yields nothing for a non-PromQL node', () => {
    const esqlNode = { type: 'column', name: 'foo' } as unknown as PromQLAstNode;

    expect(children(esqlNode)).toEqual([]);
  });

  describe('query', () => {
    test('yields the expression', () => {
      const expression = ident('metric');
      const node: PromQLAstNode = { ...base, name: '', type: 'query', expression };

      expect(children(node)).toEqual([expression]);
    });

    test('yields nothing when the expression is missing', () => {
      const node: PromQLAstNode = { ...base, name: '', type: 'query' };

      expect(children(node)).toEqual([]);
    });
  });

  describe('function', () => {
    const grouping: PromQLGrouping = {
      ...base,
      name: 'by',
      type: 'grouping',
      args: [ident('job')],
    };

    test('yields args when there is no grouping', () => {
      const arg = ident('metric');
      const node: PromQLAstNode = { ...base, name: 'rate', type: 'function', args: [arg] };

      expect(children(node)).toEqual([arg]);
    });

    test('yields grouping before args when position is "before"', () => {
      const arg = ident('metric');
      const node: PromQLAstNode = {
        ...base,
        name: 'sum',
        type: 'function',
        args: [arg],
        grouping,
        groupingPosition: 'before',
      };

      expect(children(node)).toEqual([grouping, arg]);
    });

    test('yields grouping after args when position is "after"', () => {
      const arg = ident('metric');
      const node: PromQLAstNode = {
        ...base,
        name: 'sum',
        type: 'function',
        args: [arg],
        grouping,
        groupingPosition: 'after',
      };

      expect(children(node)).toEqual([arg, grouping]);
    });

    test('yields grouping first when position is unset', () => {
      const arg = ident('metric');
      const node: PromQLAstNode = {
        ...base,
        name: 'sum',
        type: 'function',
        args: [arg],
        grouping,
      };

      expect(children(node)).toEqual([grouping, arg]);
    });
  });

  describe('selector', () => {
    test('yields all args in order', () => {
      const metric = ident('http_requests_total');
      const labelMap: PromQLLabelMap = { ...base, name: '', type: 'label-map', args: [] };
      const node: PromQLAstNode = {
        ...base,
        name: 'http_requests_total',
        type: 'selector',
        metric,
        labelMap,
        args: [metric, labelMap],
      };

      expect(children(node)).toEqual([metric, labelMap]);
    });
  });

  describe('label', () => {
    test('yields the label name and value', () => {
      const labelName = ident('job');
      const value = str('api');
      const node: PromQLLabel = {
        ...base,
        name: 'job',
        type: 'label',
        labelName,
        operator: '=',
        value,
      };

      expect(children(node)).toEqual([labelName, value]);
    });

    test('omits a missing value', () => {
      const labelName = ident('job');
      const node: PromQLLabel = { ...base, name: 'job', type: 'label', labelName, operator: '=' };

      expect(children(node)).toEqual([labelName]);
    });
  });

  describe('binary-expression', () => {
    const left = ident('a');
    const right = ident('b');

    test('yields left then right', () => {
      const node: PromQLAstNode = { ...base, name: '+', type: 'binary-expression', left, right };

      expect(children(node)).toEqual([left, right]);
    });

    test('yields the modifier between left and right', () => {
      const modifier: PromQLAstNode = {
        ...base,
        name: 'on',
        type: 'modifier',
        labels: [ident('job')],
      };
      const node: PromQLAstNode = {
        ...base,
        name: '+',
        type: 'binary-expression',
        left,
        right,
        modifier,
      };

      expect(children(node)).toEqual([left, modifier, right]);
    });
  });

  test('unary-expression yields its arg', () => {
    const arg = ident('metric');
    const node: PromQLAstNode = { ...base, name: '-', type: 'unary-expression', arg };

    expect(children(node)).toEqual([arg]);
  });

  describe('subquery', () => {
    const expr = ident('metric');
    const range = time('30m');

    test('yields expr and range', () => {
      const node: PromQLAstNode = { ...base, name: 'subquery', type: 'subquery', expr, range };

      expect(children(node)).toEqual([expr, range]);
    });

    test('yields optional resolution and evaluation last', () => {
      const resolution = time('1m');
      const evaluation: PromQLEvaluation = { ...base, name: 'evaluation', type: 'evaluation' };
      const node: PromQLAstNode = {
        ...base,
        name: 'subquery',
        type: 'subquery',
        expr,
        range,
        resolution,
        evaluation,
      };

      expect(children(node)).toEqual([expr, range, resolution, evaluation]);
    });
  });

  test('parens yields its child', () => {
    const child = ident('metric');
    const node: PromQLAstNode = { ...base, name: '', type: 'parens', child };

    expect(children(node)).toEqual([child]);
  });

  describe('evaluation', () => {
    test('yields offset and at', () => {
      const offset: PromQLAstNode = {
        ...base,
        name: 'offset',
        type: 'offset',
        negative: false,
        duration: time('5m'),
      };
      const at: PromQLAstNode = {
        ...base,
        name: 'at',
        type: 'at',
        negative: false,
        value: time('1609459200'),
      };
      const node: PromQLAstNode = { ...base, name: 'evaluation', type: 'evaluation', offset, at };

      expect(children(node)).toEqual([offset, at]);
    });

    test('yields nothing when both are missing', () => {
      const node: PromQLAstNode = { ...base, name: 'evaluation', type: 'evaluation' };

      expect(children(node)).toEqual([]);
    });
  });

  test('offset yields its duration', () => {
    const duration = time('5m');
    const node: PromQLAstNode = {
      ...base,
      name: 'offset',
      type: 'offset',
      negative: true,
      duration,
    };

    expect(children(node)).toEqual([duration]);
  });

  describe('at', () => {
    test('yields a node value', () => {
      const value = time('1609459200');
      const node: PromQLAstNode = { ...base, name: 'at', type: 'at', negative: false, value };

      expect(children(node)).toEqual([value]);
    });

    test('skips a string modifier value', () => {
      const node: PromQLAstNode = {
        ...base,
        name: 'at',
        type: 'at',
        negative: false,
        value: 'start()',
      };

      expect(children(node)).toEqual([]);
    });
  });

  describe('modifier', () => {
    test('yields labels then the group modifier', () => {
      const label = ident('job');
      const groupModifier: PromQLAstNode = {
        ...base,
        name: 'group_left',
        type: 'group-modifier',
        labels: [],
      };
      const node: PromQLAstNode = {
        ...base,
        name: 'on',
        type: 'modifier',
        labels: [label],
        groupModifier,
      };

      expect(children(node)).toEqual([label, groupModifier]);
    });

    test('group-modifier yields its labels', () => {
      const label = ident('job');
      const node: PromQLAstNode = {
        ...base,
        name: 'group_right',
        type: 'group-modifier',
        labels: [label],
      };

      expect(children(node)).toEqual([label]);
    });
  });

  describe('args fallback', () => {
    test('yields args of a label-map', () => {
      const label: PromQLLabel = {
        ...base,
        name: 'job',
        type: 'label',
        labelName: ident('job'),
        operator: '=',
      };
      const node: PromQLLabelMap = { ...base, name: '', type: 'label-map', args: [label] };

      expect(children(node)).toEqual([label]);
    });

    test('yields args of a grouping', () => {
      const label = ident('job');
      const node: PromQLGrouping = { ...base, name: 'by', type: 'grouping', args: [label] };

      expect(children(node)).toEqual([label]);
    });
  });

  test('returns a lazily evaluated iterable', () => {
    const first = ident('a') as PromQLAstExpression;
    const node: PromQLAstNode = {
      ...base,
      name: 'rate',
      type: 'function',
      args: [first, ident('b')],
    };

    const iterator = childrenOfPromqlNode(node)[Symbol.iterator]();

    expect(iterator.next()).toEqual({ value: first, done: false });
  });
});
