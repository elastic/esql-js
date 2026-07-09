/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import {
  align,
  conditionalGroup,
  fill,
  group,
  hardline,
  hardlineWithoutBreakParent,
  indent,
  join,
  line,
  softline,
  text,
  layout,
} from '@elastic/pretty-printer';
import type { Doc, LayoutOpts } from '@elastic/pretty-printer';
import type {
  ESQLAstBaseItem,
  ESQLAstCommand,
  ESQLAstForkCommand,
  ESQLAstQueryExpression,
  ESQLAstHeaderCommand,
  ESQLColumn,
  ESQLCommandOption,
  ESQLFunction,
  ESQLForkParens,
  ESQLIdentifier,
  ESQLInlineCast,
  ESQLList,
  ESQLLiteral,
  ESQLMap,
  ESQLMapEntry,
  ESQLOrderExpression,
  ESQLParens,
  ESQLSource,
  ESQLAstItem,
  ESQLAstExpression,
} from '../../types';
import type { BasicPrettyPrinterOptions } from '../basic_pretty_printer';
import {
  commandOptionsWithEqualsSeparator,
  commandsWithNoCommaArgSeparator,
  commandsWithSpecialCommaRules,
} from '../constants';
import { getPrettyPrintStats } from '../helpers';
import { LeafPrinter } from '../leaf_printer';
import { PromQLWrappingPrettyPrinter } from '../../embedded_languages/promql/pretty_print';
import { isPromqlNode } from '../../embedded_languages/promql/ast/is';
import type { PromQLAstQueryExpression } from '../../embedded_languages/promql/types';
import { singleItems, resolveItem } from '../../ast/visitor/utils';
import {
  BinaryExpressionGroup,
  binaryExpressionGroup,
  unaryExpressionGroup,
} from '../../ast/grouping';
import {
  isBinaryExpression,
  isColumn,
  isDoubleLiteral,
  isIdentifier,
  isIntegerLiteral,
  isLiteral,
  isParamLiteral,
  isParens,
  isProperNode,
  isQuery,
} from '../../ast/is';
import { commentListToDoc, commentToDoc, decorateWithComments } from './doc_helpers';

export interface WrappingPrettyPrinterOptions extends BasicPrettyPrinterOptions {
  /**
   * Initial indentation string inserted before the whole query. Defaults to an
   * empty string.
   *
   * @default ''
   */
  indent?: string;

  /**
   * Tabbing string inserted before new level of nesting. Defaults to two spaces.
   *
   * @default '  '
   */
  tab?: string;

  /**
   * Tabbing string inserted before a pipe, when `multiline` is `true`.
   *
   * @default '  '
   */
  pipeTab?: string;

  /**
   * Tabbing string inserted before command arguments, when they are broken into
   * multiple lines. Defaults to four spaces.
   *
   * @default '    '
   */
  commandTab?: string;

  /**
   * Whether to force multiline formatting. Defaults to `false`. If set to
   * `false`, it will try to fit the query into a single line.
   *
   * @default false
   */
  multiline?: boolean;

  /**
   * Expected width of the output. Defaults to 80 characters. Text will be
   * wrapped to fit this width.
   *
   * @default 80
   */
  wrap?: number;
}

type NormalizedOpts = Omit<Required<WrappingPrettyPrinterOptions>, 'mapRepresentation'> &
  Pick<WrappingPrettyPrinterOptions, 'mapRepresentation'>;

export class WrappingPrettyPrinter {
  public static readonly print = (
    query: ESQLAstQueryExpression,
    opts?: WrappingPrettyPrinterOptions
  ): string => new WrappingPrettyPrinter(opts).print(query);

  public static readonly doc = (
    query: ESQLAstQueryExpression,
    opts?: WrappingPrettyPrinterOptions
  ): Doc => new WrappingPrettyPrinter(opts).doc(query);

  protected readonly opts: NormalizedOpts;
  protected readonly layoutOpts: LayoutOpts;

