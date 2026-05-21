/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { PromQLParser } from '../../parser';
import {
  PromQLWrappingPrettyPrinter,
  type PromQLWrappingPrettyPrinterOptions,
} from '../wrapping_pretty_printer';

const roundTrip = (src: string, opts?: PromQLWrappingPrettyPrinterOptions): string => {
  const { root, errors } = PromQLParser.parse(src, { withFormatting: true });
  if (errors.length > 0) {
    throw new Error(`Parse error: ${errors[0].message}`);
  }
  return PromQLWrappingPrettyPrinter.print(root, opts);
};

describe('PromQLWrappingPrettyPrinter — comment round-trip', () => {
  describe('trailing comments', () => {
    it('preserves a trailing comment after a selector', () => {
      expect(roundTrip('up # is it up?')).toBe('up # is it up?');
    });

    it('preserves a trailing comment after a function call', () => {
      expect(roundTrip('rate(x[5m]) # request rate')).toBe('rate(x[5m]) # request rate');
    });

    it('preserves a trailing comment after a nested function call', () => {
      expect(roundTrip('sum(rate(x[5m])) # total')).toBe('sum(rate(x[5m])) # total');
    });

    it('preserves a trailing comment after a binary expression', () => {
      expect(roundTrip('a + b # sum')).toBe('a + b # sum');
    });
  });

  describe('top comments', () => {
    it('preserves a single whole-line comment above a selector', () => {
      expect(roundTrip('# header\nup')).toBe('# header\nup');
    });

    it('preserves multiple stacked whole-line comments', () => {
      expect(roundTrip('# one\n# two\nup')).toBe('# one\n# two\nup');
    });

    it('preserves a whole-line comment above a function call', () => {
      expect(roundTrip('# get rate\nrate(x[5m])')).toBe('# get rate\nrate(x[5m])');
    });
  });

  describe('bottom comments', () => {
    it('preserves a whole-line comment after the expression', () => {
      expect(roundTrip('up\n# trailing whole line')).toBe('up\n# trailing whole line');
    });

    it('preserves multiple whole-line comments after the expression', () => {
      expect(roundTrip('up\n# one\n# two')).toBe('up\n# one\n# two');
    });
  });

  describe('mixed comments', () => {
    it('preserves top + trailing + bottom together', () => {
      expect(roundTrip('# top\nup # inline\n# bottom')).toBe('# top\nup # inline\n# bottom');
    });

    it('preserves comments around a complex expression', () => {
      expect(roundTrip('# header\nrate(x[5m]) # rate\n# footer')).toBe(
        '# header\nrate(x[5m]) # rate\n# footer'
      );
    });
  });

  describe('no formatting requested', () => {
    it('drops comments when withFormatting is not set', () => {
      const { root } = PromQLParser.parse('# header\nup # trailing');
      expect(PromQLWrappingPrettyPrinter.print(root)).toBe('up');
    });
  });

  describe('comments survive wrapping', () => {
    it('keeps a trailing comment when the line wraps', () => {
      const out = roundTrip(
        'sum(rate(http_requests_total[5m])) # explanation here that may be long',
        { printWidth: 30 }
      );
      expect(out).toContain('# explanation here that may be long');
    });
  });

  describe('silent-drop bugs', () => {
    it('preserves a comment between metric name and range duration', () => {
      const out = roundTrip('metric # before duration\n[5m]');

      expect(out).toContain('# before duration');
    });

    it('preserves a comment inside a binary modifier label list', () => {
      const out = roundTrip('a + on(job, # the job key\n  instance) b');

      expect(out).toContain('# the job key');
    });

    it('preserves a comment inside a label map', () => {
      const out = roundTrip('metric{job=# the job\n"api"}');

      expect(out).toContain('# the job');
    });

    it('preserves a comment after the opening ( of an aggregation grouping', () => {
      const out = roundTrip('sum by (region) ( # grouping comment\n  rate(x[5m])\n)');

      expect(out).toContain('# grouping comment');
    });

    it('preserves a comment after the opening ( of a plain function call', () => {
      const out = roundTrip('histogram_quantile( # quantile comment\n  0.95,\n  x\n)');

      expect(out).toContain('# quantile comment');
    });

    it('places the open-paren comment on the same line as the opening paren', () => {
      const out = roundTrip('histogram_quantile( # quantile comment\n  0.95,\n  x\n)');
      const lines = out.split('\n');
      const commentLine = lines.findIndex((l) => l.includes('# quantile comment'));
      const openParenLine = lines.findIndex((l) => l.includes('histogram_quantile('));

      expect(commentLine).toBe(openParenLine);
    });

    it('puts a whole-line comment above a range duration on its own line, not on the [ line', () => {
      const out = roundTrip('rate(x[\n  # why 10m\n  10m])');

      const lines = out.split('\n');
      const bracketLine = lines.findIndex((l) => l.includes('['));
      const commentLine = lines.findIndex((l) => l.includes('# why 10m'));

      expect(commentLine).toBeGreaterThan(bracketLine);
    });

    it('keeps the range bracket inline when there is no top comment on the duration', () => {
      const out = roundTrip('rate(x[5m])');

      expect(out).toBe('rate(x[5m])');
    });
  });

  describe('trailing comment placement', () => {
    it('keeps a trailing comment on an inner function argument by breaking the call', () => {
      expect(roundTrip('clamp(a, # mid\n0, 100)')).toBe('clamp(\n  a, # mid\n  0,\n  100\n)');
    });

    it('keeps a trailing comment on a binary left operand by breaking the binary', () => {
      expect(roundTrip('a # left\n+ b')).toBe('a # left\n  + b');
    });

    it('leaves top-level trailing comments on one line', () => {
      expect(roundTrip('up # foo')).toBe('up # foo');
    });

    it('leaves trailing comments on a whole function call on one line', () => {
      expect(roundTrip('sum(rate(x[5m])) # outer')).toBe('sum(rate(x[5m])) # outer');
    });

    it('is idempotent for inner-trailing reflows', () => {
      const src = 'clamp(a, # mid\n0, 100)';
      const once = roundTrip(src);
      const twice = roundTrip(once);

      expect(twice).toBe(once);
    });
  });
});
