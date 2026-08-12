/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { isPromqlNode } from '../is';
import { PromQLBuilder } from './builder';

const { expression: expr } = PromQLBuilder;

describe('parserFields', () => {
  test('defaults to an empty location, text, and complete node', () => {
    expect(PromQLBuilder.parserFields()).toEqual({
      location: { min: 0, max: 0 },
      text: '',
      incomplete: false,
    });
  });

  test('overrides only the provided fields', () => {
    expect(PromQLBuilder.parserFields({ text: 'rate', incomplete: true })).toEqual({
      location: { min: 0, max: 0 },
      text: 'rate',
      incomplete: true,
    });
  });

  test('threads parser fields onto a built node', () => {
    const node = PromQLBuilder.identifier('metric', {
      text: 'metric',
      location: { min: 3, max: 9 },
      incomplete: true,
    });

    expect(node).toMatchObject({
      text: 'metric',
      location: { min: 3, max: 9 },
      incomplete: true,
    });
  });
});

describe('expression.query', () => {
  test('wraps an expression', () => {
    const inner = PromQLBuilder.identifier('up');
    const node = expr.query(inner);

    expect(node).toMatchObject({
      dialect: 'promql',
      type: 'query',
      name: '',
      expression: inner,
    });
  });

  test('allows an undefined expression', () => {
    expect(expr.query(undefined).expression).toBeUndefined();
  });
});

describe('expression.parens', () => {
  test('wraps a child expression', () => {
    const child = PromQLBuilder.identifier('up');

    expect(expr.parens(child)).toMatchObject({
      dialect: 'promql',
      type: 'parens',
      name: '',
      child,
    });
  });
});

describe('expression.func.call', () => {
  test('builds a call with args', () => {
    const arg = PromQLBuilder.identifier('up');
    const node = expr.func.call('rate', [arg]);

    expect(node).toMatchObject({ dialect: 'promql', type: 'function', name: 'rate', args: [arg] });
    expect(node.grouping).toBeUndefined();
    expect(node.groupingPosition).toBeUndefined();
  });

  test('attaches grouping and its position', () => {
    const grouping = PromQLBuilder.grouping('by', [PromQLBuilder.identifier('job')]);
    const node = expr.func.call('sum', [PromQLBuilder.identifier('up')], grouping, 'after');

    expect(node.grouping).toBe(grouping);
    expect(node.groupingPosition).toBe('after');
  });
});

describe('expression.selector.node', () => {
  test('derives the name from the metric', () => {
    const metric = PromQLBuilder.identifier('http_requests_total');

    expect(expr.selector.node({ metric }).name).toBe('http_requests_total');
  });

  test('uses an empty name when there is no metric', () => {
    expect(expr.selector.node({}).name).toBe('');
  });

  test('collects defined children into args in order', () => {
    const metric = PromQLBuilder.identifier('up');
    const labelMap = PromQLBuilder.labelMap([]);
    const duration = expr.literal.time('5m');
    const evaluation = PromQLBuilder.evaluation();
    const node = expr.selector.node({ metric, labelMap, duration, evaluation });

    expect(node.args).toEqual([metric, labelMap, duration, evaluation]);
  });

  test('omits undefined children from args', () => {
    const metric = PromQLBuilder.identifier('up');
    const duration = expr.literal.time('5m');

    expect(expr.selector.node({ metric, duration }).args).toEqual([metric, duration]);
  });

  test('produces empty args for a bare selector', () => {
    expect(expr.selector.node({}).args).toEqual([]);
  });
});

describe('expression.binary', () => {
  const left = PromQLBuilder.identifier('a');
  const right = PromQLBuilder.identifier('b');

  test('builds a binary expression named after the operator', () => {
    expect(expr.binary('+', left, right)).toMatchObject({
      dialect: 'promql',
      type: 'binary-expression',
      name: '+',
      left,
      right,
    });
  });

  test('leaves bool and modifier unset by default', () => {
    const node = expr.binary('==', left, right);

    expect(node.bool).toBeUndefined();
    expect(node.modifier).toBeUndefined();
  });

  test('applies bool and modifier options', () => {
    const modifier = PromQLBuilder.modifier('on', [PromQLBuilder.identifier('job')]);
    const node = expr.binary('==', left, right, { bool: true, modifier });

    expect(node.bool).toBe(true);
    expect(node.modifier).toBe(modifier);
  });
});

