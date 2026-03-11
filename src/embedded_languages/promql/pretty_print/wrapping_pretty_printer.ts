/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import * as printer from '../../../printer';
import { layout } from '../../../printer';
import type * as promql from '../types';

export interface PromQLWrappingPrettyPrinterOptions {
  /**
   * Maximum line width before the engine attempts to break groups.
   * @default 80
   */
  printWidth?: number;

  /**
   * Number of spaces per indentation level.
   * @default 2
   */
  tabWidth?: number;

  /**
   * Whether to lowercase function and aggregation names.
   * @default false
   */
  lowercaseFunctions?: boolean;

  /**
   * Whether to lowercase keywords like `by`, `without`, `on`, `ignoring`, etc.
   * @default false
   */
  lowercaseKeywords?: boolean;

  /**
   * Whether to lowercase operators like `and`, `or`, `unless`.
   * @default false
   */
  lowercaseOperators?: boolean;
}

/**
 * A wrapping pretty-printer for PromQL that respects a configurable line width.
 *
 * Converts the PromQL AST into a {@link printer.Doc} tree using commands from the
 * printer library, then calls {@link layout} to produce the final formatted
 * string with optimal line breaks.
 *
 * Each PromQL AST node type has a dedicated `doc*` method that produces the
 * corresponding `Doc`.
 */
export class PromQLWrappingPrettyPrinter {
  /**
   * Format a PromQL query or expression to a string.
   */
  public static readonly print = (
    node: promql.PromQLAstQueryExpression | promql.PromQLAstExpression,
    opts?: PromQLWrappingPrettyPrinterOptions
  ): string => {
    const printer = new PromQLWrappingPrettyPrinter(opts);
    return printer.print(node);
  };

  /**
   * Return a `Doc` representing the given PromQL query or expression. This
   * converts PromQL AST to print tree.
   *
   * @param node A PromQL query or expression AST node.
   * @param opts Pretty-printing options.
   * @returns A `Doc` representing the formatted query or expression.
   */
  public static readonly doc = (
    node: promql.PromQLAstQueryExpression | promql.PromQLAstExpression,
    opts?: PromQLWrappingPrettyPrinterOptions
  ): printer.Doc => {
    const printer = new PromQLWrappingPrettyPrinter(opts);
    return printer.doc(node);
  };

  protected readonly opts: Required<PromQLWrappingPrettyPrinterOptions>;
  protected readonly layoutOpts: printer.LayoutOpts;

  constructor(opts: PromQLWrappingPrettyPrinterOptions = {}) {
    this.opts = {
      printWidth: opts.printWidth ?? 80,
      tabWidth: opts.tabWidth ?? 2,
      lowercaseFunctions: opts.lowercaseFunctions ?? false,
      lowercaseKeywords: opts.lowercaseKeywords ?? false,
      lowercaseOperators: opts.lowercaseOperators ?? false,
    };
    this.layoutOpts = {
      printWidth: this.opts.printWidth,
      tabWidth: this.opts.tabWidth,
    };
  }

  public print(node: promql.PromQLAstQueryExpression | promql.PromQLAstExpression): string {
    const doc = this.doc(node);
    return layout(doc, this.layoutOpts);
  }

  public doc(node: promql.PromQLAstQueryExpression | promql.PromQLAstExpression): printer.Doc {
    const doc = node.type === 'query' ? this.docQuery(node) : this.docExpression(node);
    return doc;
  }

  public docQuery(query: promql.PromQLAstQueryExpression): printer.Doc {
    if (!query.expression) return '';
    return this.docExpression(query.expression);
  }

  public docExpression(expr: promql.PromQLAstExpression): printer.Doc {
    switch (expr.type) {
      case 'function':
        return this.docFunction(expr);
      case 'selector':
        return this.docSelector(expr);
      case 'binary-expression':
        return this.docBinaryExpression(expr);
      case 'unary-expression':
        return this.docUnaryExpression(expr);
      case 'subquery':
        return this.docSubquery(expr);
      case 'parens':
        return this.docParens(expr);
      case 'literal':
        return this.docLiteral(expr);
      case 'identifier':
        return this.docIdentifier(expr);
      case 'unknown':
        return printer.text('<unknown>');
      default:
        return '';
    }
  }

