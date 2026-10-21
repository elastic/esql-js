/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { Parser } from '@elastic/esql-parser';
import { Walker } from '../walker';

describe('Walker: lambda', () => {
  it('visits lambda params and body', () => {
    const { root } = Parser.parse('FROM a | EVAL f(arr, (x, y) -> x + y)');
    const lambdas: string[] = [];
    const columns: string[] = [];
    const identifiers: string[] = [];

    Walker.walk(root, {
      visitLambda: (node) => lambdas.push(node.type),
      visitColumn: (node) => columns.push(node.name),
      visitIdentifier: (node, parent) => {
        if (parent?.type === 'lambda') identifiers.push(node.name);
      },
    });

    expect(lambdas).toEqual(['lambda']);
    expect(identifiers).toEqual(['x', 'y']);
    expect(columns).toEqual(['arr', 'x', 'y']);
  });
});
