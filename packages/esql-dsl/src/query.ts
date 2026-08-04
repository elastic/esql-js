/*
 * Copyright Elasticsearch B.V. and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseExpression, escapeValue } from '@elastic/elasticsearch-query-builder';
import { ESQLBase } from './base';
import { formatIdentifier } from './identifier';
import { renderWhereOptions, type WhereOptions } from './where-options';

export type { WhereOptions };

type ExpressionArg = string | BaseExpression;

function renderExpressionArg(value: ExpressionArg): string {
  if (typeof value === 'string') {
    return value;
  }
  return value.toString();
}

function renderNamedExpressions(columns: Record<string, ExpressionArg>): string {
  return Object.entries(columns)
    .map(([k, v]) => `${formatIdentifier(k)} = ${renderExpressionArg(v)}`)
    .join(', ');
}

/**
 * Abstract base class for all chainable ES|QL query objects. Provides methods
 * for every ES|QL processing command (WHERE, EVAL, STATS, SORT, etc.).
 *
 * All methods are immutable — they return new query objects rather than mutating.
 */
export abstract class ESQLQuery extends ESQLBase {
  /** Adds a `WHERE` clause to filter rows. Accepts a string, expression, or POJO options. */
  where(expression: ExpressionArg): ESQLQuery;
  where(options: WhereOptions): ESQLQuery;
  where(expressionOrOptions: ExpressionArg | WhereOptions): ESQLQuery {
    if (typeof expressionOrOptions === 'string') {
      return new WhereCommand(this, expressionOrOptions);
    }
    if (expressionOrOptions instanceof BaseExpression) {
      return new WhereCommand(this, expressionOrOptions);
    }
    return new WhereCommand(this, renderWhereOptions(expressionOrOptions as WhereOptions));
  }

  /** Adds an `EVAL` command to compute new columns. */
  eval(columns: Record<string, ExpressionArg>): ESQLQuery;
  eval(...expressions: string[]): ESQLQuery;
  eval(columnsOrFirst: Record<string, ExpressionArg> | string, ...rest: string[]): ESQLQuery {
    if (typeof columnsOrFirst === 'string') {
      const all = [columnsOrFirst, ...rest];
      return new EvalCommand(this, all.join(', '));
    }
    return new EvalCommand(this, renderNamedExpressions(columnsOrFirst));
  }

  /** Adds a `STATS` aggregation command. Chain `.by()` on the result to group. */
  stats(aggregations: Record<string, ExpressionArg>): StatsQuery {
    if (!aggregations || Object.keys(aggregations).length === 0) {
      throw new Error('stats() requires at least one aggregation');
    }
    return new StatsCommandInternal(this, renderNamedExpressions(aggregations));
  }

  /** Adds a `SORT` command to order results. */
  sort(...columns: ExpressionArg[]): ESQLQuery {
    if (columns.length === 0) {
      throw new Error('sort() requires at least one column');
    }
    return new SortCommand(this, columns.map(renderExpressionArg));
  }

  /** Adds a `LIMIT` command to cap the number of returned rows. */
  limit(n: number): ESQLQuery {
    if (typeof n !== 'number' || !Number.isInteger(n) || n < 0) {
      throw new Error('limit() requires a non-negative integer');
    }
    return new LimitCommand(this, n);
  }

  /** Adds a `KEEP` command to select which columns to retain. */
  keep(...columns: string[]): ESQLQuery {
    if (columns.length === 0) {
      throw new Error('keep() requires at least one column');
    }
    return new KeepCommand(this, columns);
  }

  /** Adds a `DROP` command to remove columns from results. */
  drop(...columns: string[]): ESQLQuery {
    if (columns.length === 0) {
      throw new Error('drop() requires at least one column');
    }
    return new DropCommand(this, columns);
  }

  /** Adds an `ENRICH` command. Chain `.on()` and `.with()` to configure. */
  enrich(policy: string): EnrichCommand {
    if (!policy) {
      throw new Error('enrich() requires a policy name');
    }
    return new EnrichCommand(this, policy);
  }

  /** Adds a `DISSECT` command to extract structured fields from a string using a pattern. */
  dissect(input: ExpressionArg, pattern: string, appendSeparator?: string): ESQLQuery {
    if (!pattern) {
      throw new Error('dissect() requires a non-empty pattern');
    }
    return new DissectCommand(this, renderExpressionArg(input), pattern, appendSeparator);
  }