describe('expression.unary', () => {
  test('builds a unary expression named after the operator', () => {
    const arg = PromQLBuilder.identifier('up');

    expect(expr.unary('-', arg)).toMatchObject({
      dialect: 'promql',
      type: 'unary-expression',
      name: '-',
      arg,
    });
  });
});

describe('expression.subquery', () => {
  const inner = PromQLBuilder.identifier('up');
  const range = expr.literal.time('30m');

  test('builds a subquery with expr and range', () => {
    const node = expr.subquery(inner, range);

    expect(node).toMatchObject({
      dialect: 'promql',
      type: 'subquery',
      name: 'subquery',
      expr: inner,
      range,
    });
    expect(node.resolution).toBeUndefined();
    expect(node.evaluation).toBeUndefined();
  });

  test('attaches optional resolution and evaluation', () => {
    const resolution = expr.literal.time('1m');
    const evaluation = PromQLBuilder.evaluation();
    const node = expr.subquery(inner, range, resolution, evaluation);

    expect(node.resolution).toBe(resolution);
    expect(node.evaluation).toBe(evaluation);
  });
});

describe('expression.literal', () => {
  test('integer', () => {
    expect(expr.literal.integer(42)).toMatchObject({
      dialect: 'promql',
      type: 'literal',
      literalType: 'integer',
      name: '42',
      value: 42,
    });
  });

  test('decimal', () => {
    expect(expr.literal.decimal(3.14)).toMatchObject({
      literalType: 'decimal',
      name: '3.14',
      value: 3.14,
    });
  });

  test('hexadecimal keeps the source text as the name', () => {
    expect(expr.literal.hexadecimal(255, '0xFF')).toMatchObject({
      literalType: 'hexadecimal',
      name: '0xFF',
      value: 255,
    });
  });

  describe('string', () => {
    test('falls back to the unquoted value when no raw value is given', () => {
      expect(expr.literal.string('api')).toMatchObject({
        literalType: 'string',
        name: 'api',
        value: 'api',
        valueUnquoted: 'api',
      });
    });

    test('keeps the raw value separate from the unquoted value', () => {
      expect(expr.literal.string('api', '"api"')).toMatchObject({
        name: '"api"',
        value: '"api"',
        valueUnquoted: 'api',
      });
    });
  });

  test('time', () => {
    expect(expr.literal.time('5m')).toMatchObject({
      literalType: 'time',
      name: '5m',
      value: '5m',
    });
  });

  describe('param', () => {
    test('treats a string value as a named param', () => {
      expect(expr.literal.param('job')).toMatchObject({
        literalType: 'param',
        paramType: 'named',
        paramKind: '?',
        name: '',
        value: 'job',
      });
    });

    test('treats a numeric value as a positional param', () => {
      expect(expr.literal.param(1)).toMatchObject({ paramType: 'positional', value: 1 });
    });

    test('accepts a "??" param kind', () => {
      expect(expr.literal.param('labels', undefined, '??').paramKind).toBe('??');
    });
  });
});

describe('identifier', () => {
  test('builds an identifier', () => {
    expect(PromQLBuilder.identifier('up')).toMatchObject({
      dialect: 'promql',
      type: 'identifier',
      name: 'up',
    });
  });
});

describe('labelMap', () => {
  test('stores labels under args', () => {
    const label = PromQLBuilder.label(PromQLBuilder.identifier('job'), '=', undefined);

    expect(PromQLBuilder.labelMap([label])).toMatchObject({
      dialect: 'promql',
      type: 'label-map',
      name: '',
      args: [label],
    });
  });
});

describe('label', () => {
  test('derives the name from the label name node', () => {
    const labelName = PromQLBuilder.identifier('job');
    const value = expr.literal.string('api');
    const node = PromQLBuilder.label(labelName, '=~', value);

    expect(node).toMatchObject({
      dialect: 'promql',
      type: 'label',
      name: 'job',
      labelName,
      operator: '=~',
      value,
    });
  });

  test('allows an undefined value', () => {
    expect(
      PromQLBuilder.label(PromQLBuilder.identifier('job'), '!=', undefined).value
    ).toBeUndefined();
  });
});

describe('grouping', () => {
  test.each(['by', 'without'] as const)('names the node after the "%s" kind', (kind) => {
    const label = PromQLBuilder.identifier('job');

    expect(PromQLBuilder.grouping(kind, [label])).toMatchObject({
      dialect: 'promql',
      type: 'grouping',
      name: kind,
      args: [label],
    });
  });
});

