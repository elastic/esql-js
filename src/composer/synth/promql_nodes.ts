/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { PromQLBuilder } from '../../embedded_languages/promql/ast/builder';
import type {
  PromQLAstExpression,
  PromQLAt,
  PromQLBinaryExpression,
  PromQLBinaryOperator,
  PromQLFunction,
  PromQLLabel,
  PromQLLabelMap,
  PromQLLabelMatchOperator,
  PromQLNumericLiteral,
  PromQLOffset,
  PromQLParens,
  PromQLSelector,
  PromQLStringLiteral,
  PromQLSubquery,
  PromQLTimeValue,
  PromQLUnaryExpression,
} from '../../embedded_languages/promql/types';
import { SynthNode } from './synth_node';

/**
 * Creates a PromQL time-duration literal.
 */
export const pqlTime = (value: string): PromQLTimeValue =>
  SynthNode.from(PromQLBuilder.expression.literal.time(value));

/**
 * Creates a PromQL numeric literal.
 */
export const pqlNum = (value: number): PromQLNumericLiteral =>
  SynthNode.from(
    Number.isInteger(value)
      ? PromQLBuilder.expression.literal.integer(value)
      : PromQLBuilder.expression.literal.decimal(value)
  );

/**
 * Creates a PromQL string literal.
 */
export const pqlStr = (value: string): PromQLStringLiteral =>
  SynthNode.from(PromQLBuilder.expression.literal.string(value));

/**
 * Creates a single PromQL label matcher.
 *
 * ```ts
 * pqlLabel("job", "=", "api")     // job="api"
 * pqlLabel("status", "=~", "2..") // status=~"2.."
 * pqlLabel("env", "!=", "dev")    // env!="dev"
 * ```
 */
export const pqlLabel = (name: string, op: PromQLLabelMatchOperator, value?: string): PromQLLabel =>
  SynthNode.from(
    PromQLBuilder.label(
      PromQLBuilder.identifier(name),
      op,
      value !== undefined ? PromQLBuilder.expression.literal.string(value) : undefined
    )
  );

/**
 * Supported input forms for label arguments used by `pqlLabels` and `pqlSel`:
 *
 * - a plain object whose values are equality-matched strings: `{ job: "api" }`
 * - an explicit array of `PromQLLabel` nodes from `pqlLabel()`
 */
export type PqlLabelArg = Record<string, string> | PromQLLabel[];

const normLabels = (input: PqlLabelArg): PromQLLabel[] => {
  if (Array.isArray(input)) return input;

  return Object.entries(input).map(([name, value]) =>
    PromQLBuilder.label(
      PromQLBuilder.identifier(name),
      '=',
      PromQLBuilder.expression.literal.string(value)
    )
  );
};

/**
 * Creates a PromQL label map.
 *
 * ```ts
 * pqlLabels({ job: "api", env: "prod" })       // {job="api", env="prod"}
 * pqlLabels([pqlLabel("status", "=~", "2..")]) // {status=~"2.."}
 * ```
 */
export const pqlLabels = (input: PqlLabelArg): PromQLLabelMap =>
  SynthNode.from(PromQLBuilder.labelMap(normLabels(input)));

/**
 * Creates a PromQL instant or range vector selector.
 *
 * Overloads (second argument determines form):
 *
 * ```ts
 * pqlSel("metric")                             // metric
 * pqlSel("metric", "5m")                       // metric[5m]
 * pqlSel("metric", { job: "api" })             // metric{job="api"}
 * pqlSel("metric", { job: "api" }, "5m")       // metric{job="api"}[5m]
 * pqlSel(undefined, { job: "api" })            // {job="api"}
 * pqlSel("metric", [pqlLabel("s","=~","2..")]) // metric{s=~"2.."}
 * ```
 */
export function pqlSel(metric?: string): PromQLSelector;
export function pqlSel(metric: string | undefined, range: string): PromQLSelector;
export function pqlSel(metric: string | undefined, labels: PqlLabelArg): PromQLSelector;
export function pqlSel(
  metric: string | undefined,
  labels: PqlLabelArg,
  range: string
): PromQLSelector;
export function pqlSel(
  metric?: string,
  labelsOrRange?: PqlLabelArg | string,
  range?: string
): PromQLSelector {
  const metricNode = metric !== undefined ? PromQLBuilder.identifier(metric) : undefined;

  let labelMap: PromQLLabelMap | undefined;
  let duration: PromQLTimeValue | undefined;

  if (typeof labelsOrRange === 'string') {
    duration = PromQLBuilder.expression.literal.time(labelsOrRange);
  } else if (labelsOrRange !== undefined) {
    labelMap = PromQLBuilder.labelMap(normLabels(labelsOrRange));
    if (range !== undefined) {
      duration = PromQLBuilder.expression.literal.time(range);
    }
  }

  return SynthNode.from(
    PromQLBuilder.expression.selector.node({ metric: metricNode, labelMap, duration })
  );
}

/**
 * Options for `pqlFunc`.
 */
export interface PqlFuncOpts {
  /** Labels for a "by" aggregation clause. */
  by?: string[];
  /** Labels for a "without" aggregation clause. */
  without?: string[];
  /** Whether the grouping clause appears before or after the argument list. */
  groupingPosition?: 'before' | 'after';
}

