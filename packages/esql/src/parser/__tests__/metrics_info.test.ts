/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { EsqlQuery } from '../../composer/query';
import { Walker } from '../../ast/walker';
import type { ESQLAstQueryExpression, ESQLAstMetricsInfoCommand } from '../../types';

describe('METRICS_INFO', () => {
  const getMetricsInfo = (ast: ESQLAstQueryExpression): ESQLAstMetricsInfoCommand =>
    Walker.match(ast, {
      type: 'command',
      name: 'metrics_info',
    }) as ESQLAstMetricsInfoCommand;

  it('parses metrics_info command', () => {
    const src = `TS index | metrics_info`;
    const { ast, errors } = EsqlQuery.fromSrc(src);
    const metricsInfo = getMetricsInfo(ast);

    expect(errors.length).toBe(0);
    expect(metricsInfo).toMatchObject({
      type: 'command',
      name: 'metrics_info',
      incomplete: false,
    });
    expect(metricsInfo.args).toHaveLength(0);
  });
});
