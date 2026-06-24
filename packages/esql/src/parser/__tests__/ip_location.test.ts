/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { EsqlQuery } from '../../composer/query';
import { Walker } from '../../ast/walker';
import type { ESQLAstIpLocationCommand, ESQLAstQueryExpression } from '../../types';

describe('IP_LOCATION', () => {
  const getIpLocation = (ast: ESQLAstQueryExpression): ESQLAstIpLocationCommand =>
    Walker.match(ast, {
      type: 'command',
      name: 'ip_location',
    }) as ESQLAstIpLocationCommand;

  it('parses target = expression', () => {
    const src = `FROM web_logs | IP_LOCATION geo = client_ip`;
    const { ast, errors } = EsqlQuery.fromSrc(src);
    const cmd = getIpLocation(ast);

    expect(errors).toHaveLength(0);
    expect(cmd).toMatchObject({
      type: 'command',
      name: 'ip_location',
      incomplete: false,
      targetField: { type: 'column', name: 'geo' },
      expression: { type: 'column', name: 'client_ip' },
    });
    expect(cmd.args[0]).toMatchObject({
      type: 'function',
      subtype: 'binary-expression',
      name: '=',
    });
  });

  it('parses optional WITH { database: "..." }', () => {
    const src = `FROM web_logs | IP_LOCATION geo = client_ip WITH { "database": "GeoLite2-City.mmdb" }`;
    const { ast, errors } = EsqlQuery.fromSrc(src);
    const cmd = getIpLocation(ast);

    expect(errors).toHaveLength(0);
    expect(cmd.namedParameters).toMatchObject({
      type: 'map',
      entries: [
        {
          type: 'map-entry',
          key: { type: 'literal', valueUnquoted: 'database' },
          value: { type: 'literal', valueUnquoted: 'GeoLite2-City.mmdb' },
        },
      ],
    });
  });

  it('marks incomplete when expression is missing', () => {
    const { ast, errors } = EsqlQuery.fromSrc(`FROM index | IP_LOCATION geo =`);
    const cmd = getIpLocation(ast);

    expect(errors.length).toBeGreaterThan(0);
    expect(cmd).toMatchObject({
      name: 'ip_location',
      incomplete: true,
      targetField: { type: 'column', name: 'geo' },
      expression: { type: 'unknown', incomplete: true },
    });
  });

  it('errors on just the command keyword', () => {
    const { ast, errors } = EsqlQuery.fromSrc(`FROM index | IP_LOCATION`);
    const cmd = getIpLocation(ast);

    expect(errors.length).toBeGreaterThan(0);
    expect(cmd).toMatchObject({
      name: 'ip_location',
      incomplete: true,
      targetField: { type: 'column', name: '', incomplete: true },
    });
    expect(cmd.expression).toBeUndefined();
  });
});
