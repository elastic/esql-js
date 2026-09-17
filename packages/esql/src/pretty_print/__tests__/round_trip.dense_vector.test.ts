/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { EsqlQuery } from '../../composer/query';
import { BasicPrettyPrinter } from '..';

describe('DENSE_VECTOR round-trips through the pretty-printer', () => {
  const roundTrip = (src: string) => {
    const { ast } = EsqlQuery.fromSrc(src);

    return BasicPrettyPrinter.query(ast);
  };

  it('round-trips a single field', () => {
    const src = 'FROM books | DENSE_VECTOR description';

    expect(roundTrip(src)).toBe(src);
  });

  it('round-trips multiple fields', () => {
    const src = 'FROM books | DENSE_VECTOR title, description';

    expect(roundTrip(src)).toBe(src);
  });

  it('round-trips an explicit target name', () => {
    const src = 'FROM books | DENSE_VECTOR vec = description';

    expect(roundTrip(src)).toBe(src);
  });

  it('round-trips a suffix clause', () => {
    const src = 'FROM books | DENSE_VECTOR suffix = "_dv" ON title, description';

    expect(roundTrip(src)).toBe(src);
  });

  it('round-trips a WITH clause', () => {
    const src = 'FROM books | DENSE_VECTOR description WITH {"inference_id": "my-endpoint"}';

    expect(roundTrip(src)).toBe(src);
  });

  it('round-trips a suffix clause combined with WITH', () => {
    const src =
      'FROM books | DENSE_VECTOR suffix = "_dv" ON title, description WITH {"inference_id": "my-endpoint"}';

    expect(roundTrip(src)).toBe(src);
  });
});