  protected docFunction(node: promql.PromQLFunction): printer.Doc {
    const name = this.formatFunctionName(node.name);
    const argDocs = node.args.map((arg) => this.docExpression(arg));

    if (node.grouping && node.groupingPosition === 'before') {
      const groupingDoc = this.docGrouping(node.grouping);
      const argsList = this.docArgList(argDocs);
      return printer.group([
        printer.text(name),
        printer.text(' '),
        groupingDoc,
        printer.text(' '),
        argsList,
      ]);
    }

    if (node.grouping) {
      const groupingDoc = this.docGrouping(node.grouping);
      const fnCall = this.docFunctionCall(name, argDocs);
      return printer.group([fnCall, printer.text(' '), groupingDoc]);
    }

    return this.docFunctionCall(name, argDocs);
  }

  private docFunctionCall(name: string, argDocs: printer.Doc[]): printer.Doc {
    if (argDocs.length === 0) {
      return printer.text(name + '()');
    }

    return printer.group([
      printer.text(name + '('),
      printer.indent([printer.softline, printer.join([printer.text(','), printer.line], argDocs)]),
      printer.softline,
      printer.text(')'),
    ]);
  }

  private docArgList(argDocs: printer.Doc[]): printer.Doc {
    return printer.bracketedList('(', ')', ',', argDocs);
  }

  protected docGrouping(node: promql.PromQLGrouping): printer.Doc {
    const keyword = this.formatKeyword(node.name);
    const labelDocs = node.args.map((l) => this.docLabelName(l));
    return printer.group([
      printer.text(keyword + ' '),
      printer.bracketedList('(', ')', ',', labelDocs),
    ]);
  }

  protected docSelector(node: promql.PromQLSelector): printer.Doc {
    const parts: printer.Doc[] = [];

    if (node.metric) {
      parts.push(this.docIdentifier(node.metric));
    }

    if (node.labelMap) {
      parts.push(this.docLabelMap(node.labelMap));
    }

    if (node.duration) {
      parts.push(printer.text('['), this.docExpression(node.duration), printer.text(']'));
    }

    if (node.evaluation) {
      parts.push(this.docEvaluation(node.evaluation));
    }

    return printer.group(parts);
  }

  protected docLabelMap(node: promql.PromQLLabelMap): printer.Doc {
    const labelDocs = node.args.map((l) => this.docLabel(l));
    return printer.bracketedList('{', '}', ',', labelDocs);
  }

  protected docLabel(node: promql.PromQLLabel): printer.Doc {
    const labelName = this.docLabelName(node.labelName);
    const value = node.value ? this.docLiteral(node.value) : '';
    return [labelName, printer.text(node.operator), value];
  }

  protected docLabelName(node: promql.PromQLLabelName): printer.Doc {
    switch (node.type) {
      case 'identifier':
        return this.docIdentifier(node);
      case 'literal':
        return this.docLiteral(node);
      default:
        return '';
    }
  }

  protected docEvaluation(node: promql.PromQLEvaluation): printer.Doc {
    const parts: printer.Doc[] = [];

    if (node.offset) {
      parts.push(printer.text(' '), this.docOffset(node.offset));
    }

    if (node.at) {
      parts.push(printer.text(' '), this.docAt(node.at));
    }

    return parts;
  }

  protected docOffset(node: promql.PromQLOffset): printer.Doc {
    const sign = node.negative ? '- ' : '';
    const duration = this.docExpression(node.duration);
    return [printer.text('offset '), printer.text(sign), duration];
  }

  protected docAt(node: promql.PromQLAt): printer.Doc {
    const sign = node.negative ? '- ' : '';

    if (typeof node.value === 'string') {
      return [printer.text('@ '), printer.text(sign), printer.text(node.value)];
    }

    return [printer.text('@ '), printer.text(sign), this.docLiteral(node.value)];
  }

  protected docBinaryExpression(node: promql.PromQLBinaryExpression): printer.Doc {
    const operator = this.formatOperator(node.name);
    const left = this.docExpression(node.left);
    const right = this.docExpression(node.right);

    // Build the operator part (may include `bool` and modifier)
    const opParts: printer.Doc[] = [printer.text(operator)];

    if (node.bool) {
      opParts.push(printer.text(' bool'));
    }

    if (node.modifier) {
      opParts.push(printer.text(' '), this.docModifier(node.modifier));
    }

    const opDoc: printer.Doc = opParts.length === 1 ? opParts[0] : opParts;

    return printer.group([left, printer.indent([printer.line, opDoc, printer.text(' '), right])]);
  }

