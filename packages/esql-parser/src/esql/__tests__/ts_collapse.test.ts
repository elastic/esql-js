/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { EsqlQuery } from './query';
import { Walker } from '@elastic/esql-traversal';

describe('TS_COLLAPSE', () => {
  it('parses TS_COLLAPSE as a no-argument command', () => {
    const { ast, errors } = EsqlQuery.fromSrc('TS metrics | TS_COLLAPSE | LIMIT 10');

    expect(errors).toEqual([]);
    expect(ast.commands.map((c) => c.name)).toEqual(['ts', 'ts_collapse', 'limit']);
    expect(ast.commands[1]).toMatchObject({
      type: 'command',
      name: 'ts_collapse',
      incomplete: false,
      args: [],
    });
  });

  it('parses TS_COLLAPSE as the last command', () => {
    const { ast, errors } = EsqlQuery.fromSrc('TS metrics | TS_COLLAPSE');

    expect(errors).toEqual([]);
    expect(ast.commands.map((c) => c.name)).toEqual(['ts', 'ts_collapse']);
  });

  it('parses TS_COLLAPSE inside a FORK branch', () => {
    const { ast, errors } = EsqlQuery.fromSrc(
      'TS metrics | FORK (TS_COLLAPSE | LIMIT 1) (LIMIT 2)'
    );

    expect(errors).toEqual([]);
    expect(Walker.match(ast, { type: 'command', name: 'ts_collapse' })).toBeDefined();
  });
});