  constructor(opts: WrappingPrettyPrinterOptions = {}) {
    this.opts = {
      indent: opts.indent ?? '',
      tab: opts.tab ?? '  ',
      pipeTab: opts.pipeTab ?? '  ',
      commandTab: opts.commandTab ?? '    ',
      multiline: opts.multiline ?? false,
      wrap: opts.wrap ?? 80,
      skipHeader: opts.skipHeader ?? false,
      lowercase: opts.lowercase ?? false,
      lowercaseCommands: opts.lowercaseCommands ?? opts.lowercase ?? false,
      lowercaseOptions: opts.lowercaseOptions ?? opts.lowercase ?? false,
      lowercaseFunctions: opts.lowercaseFunctions ?? opts.lowercase ?? false,
      lowercaseKeywords: opts.lowercaseKeywords ?? opts.lowercase ?? false,
      mapRepresentation: opts.mapRepresentation,
    };
    this.layoutOpts = {
      printWidth: this.opts.wrap,
      tabWidth: this.opts.tab.length,
    };
  }

  public print(query: ESQLAstQueryExpression): string {
    const initIndent = this.opts.indent;
    const effectiveWidth = Math.max(1, this.opts.wrap - initIndent.length);
    const effectiveOpts: LayoutOpts = initIndent
      ? { ...this.layoutOpts, printWidth: effectiveWidth }
      : this.layoutOpts;
    const result = layout(this.doc(query), effectiveOpts);

    if (!initIndent) return result;

    return initIndent + result.replaceAll('\n', '\n' + initIndent);
  }

  public doc(query: ESQLAstQueryExpression): Doc {
    return this.docQuery(query);
  }

  // -------------------------------------------------------------------- Query

  protected docQuery(query: ESQLAstQueryExpression): Doc {
    const cmds = query.commands;
    const hasHeader = !this.opts.skipHeader && !!query.header?.length;
    const forceMultiline =
      this.opts.multiline || getPrettyPrintStats(query).hasLineBreakingDecorations;
    const pipeTabLen = this.opts.pipeTab.length;
    const flatCmdDocs = cmds.map((cmd, i) => this.docCmdVariant(cmd, i === 0, false));
    const mlCmdDocs = cmds.map((cmd, i) => this.docCmdVariant(cmd, i === 0, true));
    const headerParts: Doc[] = [];

    if (hasHeader && query.header) {
      for (const hcmd of query.header) {
        headerParts.push(this.docHeaderCommand(hcmd), hardline);
      }
    }

    // Single-line query state: everything on one line
    const singleLine: Doc = [...headerParts, join([' | '], flatCmdDocs)];

    // Multi-line query state: each command on its own line
    const multiLineParts: Doc[] = [...headerParts];

    const firstCmdTopComments = this.extractTopCommentDocs(cmds[0]);

    for (const c of firstCmdTopComments) {
      multiLineParts.push(c, hardlineWithoutBreakParent);
    }
    multiLineParts.push(mlCmdDocs[0]);

    for (const c of this.extractBottomCommentDocs(cmds[0])) {
      multiLineParts.push(hardlineWithoutBreakParent, c);
    }

    for (let i = 1; i < mlCmdDocs.length; i++) {
      const cmdDoc = mlCmdDocs[i];
      const topComments = this.extractTopCommentDocs(cmds[i]);
      if (topComments.length) {
        // Insert top-comments before the pipe, indented to pipe level
        for (const c of topComments) {
          multiLineParts.push(align(pipeTabLen, [hardlineWithoutBreakParent, c]));
        }
      }
      multiLineParts.push(align(pipeTabLen, [hardlineWithoutBreakParent, '| ', cmdDoc]));

      for (const c of this.extractBottomCommentDocs(cmds[i])) {
        multiLineParts.push(align(pipeTabLen, [hardlineWithoutBreakParent, c]));
      }
    }

    if (forceMultiline) {
      return multiLineParts;
    }

    return conditionalGroup([singleLine, multiLineParts]);
  }

  /** Extract top-comment docs for a command (to place before its pipe). */
  private extractTopCommentDocs(cmd: ESQLAstCommand): Doc[] {
    const top = cmd.formatting?.top;

    if (!top?.length) return [];

    return top.map((c) => commentToDoc(c));
  }

