/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { EsqlQuery } from './query';
import { Walker } from '@elastic/esql-traversal';
import type {
  ESQLAstHighlightCommand,
  ESQLAstQueryExpression,
  ESQLSingleAstItem,
} from '@elastic/esql-types';

describe('HIGHLIGHT', () => {
  const getHighlight = (ast: ESQLAstQueryExpression): ESQLAstHighlightCommand =>
    Walker.match(ast, {
      type: 'command',
      name: 'highlight',
    }) as ESQLAstHighlightCommand;

  const getArgs = (cmd: ESQLAstHighlightCommand) => cmd.args as ESQLSingleAstItem[];

  it('parses basic syntax with a single field', () => {
    const src = 'FROM logs | HIGHLIGHT "fox" ON content';
    const { ast, errors } = EsqlQuery.fromSrc(src);
    const cmd = getHighlight(ast);

    expect(errors).toHaveLength(0);
    expect(cmd).toMatchObject({
      type: 'command',
      name: 'highlight',
      incomplete: false,
      queryExpression: { type: 'literal', valueUnquoted: 'fox' },
      highlightFields: [{ type: 'column', name: 'content' }],
    });
  });

  it('populates args with the query text, ON option, and WITH option', () => {
    const src = 'FROM logs | HIGHLIGHT "fox" ON content WITH { "encoder": "html" }';
    const { ast } = EsqlQuery.fromSrc(src);
    const cmd = getHighlight(ast);

    expect(getArgs(cmd)).toMatchObject([
      { type: 'literal', valueUnquoted: 'fox' },
      {
        type: 'option',
        name: 'on',
        args: [{ type: 'column', name: 'content' }],
      },
      {
        type: 'option',
        name: 'with',
        args: [
          {
            type: 'map',
            entries: [
              {
                type: 'map-entry',
                key: { type: 'literal', valueUnquoted: 'encoder' },
                value: { type: 'literal', valueUnquoted: 'html' },
              },
            ],
          },
        ],
      },
    ]);
  });

  it('parses multiple highlight fields', () => {
    const src = 'FROM logs | HIGHLIGHT "ring sauron" ON title, body, summary';
    const { ast, errors } = EsqlQuery.fromSrc(src);
    const cmd = getHighlight(ast);

    expect(errors).toHaveLength(0);
    expect(cmd.highlightFields).toMatchObject([
      { type: 'column', name: 'title' },
      { type: 'column', name: 'body' },
      { type: 'column', name: 'summary' },
    ]);
  });

  it('parses wildcard highlight field patterns', () => {
    const src = 'FROM logs | HIGHLIGHT "fox" ON title*, *, a*b, body';
    const { ast, errors } = EsqlQuery.fromSrc(src);
    const cmd = getHighlight(ast);

    expect(errors).toHaveLength(0);
    expect(cmd.incomplete).toBe(false);
    expect(cmd.highlightFields).toMatchObject([
      { type: 'column', name: 'title*' },
      { type: 'column', name: '*' },
      { type: 'column', name: 'a*b' },
      { type: 'column', name: 'body' },
    ]);
  });

  it('parses WITH map with pre_tags and post_tags', () => {
    const src =
      'FROM logs | HIGHLIGHT "fox" ON content WITH { "pre_tags": "<b>", "post_tags": "</b>" }';
    const { ast, errors } = EsqlQuery.fromSrc(src);
    const cmd = getHighlight(ast);

    expect(errors).toHaveLength(0);
    expect(cmd.namedParameters).toMatchObject({
      type: 'map',
      entries: [
        {
          type: 'map-entry',
          key: { type: 'literal', valueUnquoted: 'pre_tags' },
          value: { type: 'literal', valueUnquoted: '<b>' },
        },
        {
          type: 'map-entry',
          key: { type: 'literal', valueUnquoted: 'post_tags' },
          value: { type: 'literal', valueUnquoted: '</b>' },
        },
      ],
    });
  });

  it('parses WITH map with encoder option', () => {
    const src = 'FROM logs | HIGHLIGHT "ring" ON content WITH { "encoder": "html" }';
    const { ast, errors } = EsqlQuery.fromSrc(src);
    const cmd = getHighlight(ast);

    expect(errors).toHaveLength(0);
    expect(cmd.namedParameters).toMatchObject({
      type: 'map',
      entries: [
        {
          type: 'map-entry',
          key: { type: 'literal', valueUnquoted: 'encoder' },
          value: { type: 'literal', valueUnquoted: 'html' },
        },
      ],
    });
  });

  it('parses WITH map with numeric options', () => {
    const src =
      'FROM logs | HIGHLIGHT "fox" ON content WITH { "number_of_fragments": 3, "fragment_size": 150, "no_match_size": 50 }';
    const { ast, errors } = EsqlQuery.fromSrc(src);
    const cmd = getHighlight(ast);

    expect(errors).toHaveLength(0);
    expect(cmd.namedParameters).toMatchObject({
      type: 'map',
      entries: [
        { key: { valueUnquoted: 'number_of_fragments' }, value: { value: 3 } },
        { key: { valueUnquoted: 'fragment_size' }, value: { value: 150 } },
        { key: { valueUnquoted: 'no_match_size' }, value: { value: 50 } },
      ],
    });
  });

  // The query is optional: HIGHLIGHT reuses full-text conditions from earlier WHERE
  // commands. The ON clause is optional too: fields are then derived from the query.
  it('parses the bare form, where both query and ON are omitted', () => {
    const src = 'FROM books | WHERE MATCH(title, "Return") | HIGHLIGHT';
    const { ast, errors } = EsqlQuery.fromSrc(src);
    const cmd = getHighlight(ast);

    expect(errors).toHaveLength(0);
    expect(cmd).toMatchObject({ name: 'highlight', incomplete: false, args: [] });
    expect(cmd.queryExpression).toBeUndefined();
    expect(cmd.highlightFields).toBeUndefined();
    expect(cmd.namedParameters).toBeUndefined();
  });

  it('parses an omitted query with an explicit ON clause', () => {
    const src = 'FROM books | WHERE MATCH(title, "Return") | HIGHLIGHT ON title';
    const { ast, errors } = EsqlQuery.fromSrc(src);
    const cmd = getHighlight(ast);

    expect(errors).toHaveLength(0);
    expect(cmd.incomplete).toBe(false);
    expect(cmd.queryExpression).toBeUndefined();
    expect(cmd.highlightFields).toMatchObject([{ type: 'column', name: 'title' }]);
    expect(getArgs(cmd)).toMatchObject([
      { type: 'option', name: 'on', args: [{ type: 'column', name: 'title' }] },
    ]);
  });

  it('parses a query with the ON clause omitted', () => {
    const src = 'ROW title = "Return of the King" | HIGHLIGHT MATCH(title, "king")';
    const { ast, errors } = EsqlQuery.fromSrc(src);
    const cmd = getHighlight(ast);

    expect(errors).toHaveLength(0);
    expect(cmd).toMatchObject({
      name: 'highlight',
      incomplete: false,
      queryExpression: { type: 'function', name: 'match' },
    });
    expect(cmd.highlightFields).toBeUndefined();
    expect(cmd.namedParameters).toBeUndefined();
  });

  it('parses ON * to highlight every text and keyword column', () => {
    const src = 'ROW title = "Return of the King" | HIGHLIGHT MATCH(title, "king") ON *';
    const { ast, errors } = EsqlQuery.fromSrc(src);
    const cmd = getHighlight(ast);

    expect(errors).toHaveLength(0);
    expect(cmd.incomplete).toBe(false);
    expect(cmd.highlightFields).toMatchObject([{ type: 'column', name: '*' }]);
  });

  it('marks incomplete when ON fields are missing', () => {
    const { ast } = EsqlQuery.fromSrc('FROM index | HIGHLIGHT "fox" ON');
    const cmd = getHighlight(ast);

    expect(cmd).toMatchObject({
      name: 'highlight',
      incomplete: true,
      queryExpression: { type: 'literal', valueUnquoted: 'fox' },
      highlightFields: [],
    });
    expect(getArgs(cmd)).toMatchObject([
      { type: 'literal', valueUnquoted: 'fox' },
      { type: 'option', name: 'on', incomplete: true, args: [] },
    ]);
    expect(cmd.namedParameters).toBeUndefined();
  });

  it('marks incomplete when WITH has no map', () => {
    const { ast } = EsqlQuery.fromSrc('FROM index | HIGHLIGHT "fox" ON content WITH');
    const cmd = getHighlight(ast);

    expect(cmd).toMatchObject({
      name: 'highlight',
      incomplete: true,
      queryExpression: { type: 'literal', valueUnquoted: 'fox' },
      highlightFields: [{ type: 'column', name: 'content' }],
      namedParameters: { type: 'map', incomplete: true, entries: [] },
    });
    expect(getArgs(cmd)).toMatchObject([
      { type: 'literal', valueUnquoted: 'fox' },
      { type: 'option', name: 'on', incomplete: false },
      { type: 'option', name: 'with', incomplete: true },
    ]);
  });

  describe('prefix clause', () => {
    it('leaves prefix undefined when no prefix clause is present', () => {
      const src = 'FROM logs | HIGHLIGHT "fox" ON content';
      const { ast } = EsqlQuery.fromSrc(src);
      const cmd = getHighlight(ast);

      expect(cmd.prefix).toBeUndefined();
    });

    it('parses prefix = "hl_"', () => {
      const src = 'FROM logs | HIGHLIGHT prefix = "hl_" "fox" ON content';
      const { ast, errors } = EsqlQuery.fromSrc(src);
      const cmd = getHighlight(ast);

      expect(errors).toHaveLength(0);
      expect(cmd.prefix).toMatchObject({ type: 'literal', valueUnquoted: 'hl_' });
    });

    it('parses empty prefix (prefix = "")', () => {
      const src = 'FROM logs | HIGHLIGHT prefix = "" "fox" ON content';
      const { ast, errors } = EsqlQuery.fromSrc(src);
      const cmd = getHighlight(ast);

      expect(errors).toHaveLength(0);
      expect(cmd.prefix).toMatchObject({ type: 'literal', valueUnquoted: '' });
    });

    it('parses whitespace prefix (prefix = "hl ")', () => {
      const src = 'FROM logs | HIGHLIGHT prefix = "hl " "fox" ON content';
      const { ast, errors } = EsqlQuery.fromSrc(src);
      const cmd = getHighlight(ast);

      expect(errors).toHaveLength(0);
      expect(cmd.prefix).toMatchObject({ type: 'literal', valueUnquoted: 'hl ' });
    });

    it('records prefix even when the keyword is not "prefix" (semantic check left to consumers)', () => {
      const src = 'FROM logs | HIGHLIGHT foo = "hl_" "fox" ON content';
      const { ast } = EsqlQuery.fromSrc(src);
      const cmd = getHighlight(ast);

      // The JS parser is lenient — it records whatever identifier appeared.
      // ES|QL servers will reject non-"prefix" keywords; consumers must validate.
      expect(cmd.prefix).toMatchObject({ type: 'literal', valueUnquoted: 'hl_' });
    });

    it('puts the prefix assignment as args[0], before the query expression', () => {
      const src = 'FROM logs | HIGHLIGHT prefix = "hl_" "fox" ON content';
      const { ast } = EsqlQuery.fromSrc(src);
      const cmd = getHighlight(ast);

      expect(getArgs(cmd)).toMatchObject([
        {
          type: 'function',
          subtype: 'binary-expression',
          name: '=',
          args: [
            { type: 'column', name: 'prefix' },
            { type: 'literal', valueUnquoted: 'hl_' },
          ],
        },
        { type: 'literal', valueUnquoted: 'fox' },
        { type: 'option', name: 'on', args: [{ type: 'column', name: 'content' }] },
      ]);
    });

    it('marks incomplete when ASSIGN is present but prefix string is missing', () => {
      const { ast } = EsqlQuery.fromSrc('FROM index | HIGHLIGHT prefix =');
      const cmd = getHighlight(ast);

      expect(cmd.incomplete).toBe(true);
      expect(cmd.prefix).toBeUndefined();
    });
  });
});
