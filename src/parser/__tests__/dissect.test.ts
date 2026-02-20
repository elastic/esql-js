/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { EsqlQuery } from '../../composer/query/index.ts';
import { Walker } from '../../ast/walker/index.ts';

describe('DISSECT', () => {
  describe('correctly formatted', () => {
    it('parses basic example from documentation', () => {
      const src = `
        ROW a = "2023-01-23T12:15:00.000Z - some text - 127.0.0.1"
        | DISSECT a """%{date} - %{msg} - %{ip}"""
        | KEEP date, msg, ip`;
      const { ast, errors } = EsqlQuery.fromSrc(src);
      const dissect = Walker.match(ast, { type: 'command', name: 'dissect' });

      expect(errors.length).toBe(0);
      expect(dissect).toMatchObject({
        type: 'command',
        name: 'dissect',
        args: [{}, {}],
      });
    });
  });
});
