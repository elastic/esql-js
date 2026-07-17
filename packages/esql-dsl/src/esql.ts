/*
 * Copyright Elasticsearch B.V. and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseExpression, escapeValue } from '@elastic/elasticsearch-query-builder';
import { formatIdentifier, formatSourceName } from './identifier';
import { ESQLQuery } from './query';

function renderRowValue(value: unknown): string {
  if (BaseExpression.isExpression(value)) {
    return value.toString();
  }
  return escapeValue(value);
}

/** Represents a `FROM` source command. Supports `.metadata()` for requesting metadata fields. */
export class FromCommand extends ESQLQuery {
  private readonly _indices: string[];
  private readonly _metadata: string[] | null;

  constructor(indices: string[], metadata?: string[]) {
    super();
    if (indices.length === 0) {
      throw new Error('ESQL.from() requires at least one index');
    }
    this._indices = indices;
    this._metadata = metadata ?? null;
  }

  protected _renderInternal(): string {
    const formatted = this._indices.map(formatSourceName).join(', ');
    let cmd = `FROM ${formatted}`;
    if (this._metadata && this._metadata.length > 0) {
      cmd += ` METADATA ${this._metadata.map((f) => formatIdentifier(f)).join(', ')}`;
    }
    return cmd;
  }

  /** Adds a `METADATA` clause to request metadata fields like `_id` or `_score`. */
  metadata(...fields: string[]): FromCommand {
    if (fields.length === 0) {
      throw new Error('metadata() requires at least one field');
    }
    return new FromCommand(this._indices, fields);
  }
}

/** Represents a `ROW` source command. Produces a row with literal values. */
export class RowCommand extends ESQLQuery {
  private readonly _values: Record<string, unknown>;

  constructor(values: Record<string, unknown>) {
    super();
    if (!values || Object.keys(values).length === 0) {
      throw new Error('ESQL.row() requires at least one column');
    }
    this._values = values;
  }

  protected _renderInternal(): string {
    const pairs = Object.entries(this._values).map(
      ([k, v]) => `${formatIdentifier(k)} = ${renderRowValue(v)}`
    );
    return `ROW ${pairs.join(', ')}`;
  }
}

/** Represents a `SHOW` source command. */
export class ShowCommand extends ESQLQuery {
  private readonly _item: 'INFO';

  constructor(item: 'INFO') {
    super();
    if (item !== 'INFO') {
      throw new Error("ESQL.show() requires 'INFO'");
    }
    this._item = item;
  }

  protected _renderInternal(): string {
    return `SHOW ${this._item}`;
  }
}

/**
 * Represents a `TS` source command for time-series indices. Supports `.metadata()`.
 * @since Elasticsearch 8.15
 */
export class TsCommand extends ESQLQuery {
  private readonly _indices: string[];
  private readonly _metadata: string[] | null;

  constructor(indices: string[], metadata?: string[]) {
    super();
    if (indices.length === 0) {
      throw new Error('ESQL.ts() requires at least one index');
    }
    this._indices = indices;
    this._metadata = metadata ?? null;
  }

  protected _renderInternal(): string {
    const formatted = this._indices.map(formatSourceName).join(', ');
    let cmd = `TS ${formatted}`;
    if (this._metadata && this._metadata.length > 0) {
      cmd += ` METADATA ${this._metadata.map((f) => formatIdentifier(f)).join(', ')}`;
    }
    return cmd;
  }

  /** Adds a `METADATA` clause to request metadata fields. */
  metadata(...fields: string[]): TsCommand {
    if (fields.length === 0) {
      throw new Error('metadata() requires at least one field');
    }
    return new TsCommand(this._indices, fields);
  }
}

/** Represents a branch for use within a `FORK` command. Created via `ESQL.branch()`. */
export class BranchCommand extends ESQLQuery {
  protected _renderInternal(): string {
    return '';
  }
}

/**
 * Factory object for creating ES|QL source commands.
 *
 * @example
 * ```ts
 * const query = ESQL.from('employees').where(E('salary').gt(50000)).limit(10)
 * ```
 */
export const ESQL = {
  /** Creates a `FROM` command to select indices, data streams, or aliases. */
  from(...indices: string[]): FromCommand {
    return new FromCommand(indices);
  },

  /** Creates a `ROW` command to produce a row with literal values. */
  row(values: Record<string, unknown>): RowCommand {
    return new RowCommand(values);
  },

  /** Creates a `SHOW` command. Accepts `'INFO'`. */
  show(item: 'INFO'): ShowCommand {
    return new ShowCommand(item);
  },

  /**
   * Creates a `TS` command for querying time-series indices.
   * @since Elasticsearch 8.15
   */
  ts(...indices: string[]): TsCommand {
    return new TsCommand(indices);
  },

  /** Creates a branch for use with `.fork()`. */
  branch(): BranchCommand {
    return new BranchCommand();
  },
};
