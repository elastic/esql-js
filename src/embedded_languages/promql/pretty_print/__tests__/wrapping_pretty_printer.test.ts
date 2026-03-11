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

const format = (src: string, opts?: PromQLWrappingPrettyPrinterOptions): string => {
  const result = PromQLParser.parse(src);
  if (result.errors.length > 0) {
    throw new Error(`Parse error: ${result.errors[0].message}`);
  }
  return PromQLWrappingPrettyPrinter.print(result.root, opts);
};

/**
 * Assert that the source formats to {@link expected} (defaults to the source
 * itself when omitted — i.e. idempotent formatting).
 */
const assertPrint = (
  src: string,
  expected: string = src,
  opts?: PromQLWrappingPrettyPrinterOptions
) => {
  const text = format(src, opts);
  expect(text).toBe(expected);
};

/**
 * Assert formatting at a narrow width. The default width is 80 columns so we
 * use a smaller width to trigger wrapping in test cases.
 */
const assertNarrowPrint = (src: string, expected: string, width: number = 30) => {
  assertPrint(src, expected, { printWidth: width });
};

describe('PromQL WrappingPrettyPrinter', () => {
  describe('identifiers and literals', () => {
    test('simple metric name', () => {
      assertPrint('http_requests_total');
    });

    test('integer literal', () => {
      assertPrint('42');
    });

    test('decimal literal', () => {
      assertPrint('3.14');
    });

    test('string literal (double-quoted)', () => {
      assertPrint('"hello world"');
    });

    test('string literal (single-quoted)', () => {
      assertPrint("'hello world'");
    });

    test('time literal', () => {
      assertPrint('5m', '5m');
    });

    test('NaN', () => {
      assertPrint('NaN');
    });

    test('Inf', () => {
      assertPrint('Inf');
    });
  });

  describe('selectors', () => {
    test('simple metric', () => {
      assertPrint('http_requests_total');
    });

    test('metric with single label', () => {
      assertPrint('http_requests_total{job="api"}');
    });

    test('metric with multiple labels', () => {
      assertPrint('http_requests_total{job="api", status="200"}');
    });

    test('label-only selector', () => {
      assertPrint('{job="api"}');
    });

    test('range vector', () => {
      assertPrint('http_requests_total[5m]');
    });

    test('range vector with labels', () => {
      assertPrint('http_requests_total{job="api"}[5m]');
    });

    test('offset modifier', () => {
      assertPrint('http_requests_total offset 5m');
    });

    test('negative offset', () => {
      assertPrint('http_requests_total offset - 5m');
    });

    test('@ modifier', () => {
      assertPrint('http_requests_total @ 1609459200');
    });

    test('@ with start()', () => {
      assertPrint('http_requests_total @ start()');
    });

    test('combined offset and @', () => {
      assertPrint('http_requests_total offset 5m @ 1609459200');
    });

    test('label map wraps when too wide', () => {
      assertNarrowPrint(
        'http_requests_total{job="api-server", status="200", method="GET"}',
        [
          'http_requests_total{',
          '  job="api-server",',
          '  status="200",',
          '  method="GET"',
          '}',
        ].join('\n'),
        40
      );
    });
  });

  describe('functions', () => {
    test('simple function', () => {
      assertPrint('rate(http_requests_total[5m])');
    });

    test('multi-argument function', () => {
      assertPrint('clamp(metric_value, 0, 100)');
    });

    test('no-argument function', () => {
      assertPrint('time()');
    });

    test('aggregation with grouping after', () => {
      assertPrint('sum(rate(http_requests_total[5m])) by (job)');
    });

    test('aggregation with grouping before', () => {
      assertPrint('sum by (job) (rate(http_requests_total[5m]))');
    });

    test('aggregation with without', () => {
      assertPrint('avg(cpu_usage) without (instance)');
    });

    test('function args wrap when too wide', () => {
      assertNarrowPrint(
        'clamp(metric_value, 0, 100)',
        ['clamp(', '  metric_value,', '  0,', '  100', ')'].join('\n'),
        20
      );
    });

    test('nested function wraps', () => {
      assertNarrowPrint(
        'sum(rate(http_requests_total[5m]))',
        ['sum(', '  rate(', '    http_requests_total[5m]', '  )', ')'].join('\n'),
        25
      );
    });

    test('aggregation with grouping before wraps', () => {
      assertNarrowPrint(
        'sum by (job) (rate(http_requests_total[5m]))',
        ['sum by (job) (', '  rate(', '    http_requests_total[5m]', '  )', ')'].join('\n'),
        25
      );
    });
  });

  describe('binary expressions', () => {
    test('simple addition', () => {
      assertPrint('a + b');
    });

    test('simple comparison', () => {
      assertPrint('a == b');
    });

    test('bool modifier', () => {
      assertPrint('a == bool b');
    });

    test('set operator', () => {
      assertPrint('a and b');
    });

    test('binary with vector matching', () => {
      assertPrint('a + on(job) b');
    });

    test('binary expression wraps when wide', () => {
      assertNarrowPrint(
        'very_long_metric_name_left + very_long_metric_name_right',
        ['very_long_metric_name_left', '  + very_long_metric_name_right'].join('\n'),
        40
      );
    });

    test('chained addition', () => {
      assertPrint('a + b + c');
    });

    test('binary with ignoring and group_left', () => {
      assertPrint('a + ignoring(instance) group_left(exported_job) b');
    });
  });

  describe('unary expressions', () => {
    test('negation', () => {
      assertPrint('-metric');
    });

    test('positive', () => {
      assertPrint('+metric');
    });
  });

  describe('parenthesized expressions', () => {
    test('simple parens', () => {
      assertPrint('(a + b)');
    });

    test('parens wrap when wide', () => {
      assertNarrowPrint(
        '(very_long_metric_a + very_long_metric_b)',
        ['(', '  very_long_metric_a', '    + very_long_metric_b', ')'].join('\n'),
        35
      );
    });
  });

  describe('subqueries', () => {
    test('simple subquery', () => {
      assertPrint('rate(http_requests_total[5m])[30m:1m]');
    });

    test('subquery without resolution', () => {
      assertPrint('rate(http_requests_total[5m])[30m:]');
    });

    test('subquery with offset', () => {
      assertPrint('rate(http_requests_total[5m])[30m:1m] offset 5m');
    });
  });

  describe('complex queries', () => {
    test('error rate query wraps at default width', () => {
      const result = format(
        'sum(rate(http_errors_total{job="api"}[5m])) / sum(rate(http_requests_total{job="api"}[5m]))'
      );

      expect(result).toContain('\n');

      const reparsed = PromQLParser.parse(result);

      expect(reparsed.errors).toHaveLength(0);
    });

    test('error rate query stays on one line when width allows', () => {
      assertPrint(
        'sum(rate(http_errors_total{job="api"}[5m])) / sum(rate(http_requests_total{job="api"}[5m]))',
        undefined,
        { printWidth: 100 }
      );
    });

    test('error rate query wraps at narrow width', () => {
      const result = format(
        'sum(rate(http_errors_total{job="api"}[5m])) / sum(rate(http_requests_total{job="api"}[5m]))',
        { printWidth: 50 }
      );

      expect(result).toContain('\n');

      const reparsed = PromQLParser.parse(result);

      expect(reparsed.errors).toHaveLength(0);
    });

    test('histogram_quantile wraps nicely', () => {
      assertNarrowPrint(
        'histogram_quantile(0.99, sum by (le) (rate(http_request_duration_seconds_bucket{job="api"}[5m])))',
        [
          'histogram_quantile(',
          '  0.99,',
          '  sum by (le) (',
          '    rate(',
          '      http_request_duration_seconds_bucket{',
          '        job="api"',
          '      }[5m]',
          '    )',
          '  )',
          ')',
        ].join('\n'),
        45
      );
    });
  });

  describe('options', () => {
    test('lowercaseFunctions', () => {
      assertPrint('SUM(a)', 'sum(a)', { lowercaseFunctions: true });
    });

    test('lowercaseKeywords', () => {
      assertPrint('sum BY (job) (a)', 'sum by (job) (a)', { lowercaseKeywords: true });
    });

    test('lowercaseOperators', () => {
      assertPrint('a AND b', 'a and b', { lowercaseOperators: true });
    });

    test('custom printWidth', () => {
      const result = format('rate(http_requests_total[5m])', { printWidth: 20 });

      expect(result).toContain('\n');
      expect('\n' + result).toBe(`
rate(
  http_requests_total[5m]
)`);
    });
  });

  describe('idempotency', () => {
    const queries = [
      'http_requests_total',
      'http_requests_total{job="api", status="200"}',
      'rate(http_requests_total[5m])',
      'sum by (job) (rate(http_requests_total[5m]))',
      'a + b * c',
      'a == bool b',
      '-metric',
      '(a + b)',
      'rate(http_requests_total[5m])[30m:1m]',
      'sum(rate(http_errors_total[5m])) / sum(rate(http_requests_total[5m]))',
    ];

    for (const query of queries) {
      test(`idempotent: ${query}`, () => {
        const first = format(query);
        const second = format(first);
        expect(second).toBe(first);
      });
    }
  });
});
