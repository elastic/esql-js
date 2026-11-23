/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type {
  PromQLBinaryExpression,
  PromQLFunction,
  PromQLLabel,
  PromQLLiteral,
  PromQLParamLiteral,
  PromQLParens,
  PromQLSelector,
  PromQLStringLiteral,
  PromQLSubquery,
  PromQLUnaryExpression,
} from '@elastic/esql-types';
import { PromQLParser } from '../parser';

describe('PromQL Parser', () => {
  describe('basic parsing', () => {
    it('parses a simple metric selector', () => {
      const result = PromQLParser.parse('http_requests_total');

      expect(result.errors).toHaveLength(0);
      expect(result.root.type).toBe('query');
      expect(result.root.dialect).toBe('promql');
      expect(result.root.expression).toBeDefined();
      expect(result.root.expression?.type).toBe('selector');
    });

    it('parses a metric selector with labels', () => {
      const result = PromQLParser.parse('http_requests_total{job="api", status="200"}');

      expect(result.errors).toHaveLength(0);
      expect(result.root.expression?.type).toBe('selector');

      const selector = result.root.expression as PromQLSelector;
      expect(selector.metric?.name).toBe('http_requests_total');
      expect(selector.labelMap?.args).toHaveLength(2);
      expect(selector.labelMap?.args[0].labelName.name).toBe('job');
      expect(selector.labelMap?.args[1].labelName.name).toBe('status');
    });

    it('parses keyword metrics and special-number label names as identifiers', () => {
      const result = PromQLParser.parse('by{Inf="positive", NaN="invalid",}');

      expect(result.errors).toHaveLength(0);
      expect(result.root.expression).toMatchObject({
        type: 'selector',
        metric: { type: 'identifier', name: 'by' },
        labelMap: {
          args: [
            { labelName: { type: 'identifier', name: 'Inf' } },
            { labelName: { type: 'identifier', name: 'NaN' } },
          ],
        },
      });
    });

    it('parses a range vector selector', () => {
      const result = PromQLParser.parse('http_requests_total[5m]');

      expect(result.errors).toHaveLength(0);
      expect(result.root.expression?.type).toBe('selector');

      const selector = result.root.expression as PromQLSelector;
      expect(selector.duration).toBeDefined();
    });

    it('parses a function call', () => {
      const result = PromQLParser.parse('rate(http_requests_total[5m])');

      expect(result.errors).toHaveLength(0);
      expect(result.root.expression?.type).toBe('function');

      const func = result.root.expression as PromQLSelector;
      expect(func.name).toBe('rate');
      expect(func.args).toHaveLength(1);
    });

    it('parses an aggregation with grouping', () => {
      const result = PromQLParser.parse('sum by (job) (rate(http_requests_total[5m]))');

      expect(result.errors).toHaveLength(0);
      expect(result.root.expression?.type).toBe('function');

      const func = result.root.expression as PromQLFunction;
      expect(func.name).toBe('sum');
      expect(func.grouping).toBeDefined();
      expect(func.grouping?.name).toBe('by');
      expect(func.grouping?.args).toHaveLength(1);
    });

    it('parses keyword, quoted and parameterized grouping labels', () => {
      const result = PromQLParser.parse('sum by (BOOL, "job-name", ??labels,) (up)');

      expect(result.errors).toHaveLength(0);
      expect(result.root.expression).toMatchObject({
        type: 'function',
        grouping: {
          args: [
            { type: 'identifier', name: 'BOOL' },
            { literalType: 'string', valueUnquoted: 'job-name' },
            { literalType: 'param', value: 'labels', paramKind: '??' },
          ],
        },
      });
    });

    it.each(['sum by (job instance) (up)', 'up{job="api",,instance="host"}'])(
      'reports malformed label separators in %s',
      (query) => {
        expect(PromQLParser.parseErrors(query).length).toBeGreaterThan(0);
      }
    );

    it('parses a binary expression', () => {
      const result = PromQLParser.parse('http_requests_total / http_requests_failed');

      expect(result.errors).toHaveLength(0);
      expect(result.root.expression?.type).toBe('binary-expression');

      const binary = result.root.expression as PromQLBinaryExpression;
      expect(binary.name).toBe('/');
      expect(binary.left.type).toBe('selector');
      expect(binary.right.type).toBe('selector');
    });

    it('parses a comparison with bool modifier', () => {
      const result = PromQLParser.parse('http_requests_total > bool 100');

      expect(result.errors).toHaveLength(0);
      expect(result.root.expression?.type).toBe('binary-expression');

      const binary = result.root.expression as PromQLBinaryExpression;
      expect(binary.name).toBe('>');
      expect(binary.bool).toBe(true);
    });

    it('parses a unary negation', () => {
      const result = PromQLParser.parse('-http_requests_total');

      expect(result.errors).toHaveLength(0);
      expect(result.root.expression?.type).toBe('unary-expression');

      const unary = result.root.expression as PromQLUnaryExpression;
      expect(unary.name).toBe('-');
    });

    it('parses parenthesized expressions', () => {
      const result = PromQLParser.parse('(http_requests_total + http_requests_failed)');

      expect(result.errors).toHaveLength(0);
      expect(result.root.expression?.type).toBe('parens');

      const parens = result.root.expression as PromQLParens;
      expect(parens.child.type).toBe('binary-expression');
    });

    it('parses offset modifier', () => {
      const result = PromQLParser.parse('http_requests_total offset 5m');

      expect(result.errors).toHaveLength(0);
      expect(result.root.expression?.type).toBe('selector');

      const selector = result.root.expression as PromQLSelector;
      expect(selector.evaluation).toBeDefined();
      expect(selector.evaluation?.offset).toBeDefined();
    });

    describe('offset modifier', () => {
      const parseOffset = (query: string) => {
        const result = PromQLParser.parse(query);
        const root = result.root.expression;
        const selector = (root?.type === 'binary-expression' ? root.left : root) as PromQLSelector;

        return { result, root, offset: selector.evaluation?.offset };
      };

      it.each([
        ['foo offset 5m', false],
        ['foo offset +5m', false],
        ['foo offset -5m', true],
      ])('parses the sign of `%s`', (query, negative) => {
        const { result, offset } = parseOffset(query);

        expect(result.errors).toHaveLength(0);
        expect(offset).toMatchObject({
          negative,
          duration: { type: 'literal', literalType: 'time', value: '5m' },
        });
      });

      it('parses a parenthesized duration expression', () => {
        const { result, offset } = parseOffset('foo offset (5m - 1m)');

        expect(result.errors).toHaveLength(0);
        expect(offset?.duration).toMatchObject({ type: 'binary-expression', name: '-' });
      });

      it('binds an unparenthesized offset to its selector, not the binary operator', () => {
        const { result, root, offset } = parseOffset('foo offset 5m > 1');

        expect(result.errors).toHaveLength(0);
        expect(root?.type).toBe('binary-expression');
        expect(offset?.duration).toMatchObject({ type: 'literal', value: '5m' });
      });

      it('reports an incomplete offset', () => {
        const { result, offset } = parseOffset('foo offset');

        expect(result.errors.length).toBeGreaterThan(0);
        expect(offset?.incomplete).toBe(true);
      });
    });

    it('parses numeric literals', () => {
      const result = PromQLParser.parse('42');

      expect(result.errors).toHaveLength(0);
      expect(result.root.expression?.type).toBe('literal');

      const literal = result.root.expression as PromQLLiteral;
      expect(literal.literalType).toBe('integer');
      expect(literal.value).toBe(42);
    });

    it('parses decimal literals', () => {
      const result = PromQLParser.parse('3.14');

      expect(result.errors).toHaveLength(0);
      expect(result.root.expression?.type).toBe('literal');

      const literal = result.root.expression as PromQLLiteral;
      expect(literal.literalType).toBe('decimal');
      expect(literal.value).toBe(3.14);
    });

    it.each([
      ['1_000', 'integer', 1000],
      ['1.2_5e1_0', 'decimal', 12_500_000_000],
      ['0x_ff_ff', 'hexadecimal', 65535],
      ['Inf', 'decimal', Infinity],
      ['NaN', 'decimal', NaN],
    ])('parses %s as a %s literal', (query, literalType, value) => {
      const result = PromQLParser.parse(query);

      expect(result.errors).toHaveLength(0);
      expect(result.root.expression).toMatchObject({
        type: 'literal',
        literalType,
        value,
        text: query,
      });
    });

    it.each([
      ['up @ +1_000', { literalType: 'time', value: '1_000' }],
      ['up @ start ( )', 'start()'],
      ['up @ end( )', 'end()'],
    ])('parses evaluation modifier in %s', (query, value) => {
      const result = PromQLParser.parse(query);

      expect(result.errors).toHaveLength(0);
      expect(result.root.expression).toMatchObject({
        evaluation: { at: { negative: false, value } },
      });
    });

    it('parses string literals', () => {
      const result = PromQLParser.parse('"hello world"');

      expect(result.errors).toHaveLength(0);
      expect(result.root.expression?.type).toBe('literal');

      const literal = result.root.expression as PromQLStringLiteral;
      expect(literal.literalType).toBe('string');
      expect(literal.valueUnquoted).toBe('hello world');
    });
  });

  describe('complex queries', () => {
    it('parses a complex aggregation query', () => {
      const query = 'sum(rate(http_requests_total{job="api"}[5m])) by (status)';
      const result = PromQLParser.parse(query);

      expect(result.errors).toHaveLength(0);
      expect(result.root.expression?.type).toBe('function');
    });

    it('parses vector matching with on modifier', () => {
      const query = 'http_requests_total / on(job) http_requests_failed';
      const result = PromQLParser.parse(query);

      expect(result.errors).toHaveLength(0);
      expect(result.root.expression?.type).toBe('binary-expression');

      const binary = result.root.expression as PromQLBinaryExpression;
      expect(binary.modifier).toBeDefined();
      expect(binary.modifier?.name).toBe('on');
    });

    it('parses group_left modifier', () => {
      const query = 'http_requests_total * on(job) group_left(instance) job_info';
      const result = PromQLParser.parse(query);

      expect(result.errors).toHaveLength(0);
      expect(result.root.expression?.type).toBe('binary-expression');

      const binary = result.root.expression as PromQLBinaryExpression;
      expect(binary.modifier?.groupModifier).toBeDefined();
      expect(binary.modifier?.groupModifier?.name).toBe('group_left');
    });

    it('parses a group modifier without a label list', () => {
      const result = PromQLParser.parse('up * on(job) group_left job_info');

      expect(result.errors).toHaveLength(0);
      expect(result.root.expression).toMatchObject({
        modifier: { groupModifier: { name: 'group_left', labels: [] } },
      });
    });

    it('reports an invalid label list after a group modifier', () => {
      expect(
        PromQLParser.parseErrors('up * on(job) group_left (job_info + 1)').length
      ).toBeGreaterThan(0);
    });
  });

  describe('subquery', () => {
    it('parses a basic subquery with range and resolution', () => {
      const result = PromQLParser.parse('rate(http_requests_total[5m])[30m:1m]');

      expect(result.errors).toHaveLength(0);
      expect(result.root.expression?.type).toBe('subquery');

      const subquery = result.root.expression as PromQLSubquery;
      const expr = subquery.expr as PromQLFunction;
      const range = subquery.range as PromQLLiteral;
      const resolution = subquery.resolution as PromQLLiteral;

      expect(expr.type).toBe('function');
      expect(expr.name).toBe('rate');
      expect(range.value).toBe('30m');
      expect(resolution.value).toBe('1m');
    });

    it('parses a subquery with arithmetic resolution', () => {
      const result = PromQLParser.parse(':9[5m][30m:5m*2+1m]');

      expect(result.errors).toHaveLength(0);
      expect(result.root.expression?.type).toBe('subquery');

      const subquery = result.root.expression as PromQLSubquery;
      const resolution = subquery.resolution as PromQLBinaryExpression;
      const left = resolution.left as PromQLBinaryExpression;
      const right = resolution.right as PromQLLiteral;

      expect(resolution.type).toBe('binary-expression');
      expect(resolution.name).toBe('+');
      expect(left).toMatchObject({
        name: '*',
        left: { value: '5m', location: { min: 11, max: 12 } },
        right: { value: 2 },
      });
      expect(right.value).toBe('1m');
    });
  });

  describe('label parameter values', () => {
    it('parses a named label parameter (?job)', () => {
      const result = PromQLParser.parse('http_requests_total{job=?job}');

      expect(result.errors).toHaveLength(0);

      const selector = result.root.expression as PromQLSelector;
      expect(selector.type).toBe('selector');

      const label = selector.labelMap?.args[0] as PromQLLabel;
      expect(label.incomplete).toBe(false);

      const value = label.value as PromQLParamLiteral;
      expect(value.literalType).toBe('param');
      expect(value.paramType).toBe('named');
      expect(value.paramKind).toBe('?');
      expect(value.value).toBe('job');
      expect(value.text).toBe('?job');
    });

    it('parses a positional label parameter (?1)', () => {
      const result = PromQLParser.parse('http_requests_total{job=?1}');

      expect(result.errors).toHaveLength(0);

      const selector = result.root.expression as PromQLSelector;
      const label = selector.labelMap?.args[0] as PromQLLabel;
      const value = label.value as PromQLParamLiteral;

      expect(value.literalType).toBe('param');
      expect(value.paramType).toBe('positional');
      expect(value.paramKind).toBe('?');
      expect(value.value).toBe(1);
      expect(value.text).toBe('?1');
    });

    it('parses a regex matcher with a named parameter (?pattern)', () => {
      const result = PromQLParser.parse('http_requests_total{job=~?pattern}');

      expect(result.errors).toHaveLength(0);

      const selector = result.root.expression as PromQLSelector;
      const label = selector.labelMap?.args[0] as PromQLLabel;

      expect(label.operator).toBe('=~');

      const value = label.value as PromQLParamLiteral;
      expect(value.literalType).toBe('param');
      expect(value.paramType).toBe('named');
      expect(value.paramKind).toBe('?');
      expect(value.value).toBe('pattern');
      expect(value.text).toBe('?pattern');
    });
  });

  describe('label list parameters', () => {
    it('parses a named double parameter in an aggregation grouping', () => {
      const result = PromQLParser.parse('sum by (??labels) (http_requests_total)');

      expect(result.errors).toHaveLength(0);

      const func = result.root.expression as PromQLFunction;
      const parameter = func.grouping?.args[0] as PromQLParamLiteral;
      expect(parameter.literalType).toBe('param');
      expect(parameter.paramType).toBe('named');
      expect(parameter.paramKind).toBe('??');
      expect(parameter.value).toBe('labels');
      expect(parameter.text).toBe('??labels');
    });

    it('parses a positional double parameter in a vector-matching modifier', () => {
      const result = PromQLParser.parse('http_requests_total / on(??1) errors_total');

      expect(result.errors).toHaveLength(0);

      const binary = result.root.expression as PromQLBinaryExpression;
      const parameter = binary.modifier?.labels[0] as PromQLParamLiteral;
      expect(parameter.literalType).toBe('param');
      expect(parameter.paramType).toBe('positional');
      expect(parameter.paramKind).toBe('??');
      expect(parameter.value).toBe(1);
      expect(parameter.text).toBe('??1');
    });
  });

  describe('error handling', () => {
    it('returns errors for invalid syntax', () => {
      const result = PromQLParser.parse('rate(');

      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('handles empty input', () => {
      const result = PromQLParser.parse('');

      expect(result.root.type).toBe('query');
    });
  });
});
