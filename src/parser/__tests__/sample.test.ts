/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { Parser } from '../core/parser.ts';

describe('SAMPLE', () => {
  test('correctly formatted', () => {
    const text = `
        FROM employees
        | SAMPLE 0.25
        `;
    const { ast, errors } = Parser.parse(text);

    expect(errors.length).toBe(0);
    expect(ast).toMatchObject([
      {},
      {
        type: 'command',
        name: 'sample',
        args: [
          {
            type: 'literal',
            literalType: 'double',
            value: 0.25,
          },
        ],
      },
    ]);
  });

  describe('errors', () => {
    it('wrong data type for probability', () => {
      const { errors } = Parser.parse(`
        FROM employees
        | SAMPLE test
        `);

      expect(errors.length).toBe(1);
    });

    it('command with no args', () => {
      const { errors } = Parser.parse(`
        FROM employees
        | SAMPLE
        `);

      expect(errors.length).toBe(1);
    });
  });
});