  /** Adds a `GROK` command to extract structured fields from a string using a grok pattern. */
  grok(input: ExpressionArg, pattern: string): ESQLQuery {
    if (!pattern) {
      throw new Error('grok() requires a non-empty pattern');
    }
    return new GrokCommand(this, renderExpressionArg(input), pattern);
  }

  /** Adds a `RENAME` command to rename columns. Keys are old names, values are new names. */
  rename(mappings: Record<string, string>): ESQLQuery {
    if (!mappings || Object.keys(mappings).length === 0) {
      throw new Error('rename() requires at least one mapping');
    }
    return new RenameCommand(this, mappings);
  }

  /** Adds an `MV_EXPAND` command to expand a multivalued field into one row per value. */
  mvExpand(field: string): ESQLQuery {
    if (!field) {
      throw new Error('mvExpand() requires a field name');
    }
    return new MvExpandCommand(this, field);
  }

  /**
   * Adds a `LOOKUP JOIN` command. Chain `.on()` to specify the join key.
   * @since Elasticsearch 8.18
   */
  lookupJoin(index: string): LookupJoinCommand {
    if (!index) {
      throw new Error('lookupJoin() requires an index name');
    }
    return new LookupJoinCommand(this, index);
  }

  /**
   * Adds a `FORK` command to run multiple sub-queries in parallel.
   * @since Elasticsearch 9.0
   */
  fork(...branches: ESQLBase[]): ForkCommand {
    if (branches.length === 0) {
      throw new Error('fork() requires at least one branch');
    }
    return new ForkCommand(this, branches);
  }

  /**
   * Adds a `FUSE` command to merge forked results using a strategy (e.g. `'RRF'`).
   * @since Elasticsearch 9.1
   */
  fuse(strategy: string, options?: { weights?: number[] }): ESQLQuery {
    if (!strategy) {
      throw new Error('fuse() requires a strategy');
    }
    return new FuseCommand(this, strategy, options?.weights);
  }

  /**
   * Adds an `INLINESTATS` command. Chain `.by()` on the result to group.
   * @since Elasticsearch 8.16
   */
  inlineStats(aggregations: Record<string, ExpressionArg>): InlineStatsQuery {
    if (!aggregations || Object.keys(aggregations).length === 0) {
      throw new Error('inlineStats() requires at least one aggregation');
    }
    return new InlineStatsCommandInternal(this, renderNamedExpressions(aggregations));
  }

  /**
   * Adds a `CHANGE_POINT` command. Chain `.on()` and `.as_()` to configure.
   * @since Elasticsearch 8.18
   */
  changePoint(field: string): ChangePointCommand {
    if (!field) {
      throw new Error('changePoint() requires a field name');
    }
    return new ChangePointCommand(this, field);
  }

  /**
   * Adds a `SAMPLE` command to sample a fraction of rows.
   * @since Elasticsearch 9.1
   */
  sample(probability: number): ESQLQuery {
    if (typeof probability !== 'number' || probability < 0 || probability > 1) {
      throw new Error('sample() requires a probability between 0 and 1');
    }
    return new SampleCommand(this, probability);
  }

  /**
   * Adds a `COMPLETION` command for LLM inference. Chain `.with()` to set options.
   * @since Elasticsearch 9.1
   */
  completion(prompt: string | Record<string, string>): CompletionCommand {
    return new CompletionCommand(this, prompt);
  }

  /**
   * Adds a `RERANK` command for semantic reranking. Chain `.on()` and `.with()`.
   * @since Elasticsearch 9.1
   */
  rerank(query: string): RerankCommand {
    if (!query) {
      throw new Error('rerank() requires a query string');
    }
    return new RerankCommand(this, query);
  }
}

class WhereCommand extends ESQLQuery {
  private readonly _expression: string;

  constructor(parent: ESQLBase, expression: ExpressionArg) {
    super();
    this.setParent(parent);
    this._expression = renderExpressionArg(expression);
  }

  protected _renderInternal(): string {
    return `WHERE ${this._expression}`;
  }
}

class EvalCommand extends ESQLQuery {
  private readonly _rendered: string;

  constructor(parent: ESQLBase, rendered: string) {
    super();
    this.setParent(parent);
    this._rendered = rendered;
  }

