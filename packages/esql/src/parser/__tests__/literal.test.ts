/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { parse, Parser } from '..';
import { BasicPrettyPrinter } from '../../pretty_print';
import type { ESQLLiteral, ESQLStringLiteral } from '../../types';

describe('literal expression', () => {
  it('NULL', () => {
    const text = 'ROW NULL';
    const { ast } = parse(text);
    const literal = ast[0].args[0] as ESQLLiteral;

    expect(literal).toMatchObject({
      type: 'literal',
      literalType: 'null',
      name: 'NULL',
      value: 'NULL',
    });
  });

  it('numeric expression captures "value", and "name" fields', () => {
    const text = 'ROW 1';
    const { root } = parse(text);
    const literal = root.commands[0].args[0] as ESQLLiteral;

    expect(literal).toMatchObject({
      type: 'literal',
      literalType: 'integer',
      name: '1',
      value: 1,
    });
  });

  it('doubles vs integers', () => {
    const text = 'ROW a(1.0, 1)';
    const { root } = parse(text);

    expect(root.commands[0]).toMatchObject({
      type: 'command',
      args: [
        {
          type: 'function',
          args: [
            {
              type: 'literal',
              literalType: 'double',
            },
            {
              type: 'literal',
              literalType: 'integer',
            },
          ],
        },
      ],
    });
  });

  describe('string', () => {
    describe('single quoted', () => {
      it('empty string', () => {
        const text = 'ROW "", 1';
        const { root } = parse(text);

        expect(root.commands[0]).toMatchObject({
          type: 'command',
          args: [
            {
              type: 'literal',
              literalType: 'keyword',
              name: '""',
              valueUnquoted: '',
            },
            {},
          ],
        });
      });

      it('short string', () => {
        const text = 'ROW "abc", 1';
        const { root } = parse(text);

        expect(root.commands[0]).toMatchObject({
          type: 'command',
          args: [
            {
              type: 'literal',
              literalType: 'keyword',
              name: '"abc"',
              valueUnquoted: 'abc',
            },
            {},
          ],
        });
      });

      it('escaped characters', () => {
        const text = 'ROW "a\\nb\\tc\\rd\\\\e\\"f", 1';
        const { root } = parse(text);

        expect(root.commands[0]).toMatchObject({
          type: 'command',
          args: [
            {
              type: 'literal',
              literalType: 'keyword',
              name: '"a\\nb\\tc\\rd\\\\e\\"f"',
              valueUnquoted: 'a\nb\tc\rd\\e"f',
            },
            {},
          ],
        });
      });

      it('escape double-quote before backslash', () => {
        const text = `ROW "a\\"\\\\b", 1`;
        const { root } = parse(text);

        expect(root.commands[0]).toMatchObject({
          type: 'command',
          args: [
            {
              type: 'literal',
              literalType: 'keyword',
              name: '"a\\"\\\\b"',
              valueUnquoted: 'a"\\b',
            },
            {},
          ],
        });
      });

      it('escape backslash before double-quote', () => {
        const text = `ROW "a\\\\\\"b", 1`;
        const { root } = parse(text);

        expect(root.commands[0]).toMatchObject({
          type: 'command',
          args: [
            {
              type: 'literal',
              literalType: 'keyword',
              name: '"a\\\\\\"b"',
              valueUnquoted: 'a\\"b',
            },
            {},
          ],
        });
      });

      // Regression tests for https://github.com/elastic/esql-js/issues/212.
      describe('escaped backslash before escape-letter (issue #212)', () => {
        it(String.raw`\\r — backslash + r, not carriage-return`, () => {
          const { root } = parse(String.raw`ROW "handlers\\run.cs"`);
          const literal = root.commands[0].args[0] as ESQLStringLiteral;

          expect(literal.valueUnquoted).toBe('handlers\\run.cs');
          expect(literal.valueUnquoted.charCodeAt(8)).toBe(92);
          expect(literal.valueUnquoted[8]).toBe('\\');
          expect(literal.valueUnquoted[9]).toBe('r');
        });

        it(String.raw`\\n — backslash + n, not newline`, () => {
          const { root } = parse(String.raw`ROW "a\\new.cs"`);
          const literal = root.commands[0].args[0] as ESQLStringLiteral;

          expect(literal.valueUnquoted).toBe('a\\new.cs');
          expect(literal.valueUnquoted.charCodeAt(1)).toBe(92); // backslash
          expect(literal.valueUnquoted.charCodeAt(2)).toBe(110); // 'n'
        });

        it(String.raw`\\t — backslash + t, not tab`, () => {
          const { root } = Parser.parse(String.raw`ROW "a\\temp"`);
          const literal = root.commands[0].args[0] as ESQLStringLiteral;

          expect(literal.valueUnquoted).toBe('a\\temp');
          expect(literal.valueUnquoted.charCodeAt(1)).toBe(92); // backslash
          expect(literal.valueUnquoted.charCodeAt(2)).toBe(116); // 't'
        });

        it(String.raw`actual \r escape is still carriage-return`, () => {
          const { root } = Parser.parse(String.raw`ROW "a\rb"`);

          expect((root.commands[0].args[0] as ESQLStringLiteral).valueUnquoted).toBe('a\rb');
        });

        it(String.raw`actual \n escape is still newline`, () => {
          const { root } = Parser.parse(String.raw`ROW "a\nb"`);

          expect((root.commands[0].args[0] as ESQLStringLiteral).valueUnquoted).toBe('a\nb');
        });

        it(String.raw`actual \t escape is still tab`, () => {
          const { root } = Parser.parse(String.raw`ROW "a\tb"`);

          expect((root.commands[0].args[0] as ESQLStringLiteral).valueUnquoted).toBe('a\tb');
        });

        it('backslash before any other letter is unaffected', () => {
          const { root } = Parser.parse(String.raw`ROW "a\\slash"`);

          expect((root.commands[0].args[0] as ESQLStringLiteral).valueUnquoted).toBe('a\\slash');
        });

        it(String.raw`two consecutive escaped backslashes before n (\\\\n)`, () => {
          const { root } = Parser.parse(String.raw`ROW "\\\\n"`);

          expect((root.commands[0].args[0] as ESQLStringLiteral).valueUnquoted).toBe('\\\\n');
        });

        it('escaped backslash at end of string', () => {
          const { root } = parse(String.raw`ROW "path\\"`);

          expect((root.commands[0].args[0] as ESQLStringLiteral).valueUnquoted).toBe('path\\');
        });
      });

      describe('round-trip: parse to BasicPrettyPrinter.print', () => {
        const reprint = (src: string) => BasicPrettyPrinter.print(parse(src).root);

        it(String.raw`handlers\\run.cs (issue #212 exact repro)`, () => {
          const src = String.raw`FROM a | WHERE x == "handlers\\run.cs"`;

          expect(reprint(src)).toBe(src);
        });

        it(String.raw`a\\new.cs (backslash + n)`, () => {
          const src = String.raw`FROM a | WHERE x == "a\\new.cs"`;

          expect(reprint(src)).toBe(src);
        });

        it(String.raw`a\\temp (backslash + t)`, () => {
          const src = String.raw`FROM a | WHERE x == "a\\temp"`;

          expect(reprint(src)).toBe(src);
        });

        it(String.raw`actual newline escape \n`, () => {
          const src = 'FROM a | WHERE x == "a\\nb"';

          expect(reprint(src)).toBe(src);
        });

        it(String.raw`actual tab escape \t`, () => {
          const src = 'FROM a | WHERE x == "a\\tb"';

          expect(reprint(src)).toBe(src);
        });

        it(String.raw`actual carriage-return escape \r`, () => {
          const src = String.raw`FROM a | WHERE x == "a\rb"`;

          expect(reprint(src)).toBe(src);
        });

        it('escaped double-quote', () => {
          const src = String.raw`FROM a | WHERE x == "say \"hi\""`;

          expect(reprint(src)).toBe(src);
        });

        it('two consecutive escaped backslashes', () => {
          const src = String.raw`FROM a | WHERE x == "a\\\\b"`;

          expect(reprint(src)).toBe(src);
        });

        it('escaped backslash before non-special letter is unaffected', () => {
          const src = String.raw`FROM a | WHERE x == "a\\slash"`;

          expect(reprint(src)).toBe(src);
        });
      });
    });

    describe('triple quoted', () => {
      it('empty string', () => {
        const text = 'ROW """""", 1';
        const { root } = parse(text);

        expect(root.commands[0]).toMatchObject({
          type: 'command',
          args: [
            {
              type: 'literal',
              literalType: 'keyword',
              name: '""""""',
              valueUnquoted: '',
            },
            {},
          ],
        });
      });

      it('short string', () => {
        const text = 'ROW """abc""", 1';
        const { root } = parse(text);

        expect(root.commands[0]).toMatchObject({
          type: 'command',
          args: [
            {
              type: 'literal',
              literalType: 'keyword',
              name: '"""abc"""',
              valueUnquoted: 'abc',
            },
            {},
          ],
        });
      });

      it('characters are not escaped', () => {
        const text = 'ROW """a\\nb\\c\\"d""", 1';
        const { root } = parse(text);

        expect(root.commands[0]).toMatchObject({
          type: 'command',
          args: [
            {
              type: 'literal',
              literalType: 'keyword',
              name: '"""a\\nb\\c\\"d"""',
              valueUnquoted: 'a\\nb\\c\\"d',
            },
            {},
          ],
        });
      });
    });
  });
});