  /** Extract bottom-comment docs for a command (to place on the following line). */
  private extractBottomCommentDocs(cmd: ESQLAstCommand): Doc[] {
    const bottom = cmd.formatting?.bottom;

    if (!bottom?.length) return [];

    return bottom.map((c) => commentToDoc(c));
  }

  // ---------------------------------------------------------- Header commands

  protected docHeaderCommand(cmd: ESQLAstHeaderCommand): Doc {
    const lower = this.opts.lowercaseCommands;
    const name = lower ? cmd.name.toLowerCase() : cmd.name.toUpperCase();
    const argItems = [...singleItems(cmd.args)];
    const argDocs = argItems.map((a) => this.docExpression(a));
    const hasLBD = argItems.some((a) => getPrettyPrintStats(a).hasLineBreakingDecorations);
    const argsDoc: Doc = argDocs.length
      ? [' ', hasLBD ? this.docOnePerLineList(argDocs) : this.docFillList(argDocs)]
      : '';
    const d: Doc = group([name, argsDoc, ';'], { shouldBreak: hasLBD });

    return decorateWithComments(cmd, d);
  }

  // ----------------------------------------------------------------- Commands

  /**
   * Dispatch to the right command doc generator.
   */
  protected docCmdVariant(cmd: ESQLAstCommand, isFirst: boolean, multiline: boolean): Doc {
    switch (cmd.name) {
      case 'fork':
        return this.docFork(cmd as ESQLAstForkCommand, isFirst, multiline);
      default:
        return this.docGenericCmd(cmd, isFirst, multiline);
    }
  }

  /**
   * Generic command: CMD arg1, arg2 [OPTION …]
   * Handles the vast majority of ES|QL commands.
   */
  protected docGenericCmd(cmd: ESQLAstCommand, isFirst: boolean, multiline: boolean): Doc {
    const cmdName = this.formatCmdName(cmd);

    // Separate args from options
    const allArgs = [...singleItems(cmd.args)];
    const args = allArgs.filter((a) => a.type !== 'option');
    const opts = allArgs.filter((a) => a.type === 'option') as ESQLCommandOption[];

    // If any arg or option has line-breaking decorations, force the command to
    // break and use one-per-line arg format.
    const hasLineBreakingDecorations =
      args.some((a) => getPrettyPrintStats(a).hasLineBreakingDecorations) ||
      opts.some((o) => getPrettyPrintStats(o).hasLineBreakingDecorations);

    const argDocs = args.map((a) => this.docExpression(a));
    const useComma = !commandsWithNoCommaArgSeparator.has(cmd.name);
    const specialRule = commandsWithSpecialCommaRules.get(cmd.name);
    const argsDoc = this.docArgsList(argDocs, useComma, specialRule, hasLineBreakingDecorations);
    const optDocs = opts.map((o) => this.docCommandOption(o));

    return this.buildCmdDoc(
      cmdName,
      argsDoc,
      optDocs,
      isFirst,
      multiline,
      cmd,
      hasLineBreakingDecorations
    );
  }

