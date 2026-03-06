/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { Doc, LayoutOpts } from '../../../printer';
import { text, group, indent, softline, line, join, bracketedList } from '../../../printer';
import { layout } from '../../../printer';
import type {
  PromQLAstExpression,
  PromQLAstQueryExpression,
  PromQLAt,
  PromQLBinaryExpression,
  PromQLEvaluation,
  PromQLFunction,
  PromQLGrouping,
  PromQLGroupModifier,
  PromQLIdentifier,
  PromQLLabel,
  PromQLLabelMap,
  PromQLLabelName,
  PromQLLiteral,
  PromQLModifier,
  PromQLNumericLiteral,
  PromQLOffset,
  PromQLParens,
  PromQLSelector,
  PromQLStringLiteral,
  PromQLSubquery,
  PromQLTimeValue,
  PromQLUnaryExpression,
} from '../types';

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
 * Converts the PromQL AST into a {@link Doc} tree using commands from the
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
    node: PromQLAstQueryExpression | PromQLAstExpression,
    opts?: PromQLWrappingPrettyPrinterOptions
  ): string => {
    const printer = new PromQLWrappingPrettyPrinter(opts);
    return printer.print(node);
  };

  protected readonly opts: Required<PromQLWrappingPrettyPrinterOptions>;
  protected readonly layoutOpts: LayoutOpts;

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

  public print(node: PromQLAstQueryExpression | PromQLAstExpression): string {
    const doc = node.type === 'query' ? this.docQuery(node) : this.docExpression(node);
    return layout(doc, this.layoutOpts);
  }

  public docQuery(query: PromQLAstQueryExpression): Doc {
    if (!query.expression) return '';
    return this.docExpression(query.expression);
  }

  public docExpression(expr: PromQLAstExpression): Doc {
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
        return text('<unknown>');
      default:
        return '';
    }
  }

  protected docFunction(node: PromQLFunction): Doc {
    const name = this.formatFunctionName(node.name);
    const argDocs = node.args.map((arg) => this.docExpression(arg));

    if (node.grouping && node.groupingPosition === 'before') {
      const groupingDoc = this.docGrouping(node.grouping);
      const argsList = this.docArgList(argDocs);
      return group([text(name), text(' '), groupingDoc, text(' '), argsList]);
    }

    if (node.grouping) {
      const groupingDoc = this.docGrouping(node.grouping);
      const fnCall = this.docFunctionCall(name, argDocs);
      return group([fnCall, text(' '), groupingDoc]);
    }

    return this.docFunctionCall(name, argDocs);
  }

  private docFunctionCall(name: string, argDocs: Doc[]): Doc {
    if (argDocs.length === 0) {
      return text(name + '()');
    }

    return group([
      text(name + '('),
      indent([softline, join([text(','), line], argDocs)]),
      softline,
      text(')'),
    ]);
  }

  private docArgList(argDocs: Doc[]): Doc {
    return bracketedList('(', ')', ',', argDocs);
  }

  protected docGrouping(node: PromQLGrouping): Doc {
    const keyword = this.formatKeyword(node.name);
    const labelDocs = node.args.map((l) => this.docLabelName(l));
    return group([text(keyword + ' '), bracketedList('(', ')', ',', labelDocs)]);
  }

  protected docSelector(node: PromQLSelector): Doc {
    const parts: Doc[] = [];

    if (node.metric) {
      parts.push(this.docIdentifier(node.metric));
    }

    if (node.labelMap) {
      parts.push(this.docLabelMap(node.labelMap));
    }

    if (node.duration) {
      parts.push(text('['), this.docExpression(node.duration), text(']'));
    }

    if (node.evaluation) {
      parts.push(this.docEvaluation(node.evaluation));
    }

    return group(parts);
  }

  protected docLabelMap(node: PromQLLabelMap): Doc {
    const labelDocs = node.args.map((l) => this.docLabel(l));
    return bracketedList('{', '}', ',', labelDocs);
  }

  protected docLabel(node: PromQLLabel): Doc {
    const labelName = this.docLabelName(node.labelName);
    const value = node.value ? this.docLiteral(node.value) : '';
    return [labelName, text(node.operator), value];
  }

  protected docLabelName(node: PromQLLabelName): Doc {
    switch (node.type) {
      case 'identifier':
        return this.docIdentifier(node);
      case 'literal':
        return this.docLiteral(node);
      default:
        return '';
    }
  }

  protected docEvaluation(node: PromQLEvaluation): Doc {
    const parts: Doc[] = [];

    if (node.offset) {
      parts.push(text(' '), this.docOffset(node.offset));
    }

    if (node.at) {
      parts.push(text(' '), this.docAt(node.at));
    }

    return parts;
  }

  protected docOffset(node: PromQLOffset): Doc {
    const sign = node.negative ? '- ' : '';
    const duration = this.docExpression(node.duration);
    return [text('offset '), text(sign), duration];
  }

  protected docAt(node: PromQLAt): Doc {
    const sign = node.negative ? '- ' : '';

    if (typeof node.value === 'string') {
      return [text('@ '), text(sign), text(node.value)];
    }

    return [text('@ '), text(sign), this.docLiteral(node.value)];
  }

  protected docBinaryExpression(node: PromQLBinaryExpression): Doc {
    const operator = this.formatOperator(node.name);
    const left = this.docExpression(node.left);
    const right = this.docExpression(node.right);

    // Build the operator part (may include `bool` and modifier)
    const opParts: Doc[] = [text(operator)];

    if (node.bool) {
      opParts.push(text(' bool'));
    }

    if (node.modifier) {
      opParts.push(text(' '), this.docModifier(node.modifier));
    }

    const opDoc: Doc = opParts.length === 1 ? opParts[0] : opParts;

    return group([left, indent([line, opDoc, text(' '), right])]);
  }

  protected docModifier(node: PromQLModifier): Doc {
    const keyword = this.formatKeyword(node.name);
    const labelDocs = node.labels.map((l) => this.docLabelName(l));
    const labels = labelDocs.length > 0 ? join([text(', ')], labelDocs) : '';

    const parts: Doc[] = [text(keyword), text('('), labels, text(')')];

    if (node.groupModifier) {
      parts.push(text(' '), this.docGroupModifier(node.groupModifier));
    }

    return parts;
  }

  protected docGroupModifier(node: PromQLGroupModifier): Doc {
    const keyword = this.formatKeyword(node.name);
    const labelDocs = node.labels.map((l) => this.docLabelName(l));

    if (labelDocs.length > 0) {
      const labels = join([text(', ')], labelDocs);
      return [text(keyword), text('('), labels, text(')')];
    }

    return text(keyword);
  }

  protected docUnaryExpression(node: PromQLUnaryExpression): Doc {
    return [text(node.name), this.docExpression(node.arg)];
  }

  protected docSubquery(node: PromQLSubquery): Doc {
    const expr = this.docExpression(node.expr);
    const range = this.docExpression(node.range);
    const resolution = node.resolution ? this.docExpression(node.resolution) : '';

    const parts: Doc[] = [expr, text('['), range, text(':'), resolution, text(']')];

    if (node.evaluation) {
      parts.push(this.docEvaluation(node.evaluation));
    }

    return group(parts);
  }

  protected docParens(node: PromQLParens): Doc {
    const child = this.docExpression(node.child);
    return group([text('('), indent([softline, child]), softline, text(')')]);
  }

  protected docLiteral(node: PromQLLiteral): Doc {
    switch (node.literalType) {
      case 'integer':
        return text(String((node as PromQLNumericLiteral).value));
      case 'decimal':
        return text(this.formatDecimal(node as PromQLNumericLiteral));
      case 'hexadecimal':
        return text('0x' + (node as PromQLNumericLiteral).value.toString(16));
      case 'string':
        return text(this.formatString(node as PromQLStringLiteral));
      case 'time':
        return text((node as PromQLTimeValue).value);
      default:
        return text(String((node as PromQLNumericLiteral).value));
    }
  }

  protected docIdentifier(node: PromQLIdentifier): Doc {
    return text(node.name);
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

  private formatDecimal(node: PromQLNumericLiteral): string {
    const value = node.value;
    if (Number.isNaN(value)) return 'NaN';
    if (!Number.isFinite(value)) return value > 0 ? 'Inf' : '-Inf';
    const str = String(value);
    if (!str.includes('.') && !str.includes('e') && !str.includes('E')) {
      return str + '.0';
    }
    return str;
  }

  private formatString(node: PromQLStringLiteral): string {
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
