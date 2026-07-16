/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { EsqlQuery } from '../../composer/query';
import { Walker } from '../../ast/walker';

describe('RENAME', () => {
  describe('correctly formatted', () => {
    it('parses basic example from documentation', () => {
      const src = `
        FROM employees
        | KEEP first_name, last_name, still_hired
        | RENAME still_hired AS employed`;
      const { ast, errors } = EsqlQuery.fromSrc(src);
      const rename = Walker.match(ast, { type: 'command', name: 'rename' });

      expect(errors.length).toBe(0);
      expect(rename).toMatchObject({
        type: 'command',
        name: 'rename',
        args: [
          {
            type: 'function',
            name: 'as',
            args: [{}, {}],
          },
        ],
      });
    });

    it('supports assignment syntax', () => {
      const src = `
        FROM employees
        | KEEP first_name, last_name, still_hired
        | RENAME still_hired = employed`;
      const { ast, errors } = EsqlQuery.fromSrc(src);
      const rename = Walker.match(ast, { type: 'command', name: 'rename' });

      expect(errors.length).toBe(0);
      expect(rename).toMatchObject({
        type: 'command',
        name: 'rename',
        args: [
          {
            type: 'function',
            name: '=',
            args: [{}, {}],
          },
        ],
      });
    });
  });

  describe('incorrectly formatted', () => {
    it('reports real, token-located syntaxErrors when the new (unquoted) name needs backticks', () => {
      // The invalid identifier is the *new* name (right of AS).
      const src = 'FROM logs-* | RENAME agent.id AS agent-id';
      const { errors } = EsqlQuery.fromSrc(src);

      expect(errors).toMatchObject([
        {
          code: 'invalidUnquotedIdentifier',
          message: "invalidUnquotedIdentifier: Field name contains invalid character '-'",
          startColumn: 34,
          endColumn: 42,
        },
        { code: 'syntaxError' },
      ]);
    });

    it('collapses to a single, unlocated parseError when the old (unquoted) name needs backticks', () => {
      // The invalid identifier is the *old* name (left of AS).
      const src = 'FROM logs-* | RENAME agent-id AS agentId';
      const { errors } = EsqlQuery.fromSrc(src);

      expect(errors).toMatchObject([
        {
          code: 'parseError',
          startLineNumber: 0,
          startColumn: 0,
          endLineNumber: 0,
          endColumn: 0,
        },
      ]);
    });
  });
});