  /**
   * Build a command doc given pre-computed parts.
   *
   * Layout strategy:
   *
   *  - An **inner group** tries to keep `cmdName + args` on one line.
   *  - An **outer group** wraps the inner group plus options. When it breaks,
   *    options go on separate lines while args may still stay inline.
   */
  private buildCmdDoc(
    cmdName: Doc,
    argsDoc: Doc,
    optDocs: Doc[],
    isFirst: boolean,
    multiline: boolean,
    cmd?: ESQLAstCommand,
    forceBreak = false
  ): Doc {
    const tabLen = this.opts.tab.length;
    const cmdTabLen = this.opts.commandTab.length;
    const extraAlign = isFirst ? 0 : cmdTabLen - tabLen;
    const hasArgs = argsDoc !== '';
    const hasOpts = optDocs.length > 0;

    if (!hasArgs && !hasOpts) {
      const d: Doc = cmdName;
      return cmd ? decorateWithComments(cmd, d) : d;
    }

    // When there are 2+ options in multiline state, use hardlines so options
    // always appear on separate lines regardless of length.
    const optSepLine: Doc = multiline && optDocs.length >= 2 ? hardlineWithoutBreakParent : line;

    // When the group breaks, args move to the next line at the correct indentation.
    const buildArgsSection = (argsContent: Doc): Doc =>
      extraAlign > 0 ? align(extraAlign, indent([line, argsContent])) : indent([line, argsContent]);

    // Each option is indented one more level than args.
    const buildOptsSection = (): Doc => {
      if (!hasOpts) return '';

      const parts: Doc[] = [];

      for (const optDoc of optDocs) {
        const sep: Doc =
          extraAlign > 0
            ? align(extraAlign, indent(indent([optSepLine, optDoc])))
            : indent(indent([optSepLine, optDoc]));
        parts.push(sep);
      }

      return parts;
    };

    let fullDoc: Doc;

    if (hasArgs && hasOpts) {
      const argsSection = buildArgsSection(argsDoc);
      const optsSection = buildOptsSection();
      const innerGroup = group([cmdName, argsSection], { shouldBreak: forceBreak });

      fullDoc = group([innerGroup, optsSection]);
    } else if (hasArgs) {
      fullDoc = group([cmdName, buildArgsSection(argsDoc)], { shouldBreak: forceBreak });
    } else {
      fullDoc = group([cmdName, buildOptsSection()]);
    }

    if (!cmd) return fullDoc;

    // For regular commands, only the `left` inline comments are added here.
    // `top` comments are handled at the query level (before the pipe separator).
    const leftComments = cmd.formatting?.left;

    if (leftComments?.length) {
      return [commentListToDoc(leftComments), ' ', fullDoc];
    }

    return fullDoc;
  }

  private formatCmdName(cmd: ESQLAstCommand): string {
    const lower = this.opts.lowercaseCommands;
    let name = lower ? cmd.name.toLowerCase() : cmd.name.toUpperCase();

    if (cmd.commandType) {
      const type = lower ? cmd.commandType.toLowerCase() : cmd.commandType.toUpperCase();
      name = `${type} ${name}`;
    }

    return name;
  }

  /**
   * Build a Doc for a list of argument expressions, respecting comma/no-comma
   * separators and per-command special rules.
   */
  private docArgsList(
    argDocs: Doc[],
    useComma: boolean,
    specialRule?: (i: number) => boolean,
    forceOneLine = false
  ): Doc {
    if (argDocs.length === 0) return '';
    if (argDocs.length === 1) return argDocs[0];

    if (!useComma) {
      const sep: Doc = forceOneLine ? hardlineWithoutBreakParent : line;

      return join([sep], argDocs);
    }

    if (specialRule) {
      const parts: Doc[] = [];
      for (let i = 0; i < argDocs.length; i++) {
        if (i > 0) {
          const needsComma = specialRule(i);

          if (forceOneLine) {
            parts.push(
              needsComma ? [text(','), hardlineWithoutBreakParent] : hardlineWithoutBreakParent
            );
          } else {
            parts.push(needsComma ? [text(','), line] : line);
          }
        }
        parts.push(argDocs[i]);
      }

      return parts;
    }

    if (forceOneLine) {
      return this.docOnePerLineList(argDocs);
    }

    return this.docFillList(argDocs);
  }

  /**
   * One-per-line format with trailing commas, joined by hard line breaks.
   */
  private docOnePerLineList(itemDocs: Doc[]): Doc {
    const withComma: Doc[] = itemDocs.map((d, i) => (i < itemDocs.length - 1 ? [d, text(',')] : d));

    return join([hardlineWithoutBreakParent], withComma);
  }

  /**
   * Join items with trailing commas using fill for line-wrapping.
   */
  private docFillList(itemDocs: Doc[]): Doc {
    if (itemDocs.length === 0) return '';
    if (itemDocs.length === 1) return itemDocs[0];

    const withComma: Doc[] = itemDocs.map((d, i) => (i < itemDocs.length - 1 ? [d, text(',')] : d));

    return fill(join([line], withComma));
  }

  // ---------------------------------------------------------- Command options

