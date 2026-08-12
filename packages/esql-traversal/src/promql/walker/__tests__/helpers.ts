/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { PromQLBuilder } from '@elastic/esql-ast';
import type {
  PromQLAstExpression,
  PromQLEvaluation,
  PromQLLabel,
  PromQLLabelMap,
  PromQLLabelMatchOperator,
  PromQLLabelValue,
  PromQLSelector,
  PromQLStringLiteral,
} from '@elastic/esql-types';

export const { expression: expr } = PromQLBuilder;
export const query = expr.query;
export const parens = expr.parens;
export const func = expr.func.call;
export const binary = expr.binary;
export const unary = expr.unary;
export const subquery = expr.subquery;
export const grouping = PromQLBuilder.grouping;
export const modifier = PromQLBuilder.modifier;
export const groupModifier = PromQLBuilder.groupModifier;
export const evaluation = PromQLBuilder.evaluation;
export const offset = PromQLBuilder.offset;
export const at = PromQLBuilder.at;
export const id = PromQLBuilder.identifier;
export const labelMap = PromQLBuilder.labelMap;
export const int = expr.literal.integer;
export const time = expr.literal.time;
export const param = expr.literal.param;
export const str = (value: string): PromQLStringLiteral => expr.literal.string(value, `"${value}"`);
export const sel = (
  metric: string,
  options: {
    labelMap?: PromQLLabelMap;
    duration?: PromQLAstExpression;
    evaluation?: PromQLEvaluation;
  } = {}
): PromQLSelector => expr.selector.node({ metric: id(metric), ...options });
export const label = (
  name: string,
  operator: PromQLLabelMatchOperator,
  value?: PromQLLabelValue
): PromQLLabel => PromQLBuilder.label(id(name), operator, value);