describe('modifier', () => {
  test.each(['on', 'ignoring'] as const)('names the node after the "%s" kind', (kind) => {
    const label = PromQLBuilder.identifier('job');
    const node = PromQLBuilder.modifier(kind, [label]);

    expect(node).toMatchObject({
      dialect: 'promql',
      type: 'modifier',
      name: kind,
      labels: [label],
    });
    expect(node.groupModifier).toBeUndefined();
  });

  test('attaches a group modifier', () => {
    const groupModifier = PromQLBuilder.groupModifier('group_left', []);

    expect(PromQLBuilder.modifier('on', [], groupModifier).groupModifier).toBe(groupModifier);
  });
});

describe('groupModifier', () => {
  test.each(['group_left', 'group_right'] as const)('names the node after "%s"', (kind) => {
    const label = PromQLBuilder.identifier('job');

    expect(PromQLBuilder.groupModifier(kind, [label])).toMatchObject({
      dialect: 'promql',
      type: 'group-modifier',
      name: kind,
      labels: [label],
    });
  });
});

describe('evaluation', () => {
  test('builds an empty evaluation', () => {
    const node = PromQLBuilder.evaluation();

    expect(node).toMatchObject({ dialect: 'promql', type: 'evaluation', name: 'evaluation' });
    expect(node.offset).toBeUndefined();
    expect(node.at).toBeUndefined();
  });

  test('attaches offset and at', () => {
    const offset = PromQLBuilder.offset(expr.literal.time('5m'));
    const at = PromQLBuilder.at('start()');
    const node = PromQLBuilder.evaluation(offset, at);

    expect(node.offset).toBe(offset);
    expect(node.at).toBe(at);
  });
});

describe('offset', () => {
  test('defaults to non-negative', () => {
    const duration = expr.literal.time('5m');
    const node = PromQLBuilder.offset(duration);

    expect(node).toMatchObject({
      dialect: 'promql',
      type: 'offset',
      name: 'offset',
      negative: false,
      duration,
    });
  });

  test('accepts a negative offset', () => {
    expect(PromQLBuilder.offset(expr.literal.time('5m'), true).negative).toBe(true);
  });
});

describe('at', () => {
  test('accepts a time value and defaults to non-negative', () => {
    const value = expr.literal.time('1609459200');
    const node = PromQLBuilder.at(value);

    expect(node).toMatchObject({
      dialect: 'promql',
      type: 'at',
      name: 'at',
      negative: false,
      value,
    });
  });

  test('accepts a string modifier value', () => {
    expect(PromQLBuilder.at('end()').value).toBe('end()');
  });

  test('accepts a negative at', () => {
    expect(PromQLBuilder.at(expr.literal.time('5m'), true).negative).toBe(true);
  });
});

describe('unknown', () => {
  test('builds an unknown node', () => {
    expect(PromQLBuilder.unknown()).toMatchObject({
      dialect: 'promql',
      type: 'unknown',
      name: 'unknown',
    });
  });
});

describe('dialect tagging', () => {
  test('every built node is recognized as a PromQL node', () => {
    const nodes = [
      expr.query(undefined),
      expr.parens(PromQLBuilder.identifier('a')),
      expr.func.call('rate', []),
      expr.selector.node({}),
      expr.binary('+', PromQLBuilder.identifier('a'), PromQLBuilder.identifier('b')),
      expr.unary('-', PromQLBuilder.identifier('a')),
      expr.subquery(PromQLBuilder.identifier('a'), expr.literal.time('5m')),
      expr.literal.integer(1),
      expr.literal.decimal(1.5),
      expr.literal.hexadecimal(255, '0xFF'),
      expr.literal.string('a'),
      expr.literal.time('5m'),
      expr.literal.param('a'),
      PromQLBuilder.identifier('a'),
      PromQLBuilder.labelMap([]),
      PromQLBuilder.label(PromQLBuilder.identifier('job'), '=', undefined),
      PromQLBuilder.grouping('by', []),
      PromQLBuilder.modifier('on', []),
      PromQLBuilder.groupModifier('group_left', []),
      PromQLBuilder.evaluation(),
      PromQLBuilder.offset(expr.literal.time('5m')),
      PromQLBuilder.at('start()'),
      PromQLBuilder.unknown(),
    ];

    expect(nodes.every(isPromqlNode)).toBe(true);
  });
});
