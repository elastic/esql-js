/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { EsqlQuery } from '../../composer/query';
import { BasicPrettyPrinter, WrappingPrettyPrinter } from '..';

describe('TS_COLLAPSE round-trips through the pretty-printers', () => {
  it.each([
    'TS metrics | TS_COLLAPSE',
    'TS metrics | TS_COLLAPSE | LIMIT 10',
    'TS metrics | FORK (TS_COLLAPSE | LIMIT 1) (LIMIT 2)',
  ])('%s', (src) => {
    const { ast } = EsqlQuery.fromSrc(src);

    expect(BasicPrettyPrinter.query(ast)).toBe(src);
    expect(WrappingPrettyPrinter.print(ast)).toBe(src);
  });
});
