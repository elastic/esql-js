/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { EsqlQuery } from '../../composer/query';
import { Walker } from '../../ast/walker';
import { BasicPrettyPrinter } from '../../pretty_print';
import type {
  ESQLAstHighlightCommand,
  ESQLAstQueryExpression,
  ESQLSingleAstItem,
} from '../../types';

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
      queryText: { type: 'literal', valueUnquoted: 'fox' },
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

  it('marks incomplete when query text is missing', () => {
    const { ast } = EsqlQuery.fromSrc('FROM index | HIGHLIGHT');
    const cmd = getHighlight(ast);

    expect(cmd).toMatchObject({ name: 'highlight', incomplete: true, args: [] });
    expect(cmd.queryText).toBeUndefined();
    expect(cmd.highlightFields).toBeUndefined();
    expect(cmd.namedParameters).toBeUndefined();
  });

  it('marks incomplete when ON clause is missing', () => {
    const { ast } = EsqlQuery.fromSrc('FROM index | HIGHLIGHT "fox"');
    const cmd = getHighlight(ast);

    expect(cmd).toMatchObject({
      name: 'highlight',
      incomplete: true,
      queryText: { type: 'literal', valueUnquoted: 'fox' },
    });
    expect(getArgs(cmd)).toMatchObject([{ type: 'literal', valueUnquoted: 'fox' }]);
    expect(cmd.highlightFields).toBeUndefined();
    expect(cmd.namedParameters).toBeUndefined();
  });

  it('marks incomplete when ON fields are missing', () => {
    const { ast } = EsqlQuery.fromSrc('FROM index | HIGHLIGHT "fox" ON');
    const cmd = getHighlight(ast);

    expect(cmd).toMatchObject({
      name: 'highlight',
      incomplete: true,
      queryText: { type: 'literal', valueUnquoted: 'fox' },
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
      queryText: { type: 'literal', valueUnquoted: 'fox' },
      highlightFields: [{ type: 'column', name: 'content' }],
      namedParameters: { type: 'map', incomplete: true, entries: [] },
    });
    expect(getArgs(cmd)).toMatchObject([
      { type: 'literal', valueUnquoted: 'fox' },
      { type: 'option', name: 'on', incomplete: false },
      { type: 'option', name: 'with', incomplete: true },
    ]);
  });

  it('round-trips single-field syntax through the pretty-printer', () => {
    const src = 'FROM logs | HIGHLIGHT "fox" ON content';
    const { ast } = EsqlQuery.fromSrc(src);

    expect(BasicPrettyPrinter.query(ast)).toBe(src);
  });

  it('round-trips multi-field syntax through the pretty-printer', () => {
    const src = 'FROM logs | HIGHLIGHT "ring sauron" ON title, body';
    const { ast } = EsqlQuery.fromSrc(src);

    expect(BasicPrettyPrinter.query(ast)).toBe(src);
  });
});
