/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { parse } from '../parser';
import { EsqlQuery } from './query';
import type { ESQLColumn, ESQLCommand, ESQLFunction, ESQLInlineCast } from '@elastic/esql-types';
import { Walker, printAst } from '@elastic/esql-traversal';

describe('WHERE', () => {
  describe('correctly formatted', () => {
    it('example from documentation', () => {
      const text = `
        FROM employees
        | KEEP first_name, last_name, still_hired
        | WHERE still_hired == true
        `;
      const { ast, errors } = EsqlQuery.fromSrc(text);
      const where = Walker.match(ast, { type: 'command', name: 'where' });

      expect(errors.length).toBe(0);
      expect(where).toMatchObject({
        type: 'command',
        name: 'where',
        args: [
          {
            type: 'function',
            name: '==',
          },
        ],
      });
    });

    describe('match expression', () => {
      it('simple column name', () => {
        const text = `FROM index | WHERE abc`;
        const { root } = parse(text);

        expect(root.commands[1]).toMatchObject({
          type: 'command',
          name: 'where',
          args: [
            {
              type: 'column',
              name: 'abc',
            },
          ],
        });
      });

      it('simple column with match expression', () => {
        const text = `FROM index | WHERE abc : 123`;
        const { root } = parse(text);

        expect(root.commands[1]).toMatchObject({
          type: 'command',
          name: 'where',
          args: [
            {
              type: 'function',
              subtype: 'binary-expression',
              name: ':',
              args: [
                {
                  type: 'column',
                  name: 'abc',
                },
                {
                  type: 'literal',
                  literalType: 'integer',
                  value: 123,
                },
              ],
            },
          ],
        });
      });

      it('correctly reports match expression location', () => {
        const text = `FROM index | WHERE abc /*a*/ :  /*a*/  123`;
        const { root } = parse(text);
        const expression = root.commands[1].args[0] as ESQLFunction;

        expect(expression.name).toBe(':');
        expect(text.slice(expression.location.min, expression.location.max + 1)).toBe(
          'abc /*a*/ :  /*a*/  123'
        );
      });

      it('simple column with match expression and inline cast', () => {
        const text = `FROM index | WHERE abc :: INTEGER : 123`;
        const { root } = parse(text);

        expect(root.commands[1]).toMatchObject({
          type: 'command',
          name: 'where',
          args: [
            {
              type: 'function',
              subtype: 'binary-expression',
              name: ':',
              args: [
                {
                  type: 'inlineCast',
                  castType: 'integer',
                  value: {
                    type: 'column',
                    name: 'abc',
                  },
                },
                {
                  type: 'literal',
                  literalType: 'integer',
                  value: 123,
                },
              ],
            },
          ],
        });
      });

      it('correctly reports match expression with inline cast location', () => {
        const text = `FROM index | WHERE abc /*a*/ ::  /*a*/ INTEGER :  123`;
        const { root } = parse(text);
        const command = root.commands[1] as ESQLCommand;
        const match = command.args[0] as ESQLFunction;
        const cast = match.args[0] as ESQLInlineCast;
        const column = cast.value as ESQLColumn;

        expect(text.slice(command.location.min, command.location.max + 1)).toBe(
          'WHERE abc /*a*/ ::  /*a*/ INTEGER :  123'
        );
        expect(text.slice(match.location.min, match.location.max + 1)).toBe(
          'abc /*a*/ ::  /*a*/ INTEGER :  123'
        );
        expect(text.slice(cast.location.min, cast.location.max + 1)).toBe(
          'abc /*a*/ ::  /*a*/ INTEGER'
        );
        expect(text.slice(column.location.min, column.location.max + 1)).toBe('abc');
      });

      it('supports primary expressions in match expression', () => {
        const text = `FROM index | WHERE CONCAT(a, b) : "query"`;
        const { errors, root } = parse(text);

        expect(errors).toHaveLength(0);
        expect(root.commands[1]).toMatchObject({
          type: 'command',
          name: 'where',
          args: [
            {
              type: 'function',
              subtype: 'binary-expression',
              name: ':',
              args: [
                {
                  type: 'function',
                  name: 'concat',
                  args: [
                    { type: 'column', name: 'a' },
                    { type: 'column', name: 'b' },
                  ],
                },
                {
                  type: 'literal',
                  literalType: 'keyword',
                  valueUnquoted: 'query',
                },
              ],
            },
          ],
        });
        expect('\n' + printAst(root)).toBe(`
query 0-9
├─ command 0-9 "from"
│  └─ source 5-9 "index"
│     └─ literal 5-9 ""index""
└─ command 13-40 "where"
   └─ function 19-40 ":"
      ├─ function 19-30 "concat"
      │  ├─ column 26-26 "a"
      │  │  └─ identifier 26-26 "a"
      │  └─ column 29-29 "b"
      │     └─ identifier 29-29 "b"
      └─ literal 34-40 ""query""`);
      });
    });
  });
});
