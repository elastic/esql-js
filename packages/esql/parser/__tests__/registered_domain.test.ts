/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { EsqlQuery } from '../../composer/query';
import { Walker } from '../../ast/walker';
import type {
  ESQLAstQueryExpression,
  ESQLAstRegisteredDomainCommand,
  ESQLFunction,
} from '../../types';

describe('REGISTERED_DOMAIN', () => {
  const getRegisteredDomain = (ast: ESQLAstQueryExpression): ESQLAstRegisteredDomainCommand =>
    Walker.match(ast, {
      type: 'command',
      name: 'registered_domain',
    }) as ESQLAstRegisteredDomainCommand;

  describe('correctly formatted', () => {
    it('parses basic example', () => {
      const src = `FROM index | REGISTERED_DOMAIN parts = host`;
      const { ast, errors } = EsqlQuery.fromSrc(src);
      const registeredDomain = getRegisteredDomain(ast);

      expect(errors.length).toBe(0);
      expect(registeredDomain).toMatchObject({
        type: 'command',
        name: 'registered_domain',
        incomplete: false,
      });
      expect(registeredDomain.targetField).toMatchObject({
        type: 'column',
        name: 'parts',
      });
      expect(registeredDomain.expression).toMatchObject({
        type: 'column',
        name: 'host',
      });
      expect(registeredDomain.args).toHaveLength(1);
      expect(registeredDomain.args[0]).toMatchObject({
        type: 'function',
        subtype: 'binary-expression',
        name: '=',
      });
    });

    it('parses the assignment structure correctly', () => {
      const src = `FROM index | REGISTERED_DOMAIN parts = host`;
      const { ast } = EsqlQuery.fromSrc(src);
      const registeredDomain = getRegisteredDomain(ast);

      const assignment = registeredDomain.args[0] as ESQLFunction;
      expect(assignment.args[0]).toMatchObject({
        type: 'column',
        name: 'parts',
      });
      expect(assignment.args[1]).toMatchObject({
        type: 'column',
        name: 'host',
      });
    });

    it('parses with dotted qualified name', () => {
      const src = `FROM index | REGISTERED_DOMAIN my.prefix = fqdn`;
      const { ast, errors } = EsqlQuery.fromSrc(src);
      const registeredDomain = getRegisteredDomain(ast);

      expect(errors.length).toBe(0);
      expect(registeredDomain.targetField).toMatchObject({
        type: 'column',
      });
    });

    it('parses with function expression as source', () => {
      const src = `FROM index | REGISTERED_DOMAIN parts = CONCAT(host, ".com")`;
      const { ast, errors } = EsqlQuery.fromSrc(src);
      const registeredDomain = getRegisteredDomain(ast);

      expect(errors.length).toBe(0);
      expect(registeredDomain.expression).toMatchObject({
        type: 'function',
        name: 'concat',
      });
    });

    it('parses with quoted target prefix', () => {
      const src = 'FROM index | REGISTERED_DOMAIN `my-prefix` = fqdn';
      const { ast, errors } = EsqlQuery.fromSrc(src);
      const registeredDomain = getRegisteredDomain(ast);

      expect(errors.length).toBe(0);
      expect(registeredDomain.targetField).toMatchObject({
        type: 'column',
        name: 'my-prefix',
        quoted: true,
      });
    });

    it('parses with parameter expression as source', () => {
      const src = 'FROM index | REGISTERED_DOMAIN parts = ?fqdn_param';
      const { ast, errors } = EsqlQuery.fromSrc(src);
      const registeredDomain = getRegisteredDomain(ast);

      expect(errors.length).toBe(0);
      expect(registeredDomain.expression).toMatchObject({
        type: 'literal',
        literalType: 'param',
        value: 'fqdn_param',
      });
    });
  });

  describe('incorrectly formatted', () => {
    it('errors on just the command keyword', () => {
      const { ast, errors } = EsqlQuery.fromSrc(`FROM index | REGISTERED_DOMAIN`);
      const registeredDomain = getRegisteredDomain(ast);

      expect(errors.length).toBeGreaterThan(0);
      expect(registeredDomain).toMatchObject({
        name: 'registered_domain',
        incomplete: true,
      });
      expect(registeredDomain.targetField).toMatchObject({
        type: 'column',
        name: '',
        incomplete: true,
      });
      expect(registeredDomain.expression).toBeUndefined();
    });

    it('errors on missing assignment', () => {
      const { ast, errors } = EsqlQuery.fromSrc(`FROM index | REGISTERED_DOMAIN parts`);
      const registeredDomain = getRegisteredDomain(ast);

      expect(errors.length).toBeGreaterThan(0);
      expect(registeredDomain).toMatchObject({
        name: 'registered_domain',
        incomplete: true,
      });
      expect(registeredDomain.targetField).toMatchObject({
        type: 'column',
        name: 'parts',
      });
      expect(registeredDomain.expression).toBeUndefined();
    });

    it('errors on missing expression after assignment', () => {
      const { ast, errors } = EsqlQuery.fromSrc(`FROM index | REGISTERED_DOMAIN parts =`);
      const registeredDomain = getRegisteredDomain(ast);

      expect(errors.length).toBeGreaterThan(0);
      expect(registeredDomain).toMatchObject({
        name: 'registered_domain',
        incomplete: true,
      });
      expect(registeredDomain.targetField).toMatchObject({
        type: 'column',
        name: 'parts',
      });
      expect(registeredDomain.expression).toMatchObject({
        type: 'unknown',
        incomplete: true,
      });
    });
  });
});