  protected docCommandOption(opt: ESQLCommandOption): Doc {
    const lower = this.opts.lowercaseOptions;
    const name = lower ? opt.name.toLowerCase() : opt.name.toUpperCase();
    const args = [...singleItems(opt.args)];
    const argDocs = args.map((a) => this.docExpression(a));

    if (argDocs.length === 0) return name;

    const useEquals = commandOptionsWithEqualsSeparator.has(opt.name);

    if (useEquals) {
      const argsDoc = this.docFillList(argDocs);

      // APPEND_SEPARATOR = "value"  or  APPEND_SEPARATOR =\n  "very long value"
      return group([name + ' =', indent([line, argsDoc])]);
    } else {
      const withComma: Doc[] = argDocs.map((d, i) => (i < argDocs.length - 1 ? [d, text(',')] : d));
      const argsDoc: Doc = argDocs.length === 1 ? argDocs[0] : fill(join([line], withComma));

      return group([name, ' ', indent([argsDoc])]);
    }
  }

  // ------------------------------------------------------------- FORK command

  protected docFork(cmd: ESQLAstForkCommand, isFirst: boolean, multiline: boolean): Doc {
    const cmdName = this.formatCmdName(cmd);
    const tabLen = this.opts.tab.length;
    const cmdTabLen = this.opts.commandTab.length;
    const extraAlign = isFirst ? 0 : cmdTabLen - tabLen;

    const buildArgsSection = (branchesDoc: Doc): Doc =>
      extraAlign > 0 ? align(extraAlign, indent([line, branchesDoc])) : indent([line, branchesDoc]);

    if (!multiline) {
      // Flat inline format — (CMD1 | CMD2) (CMD3 | CMD4)
      const flatBranches = cmd.args.map((branch) => {
        const innerCmds = branch.child.commands;
        const innerFlatDocs = innerCmds.map((c, i) => this.docCmdVariant(c, i === 0, false));
        return ['(', join([' | '], innerFlatDocs), ')'];
      });
      const branchesDoc: Doc = join([' '], flatBranches);
      const doc = group([cmdName, ' ', branchesDoc]);
      const leftComments = cmd.formatting?.left;

      return leftComments?.length ? [commentListToDoc(leftComments), ' ', doc] : doc;
    }

    // Multiline with expanded branch format
    const mlBranches = cmd.args.map((branch) => this.docForkBranch(branch));
    const branchesDoc = join([line], mlBranches);
    const fullDoc: Doc = group([cmdName, buildArgsSection(branchesDoc)], { shouldBreak: true });
    const leftComments = cmd.formatting?.left;

    return leftComments?.length ? [commentListToDoc(leftComments), ' ', fullDoc] : fullDoc;
  }

  /**
   * A single FORK branch: ( inner_query )
   */
  protected docForkBranch(branch: ESQLForkParens): Doc {
    const innerQuery = branch.child;
    const innerCmds = innerQuery.commands;
    const pipeTabLen = this.opts.pipeTab.length;
    const innerCmdDocs = innerCmds.map((cmd, i) => this.docCmdVariant(cmd, i === 0, true));
    const innerParts: Doc[] = [];

    for (const c of this.extractTopCommentDocs(innerCmds[0])) {
      innerParts.push(c, hardlineWithoutBreakParent);
    }
    innerParts.push(innerCmdDocs[0]);

    for (let i = 1; i < innerCmdDocs.length; i++) {
      for (const c of this.extractTopCommentDocs(innerCmds[i])) {
        innerParts.push(align(-pipeTabLen, [hardlineWithoutBreakParent, c]));
      }
      innerParts.push(align(-pipeTabLen, [hardlineWithoutBreakParent, '| ', innerCmdDocs[i]]));
    }

    const branchInner: Doc = [
      '(',
      align(4, [hardlineWithoutBreakParent, ...innerParts]),
      hardlineWithoutBreakParent,
      ')',
    ];

    return decorateWithComments(branch, branchInner);
  }

  // -------------------------------------------------------------- Expressions