/**
 * Creates a PromQL function call or aggregation.
 *
 * ```ts
 * pqlFunc("rate", pqlSel("metric", "5m"))
 * // rate(metric[5m])
 *
 * pqlFunc("sum", expr, { by: ["job"] })
 * // sum(expr) by (job)
 *
 * pqlFunc("sum", expr, { by: ["job"], groupingPosition: "before" })
 * // sum by (job) (expr)
 *
 * pqlFunc("histogram_quantile", [pqlNum(0.95), pqlSel("le_bucket", "5m")])
 * // histogram_quantile(0.95, le_bucket[5m])
 * ```
 */
export const pqlFunc = (
  name: string,
  args: PromQLAstExpression | PromQLAstExpression[],
  opts?: PqlFuncOpts
): PromQLFunction => {
  const argsArray = Array.isArray(args) ? args : [args];

  let grouping;
  if (opts?.by) {
    grouping = PromQLBuilder.grouping(
      'by',
      opts.by.map((l) => PromQLBuilder.identifier(l))
    );
  } else if (opts?.without) {
    grouping = PromQLBuilder.grouping(
      'without',
      opts.without.map((l) => PromQLBuilder.identifier(l))
    );
  }

  return SynthNode.from(
    PromQLBuilder.expression.func.call(name, argsArray, grouping, opts?.groupingPosition)
  );
};

/**
 * Options for `pqlBinary`.
 */
export interface PqlBinaryOpts {
  /** Turns a comparison into a scalar. */
  bool?: boolean;
  /** Vector matching "on". */
  on?: string[];
  /** Vector matching "ignoring". */
  ignoring?: string[];
  groupLeft?: string[];
  groupRight?: string[];
}

/**
 * Creates a PromQL binary expression.
 *
 * ```ts
 * pqlBinary("+", a, b)
 * // a + b
 *
 * pqlBinary("==", a, b, { bool: true })
 * // a == bool b
 *
 * pqlBinary("/", a, b, { on: ["job"], groupLeft: [] })
 * // a / on(job) group_left() b
 * ```
 */
export const pqlBinary = <Name extends PromQLBinaryOperator>(
  op: Name,
  left: PromQLAstExpression,
  right: PromQLAstExpression,
  opts?: PqlBinaryOpts
): PromQLBinaryExpression<Name> => {
  let modifier;
  if (opts?.on !== undefined || opts?.ignoring !== undefined) {
    const kind = opts.on !== undefined ? ('on' as const) : ('ignoring' as const);
    const labelIds = (opts.on ?? opts.ignoring ?? []).map((l) => PromQLBuilder.identifier(l));

    let groupMod;
    if (opts.groupLeft !== undefined) {
      groupMod = PromQLBuilder.groupModifier(
        'group_left',
        opts.groupLeft.map((l) => PromQLBuilder.identifier(l))
      );
    } else if (opts.groupRight !== undefined) {
      groupMod = PromQLBuilder.groupModifier(
        'group_right',
        opts.groupRight.map((l) => PromQLBuilder.identifier(l))
      );
    }

    modifier = PromQLBuilder.modifier(kind, labelIds, groupMod);
  }

  return SynthNode.from(
    PromQLBuilder.expression.binary(op, left, right, { bool: opts?.bool, modifier })
  );
};

/**
 * Creates a PromQL unary expression.
 */
export const pqlUnary = (op: '+' | '-', arg: PromQLAstExpression): PromQLUnaryExpression =>
  SynthNode.from(PromQLBuilder.expression.unary(op, arg));

/**
 * Wraps a PromQL expression in parentheses.
 */
export const pqlParens = (child: PromQLAstExpression): PromQLParens =>
  SynthNode.from(PromQLBuilder.expression.parens(child));

/**
 * Creates a PromQL subquery expression.
 *
 * ```ts
 * pqlSubquery(expr, "30m")       // expr[30m:]
 * pqlSubquery(expr, "30m", "5m") // expr[30m:5m]
 * ```
 */
export const pqlSubquery = (
  expr: PromQLAstExpression,
  range: string,
  resolution?: string
): PromQLSubquery =>
  SynthNode.from(
    PromQLBuilder.expression.subquery(
      expr,
      PromQLBuilder.expression.literal.time(range),
      resolution !== undefined ? PromQLBuilder.expression.literal.time(resolution) : undefined
    )
  );

/**
 * Creates a PromQL `offset` modifier for use in selectors or subqueries.
 *
 * ```ts
 * pqlOffset("5m")        // offset 5m
 * pqlOffset("5m", true)  // offset - 5m
 * ```
 */
export const pqlOffset = (duration: string, negative = false): PromQLOffset =>
  SynthNode.from(PromQLBuilder.offset(PromQLBuilder.expression.literal.time(duration), negative));

/**
 * Creates a PromQL `@` modifier for use in selectors or subqueries.
 *
 * ```ts
 * pqlAt("start()")    // @ start()
 * pqlAt("end()")      // @ end()
 * pqlAt("1609459200") // @ 1609459200
 * ```
 */
export const pqlAt = (value: string, negative = false): PromQLAt => {
  const atValue =
    value === 'start()' || value === 'end()'
      ? (value as 'start()' | 'end()')
      : PromQLBuilder.expression.literal.time(value);

  return SynthNode.from(PromQLBuilder.at(atValue, negative));
};
