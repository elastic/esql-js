/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { BasicPrettyPrinter } from '../../../pretty_print';
import { PromQLBasicPrettyPrinter } from '../../../embedded_languages/promql/pretty_print';
import { pql, promqlExpression } from '../promql';
import { cmd } from '../command';
import { qry } from '../query';

test('creates a PromQL expression node from a tagged template', () => {
  const node = pql`rate(http_requests_total[5m])`;

  expect(node).toBeDefined();
  expect(node.type).toBe('query');
  expect(node.dialect).toBe('promql');
});

test('pql is an alias for promqlExpression', () => {
  expect(pql).toBe(promqlExpression);
});

test('serializes a PromQL expression back to text', () => {
  const node = pql`rate(http_requests_total[5m])`;
  const text = PromQLBasicPrettyPrinter.print(node);

  expect(text).toBe('rate(http_requests_total[5m])');
});

test('serializes a metric selector', () => {
  const node = pql`http_requests_total{job="api",status="200"}`;
  const text = PromQLBasicPrettyPrinter.print(node);

  expect(text).toBe('http_requests_total{job="api", status="200"}');
});

test('can be used as a function call', () => {
  const node = pql('up == 1');
  const text = PromQLBasicPrettyPrinter.print(node);

  expect(text).toBe('up == 1');
});

test('can compose PromQL expressions', () => {
  const time = pql`5m`;
  const selector = pql`some_metric{job="api"}[${time}]`;
  const number = pql`456`;
  const func = pql`func(${selector}, 123, ${number})`;
  const text = func + '';

  expect(text).toBe('func(some_metric{job="api"}[5m], 123, 456)');
});

test('can be interpolated as a hole in a PROMQL command', () => {
  const expr = pql`bytes_in{job="prometheus"}`;
  const node = cmd`PROMQL (${expr})`;
  const text = BasicPrettyPrinter.command(node);

  expect(text).toBe('PROMQL (bytes_in{job="prometheus"})');
});

test('can build a full PROMQL query via qry', () => {
  const expr = pql`rate(http_requests_total[5m])`;
  const node = qry`PROMQL (${expr})`;
  const text = BasicPrettyPrinter.print(node);

  expect(text).toBe('PROMQL (rate(http_requests_total[5m]))');
});

test('trims whitespace from source', () => {
  const node = pql`  up  `;
  const text = PromQLBasicPrettyPrinter.print(node);

  expect(text).toBe('up');
});
