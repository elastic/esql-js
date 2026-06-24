/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { esql } from '../esql';
import { pqlFunc, pqlSel, pqlNum } from '../synth';

test('simple instant vector', () => {
  const query = esql.promql(pqlSel('up'));

  expect(query.print()).toBe('PROMQL (up)');
});

test('range vector selector', () => {
  const query = esql.promql(pqlSel('http_requests_total', '5m'));

  expect(query.print()).toBe('PROMQL (http_requests_total[5m])');
});

test('from PromQL synth-created node', () => {
  const query = esql.promql(esql.pql`http_requests_total[5m]`);

  expect(query.print()).toBe('PROMQL (http_requests_total[5m])');
});

test('from PromQL synth-created node - 2', () => {
  const query = esql.promql(esql.pql`http_requests_total[5m]`, { params: { a: 'b' } });

  expect(query.print()).toBe('PROMQL a = b (http_requests_total[5m])');
});

test('from PromQL synth-created node - 3', () => {
  const query = esql.promql(esql.pql`http_requests_total[5m]`, {
    params: { a: 'b' },
    outputName: 'result',
  });

  expect(query.print()).toBe('PROMQL a = b result = (http_requests_total[5m])');
});

test('function expression', () => {
  const query = esql.promql(pqlFunc('rate', pqlSel('http_requests_total', '5m')));

  expect(query.print()).toBe('PROMQL (rate(http_requests_total[5m]))');
});

test('aggregation with grouping', () => {
  const expr = pqlFunc('sum', pqlFunc('rate', pqlSel('metric', '5m')), { by: ['job'] });
  const query = esql.promql(expr);

  expect(query.print()).toBe('PROMQL (sum(rate(metric[5m])) by (job))');
});

test('accepts a raw PromQL string', () => {
  const query = esql.promql('rate(http_requests_total[5m])');

  expect(query.print()).toBe('PROMQL (rate(http_requests_total[5m]))');
});

test('accepts a simple metric string', () => {
  const query = esql.promql('up');

  expect(query.print()).toBe('PROMQL (up)');
});

test('accepts a pql-tagged expression', () => {
  const expr = esql.pql`sum(rate(metric[5m])) by (job)`;
  const query = esql.promql(expr);

  expect(query.print()).toBe('PROMQL (sum(rate(metric[5m])) by (job))');
});

test('single command-level param', () => {
  const query = esql.promql(pqlSel('up'), { params: { index: 'k8s' } });

  expect(query.print()).toBe('PROMQL index = k8s (up)');
});

test('multiple command-level params', () => {
  const query = esql.promql(pqlSel('up'), { params: { index: 'k8s', timeout: '10s' } });

  expect(query.print()).toBe('PROMQL index = k8s timeout = 10s (up)');
});

test('named output column', () => {
  const query = esql.promql(pqlFunc('sum', pqlSel('metric', '5m')), { outputName: 'result' });

  expect(query.print()).toBe('PROMQL result = (sum(metric[5m]))');
});

test('params and output name together', () => {
  const query = esql.promql(pqlSel('up'), {
    params: { index: 'k8s' },
    outputName: 'health',
  });

  expect(query.print()).toBe('PROMQL index = k8s health = (up)');
});

test('result is a ComposerQuery that can be piped', () => {
  const query = esql.promql(pqlSel('up')).limit(100);

  expect(query.print()).toBe('PROMQL (up) | LIMIT 100');
});

test('result can be sorted', () => {
  const query = esql.promql(pqlFunc('rate', pqlSel('metric', '5m')))
    .where`value > ${pqlNum(0)}`.limit(50);

  expect(query.print()).toBe('PROMQL (rate(metric[5m])) | WHERE value > 0 | LIMIT 50');
});

test('first command is a PROMQL command', () => {
  const query = esql.promql(pqlSel('up'));
  const [cmd] = query.ast.commands;

  expect(cmd.type).toBe('command');
  expect(cmd.name).toBe('promql');
});

describe('promqlCommand() getter', () => {
  test('returns the PROMQL command', () => {
    const query = esql.promql(pqlSel('up'));
    const cmd = query.promqlCommand();

    expect(cmd).toBeDefined();
    expect(cmd?.type).toBe('command');
    expect(cmd?.name).toBe('promql');
  });

  test('returns undefined for non-PROMQL queries', () => {
    const query = esql`FROM index`;

    expect(query.promqlCommand()).toBeUndefined();
  });

  test('exposes params and query properties', () => {
    const query = esql.promql(pqlSel('up'), { params: { index: 'k8s' }, outputName: 'health' });
    const cmd = query.promqlCommand();

    expect(cmd?.params?.type).toBe('map');
    expect(cmd?.query).toBeDefined();
  });
});
