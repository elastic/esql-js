/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { PromQLParser } from '../parser';

describe('PromQL syntax error positions', () => {
  it('reports columns of an extraneous token on the first line', () => {
    const { errors } = PromQLParser.parse('up )');

    expect(errors).toMatchObject([
      {
        code: 'syntaxError',
        startLineNumber: 1,
        endLineNumber: 1,
        startColumn: 4,
        endColumn: 5,
      },
    ]);
  });

  it('reports line-relative columns of an extraneous token on a later line', () => {
    const { errors } = PromQLParser.parse('up\n  )');

    expect(errors).toMatchObject([
      {
        code: 'syntaxError',
        startLineNumber: 2,
        endLineNumber: 2,
        startColumn: 3,
        endColumn: 4,
      },
    ]);
  });

  it('reports line-relative columns on the third line', () => {
    const { errors } = PromQLParser.parse('sum(\n  rate(x[5m]) )\n)');

    expect(errors).toMatchObject([
      {
        code: 'syntaxError',
        startLineNumber: 3,
        startColumn: 1,
        endColumn: 2,
      },
    ]);
  });
});
