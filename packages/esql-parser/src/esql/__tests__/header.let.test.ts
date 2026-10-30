/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { Parser } from '../parser';

describe('LET instruction parsing', () => {
  test('LET binding used as FROM source', () => {
    const query = 'LET top_langs = (FROM languages | SORT language_code | LIMIT 2); FROM top_langs';
    const { root, errors } = Parser.parse(query);

    expect(errors).toHaveLength(0);
    expect(root).toMatchObject({
      header: [
        {
          type: 'header-command',
          name: 'let',
          incomplete: false,
          args: [
            {
              type: 'function',
              subtype: 'binary-expression',
              name: '=',
              args: [
                { type: 'identifier', name: 'top_langs' },
                {
                  type: 'parens',
                  child: {
                    type: 'query',
                    commands: [{ name: 'from' }, { name: 'sort' }, { name: 'limit' }],
                  },
                },
              ],
            },
          ],
        },
      ],
      commands: [{ name: 'from', args: [{ type: 'source', name: 'top_langs' }] }],
    });
  });

  test('sets correct locations', () => {
    const query = 'LET x = (FROM i); FROM x';
    const { root } = Parser.parse(query);
    const command = root.header![0];
    const binding = command.args[0] as { location: { min: number; max: number } };

    expect(query.slice(command.location.min, command.location.max + 1)).toBe('LET x = (FROM i);');
    expect(query.slice(binding.location.min, binding.location.max + 1)).toBe('x = (FROM i)');
  });

  test('keeps SET and LET instructions in source order', () => {
    const query = 'SET a = 1; LET c = (FROM i); LET d = (FROM c); FROM d';
    const { root, errors } = Parser.parse(query);

    expect(errors).toHaveLength(0);
    expect(root.header!.map((cmd) => cmd.name)).toEqual(['set', 'let', 'let']);
  });

  describe('incomplete', () => {
    test('LET without binding name', () => {
      const { root, errors } = Parser.parse('LET ');

      expect(errors).toHaveLength(1);
      expect(root.header).toMatchObject([
        { type: 'header-command', name: 'let', args: [], incomplete: true },
      ]);
    });

    test('LET without subquery', () => {
      const { root, errors } = Parser.parse('LET x = ');

      expect(errors).toHaveLength(1);
      expect(root.header).toMatchObject([
        {
          name: 'let',
          incomplete: true,
          args: [{ name: '=', incomplete: true, args: [{ type: 'identifier', name: 'x' }, {}] }],
        },
      ]);
    });

    test('LET with unterminated subquery', () => {
      const { root, errors } = Parser.parse('LET x = (FROM i | ');

      expect(errors.length).toBeGreaterThan(0);
      expect(root.header).toMatchObject([
        {
          name: 'let',
          incomplete: true,
          args: [
            {
              incomplete: true,
              args: [
                { name: 'x' },
                { type: 'parens', incomplete: true, child: { commands: [{ name: 'from' }] } },
              ],
            },
          ],
        },
      ]);
    });
  });
});