  protected _renderInternal(): string {
    return `EVAL ${this._rendered}`;
  }
}

class SortCommand extends ESQLQuery {
  private readonly _columns: string[];

  constructor(parent: ESQLBase, columns: string[]) {
    super();
    this.setParent(parent);
    this._columns = columns;
  }

  protected _renderInternal(): string {
    return `SORT ${this._columns.join(', ')}`;
  }
}

class LimitCommand extends ESQLQuery {
  private readonly _n: number;

  constructor(parent: ESQLBase, n: number) {
    super();
    this.setParent(parent);
    this._n = n;
  }

  protected _renderInternal(): string {
    return `LIMIT ${this._n}`;
  }
}

class KeepCommand extends ESQLQuery {
  private readonly _columns: string[];

  constructor(parent: ESQLBase, columns: string[]) {
    super();
    this.setParent(parent);
    this._columns = columns;
  }

  protected _renderInternal(): string {
    const formatted = this._columns
      .map((c) => formatIdentifier(c, { allowPatterns: true }))
      .join(', ');
    return `KEEP ${formatted}`;
  }
}

class DropCommand extends ESQLQuery {
  private readonly _columns: string[];

  constructor(parent: ESQLBase, columns: string[]) {
    super();
    this.setParent(parent);
    this._columns = columns;
  }

  protected _renderInternal(): string {
    const formatted = this._columns
      .map((c) => formatIdentifier(c, { allowPatterns: true }))
      .join(', ');
    return `DROP ${formatted}`;
  }
}

class EnrichCommand extends ESQLQuery {
  private readonly _policy: string;
  private _onField: string | null = null;
  private _withFields: string[] | null = null;

  constructor(parent: ESQLBase, policy: string) {
    super();
    this.setParent(parent);
    this._policy = policy;
  }

  /** Specifies the field to match on for enrichment. */
  on(field: string): EnrichCommand {
    if (!field) {
      throw new Error('on() requires a field name');
    }
    const result = new EnrichCommand(this._parent as ESQLBase, this._policy);
    result._onField = field;
    result._withFields = this._withFields;
    return result;
  }

  /** Specifies which enrichment fields to add. */
  with(...fields: string[]): EnrichCommand {
    if (fields.length === 0) {
      throw new Error('with() requires at least one field');
    }
    const result = new EnrichCommand(this._parent as ESQLBase, this._policy);
    result._onField = this._onField;
    result._withFields = fields;
    return result;
  }

  protected _renderInternal(): string {
    let cmd = `ENRICH ${this._policy}`;
    if (this._onField) {
      cmd += ` ON ${formatIdentifier(this._onField)}`;
    }
    if (this._withFields && this._withFields.length > 0) {
      cmd += ` WITH ${this._withFields.map((f) => formatIdentifier(f)).join(', ')}`;
    }
    return cmd;
  }
}

class DissectCommand extends ESQLQuery {
  private readonly _input: string;
  private readonly _pattern: string;
  private readonly _appendSeparator: string | undefined;

  constructor(parent: ESQLBase, input: string, pattern: string, appendSeparator?: string) {
    super();
    this.setParent(parent);
    this._input = input;
    this._pattern = pattern;
    this._appendSeparator = appendSeparator;
  }

  protected _renderInternal(): string {
    let cmd = `DISSECT ${this._input} ${escapeValue(this._pattern)}`;
    if (this._appendSeparator !== undefined) {
      cmd += ` APPEND_SEPARATOR=${escapeValue(this._appendSeparator)}`;
    }
    return cmd;
  }
}

class GrokCommand extends ESQLQuery {
  private readonly _input: string;
  private readonly _pattern: string;

  constructor(parent: ESQLBase, input: string, pattern: string) {
    super();
    this.setParent(parent);
    this._input = input;
    this._pattern = pattern;
  }

  protected _renderInternal(): string {
    return `GROK ${this._input} ${escapeValue(this._pattern)}`;
  }
}

class RenameCommand extends ESQLQuery {
  private readonly _mappings: Record<string, string>;

  constructor(parent: ESQLBase, mappings: Record<string, string>) {
    super();
    this.setParent(parent);
    this._mappings = mappings;
  }

