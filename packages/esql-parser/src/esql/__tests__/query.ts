/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { Token } from 'antlr4';
import type { ESQLAstQueryExpression, EditorError } from '@elastic/esql-types';
import { parse, type ParseOptions } from '../parser';

/**
 * Test-only stand-in for the `EsqlQuery` composer class, which cannot be used
 * here because it also pulls in the pretty-printer. Exposes the same `ast` /
 * `src` / `tokens` / `errors` shape — note that `ast` is the root
 * *QueryExpression* node, unlike `ParseResult.ast`, which is the command list.
 */
export class EsqlQuery {
  public static readonly fromSrc = (src: string, opts?: ParseOptions): EsqlQuery => {
    const { root, tokens, errors } = parse(src, opts);

    return new EsqlQuery(root, src, tokens, errors);
  };

  constructor(
    public readonly ast: ESQLAstQueryExpression,
    public readonly src: string = '',
    public readonly tokens: Token[] = [],
    public readonly errors: EditorError[] = []
  ) {}
}
