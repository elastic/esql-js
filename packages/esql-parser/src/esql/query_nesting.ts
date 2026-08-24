/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { Token } from 'antlr4';
import { EsqlLexer as ESQLLexer } from '@elastic/esql-grammar';
import { DEFAULT_CHANNEL } from '../constants';

// Supported boundary for nested query structures.
export const MAX_QUERY_NESTING_DEPTH = 50;
export const QUERY_NESTING_ERROR_CODE = 'queryTooComplex';

/** Signals that an ES|QL query contains unsupported nesting. */
export class QueryNestingError extends Error {
  constructor() {
    super('ES|QL statement contains unsupported query nesting');
    this.name = 'QueryNestingError';
  }
}

export const assertQueryNesting = (tokens: readonly Token[]): void => {
  let nestingDepth = 0;

  for (const token of tokens) {
    if (token.channel !== DEFAULT_CHANNEL) {
      continue;
    }

    switch (token.type) {
      case ESQLLexer.LP:
        nestingDepth++;
        break;
      case ESQLLexer.RP:
        nestingDepth = Math.max(0, nestingDepth - 1);
        break;
    }

    if (nestingDepth > MAX_QUERY_NESTING_DEPTH) {
      throw new QueryNestingError();
    }
  }
};
