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
  ESQLAstUserAgentCommand,
  ESQLCommandOption,
  ESQLFunction,
  ESQLMap,
} from '../../types';

/**
 * Examples follow the ES|QL USER_AGENT command syntax described in Elastic’s docs:
 * https://www.elastic.co/docs/reference/query-languages/esql/commands/user-agent
 */
describe('USER_AGENT', () => {
  const getUserAgent = (ast: ESQLAstQueryExpression): ESQLAstUserAgentCommand =>
    Walker.match(ast, {
      type: 'command',
      name: 'user_agent',
    }) as ESQLAstUserAgentCommand;

  describe('correctly formatted', () => {
    it('parses prefix = expression without WITH (FROM … | USER_AGENT ua = user_agent)', () => {
      const src = `FROM web_logs | USER_AGENT ua = user_agent`;
      const { ast, errors } = EsqlQuery.fromSrc(src);
      const cmd = getUserAgent(ast);

      expect(errors.length).toBe(0);
      expect(cmd).toMatchObject({
        type: 'command',
        name: 'user_agent',
        incomplete: false,
      });
      expect(cmd.targetField).toMatchObject({
        type: 'column',
        name: 'ua',
      });
      expect(cmd.expression).toMatchObject({
        type: 'column',
        name: 'user_agent',
      });
      expect(cmd.namedParameters).toBeUndefined();
      expect(cmd.args).toHaveLength(1);
      expect(cmd.args[0]).toMatchObject({
        type: 'function',
        subtype: 'binary-expression',
        name: '=',
      });
    });

    it('parses WITH { extract_device_type: true } (ROW … | USER_AGENT ua = input WITH { … })', () => {
      const src = `ROW input = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) AppleWebKit/537.36"
| USER_AGENT ua = input WITH { "extract_device_type": true }`;
      const { ast, errors } = EsqlQuery.fromSrc(src);
      const cmd = getUserAgent(ast);

      expect(errors.length).toBe(0);
      expect(cmd.targetField).toMatchObject({ type: 'column', name: 'ua' });
      expect(cmd.expression).toMatchObject({ type: 'column', name: 'input' });

      expect(cmd.namedParameters).toMatchObject({
        type: 'map',
        entries: [
          {
            type: 'map-entry',
            key: {
              type: 'literal',
              literalType: 'keyword',
              valueUnquoted: 'extract_device_type',
            },
            value: {
              type: 'literal',
              literalType: 'boolean',
              value: 'true',
            },
          },
        ],
      });

      const withOption = cmd.args.find(
        (arg): arg is ESQLCommandOption =>
          'type' in arg && arg.type === 'option' && arg.name === 'with'
      );
      expect(withOption).toBeDefined();
      expect((withOption!.args[0] as ESQLMap).entries).toHaveLength(1);
    });

    it('parses WITH { regex_file: "my-regexes.yml" }', () => {
      const src = `FROM web_logs | USER_AGENT ua = user_agent WITH { "regex_file": "my-regexes.yml" }`;
      const { ast, errors } = EsqlQuery.fromSrc(src);
      const cmd = getUserAgent(ast);

      expect(errors.length).toBe(0);
      expect(cmd.namedParameters).toMatchObject({
        type: 'map',
        entries: [
          {
            type: 'map-entry',
            key: {
              type: 'literal',
              valueUnquoted: 'regex_file',
            },
            value: {
              type: 'literal',
              literalType: 'keyword',
              valueUnquoted: 'my-regexes.yml',
            },
          },
        ],
      });
    });

    it('parses WITH properties list and extract_device_type', () => {
      const src = `ROW ua_str = "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15"
| USER_AGENT ua = ua_str WITH { "properties": ["name", "version", "device"], "extract_device_type": true }`;
      const { ast, errors } = EsqlQuery.fromSrc(src);
      const cmd = getUserAgent(ast);

      expect(errors.length).toBe(0);
      expect(cmd.expression).toMatchObject({ type: 'column', name: 'ua_str' });

      const map = cmd.namedParameters as ESQLMap;
      expect(map.type).toBe('map');
      expect(map.entries).toHaveLength(2);

      const propertiesEntry = map.entries.find(
        (e) =>
          e.key.type === 'literal' &&
          'valueUnquoted' in e.key &&
          e.key.valueUnquoted === 'properties'
      );
      expect(propertiesEntry?.value).toMatchObject({
        type: 'list',
      });

      const deviceTypeEntry = map.entries.find(
        (e) =>
          e.key.type === 'literal' &&
          'valueUnquoted' in e.key &&
          e.key.valueUnquoted === 'extract_device_type'
      );
      expect(deviceTypeEntry?.value).toMatchObject({
        type: 'literal',
        literalType: 'boolean',
        value: 'true',
      });
    });

    it('parses the assignment structure in args', () => {
      const src = `FROM index | USER_AGENT ua = user_agent`;
      const { ast } = EsqlQuery.fromSrc(src);
      const cmd = getUserAgent(ast);

      const assignment = cmd.args[0] as ESQLFunction;
      expect(assignment.args[0]).toMatchObject({
        type: 'column',
        name: 'ua',
      });
      expect(assignment.args[1]).toMatchObject({
        type: 'column',
        name: 'user_agent',
      });
    });

    it('parses dotted prefix column', () => {
      const src = `FROM index | USER_AGENT client.ua = raw_ua`;
      const { ast, errors } = EsqlQuery.fromSrc(src);
      const cmd = getUserAgent(ast);

      expect(errors.length).toBe(0);
      expect(cmd.targetField).toMatchObject({
        type: 'column',
      });
      expect(cmd.targetField.parts).toEqual(['client', 'ua']);
    });
  });

  describe('incomplete flag', () => {
    it('is false when the full "ua = ua_str" expression is valid', () => {
      const { ast } = EsqlQuery.fromSrc(`FROM index | USER_AGENT ua = user_agent`);
      const cmd = getUserAgent(ast);

      expect(cmd.incomplete).toBe(false);
      expect(cmd.expression).toMatchObject({
        type: 'column',
        name: 'user_agent',
        incomplete: false,
      });
    });

    it('is true when only the target field is provided (no assignment)', () => {
      const { ast } = EsqlQuery.fromSrc(`FROM index | USER_AGENT ua`);
      const cmd = getUserAgent(ast);

      expect(cmd.incomplete).toBe(true);
      expect(cmd.expression).toBeUndefined();
    });

    it('is true when the assignment is present but the expression is missing', () => {
      const { ast } = EsqlQuery.fromSrc(`FROM index | USER_AGENT ua =`);
      const cmd = getUserAgent(ast);

      expect(cmd.incomplete).toBe(true);
      expect(cmd.expression).toMatchObject({
        type: 'unknown',
        incomplete: true,
      });
    });
  });

  describe('incorrectly formatted', () => {
    it('errors on just the command keyword', () => {
      const { ast, errors } = EsqlQuery.fromSrc(`FROM index | USER_AGENT`);
      const cmd = getUserAgent(ast);

      expect(errors.length).toBeGreaterThan(0);
      expect(cmd).toMatchObject({
        name: 'user_agent',
        incomplete: true,
      });
      expect(cmd.targetField).toMatchObject({
        type: 'column',
        name: '',
        incomplete: true,
      });
      expect(cmd.expression).toBeUndefined();
    });

    it('errors on missing assignment', () => {
      const { ast, errors } = EsqlQuery.fromSrc(`FROM index | USER_AGENT ua`);
      const cmd = getUserAgent(ast);

      expect(errors.length).toBeGreaterThan(0);
      expect(cmd).toMatchObject({
        name: 'user_agent',
        incomplete: true,
      });
      expect(cmd.targetField).toMatchObject({
        type: 'column',
        name: 'ua',
      });
      expect(cmd.expression).toBeUndefined();
    });

    it('errors on missing expression after assignment', () => {
      const { ast, errors } = EsqlQuery.fromSrc(`FROM index | USER_AGENT ua =`);
      const cmd = getUserAgent(ast);

      expect(errors.length).toBeGreaterThan(0);
      expect(cmd).toMatchObject({
        name: 'user_agent',
        incomplete: true,
      });
      expect(cmd.targetField).toMatchObject({
        type: 'column',
        name: 'ua',
      });
      expect(cmd.expression).toMatchObject({
        type: 'unknown',
        incomplete: true,
      });
    });
  });
});
