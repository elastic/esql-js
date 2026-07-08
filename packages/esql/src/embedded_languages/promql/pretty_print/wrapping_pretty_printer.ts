/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import * as printer from '@elastic/pretty-printer';
import { layout } from '@elastic/pretty-printer';
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
    const inner = query.expression ? this.docExpression(query.expression) : '';
    return this.decorateWithComments(query, inner);
  }

  public docExpression(expr: promql.PromQLAstExpression): printer.Doc {
    let doc: printer.Doc;
    switch (expr.type) {
      case 'function': {
        doc = this.docFunction(expr);
        const right = expr.formatting?.rightSingleLine;
        const skipRight = !!(right?.location && right.location.min < expr.location.max);
        return this.decorateWithComments(expr, doc, skipRight);
      }
      case 'selector':
        doc = this.docSelector(expr);
        break;
      case 'binary-expression':
        doc = this.docBinaryExpression(expr);
        break;
      case 'unary-expression':
        doc = this.docUnaryExpression(expr);
        break;
      case 'subquery':
        doc = this.docSubquery(expr);
        break;
      case 'parens':
        doc = this.docParens(expr);
        break;

      // Leaf node types self-decorate with comments, because they are also
      // reached via non-expression paths.
      case 'literal':
        return this.docLiteral(expr);
      case 'identifier':
        return this.docIdentifier(expr);
      case 'unknown':
        doc = printer.text('<unknown>');
        break;
      default:
        return '';
    }
    return this.decorateWithComments(expr, doc);
  }

  protected decorateWithComments(
    node: promql.PromQLAstNode,
    doc: printer.Doc,
    skipRight = false
  ): printer.Doc {
    const formatting = node.formatting;
    if (!formatting) return doc;

    const { top, rightSingleLine, bottom } = formatting;
    const right = skipRight ? undefined : rightSingleLine;
    if (!top && !right && !bottom) return doc;

    const parts: printer.Doc[] = [];

    if (top) {
      for (const comment of top) {
        parts.push(printer.text(`#${comment.text}`), printer.hardline);
      }
    }

    parts.push(doc);

    if (right) {
      parts.push(printer.lineSuffix(` #${right.text}`));
      parts.push(printer.breakParent);
    }

    if (bottom) {
      for (const comment of bottom) {
        parts.push(printer.hardline, printer.text(`#${comment.text}`));
      }
    }

    return parts;
  }

  protected docFunction(node: promql.PromQLFunction): printer.Doc {
    const name = this.formatFunctionName(node.name);
    const argDocs = node.args.map((arg) => this.docExpression(arg));

    const right = node.formatting?.rightSingleLine;
    const openParenSuffix: printer.Doc[] | undefined =
      right?.location && right.location.min < node.location.max
        ? [printer.lineSuffix(` #${right.text}`), printer.breakParent]
        : undefined;

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
      const fnCall = this.docFunctionCall(name, argDocs, openParenSuffix);
      return printer.group([fnCall, printer.text(' '), groupingDoc]);
    }

    return this.docFunctionCall(name, argDocs, openParenSuffix);
  }

  private docFunctionCall(
    name: string,
    argDocs: printer.Doc[],
    openParenSuffix?: printer.Doc[]
  ): printer.Doc {
    if (argDocs.length === 0) {
      return printer.text(name + '()');
    }

    return printer.group([
      printer.text(name + '('),
      ...(openParenSuffix ?? []),
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
    const doc = printer.group([
      printer.text(keyword + ' '),
      printer.bracketedList('(', ')', ',', labelDocs),
    ]);
    return this.decorateWithComments(node, doc);
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
      const durationDoc = this.docExpression(node.duration);
      if (node.duration.formatting?.top?.length) {
        parts.push(
          printer.text('['),
          printer.indent([printer.hardline, durationDoc]),
          printer.hardline,
          printer.text(']')
        );
      } else {
        parts.push(printer.text('['), durationDoc, printer.text(']'));
      }
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
    const doc = printer.fill([
      labelName,
      printer.text(' '),
      printer.text(node.operator),
      printer.indent([printer.line, value]),
    ]);
    return this.decorateWithComments(node, doc);
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
    let doc: printer.Doc;
    switch (node.literalType) {
      case 'integer':
        doc = printer.text(String((node as promql.PromQLNumericLiteral).value));
        break;
      case 'decimal':
        doc = printer.text(this.formatDecimal(node as promql.PromQLNumericLiteral));
        break;
      case 'hexadecimal':
        doc = printer.text('0x' + (node as promql.PromQLNumericLiteral).value.toString(16));
        break;
      case 'string':
        doc = printer.text(this.formatString(node as promql.PromQLStringLiteral));
        break;
      case 'time':
        doc = printer.text((node as promql.PromQLTimeValue).value);
        break;
      case 'param':
        doc = printer.text(
          `${(node as promql.PromQLParamLiteral).paramKind}${(node as promql.PromQLParamLiteral).value}`
        );
        break;
      default:
        doc = printer.text(String((node as promql.PromQLNumericLiteral).value));
    }
    return this.decorateWithComments(node, doc);
  }

  protected docIdentifier(node: promql.PromQLIdentifier): printer.Doc {
    return this.decorateWithComments(node, printer.text(node.name));
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