  protected _renderInternal(): string {
    const pairs = Object.entries(this._mappings)
      .map(([old, renamed]) => `${formatIdentifier(old)} AS ${formatIdentifier(renamed)}`)
      .join(', ');
    return `RENAME ${pairs}`;
  }
}

class MvExpandCommand extends ESQLQuery {
  private readonly _field: string;

  constructor(parent: ESQLBase, field: string) {
    super();
    this.setParent(parent);
    this._field = field;
  }

  protected _renderInternal(): string {
    return `MV_EXPAND ${formatIdentifier(this._field)}`;
  }
}

class LookupJoinCommand extends ESQLQuery {
  private readonly _index: string;
  private _onField: string | null = null;

  constructor(parent: ESQLBase, index: string) {
    super();
    this.setParent(parent);
    this._index = index;
  }

  /** Specifies the field to join on. */
  on(field: string): LookupJoinCommand {
    if (!field) {
      throw new Error('on() requires a field name');
    }
    const result = new LookupJoinCommand(this._parent as ESQLBase, this._index);
    result._onField = field;
    return result;
  }

  protected _renderInternal(): string {
    let cmd = `LOOKUP JOIN ${formatIdentifier(this._index)}`;
    if (this._onField) {
      cmd += ` ON ${formatIdentifier(this._onField)}`;
    }
    return cmd;
  }
}

class ForkCommand extends ESQLQuery {
  private readonly _branches: ESQLBase[];

  constructor(parent: ESQLBase, branches: ESQLBase[]) {
    super();
    this.setParent(parent);
    this._branches = branches;
  }

  protected _renderInternal(): string {
    const rendered = this._branches.map((b) => {
      const branchStr = b
        .render()
        .replace(/^\n\| /, '')
        .replace(/\n\| /g, ' | ');
      return `  (${branchStr})`;
    });
    return `FORK\n${rendered.join('\n')}`;
  }
}

class FuseCommand extends ESQLQuery {
  private readonly _strategy: string;
  private readonly _weights: number[] | undefined;

  constructor(parent: ESQLBase, strategy: string, weights?: number[]) {
    super();
    this.setParent(parent);
    this._strategy = strategy;
    this._weights = weights;
  }

  protected _renderInternal(): string {
    let cmd = `FUSE ${this._strategy}`;
    if (this._weights && this._weights.length > 0) {
      cmd += `(${this._weights.join(', ')})`;
    }
    return cmd;
  }
}

class InlineStatsCommandInternal extends ESQLQuery {
  private readonly _aggs: string;
  private _byClause: string | null = null;

  constructor(parent: ESQLBase, aggs: string) {
    super();
    this.setParent(parent);
    this._aggs = aggs;
  }

  /** Groups the inline stats aggregation by the given fields. */
  by(...grouping: ExpressionArg[]): ESQLQuery {
    const parent = this._parent;
    if (!parent) {
      throw new Error('InlineStatsCommand must have a parent');
    }
    if (grouping.length === 0) {
      throw new Error('by() requires at least one grouping field');
    }
    const result = new InlineStatsCommandInternal(parent, this._aggs);
    result._byClause = grouping.map(renderExpressionArg).join(', ');
    return result;
  }

  protected _renderInternal(): string {
    const byStr = this._byClause ? ` BY ${this._byClause}` : '';
    return `INLINESTATS ${this._aggs}${byStr}`;
  }
}

class ChangePointCommand extends ESQLQuery {
  private readonly _field: string;
  private _onKey: string | null = null;
  private _asNames: [string, string] | null = null;

  constructor(parent: ESQLBase, field: string) {
    super();
    this.setParent(parent);
    this._field = field;
  }

  /** Specifies the key field to partition change point detection by. */
  on(key: string): ChangePointCommand {
    if (!key) {
      throw new Error('on() requires a key field');
    }
    const result = new ChangePointCommand(this._parent as ESQLBase, this._field);
    result._onKey = key;
    result._asNames = this._asNames;
    return result;
  }

  /** Names the output columns for the change point type and p-value. */
  as_(typeName: string, pvalueName: string): ChangePointCommand {
    if (!typeName || !pvalueName) {
      throw new Error('as_() requires both a type name and a p-value name');
    }
    const result = new ChangePointCommand(this._parent as ESQLBase, this._field);
    result._onKey = this._onKey;
    result._asNames = [typeName, pvalueName];
    return result;
  }

