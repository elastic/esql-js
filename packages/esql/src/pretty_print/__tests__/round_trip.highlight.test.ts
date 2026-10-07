/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { EsqlQuery } from '../../composer/query';
import { BasicPrettyPrinter } from '..';

describe('HIGHLIGHT round-trips through the pretty-printer', () => {
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

  it.each([
    'FROM books | WHERE MATCH(title, "Return") | HIGHLIGHT',
    'FROM books | WHERE MATCH(title, "Return") | HIGHLIGHT ON title',
    'ROW title = "Return of the King" | HIGHLIGHT MATCH(title, "king")',
    'ROW title = "Return of the King" | HIGHLIGHT MATCH(title, "king") ON *',
    'FROM logs | HIGHLIGHT WITH {"encoder": "html"}',
  ])('round-trips the optional query and ON forms: %s', (src) => {
    const { ast } = EsqlQuery.fromSrc(src);

    expect(BasicPrettyPrinter.query(ast)).toBe(src);
  });

  describe('prefix clause', () => {
    it('round-trips prefix = "hl_" through the pretty-printer', () => {
      const src = 'FROM logs | HIGHLIGHT prefix = "hl_" "fox" ON content';
      const { ast } = EsqlQuery.fromSrc(src);

      expect(BasicPrettyPrinter.query(ast)).toBe(src);
    });

    it('round-trips empty prefix through the pretty-printer', () => {
      const src = 'FROM logs | HIGHLIGHT prefix = "" "fox" ON content';
      const { ast } = EsqlQuery.fromSrc(src);

      expect(BasicPrettyPrinter.query(ast)).toBe(src);
    });
  });
});
