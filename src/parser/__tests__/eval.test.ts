/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { EsqlQuery } from '../../composer/query/index.ts';

describe('EVAL', () => {
  describe('correctly formatted', () => {
    it('parses basic command', () => {
      const query = 'FROM a | EVAL a = 1';
      const { ast } = EsqlQuery.fromSrc(query);

      expect(ast.commands).toMatchObject([
        {},
        {
          type: 'command',
          name: 'eval',
          args: [
            {
              type: 'function',
              name: '=',
            },
          ],
        },
      ]);
    });
  });
});
