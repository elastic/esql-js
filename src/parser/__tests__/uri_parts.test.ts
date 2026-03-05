/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { EsqlQuery } from '../../composer/query';
import { Walker } from '../../ast/walker';
import type { ESQLAstUriPartsCommand, ESQLFunction } from '../../types';

describe('URI_PARTS', () => {
  const getUriParts = (ast: ReturnType<typeof EsqlQuery.fromSrc>['ast']): ESQLAstUriPartsCommand =>
    Walker.match(ast, {
      type: 'command',
      name: 'uri_parts',
    }) as ESQLAstUriPartsCommand;

  describe('correctly formatted', () => {
    it('parses basic example', () => {
      const src = `FROM index | URI_PARTS prefix = url`;
      const { ast, errors } = EsqlQuery.fromSrc(src);
      const uriParts = getUriParts(ast);

      expect(errors.length).toBe(0);
      expect(uriParts).toMatchObject({
        type: 'command',
        name: 'uri_parts',
        incomplete: false,
      });
      expect(uriParts.targetField).toMatchObject({
        type: 'column',
        name: 'prefix',
      });
      expect(uriParts.expression).toMatchObject({
        type: 'column',
        name: 'url',
      });
      expect(uriParts.args).toHaveLength(1);
      expect(uriParts.args[0]).toMatchObject({
        type: 'function',
        subtype: 'binary-expression',
        name: '=',
      });
    });

    it('parses the assignment structure correctly', () => {
      const src = `FROM index | URI_PARTS prefix = url`;
      const { ast } = EsqlQuery.fromSrc(src);
      const uriParts = getUriParts(ast);

      const assignment = uriParts.args[0] as ESQLFunction;
      expect(assignment.args[0]).toMatchObject({
        type: 'column',
        name: 'prefix',
      });
      expect(assignment.args[1]).toMatchObject({
        type: 'column',
        name: 'url',
      });
    });

    it('parses with dotted qualified name', () => {
      const src = `FROM index | URI_PARTS my.prefix = url_field`;
      const { ast, errors } = EsqlQuery.fromSrc(src);
      const uriParts = getUriParts(ast);

      expect(errors.length).toBe(0);
      expect(uriParts.targetField).toMatchObject({
        type: 'column',
      });
    });

    it('parses with function expression as source', () => {
      const src = `FROM index | URI_PARTS parts = CONCAT(scheme, host)`;
      const { ast, errors } = EsqlQuery.fromSrc(src);
      const uriParts = getUriParts(ast);

      expect(errors.length).toBe(0);
      expect(uriParts.expression).toMatchObject({
        type: 'function',
        name: 'concat',
      });
    });

    it('parses with quoted target prefix', () => {
      const src = 'FROM index | URI_PARTS `my-prefix` = url';
      const { ast, errors } = EsqlQuery.fromSrc(src);
      const uriParts = getUriParts(ast);

      expect(errors.length).toBe(0);
      expect(uriParts.targetField).toMatchObject({
        type: 'column',
        name: 'my-prefix',
        quoted: true,
      });
    });

    it('parses with parameter expression as source', () => {
      const src = 'FROM index | URI_PARTS parts = ?url_param';
      const { ast, errors } = EsqlQuery.fromSrc(src);
      const uriParts = getUriParts(ast);

      expect(errors.length).toBe(0);
      expect(uriParts.expression).toMatchObject({
        type: 'literal',
        literalType: 'param',
        value: 'url_param',
      });
    });
  });

  describe('incorrectly formatted', () => {
    it('errors on just the command keyword', () => {
      const { ast, errors } = EsqlQuery.fromSrc(`FROM index | URI_PARTS`);
      const uriParts = getUriParts(ast);

      expect(errors.length).toBeGreaterThan(0);
      expect(uriParts).toMatchObject({
        name: 'uri_parts',
        incomplete: true,
      });
      expect(uriParts.targetField).toMatchObject({
        type: 'column',
        name: '',
        incomplete: true,
      });
      expect(uriParts.expression).toBeUndefined();
    });

    it('errors on missing assignment', () => {
      const { ast, errors } = EsqlQuery.fromSrc(`FROM index | URI_PARTS prefix`);
      const uriParts = getUriParts(ast);

      expect(errors.length).toBeGreaterThan(0);
      expect(uriParts).toMatchObject({
        name: 'uri_parts',
        incomplete: true,
      });
      expect(uriParts.targetField).toMatchObject({
        type: 'column',
        name: 'prefix',
      });
      expect(uriParts.expression).toBeUndefined();
    });

    it('errors on missing expression after assignment', () => {
      const { ast, errors } = EsqlQuery.fromSrc(`FROM index | URI_PARTS prefix =`);
      const uriParts = getUriParts(ast);

      expect(errors.length).toBeGreaterThan(0);
      expect(uriParts).toMatchObject({
        name: 'uri_parts',
        incomplete: true,
      });
      expect(uriParts.targetField).toMatchObject({
        type: 'column',
        name: 'prefix',
      });
      expect(uriParts.expression).toMatchObject({
        type: 'unknown',
        incomplete: true,
      });
    });
  });
});
