/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { Parser } from '../../parser';
import { BasicPrettyPrinter, WrappingPrettyPrinter } from '..';

describe('DESCRIBE formatting', () => {
  it.each([
    'FROM logs | DESCRIBE',
    'FROM logs | DESCRIBE | LIMIT 1',
    'FROM logs | FORK (DESCRIBE | LIMIT 1) (LIMIT 2)',
  ])('round-trips %s', (src) => {
    const { root, errors } = Parser.parse(src);

    expect(errors).toEqual([]);
    expect(BasicPrettyPrinter.query(root)).toBe(src);
    expect(WrappingPrettyPrinter.print(root)).toBe(src);
  });
});
