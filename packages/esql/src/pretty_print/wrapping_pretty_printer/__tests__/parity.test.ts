/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Runs a sample of the existing old wrapping_pretty_printer test cases against
 * the new Doc IR printer to identify divergences.
 */

import { Parser } from '../../../parser';
import { WrappingPrettyPrinter as NewPrinter } from '../printer';
import type { WrappingPrettyPrinterOptions } from '../printer';

const reprint = (src: string, opts?: WrappingPrettyPrinterOptions) => {
  const { root } = Parser.parse(src);
  return NewPrinter.print(root, opts);
};

const assertReprint = (src: string, expected: string = src) => {
  expect(reprint(src)).toBe(expected);
};

describe('parity with existing wrapping printer', () => {
  describe('basic queries', () => {
    test('single command', () => assertReprint('FROM index'));
    test('two commands single line', () => assertReprint('FROM a | LIMIT 10'));
    test('two commands with SORT', () => assertReprint('FROM a | SORT b'));

    test('long query goes multiline', () => {
      const text = reprint(
        'FROM very_long_index_name_that_exceeds_line_length | WHERE very_long_field_name == "value" | LIMIT 100'
      );
      expect('\n' + text).toBe(`
FROM very_long_index_name_that_exceeds_line_length
  | WHERE very_long_field_name == "value"
  | LIMIT 100`);
    });
  });

  describe('casing', () => {
    test('default uppercase', () => {
      assertReprint('FROM index | WHERE a == 123');
    });
    test('lowercase option', () => {
      expect(reprint('FROM index | WHERE a == 123', { lowercase: true })).toBe(
        'from index | where a == 123'
      );
    });
    test('lowercaseCommands only', () => {
      expect(reprint('FROM index | WHERE a == 123', { lowercaseCommands: true })).toBe(
        'from index | where a == 123'
      );
    });
    test('lowercaseOptions', () => {
      expect(reprint('FROM a METADATA b', { lowercaseOptions: true })).toBe('FROM a metadata b');
    });
    test('lowercaseFunctions', () => {
      expect(reprint('FROM index | STATS FN1(), FN2()', { lowercaseFunctions: true })).toBe(
        'FROM index | STATS fn1(), fn2()'
      );
    });
  });

  describe('GROK', () => {
    test('short args inline', () => {
      assertReprint('FROM search-movies | GROK Awards "text"');
    });
    test('long args wrap', () => {
      const text = reprint(
        'FROM search-movies | GROK AwardsAwardsAwardsAwardsAwardsAwardsAwardsAwards "texttexttexttexttexttexttexttexttexttexttexttexttexttexttext"'
      );
      expect('\n' + text).toBe(`
FROM search-movies
  | GROK
      AwardsAwardsAwardsAwardsAwardsAwardsAwardsAwards
      "texttexttexttexttexttexttexttexttexttexttexttexttexttexttext"`);
    });
  });

  describe('DISSECT', () => {
    test('short inline', () => assertReprint('FROM index | DISSECT input "pattern"'));
    test('with APPEND_SEPARATOR', () => {
      assertReprint(
        'FROM index | DISSECT input "pattern" APPEND_SEPARATOR="<separator>"',
        'FROM index | DISSECT input "pattern" APPEND_SEPARATOR = "<separator>"'
      );
    });
  });

  describe('JOIN', () => {
    test('short inline', () => assertReprint('FROM a | RIGHT JOIN b ON d, e'));
    test('long fields wrap', () => {
      const text = reprint(
        'FROM aaaaaaaaaaaa | RIGHT JOIN bbbbbbbbbbbbbbbbb ON dddddddddddddddddddddddddddddddddddddddd, eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
      );
      // New printer: first field stays inline with ON (fill-based wrapping)
      expect('\n' + text).toBe(`
FROM aaaaaaaaaaaa
  | RIGHT JOIN bbbbbbbbbbbbbbbbb
        ON dddddddddddddddddddddddddddddddddddddddd,
          eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee`);
    });
  });

  describe('RERANK', () => {
    test('short inline', () => {
      assertReprint('FROM a | RERANK "query" ON field1 WITH {"inference_id": "model"}');
    });
    test('long query wraps', () => {
      const text = reprint(
        `FROM a | RERANK "this is a very long long long long long long long long long long long long text" ON field1 WITH {"inference_id": "model"}`
      );
      expect('\n' + text).toBe(`
FROM a
  | RERANK
      "this is a very long long long long long long long long long long long long text"
        ON field1
        WITH {"inference_id": "model"}`);
    });
  });

  describe('CHANGE_POINT', () => {
    test('value only', () => assertReprint('FROM a | CHANGE_POINT value'));
    test('value and key', () => {
      assertReprint('FROM a | CHANGE_POINT value ON key', 'FROM a | CHANGE_POINT value ON `key`');
    });
    test('options always break with 2+ options', () => {
      const text = reprint(`
        FROM k8s
          | STATS count=COUNT() BY @timestamp=BUCKET(@timestamp, 1 MINUTE)
          | CHANGE_POINT count ON @timestamp AS type, pvalue
          | LIMIT 123
      `);
      expect(text).toBe(
        `FROM k8s
  | STATS count = COUNT() BY @timestamp = BUCKET(@timestamp, 1 MINUTE)
  | CHANGE_POINT count
        ON @timestamp
        AS type, pvalue
  | LIMIT 123`
      );
    });
  });

  describe('FORK', () => {
    test('short inline', () => {
      assertReprint(
        'FROM index | FORK ( KEEP a ) ( KEEP b )',
        'FROM index | FORK (KEEP a) (KEEP b)'
      );
    });
    test('long branches multiline', () => {
      const text = reprint(
        'FROM index | FORK ( KEEP field1, field2, field3 | WHERE x > 100 ) ( DROP field4, field5 | LIMIT 50 )',
        { multiline: true }
      );
      expect(text).toBe(`FROM index
  | FORK
      (
          KEEP field1, field2, field3
        | WHERE x > 100
      )
      (
          DROP field4, field5
        | LIMIT 50
      )`);
    });
  });
});
