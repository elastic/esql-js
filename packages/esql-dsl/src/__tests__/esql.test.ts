/*
 * Copyright Elasticsearch B.V. and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { f } from '..';
import { ESQL } from '../esql';

describe('ESQL.from()', () => {
  it('single index', () => {
    expect(ESQL.from('employees').toString()).toBe('FROM employees');
  });

  it('multiple indices', () => {
    expect(ESQL.from('logs-*', 'metrics-*').toString()).toBe('FROM logs-*, metrics-*');
  });

  it('wildcard patterns pass through unescaped', () => {
    expect(ESQL.from('logs-*').toString()).toBe('FROM logs-*');
  });

  it('hyphenated index names are not backtick-escaped', () => {
    expect(ESQL.from('dsl-integration-test').toString()).toBe('FROM dsl-integration-test');
  });

  it('metadata() renders inline with FROM', () => {
    expect(ESQL.from('x').metadata('_id', '_score').toString()).toBe('FROM x METADATA _id, _score');
  });

  it('metadata does not mutate original', () => {
    const from = ESQL.from('a');
    from.metadata('_id');
    expect(from.toString()).toBe('FROM a');
  });
});

describe('ESQL.row()', () => {
  it('simple key-value pairs', () => {
    expect(ESQL.row({ a: 1, b: 'two' }).toString()).toBe('ROW a = 1, b = "two"');
  });

  it('handles null', () => {
    expect(ESQL.row({ a: 1, b: null }).toString()).toBe('ROW a = 1, b = null');
  });

  it('handles boolean', () => {
    expect(ESQL.row({ active: true }).toString()).toBe('ROW active = true');
  });

  it('escapes string values', () => {
    expect(ESQL.row({ name: "O'Brien" }).toString()).toBe('ROW name = "O\'Brien"');
  });

  it('handles expression values', () => {
    expect(ESQL.row({ a: f.round(1.23, 0) }).toString()).toBe('ROW a = ROUND(1.23, 0)');
  });
});

describe('ESQL.show()', () => {
  it('SHOW INFO', () => {
    expect(ESQL.show('INFO').toString()).toBe('SHOW INFO');
  });

  it('rejects invalid arguments', () => {
    // @ts-expect-error -- testing runtime validation
    expect(() => ESQL.show('INVALID')).toThrow();
  });
});

describe('ESQL.ts()', () => {
  it('single index', () => {
    expect(ESQL.ts('metrics').toString()).toBe('TS metrics');
  });

  it('multiple indices with wildcards', () => {
    expect(ESQL.ts('metrics-*', 'logs-*').toString()).toBe('TS metrics-*, logs-*');
  });

  it('metadata() renders inline with TS', () => {
    expect(ESQL.ts('m').metadata('_id').toString()).toBe('TS m METADATA _id');
  });
});

describe('ESQL.branch()', () => {
  it('renders empty', () => {
    expect(ESQL.branch().toString()).toBe('');
  });
});