  protected docExpression(node: ESQLAstItem): Doc {
    if (Array.isArray(node)) {
      const items = [...singleItems([node])];
      if (items.length === 1) return this.docExpression(items[0]);
      return items.map((item) => this.docExpression(item));
    }

    if (isPromqlNode(node)) {
      const promqlDoc = this.docPromql(node as PromQLAstQueryExpression);

      return decorateWithComments(node as unknown as ESQLAstBaseItem, promqlDoc);
    }

    switch (node.type) {
      case 'function':
        return this.docFunction(node);
      case 'source':
        return this.docSource(node);
      case 'column':
        return this.docColumn(node);
      case 'literal':
        return this.docLiteral(node);
      case 'identifier':
        return this.docIdentifier(node);
      case 'inlineCast':
        return this.docInlineCast(node);
      case 'list':
        return this.docList(node);
      case 'map':
        return this.docMap(node);
      case 'map-entry':
        return this.docMapEntry(node as ESQLMapEntry);
      case 'parens':
        return this.docParens(node);
      case 'order':
        return this.docOrderExpression(node);
      case 'query':
        return this.docQuery(node);
      default:
        return (node as ESQLAstExpression).text ?? '';
    }
  }

  // ----------------------------------------------------- Function expressions

  protected docFunction(node: ESQLFunction): Doc {
    let operatorStr = node.name;
    let isParamOp = false;

    if (node.operator && isParamLiteral(node.operator)) {
      operatorStr = LeafPrinter.param(node.operator);
      isParamOp = true;
    } else if (node.operator && isIdentifier(node.operator)) {
      operatorStr = node.operator.name;
    }

    switch (node.subtype) {
      case 'unary-expression':
        return decorateWithComments(node, this.docUnaryExpression(node, operatorStr));
      case 'postfix-unary-expression':
        return decorateWithComments(node, this.docPostfixUnary(node, operatorStr));
      case 'binary-expression':
        return decorateWithComments(node, this.docBinaryExpression(node, operatorStr));
      default:
        return decorateWithComments(node, this.docFunctionCall(node, operatorStr, isParamOp));
    }
  }

  private docUnaryExpression(node: ESQLFunction, op: string): Doc {
    const operator = this.opts.lowercaseKeywords ? op.toLowerCase() : op.toUpperCase();
    const separator = operator === '-' || operator === '+' ? '' : ' ';
    const arg = node.args[0];
    const argDoc = this.docExpression(arg);

    const operatorPrec = unaryExpressionGroup(node);
    const argPrec = binaryExpressionGroup(arg);
    if (argPrec !== BinaryExpressionGroup.none && argPrec < operatorPrec) {
      return [operator, separator, '(', argDoc, ')'];
    }

    return [operator, separator, argDoc];
  }

  private docPostfixUnary(node: ESQLFunction, op: string): Doc {
    const operator = this.opts.lowercaseKeywords ? op.toLowerCase() : op.toUpperCase();
    const argDoc = this.docExpression(node.args[0]);

    return [argDoc, ' ', operator];
  }

  private docBinaryExpression(node: ESQLFunction, op: string): Doc {
    if (node.name === '*') {
      const simplified = this.docSimplifyMultiplicationByOne(node);

      if (simplified !== undefined) return simplified;
    }

    const operator = this.opts.lowercaseKeywords ? op.toLowerCase() : op.toUpperCase();
    const [leftItem, rightItem] = node.args as [ESQLAstItem, ESQLAstItem];
    const group_of = binaryExpressionGroup(node);
    const leftGroup = binaryExpressionGroup(leftItem);
    const rightGroup = binaryExpressionGroup(rightItem);
    const wrapLeft = leftGroup !== BinaryExpressionGroup.none && leftGroup < group_of;
    const wrapRight =
      rightGroup !== BinaryExpressionGroup.none &&
      (rightGroup < group_of ||
        (rightGroup === group_of && (node.name === '/' || node.name === '-' || node.name === '%')));

    let leftDoc = this.docExpression(leftItem);
    let rightDoc = this.docExpression(rightItem);

    if (wrapLeft) leftDoc = ['(', leftDoc, ')'];
    if (wrapRight) rightDoc = ['(', rightDoc, ')'];

    return group([leftDoc, indent([line, operator + ' ', rightDoc])]);
  }

