/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { EsqlQuery } from '../../composer/query';
import { Walker } from '../../ast/walker';
import { BasicPrettyPrinter } from '../../pretty_print';
import type { ESQLAstHighlightCommand, ESQLAstQueryExpression } from '../../types';

describe('HIGHLIGHT', () => {
  const getHighlight = (ast: ESQLAstQueryExpression): ESQLAstHighlightCommand =>
    Walker.match(ast, {
      type: 'command',
      name: 'highlight',
    }) as ESQLAstHighlightCommand;

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

  it('parses multiple highlight fields', () => {
    const src = 'FROM logs | HIGHLIGHT "ring sauron" ON title, body, summary';
    const { ast, errors } = EsqlQuery.fromSrc(src);
    const cmd = getHighlight(ast);

    expect(errors).toHaveLength(0);
    expect(cmd.highlightFields).toHaveLength(3);
    expect(cmd.highlightFields[0]).toMatchObject({ type: 'column', name: 'title' });
    expect(cmd.highlightFields[1]).toMatchObject({ type: 'column', name: 'body' });
    expect(cmd.highlightFields[2]).toMatchObject({ type: 'column', name: 'summary' });
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

    expect(cmd).toMatchObject({
      name: 'highlight',
      incomplete: true,
    });
    expect(cmd.queryText).toBeUndefined();
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
