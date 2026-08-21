/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { Builder, PromQLBuilder } from '@elastic/esql-ast';
import type {
  ESQLAstItem,
  ESQLFunction,
  ESQLUnknownItem,
  PromQLAstExpression,
  PromQLEvaluation,
  PromQLLabel,
  PromQLLabelMap,
  PromQLLabelMatchOperator,
  PromQLLabelValue,
  PromQLSelector,
  PromQLStringLiteral,
} from '@elastic/esql-types';

export const expr = Builder.expression;
export const promqlExpr = PromQLBuilder.expression;

export const unary = (name: string, arg: ESQLAstItem): ESQLFunction =>
  expr.func.node({ name, subtype: 'unary-expression', args: [arg] });

export const unknown = (): ESQLUnknownItem => ({
  ...Builder.parserFields({ incomplete: true }),
  type: 'unknown',
  name: 'unknown',
});

export const fromSources = () =>
  Builder.expression.query([
    Builder.command({
      name: 'from',
      args: ['a', 'b', 'c'].map((name) => expr.source.index(name)),
    }),
  ]);

export const fromSourceComponents = () =>
  Builder.expression.query([
    Builder.command({
      name: 'from',
      args: [expr.source.index('b', 'a'), expr.source.index('c', undefined, 'd')],
    }),
  ]);

export const rowNestedCall = () =>
  Builder.expression.query([
    Builder.command({
      name: 'row',
      args: [
        expr.func.call('fn', [
          expr.literal.integer(1),
          expr.literal.integer(2),
          expr.literal.integer(3),
          expr.func.call('gg', [expr.literal.integer(4), expr.literal.integer(5)]),
        ]),
      ],
    }),
  ]);

export const rowWithMap = () =>
  Builder.expression.query([
    Builder.command({
      name: 'row',
      args: [
        expr.func.call('fn', [
          expr.literal.boolean(true),
          expr.map({
            entries: [
              expr.entry('foo', expr.literal.integer(1)),
              expr.entry('bar', expr.literal.integer(2)),
              expr.entry('baz', expr.literal.integer(3)),
            ],
          }),
        ]),
      ],
    }),
  ]);

export const id = PromQLBuilder.identifier;

export const time = promqlExpr.literal.time;

export const str = (value: string): PromQLStringLiteral =>
  promqlExpr.literal.string(value, `"${value}"`);

export const sel = (
  metric: string,
  options: {
    labelMap?: PromQLLabelMap;
    duration?: PromQLAstExpression;
    evaluation?: PromQLEvaluation;
  } = {}
): PromQLSelector => promqlExpr.selector.node({ metric: id(metric), ...options });

export const label = (
  name: string,
  operator: PromQLLabelMatchOperator,
  value?: PromQLLabelValue
): PromQLLabel => PromQLBuilder.label(id(name), operator, value);