  /**
   * Unary minus is encoded in the AST as a multiplication by `-1` (and `1` for
   * an explicit plus). Collapse such `*` chains back into a leading sign, e.g. `-1.
   */
  private docSimplifyMultiplicationByOne(node: ESQLAstExpression, minusCount = 0): Doc | undefined {
    if (isBinaryExpression(node) && node.name === '*') {
      const left = resolveItem(node.args[0]);
      const right = resolveItem(node.args[1]);

      if (isProperNode(left) && isProperNode(right)) {
        if (!!left.formatting || !!right.formatting) return undefined;
        if (isIntegerLiteral(left)) {
          if (left.value === 1) return this.docSimplifyMultiplicationByOne(right, minusCount);
          if (left.value === -1) return this.docSimplifyMultiplicationByOne(right, minusCount + 1);
        }
        if (isIntegerLiteral(right)) {
          if (right.value === 1) return this.docSimplifyMultiplicationByOne(left, minusCount);
          if (right.value === -1) return this.docSimplifyMultiplicationByOne(left, minusCount + 1);
        }

        return undefined;
      }

      return undefined;
    }

    const isNegative = minusCount % 2 === 1;

    if (isNegative && (isIntegerLiteral(node) || isDoubleLiteral(node)) && node.value < 0) {
      return this.docExpression({ ...node, value: Math.abs(node.value) });
    }

    let expression = this.docExpression(node);
    const sign = isNegative ? '-' : '';
    const needsBrackets = !!sign && !isColumn(node) && !isLiteral(node) && !isParens(node);

    if (needsBrackets) expression = ['(', expression, ')'];

    return sign ? [sign, expression] : expression;
  }

  /**
   * Variadic-call (function): fn(arg1, arg2, ...)
   */
  private docFunctionCall(node: ESQLFunction, op: string, preserveCase = false): Doc {
    const name = preserveCase
      ? op
      : this.opts.lowercaseFunctions
        ? op.toLowerCase()
        : op.toUpperCase();
    const args = [...singleItems(node.args)];

    if (args.length === 0) return `${name}()`;

    const argDocs = args.map((a) => this.docExpression(a));
    const hasRightSingleLine = getPrettyPrintStats(node.args).hasRightSingleLineComments;
    const hasLBD = getPrettyPrintStats(node.args).hasLineBreakingDecorations;
    const argsDoc = hasLBD ? this.docOnePerLineList(argDocs) : this.docFillList(argDocs);

    // When a trailing `//` comment follows the last arg, put the closing paren
    // on its own line so the comment lands before the paren.
    if (hasRightSingleLine) {
      return group([`${name}(`, indent([softline, argsDoc]), softline, ')'], {
        shouldBreak: hasLBD,
      });
    }

    return group([`${name}(`, indent([softline, argsDoc, ')'])], { shouldBreak: hasLBD });
  }

  // --------------------------------------------------------- List expressions

  protected docList(node: ESQLList): Doc {
    const items = node.values.map((v) => this.docExpression(v));
    const subtype = node.subtype ?? 'literal';

    let d: Doc;
    if (subtype === 'bare') {
      d = this.docFillList(items);
    } else {
      const open = subtype === 'tuple' ? '(' : '[';
      const close = subtype === 'tuple' ? ')' : ']';

      d = this.docBracketedFillList(open, close, items);
    }

    return decorateWithComments(node, d);
  }

  private docBracketedFillList(open: string, close: string, items: Doc[]): Doc {
    if (items.length === 0) return [open, close];

    const withComma: Doc[] = items.map((d, i) => (i < items.length - 1 ? [d, text(',')] : d));

    return group([open, indent([softline, fill(join([line], withComma)), close])]);
  }

  // ----------------------------------------------------------- Map expression

  protected docMap(node: ESQLMap): Doc {
    const repr = node.representation ?? 'map';
    const entries = node.entries.map((e) => this.docMapEntry(e, repr));
    const hasLineBreakingDecorations = node.entries.some(
      (e) =>
        getPrettyPrintStats(e).hasLineBreakingDecorations ||
        getPrettyPrintStats(e.key).hasLineBreakingDecorations ||
        getPrettyPrintStats(e.value).hasLineBreakingDecorations
    );

    let d: Doc;
    if (repr === 'map') {
      if (hasLineBreakingDecorations) {
        d = this.docBracketedOnePerLine('{', '}', entries);
      } else {
        d = this.docBracketedFillList('{', '}', entries);
      }
    } else if (repr === 'assignment') {
      if (hasLineBreakingDecorations) {
        d = this.docOnePerLineList(entries);
      } else {
        d = fill(join([line], entries));
      }
    } else {
      d = join([line], entries);
    }

    return decorateWithComments(node, d);
  }

