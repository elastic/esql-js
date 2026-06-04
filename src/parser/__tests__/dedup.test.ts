/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { EsqlQuery } from '../../composer/query';
import { Walker } from '../../ast/walker';
import type { ESQLAstQueryExpression } from '../../types';

describe('DEDUP', () => {
  const getDedup = (ast: ESQLAstQueryExpression) =>
    Walker.match(ast, { type: 'command', name: 'dedup' });

  describe('correctly formatted', () => {
    it('parses basic DEDUP command', () => {
      const src = 'FROM index | DEDUP';
      const { ast, errors } = EsqlQuery.fromSrc(src);
      const dedup = getDedup(ast);

      expect(errors.length).toBe(0);
      expect(dedup).toMatchObject({
        type: 'command',
        name: 'dedup',
        incomplete: false,
        args: [],
      });
    });

    it('parses DEDUP mid-pipeline without affecting surrounding commands', () => {
      const src = 'FROM index | KEEP a | DEDUP | SORT a | LIMIT 2';
      const { ast, errors } = EsqlQuery.fromSrc(src);
      const root = ast;

      expect(errors.length).toBe(0);
      expect(root.commands).toHaveLength(5);
      expect(root.commands[0]).toMatchObject({ type: 'command', name: 'from' });
      expect(root.commands[1]).toMatchObject({ type: 'command', name: 'keep' });
      expect(root.commands[2]).toMatchObject({ type: 'command', name: 'dedup', args: [] });
      expect(root.commands[3]).toMatchObject({ type: 'command', name: 'sort' });
      expect(root.commands[4]).toMatchObject({ type: 'command', name: 'limit' });
    });
  });

  describe('invalid query', () => {
    it('rejects DEDUP with extra argument', () => {
      const src = 'FROM x | DEDUP foo';
      const { errors } = EsqlQuery.fromSrc(src);

      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('incomplete input', () => {
    it('does not produce a dedup command when keyword is partial', () => {
      const src = 'FROM x | DED';
      const { ast, errors } = EsqlQuery.fromSrc(src);

      const dedup = ast.commands.find((c) => c.name === 'dedup');
      expect(dedup).toBeUndefined();
      expect(errors.length).toBeGreaterThan(0);
    });
  });
});
