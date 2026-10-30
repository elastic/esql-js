/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { Parser } from '../../parser';
import { BasicPrettyPrinter, WrappingPrettyPrinter } from '..';

const queries = [
  'FROM a | EVAL x = MV_FILTER(arr, v -> v > 1)',
  'FROM a | EVAL x = MV_REDUCE(arr, (acc, v) -> acc + v, 0)',
  'FROM a | EVAL x = F(() -> 1)',
  'FROM a | EVAL x = F(a, v -> v, b)',
  'FROM a | EVAL x = F((v) -> v)',
];

const normalize = (s: string) => s.toLowerCase();

describe('round-trip: lambda arguments', () => {
  it.each(queries)('BasicPrettyPrinter: %s', (src) => {
    const { root } = Parser.parse(src);

    expect(normalize(BasicPrettyPrinter.print(root))).toBe(normalize(src));
  });

  it.each(queries)('WrappingPrettyPrinter: %s', (src) => {
    const reprint = (src: string, width: number) => {
      const { root } = Parser.parse(src);
      return WrappingPrettyPrinter.print(root, { wrap: width });
    };

    expect(normalize(reprint(src, 200))).toBe(normalize(src));
    expect(normalize(reprint(reprint(src, 10), 200))).toBe(normalize(src));
  });
});
