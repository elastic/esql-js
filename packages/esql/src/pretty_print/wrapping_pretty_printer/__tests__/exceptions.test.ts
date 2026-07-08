/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * ES|QL has a handful of syntactic exceptions — places where a command, option,
 * or expression deviates from the "normal" `COMMAND arg1, arg2 OPTION value`
 * shape. This suite captures how the wrapping pretty-printer renders each of
 * them, both inline and (where relevant) when wrapped onto multiple lines.
 */

import { Parser } from '../../../parser';
import { WrappingPrettyPrinter } from '../printer';
import type { WrappingPrettyPrinterOptions } from '../printer';

const reprint = (src: string, opts?: WrappingPrettyPrinterOptions) => {
  const { root } = Parser.parse(src);
  return WrappingPrettyPrinter.print(root, opts);
};

describe('exception: commands that do NOT separate arguments with commas', () => {
  describe('DISSECT (input + pattern, space-separated)', () => {
    /**
     * Most commands separate their arguments with commas (`KEEP a, b, c`). DISSECT
     * is the canonical counter-example: its `input` argument and `pattern` string
     * are separated only by a space — no comma.
     */

    test('inline: no comma between input and pattern', () => {
      expect(reprint('FROM a | DISSECT input "%{a} %{b}"')).toBe(
        'FROM a | DISSECT input "%{a} %{b}"'
      );
    });

    test('wrapped: arguments stack with no comma', () => {
      const text = reprint(
        'FROM search-movies | DISSECT AwardsAwardsAwardsAwardsAwardsAwardsAwardsAwards "texttexttexttexttexttexttexttexttexttexttexttexttexttexttext"'
      );

      expect(text).toBe(`FROM search-movies
  | DISSECT
      AwardsAwardsAwardsAwardsAwardsAwardsAwardsAwards
      "texttexttexttexttexttexttexttexttexttexttexttexttexttexttext"`);
    });

    test('contrast: a normal command (KEEP) DOES use commas', () => {
      expect(reprint('FROM a | KEEP x, y, z')).toBe('FROM a | KEEP x, y, z');
    });
  });

  describe('FORK (parenthesised branches, space-separated)', () => {
    /**
     * FORK branches are parenthesised sub-pipelines separated by a space, never a
     * comma — another member of the no-comma set.
     */

    test('inline: branches separated by a space, not a comma', () => {
      expect(reprint('FROM index | FORK (WHERE a > 1) (WHERE b > 2)')).toBe(
        'FROM index | FORK (WHERE a > 1) (WHERE b > 2)'
      );
    });

    test('wrapped: each branch is its own parenthesised block', () => {
      const text = reprint(
        'FROM index | FORK (WHERE aaaaaaaaaaaaaaaaa > 1 | LIMIT 5) (WHERE bbbbbbbbbbbbbbbbb > 2 | LIMIT 9)',
        { multiline: true }
      );

      expect(text).toBe(`FROM index
  | FORK
      (
          WHERE aaaaaaaaaaaaaaaaa > 1
        | LIMIT 5
      )
      (
          WHERE bbbbbbbbbbbbbbbbb > 2
        | LIMIT 9
      )`);
    });
  });
});

describe('exception: GROK special comma rules', () => {
  /**
   * GROK is special-cased: the `input` argument and the first pattern are NOT
   * separated by a comma, but any additional patterns (index >= 2) ARE comma-separated.
   */

  test('single pattern: no comma between input and pattern', () => {
    expect(reprint('FROM a | GROK input "%{a}"')).toBe('FROM a | GROK input "%{a}"');
  });

  test('multiple patterns: input has no comma, patterns are comma-separated', () => {
    expect(reprint('FROM a | GROK input "%{a}", "%{b}", "%{c}"')).toBe(
      'FROM a | GROK input "%{a}", "%{b}", "%{c}"'
    );
  });

  test('wrapped: input on its own line (no comma), patterns keep their commas', () => {
    const text = reprint(
      'FROM a | GROK input "%{pattern_number_one}", "%{pattern_number_two}", "%{pattern_number_three}", "%{pattern_number_four}"'
    );

    expect(text).toBe(`FROM a
  | GROK
      input
      "%{pattern_number_one}",
      "%{pattern_number_two}",
      "%{pattern_number_three}",
      "%{pattern_number_four}"`);
  });
});

describe('exception: command option separated by an equals sign', () => {
  /**
   * Options normally separate their label from their value with a space. The
   * lone exception is DISSECT's `APPEND_SEPARATOR`, which uses an equals sign.
   */
  test('DISSECT APPEND_SEPARATOR uses `=`', () => {
    expect(reprint('FROM a | DISSECT input "%{a} %{b}" APPEND_SEPARATOR="<sep>"')).toBe(
      'FROM a | DISSECT input "%{a} %{b}" APPEND_SEPARATOR = "<sep>"'
    );
  });

  test('contrast: METADATA and ENRICH option uses a space separator', () => {
    expect(reprint('FROM a METADATA _id, _index')).toBe('FROM a METADATA _id, _index');
    ``;
    expect(reprint('FROM a | ENRICH policy ON f WITH g = h')).toBe(
      'FROM a | ENRICH policy ON f WITH g = h'
    );
  });
});

describe('exception: unary minus is encoded as multiplication by -1', () => {
  /**
   * In the AST a negated value such as `-value` is represented as `*(-1, value)`.
   */

  test('negated column prints with a leading minus, not `-1 *`', () => {
    expect(reprint('ROW x = -value')).toBe('ROW x = -value');
  });

  test('negated parenthesised expression keeps its parentheses', () => {
    expect(reprint('ROW y = -(a + b)')).toBe('ROW y = -(a + b)');
  });

  test('negative numeric literals and genuine multiplication are preserved', () => {
    expect(reprint('FROM a | EVAL n = -3, m = -3.5, k = -x * -y')).toBe(
      'FROM a | EVAL n = -3, m = -3.5, k = -x * -y'
    );
  });
});

describe('exception: STATS aggregate accepts an inline WHERE filter', () => {
  /**
   * Within STATS, an aggregate may carry its own `WHERE` filter (and `BY`
   * grouping) - a clause shape that appears nowhere else.
   */

  test('aggregate with inline WHERE', () => {
    expect(reprint('FROM a | STATS c = COUNT(*) WHERE x > 1')).toBe(
      'FROM a | STATS c = COUNT(*) WHERE x > 1'
    );
  });

  test('aggregate with inline WHERE and BY', () => {
    expect(reprint('FROM a | STATS c = COUNT(*) WHERE x > 1 BY g')).toBe(
      'FROM a | STATS c = COUNT(*) WHERE x > 1 BY g'
    );
  });
});