  private docBracketedOnePerLine(open: string, close: string, items: Doc[]): Doc {
    if (items.length === 0) return [open, close];

    const withComma: Doc[] = items.map((d, i) => (i < items.length - 1 ? [d, text(',')] : d));

    return [
      open,
      indent([hardlineWithoutBreakParent, join([hardlineWithoutBreakParent], withComma)]),
      hardlineWithoutBreakParent,
      close,
    ];
  }

  protected docMapEntry(entry: ESQLMapEntry, repr?: 'map' | 'listpairs' | 'assignment'): Doc {
    const representation = repr ?? 'map';
    const keyDoc = this.docExpression(entry.key);
    const valDoc = this.docExpression(entry.value);
    const hasLineBreakingDecorations =
      getPrettyPrintStats(entry.key).hasLineBreakingDecorations ||
      getPrettyPrintStats(entry.value).hasLineBreakingDecorations;

    let d: Doc;

    if (representation === 'map') {
      d = group([keyDoc, ':', indent([line, valDoc])], { shouldBreak: hasLineBreakingDecorations });
    } else if (representation === 'assignment') {
      d = group([keyDoc, ' =', indent([line, valDoc])], {
        shouldBreak: hasLineBreakingDecorations,
      });
    } else {
      d = [keyDoc, ' ', valDoc];
    }

    return decorateWithComments(entry, d);
  }

  // -------------------------------------------------------- Parens expression

  protected docParens(node: ESQLParens): Doc {
    const childDoc = this.docExpression(node.child);

    // Subqueries break onto their own line right after the opening paren;
    // regular expressions keep the opening paren attached to their content.
    const d: Doc = isQuery(node.child)
      ? group(['(', indent([softline, childDoc, ')'])])
      : group(['(', childDoc, ')']);

    return decorateWithComments(node, d);
  }

  // --------------------------------------------------- Inline cast expression

  protected docInlineCast(node: ESQLInlineCast): Doc {
    const value = node.value as ESQLAstExpression;
    const wrapInBrackets =
      value.type !== 'literal' &&
      value.type !== 'column' &&
      value.type !== 'parens' &&
      !(value.type === 'function' && value.subtype === 'variadic-call');

    let valDoc = this.docExpression(value);

    if (wrapInBrackets) valDoc = ['(', valDoc, ')'];

    const castType = this.opts.lowercaseKeywords
      ? node.castType.toLowerCase()
      : node.castType.toUpperCase();
    const d: Doc = [valDoc, '::', castType];

    return decorateWithComments(node, d);
  }

  // ---------------------------------------------------------- Sort expression

  protected docOrderExpression(node: ESQLOrderExpression): Doc {
    const fieldDoc = this.docExpression(node.args[0]);
    const parts: Doc[] = [fieldDoc];

    if (node.order) parts.push(' ', node.order);
    if (node.nulls) parts.push(' ', node.nulls);

    return decorateWithComments(node, parts);
  }

  // --------------------------------------------------------------- Leaf nodes

  protected docSource(node: ESQLSource): Doc {
    return decorateWithComments(node, LeafPrinter.source(node));
  }

  protected docColumn(node: ESQLColumn): Doc {
    return decorateWithComments(node, LeafPrinter.column(node));
  }

  protected docLiteral(node: ESQLLiteral): Doc {
    return decorateWithComments(node, LeafPrinter.literal(node));
  }

  protected docIdentifier(node: ESQLIdentifier): Doc {
    return decorateWithComments(node, LeafPrinter.identifier(node));
  }

  // ------------------------------------------------------------------- PromQL

  protected docPromql(node: PromQLAstQueryExpression): Doc {
    return PromQLWrappingPrettyPrinter.print(node);
  }
}
