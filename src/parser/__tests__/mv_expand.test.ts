/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { EsqlQuery } from '../../composer/query';
import { Walker } from '../../ast/walker';

describe('MV_EXPAND', () => {
  describe('correctly formatted', () => {
    it('parses basic example from documentation', () => {
      const src = `
        ROW a=[1,2,3], b="b", j=["a","b"]
        | MV_EXPAND a`;
      const { ast, errors } = EsqlQuery.fromSrc(src);
      const mvExpand = Walker.match(ast, { type: 'command', name: 'mv_expand' });

      expect(errors.length).toBe(0);
      expect(mvExpand).toMatchObject({
        type: 'command',
        name: 'mv_expand',
        args: [{ name: 'a' }],
      });
    });
  });
});
