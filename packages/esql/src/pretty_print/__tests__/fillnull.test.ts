/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { parse } from '../../parser';
import { BasicPrettyPrinter, WrappingPrettyPrinter } from '..';

describe('FILLNULL', () => {
  it.each([
    'FROM a | FILLNULL 0 ON x, y*',
    'FROM a | FILLNULL DEFAULT ON *',
    'FROM a | FILLNULL -1.5 ON x',
    'FROM a | FILLNULL NULL ON x',
    'FROM a | FILLNULL TRUE ON x',
    'FROM a | FILLNULL "x" ON a*, *.b',
    'FROM a | FILLNULL ?p ON x',
  ])('round-trips %s', (src) => {
    const { root, errors } = parse(src);

    expect(errors).toHaveLength(0);
    expect(BasicPrettyPrinter.print(root)).toBe(src);
    expect(WrappingPrettyPrinter.print(root)).toBe(src);
  });

  it('prints DEFAULT verbatim but keeps quoting a column named default', () => {
    const { root, errors } = parse('FROM a | FILLNULL DEFAULT ON `default`');

    expect(errors).toHaveLength(0);
    expect(BasicPrettyPrinter.print(root)).toBe('FROM a | FILLNULL DEFAULT ON `default`');
    expect(WrappingPrettyPrinter.print(root)).toBe('FROM a | FILLNULL DEFAULT ON `default`');
  });

  it('preserves lowercase default as written', () => {
    const { root } = parse('FROM a | FILLNULL default ON x');

    expect(BasicPrettyPrinter.print(root)).toBe('FROM a | FILLNULL default ON x');
  });

  it('wraps a long field list onto continuation lines', () => {
    const src =
      'FROM a | FILLNULL "some long default value string" ON field_number_one, field_number_two, field_number_three, field_number_four, prefix_*, *.suffix | LIMIT 1';
    const { root, errors } = parse(src);

    expect(errors).toHaveLength(0);
    expect(WrappingPrettyPrinter.print(root)).toBe(
      [
        'FROM a',
        '  | FILLNULL "some long default value string"',
        '        ON field_number_one, field_number_two, field_number_three,',
        '          field_number_four, prefix_*, *.suffix',
        '  | LIMIT 1',
      ].join('\n')
    );
  });
});