  protected _renderInternal(): string {
    let cmd = `CHANGE_POINT ${formatIdentifier(this._field)}`;
    if (this._onKey) {
      cmd += ` ON ${formatIdentifier(this._onKey)}`;
    }
    if (this._asNames) {
      cmd += ` AS ${formatIdentifier(this._asNames[0])}, ${formatIdentifier(this._asNames[1])}`;
    }
    return cmd;
  }
}

class SampleCommand extends ESQLQuery {
  private readonly _probability: number;

  constructor(parent: ESQLBase, probability: number) {
    super();
    this.setParent(parent);
    this._probability = probability;
  }

  protected _renderInternal(): string {
    return `SAMPLE ${this._probability}`;
  }
}

class CompletionCommand extends ESQLQuery {
  private readonly _prompt: string | Record<string, string>;
  private _options: Record<string, unknown> | null = null;

  constructor(parent: ESQLBase, prompt: string | Record<string, string>) {
    super();
    this.setParent(parent);
    this._prompt = prompt;
  }

  /** Sets inference options such as `inferenceId`. */
  with(options: Record<string, unknown>): CompletionCommand {
    const result = new CompletionCommand(this._parent as ESQLBase, this._prompt);
    result._options = options;
    return result;
  }

  protected _renderInternal(): string {
    let promptStr: string;
    if (typeof this._prompt === 'string') {
      promptStr = escapeValue(this._prompt);
    } else {
      const entries = Object.entries(this._prompt);
      promptStr = entries.map(([k, v]) => `${formatIdentifier(k)} = ${escapeValue(v)}`).join(', ');
    }
    let cmd = `COMPLETION ${promptStr}`;
    if (this._options) {
      const opts = Object.entries(this._options)
        .map(([k, v]) => `${formatIdentifier(k)} = ${escapeValue(v)}`)
        .join(', ');
      cmd += ` WITH ${opts}`;
    }
    return cmd;
  }
}

class RerankCommand extends ESQLQuery {
  private readonly _query: string;
  private _onFields: string[] | null = null;
  private _options: Record<string, unknown> | null = null;

  constructor(parent: ESQLBase, query: string) {
    super();
    this.setParent(parent);
    this._query = query;
  }

  /** Specifies which fields to rerank on. */
  on(...fields: string[]): RerankCommand {
    if (fields.length === 0) {
      throw new Error('on() requires at least one field');
    }
    const result = new RerankCommand(this._parent as ESQLBase, this._query);
    result._onFields = fields;
    result._options = this._options;
    return result;
  }

  /** Sets reranking options such as `inferenceId` and `topN`. */
  with(options: Record<string, unknown>): RerankCommand {
    const result = new RerankCommand(this._parent as ESQLBase, this._query);
    result._onFields = this._onFields;
    result._options = options;
    return result;
  }

  protected _renderInternal(): string {
    let cmd = `RERANK ${escapeValue(this._query)}`;
    if (this._onFields && this._onFields.length > 0) {
      cmd += ` ON ${this._onFields.map((f) => formatIdentifier(f)).join(', ')}`;
    }
    if (this._options) {
      const opts = Object.entries(this._options)
        .map(([k, v]) => `${formatIdentifier(k)} = ${escapeValue(v)}`)
        .join(', ');
      cmd += ` WITH ${opts}`;
    }
    return cmd;
  }
}

class StatsCommandInternal extends ESQLQuery {
  private readonly _aggs: string;
  private _byClause: string | null = null;

  constructor(parent: ESQLBase, aggs: string) {
    super();
    this.setParent(parent);
    this._aggs = aggs;
  }

  /** Groups the stats aggregation by the given fields. */
  by(...grouping: ExpressionArg[]): ESQLQuery {
    const parent = this._parent;
    if (!parent) {
      throw new Error('StatsCommand must have a parent');
    }
    if (grouping.length === 0) {
      throw new Error('by() requires at least one grouping field');
    }
    const result = new StatsCommandInternal(parent, this._aggs);
    result._byClause = grouping.map(renderExpressionArg).join(', ');
    return result;
  }

  protected _renderInternal(): string {
    const byStr = this._byClause ? ` BY ${this._byClause}` : '';
    return `STATS ${this._aggs}${byStr}`;
  }
}

export type StatsQuery = StatsCommandInternal;
export type InlineStatsQuery = InlineStatsCommandInternal;
