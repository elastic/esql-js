/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { Parser } from '../../../parser';
import { WrappingPrettyPrinter } from '../printer';
import { layout } from '@elastic/pretty-printer';
import type { WrappingPrettyPrinterOptions } from '../printer';
import { assertReprint } from './tools';

const reprint = (src: string, opts?: WrappingPrettyPrinterOptions) => {
  const { root } = Parser.parse(src);
  return WrappingPrettyPrinter.print(root, opts);
};

describe('WrappingPrettyPrinter (Doc IR)', () => {
  describe('basic queries', () => {
    test('single command', () => {
      expect(reprint('FROM index')).toBe('FROM index');
    });

    test('two commands fit on one line', () => {
      expect(reprint('FROM a | LIMIT 10')).toBe('FROM a | LIMIT 10');
    });

    test('long query goes multiline', () => {
      const text = reprint(
        'FROM very_long_index_name_that_exceeds | WHERE very_long_field_name == "value" | LIMIT 100'
      );
      expect(text).toContain('\n  | ');
    });
  });

  describe('function calls', () => {
    test('short function call inline', () => {
      expect(reprint('ROW fn(1, 2)')).toBe('ROW FN(1, 2)');
    });

    test('uppercase function name', () => {
      expect(reprint('ROW COUNT()')).toBe('ROW COUNT()');
    });
  });

  describe('binary expressions', () => {
    test('short binary expression inline', () => {
      expect(reprint('ROW 1 + 2')).toBe('ROW 1 + 2');
    });

    test('leading-operator style when breaking', () => {
      const longExpr =
        'ROW aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa + bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb';
      const text = reprint(longExpr);

      expect(text).toMatch(/\n\s*\+\s/);
    });
  });

  describe('casing', () => {
    test('lowercase option', () => {
      expect(reprint('FROM a | WHERE x == 1', { lowercase: true })).toBe('from a | where x == 1');
    });
  });
});

describe('inline cast attaches directly to its value', () => {
  test('column cast', () => {
    expect(reprint('FROM a | EVAL v = col::integer')).toBe('FROM a | EVAL v = col::INTEGER');
  });

  test('parenthesised expression cast', () => {
    expect(reprint('FROM a | EVAL w = (1 + 2)::long')).toBe('FROM a | EVAL w = (1 + 2)::LONG');
  });
});

describe('parens', () => {
  test('parenthesised sub-expression stays inline when it fits', () => {
    const src = `FROM a | STATS m = MAX(b) WHERE c > (1 + 2) * 3 BY d`;
    const expected = `FROM a | STATS m = MAX(b) WHERE c > (1 + 2) * 3 BY d`;

    assertReprint(src, expected);
  });
});

describe('time interval literals (number + unit, unquoted)', () => {
  test('intervals render as `<n> <unit>`', () => {
    expect(reprint('FROM a | EVAL x = 1 day, y = 2 hours')).toBe(
      'FROM a | EVAL x = 1 day, y = 2 hours'
    );
  });
});

describe('double parameter placeholders', () => {
  test('positional, named and identifier params', () => {
    expect(reprint('FROM a | WHERE x == ?name AND y == ? AND z == ??field')).toBe(
      'FROM a | WHERE x == ?name AND y == ? AND z == ??field'
    );
  });
});

describe('doc() API', () => {
  test('returns a Doc that layout-renders to the same string as print()', () => {
    const { root } = Parser.parse('FROM a | WHERE x == 1 | LIMIT 5');
    const doc = WrappingPrettyPrinter.doc(root);
    const text = layout(doc);

    expect(doc).toBeDefined();
    expect(typeof doc).not.toBe('string');
    expect(text).toBe('FROM a | WHERE x == 1 | LIMIT 5');
  });
});
