/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { parse } from '../../parser';
import { BasicPrettyPrinter } from '..';

describe('literal expression', () => {
  describe('string', () => {
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
});