  protected docModifier(node: promql.PromQLModifier): printer.Doc {
    const keyword = this.formatKeyword(node.name);
    const labelDocs = node.labels.map((l) => this.docLabelName(l));
    const labels = labelDocs.length > 0 ? printer.join([printer.text(', ')], labelDocs) : '';

    const parts: printer.Doc[] = [
      printer.text(keyword),
      printer.text('('),
      labels,
      printer.text(')'),
    ];

    if (node.groupModifier) {
      parts.push(printer.text(' '), this.docGroupModifier(node.groupModifier));
    }

    return parts;
  }

  protected docGroupModifier(node: promql.PromQLGroupModifier): printer.Doc {
    const keyword = this.formatKeyword(node.name);
    const labelDocs = node.labels.map((l) => this.docLabelName(l));

    if (labelDocs.length > 0) {
      const labels = printer.join([printer.text(', ')], labelDocs);
      return [printer.text(keyword), printer.text('('), labels, printer.text(')')];
    }

    return printer.text(keyword);
  }

  protected docUnaryExpression(node: promql.PromQLUnaryExpression): printer.Doc {
    return [printer.text(node.name), this.docExpression(node.arg)];
  }

  protected docSubquery(node: promql.PromQLSubquery): printer.Doc {
    const expr = this.docExpression(node.expr);
    const range = this.docExpression(node.range);
    const resolution = node.resolution ? this.docExpression(node.resolution) : '';

    const parts: printer.Doc[] = [
      expr,
      printer.text('['),
      range,
      printer.text(':'),
      resolution,
      printer.text(']'),
    ];

    if (node.evaluation) {
      parts.push(this.docEvaluation(node.evaluation));
    }

    return printer.group(parts);
  }

  protected docParens(node: promql.PromQLParens): printer.Doc {
    const child = this.docExpression(node.child);
    return printer.group([
      printer.text('('),
      printer.indent([printer.softline, child]),
      printer.softline,
      printer.text(')'),
    ]);
  }

  protected docLiteral(node: promql.PromQLLiteral): printer.Doc {
    switch (node.literalType) {
      case 'integer':
        return printer.text(String((node as promql.PromQLNumericLiteral).value));
      case 'decimal':
        return printer.text(this.formatDecimal(node as promql.PromQLNumericLiteral));
      case 'hexadecimal':
        return printer.text('0x' + (node as promql.PromQLNumericLiteral).value.toString(16));
      case 'string':
        return printer.text(this.formatString(node as promql.PromQLStringLiteral));
      case 'time':
        return printer.text((node as promql.PromQLTimeValue).value);
      default:
        return printer.text(String((node as promql.PromQLNumericLiteral).value));
    }
  }

  protected docIdentifier(node: promql.PromQLIdentifier): printer.Doc {
    return printer.text(node.name);
  }

  private formatFunctionName(name: string): string {
    return this.opts.lowercaseFunctions ? name.toLowerCase() : name;
  }

  private formatKeyword(word: string): string {
    return this.opts.lowercaseKeywords ? word.toLowerCase() : word;
  }

  private formatOperator(op: string): string {
    if (op === 'and' || op === 'or' || op === 'unless') {
      return this.opts.lowercaseOperators ? op.toLowerCase() : op;
    }
    return op;
  }

  private formatDecimal(node: promql.PromQLNumericLiteral): string {
    const value = node.value;
    if (Number.isNaN(value)) return 'NaN';
    if (!Number.isFinite(value)) return value > 0 ? 'Inf' : '-Inf';
    const str = String(value);
    if (!str.includes('.') && !str.includes('e') && !str.includes('E')) {
      return str + '.0';
    }
    return str;
  }

  private formatString(node: promql.PromQLStringLiteral): string {
    const { value, valueUnquoted } = node;
    if (value !== valueUnquoted) return value;
    const escaped = valueUnquoted
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t');
    return `"${escaped}"`;
  }
}

export const print = PromQLWrappingPrettyPrinter.print;
export const doc = PromQLWrappingPrettyPrinter.doc;
