/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { Parser } from '..';

describe('syntax error positions', () => {
  it('reports columns of an unexpected token on the first line', () => {
    const { errors } = Parser.parse('FROM a | WHER x');

    expect(errors).toMatchObject([
      {
        code: 'syntaxError',
        startLineNumber: 1,
        endLineNumber: 1,
        startColumn: 10,
        endColumn: 14,
      },
    ]);
  });

  it('reports line-relative columns of an unexpected token on the second line', () => {
    const { errors } = Parser.parse('FROM logs\n| WHER x > 1');

    expect(errors).toMatchObject([
      {
        code: 'syntaxError',
        startLineNumber: 2,
        endLineNumber: 2,
        startColumn: 3,
        endColumn: 7,
      },
    ]);
  });

  it('reports line-relative columns on later, indented lines', () => {
    const { errors } = Parser.parse('FROM logs\n| EVAL a = 1\n  | WHER x');

    expect(errors).toMatchObject([
      {
        code: 'syntaxError',
        startLineNumber: 3,
        startColumn: 5,
        endColumn: 9,
      },
    ]);
  });

  it('reports line-relative columns of an extraneous token', () => {
    const { errors } = Parser.parse('FROM a\n| EVAL x = f(1))');

    expect(errors).toMatchObject([
      {
        code: 'syntaxError',
        startLineNumber: 2,
        startColumn: 16,
        endColumn: 17,
      },
    ]);
  });

  it('reports line-relative columns of lexer errors', () => {
    const { errors } = Parser.parse('FROM logs-*\n| RENAME agent.id AS agent-id');

    expect(errors[0]).toMatchObject({
      code: 'invalidUnquotedIdentifier',
      startLineNumber: 2,
      startColumn: 22,
      endColumn: 30,
    });
  });
});
