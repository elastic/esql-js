/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { Parser } from '../../parser';
import { BasicPrettyPrinter } from '..';

const parse = (src: string) => Parser.parse(src, { withParens: true }).root;
const reprint = (src: string) => BasicPrettyPrinter.print(parse(src));

describe('round-trip: printer preserves source parens', () => {
  it('redundant same-precedence right-operand parens are preserved', () => {
    expect(reprint('FROM a | WHERE a + (b + c)')).toBe('FROM a | WHERE a + (b + c)');
    expect(reprint('FROM a | WHERE a * (b * c)')).toBe('FROM a | WHERE a * (b * c)');
    expect(reprint('FROM a | WHERE a - (b + c)')).toBe('FROM a | WHERE a - (b + c)');
  });

  it('redundant left-operand parens are preserved', () => {
    expect(reprint('FROM a | WHERE (b / c) * 10')).toBe('FROM a | WHERE (b / c) * 10');
    expect(reprint('FROM a | WHERE (b + c) AND d')).toBe('FROM a | WHERE (b + c) AND d');
  });

  it('semantically significant parens are preserved', () => {
    expect(reprint('FROM a | WHERE (a + b) * c')).toBe('FROM a | WHERE (a + b) * c');
    expect(reprint('FROM a | WHERE a / (b * c)')).toBe('FROM a | WHERE a / (b * c)');
    expect(reprint('FROM a | WHERE b AND (c OR d)')).toBe('FROM a | WHERE b AND (c OR d)');
  });

  it('nested parens are preserved', () => {
    expect(reprint('FROM a | WHERE (1 + (2 + 3))')).toBe('FROM a | WHERE (1 + (2 + 3))');
  });

  it('NOT (expr) parens are preserved', () => {
    expect(reprint('FROM a | WHERE NOT (a OR b)')).toBe('FROM a | WHERE NOT (a OR b)');
    expect(reprint('FROM a | WHERE NOT (a > b)')).toBe('FROM a | WHERE NOT (a > b)');
  });

  it('inline cast with parenthesized inner expression', () => {
    expect(reprint('ROW (1 + 2)::string')).toBe('ROW (1 + 2)::STRING');
  });
});
