/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { esql } from '../esql';

describe('.query``', () => {
  test('appends multiple commands in one template', () => {
    const query = esql`FROM index`;

    query.query`WHERE foo > 42 | LIMIT 10`;

    expect(query.print('basic')).toBe('FROM index | WHERE foo > 42 | LIMIT 10');
  });

  test('appends a single command (equivalent to .pipe)', () => {
    const query = esql`FROM index`;

    query.query`WHERE foo > 42`;

    expect(query.print('basic')).toBe('FROM index | WHERE foo > 42');
  });

  test('returns this for chaining', () => {
    const query = esql`FROM index`;
    const result = query.query`WHERE foo > 1`;

    expect(result).toBe(query);
  });

  test('can be chained with .pipe and .query', () => {
    const query = esql`FROM index`;

    query.query`WHERE a > 1 | EVAL b = a * 2`.pipe`SORT b DESC`.query`LIMIT 100`;

    expect(query.print('basic')).toBe(
      'FROM index | WHERE a > 1 | EVAL b = a * 2 | SORT b DESC | LIMIT 100'
    );
  });

  test('inlines literal values from holes', () => {
    const query = esql`FROM index`;

    query.query`WHERE foo > ${5} | LIMIT ${10}`;

    expect(query.print('basic')).toBe('FROM index | WHERE foo > 5 | LIMIT 10');
  });

  test('extracts named params from ${{ }} holes', () => {
    const query = esql`FROM index`;

    query.query`WHERE status == ${{ status: 'ok' }} | LIMIT ${{ limit: 100 }}`;

    expect(query.toRequest()).toEqual({
      query: 'FROM index | WHERE status == ?status | LIMIT ?limit',
      params: [{ status: 'ok' }, { limit: 100 }],
    });
  });

  test('${{ }} holes span across commands in the fragment', () => {
    const query = esql`FROM index`;

    query.query`WHERE a > ${{ threshold: 10 }} | STATS avg = AVG(a) | LIMIT ${{ limit: 50 }}`;

    expect(query.toRequest()).toEqual({
      query: 'FROM index | WHERE a > ?threshold | STATS avg = AVG(a) | LIMIT ?limit',
      params: [{ threshold: 10 }, { limit: 50 }],
    });
  });

  test('renames colliding params from the fragment', () => {
    const query = esql`FROM index | WHERE x > ${{ threshold: 1 }}`;

    query.query`WHERE y > ${{ threshold: 2 }} | LIMIT ${{ threshold: 3 }}`;

    expect(query.toRequest()).toEqual({
      query: 'FROM index | WHERE x > ?threshold | WHERE y > ?p1 | LIMIT ?p2',
      params: [{ threshold: 1 }, { p1: 2 }, { p2: 3 }],
    });
  });

  test('renames colliding params from the fragment - 2', () => {
    const query = esql`FROM index | WHERE x > ${{ threshold: 1 }} | LIMIT ${{ threshold: 2 }}`;

    query.query`WHERE y > ${{ threshold: 3 }}`;

    expect(query.toRequest()).toEqual({
      query: 'FROM index | WHERE x > ?threshold | LIMIT ?p1 | WHERE y > ?p2',
      params: [{ threshold: 1 }, { p1: 2 }, { p2: 3 }],
    });
  });

  test('pre-supplied params form', () => {
    const query = esql`FROM index`;

    query.query({ status: 'ok', limit: 100 })`WHERE status == ?status | LIMIT ?limit`;

    expect(query.toRequest()).toEqual({
      query: 'FROM index | WHERE status == ?status | LIMIT ?limit',
      params: [{ status: 'ok' }, { limit: 100 }],
    });
  });

  test('string form', () => {
    const query = esql`FROM index`;

    query.query('WHERE foo > 42 | LIMIT 10');

    expect(query.print('basic')).toBe('FROM index | WHERE foo > 42 | LIMIT 10');
  });

  test('string form with params', () => {
    const query = esql`FROM index`;

    query.query('WHERE status == ?status | LIMIT ?limit', { status: 'ok', limit: 100 });

    expect(query.toRequest()).toEqual({
      query: 'FROM index | WHERE status == ?status | LIMIT ?limit',
      params: [{ status: 'ok' }, { limit: 100 }],
    });
  });

  test('renames colliding params in string form', () => {
    const query = esql`FROM index | WHERE x > ${{ param: 1 }}`;

    query.query('WHERE y > ?param | LIMIT ?param', { param: 2 });

    expect(query.toRequest()).toEqual({
      query: 'FROM index | WHERE x > ?param | WHERE y > ?param_1 | LIMIT ?param_1',
      params: [{ param: 1 }, { param_1: 2 }],
    });
  });

  test('throws when fragment starts with a source command', () => {
    const query = esql`FROM index`;

    expect(() => query.query`FROM other`).toThrow('.query() does not accept source commands');
  });

  test('throws when fragment starts with ROW', () => {
    const query = esql`FROM index`;

    expect(() => query.query`ROW a = 1`).toThrow('.query() does not accept source commands');
  });
});
