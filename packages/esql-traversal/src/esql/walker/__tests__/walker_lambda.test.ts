/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { Builder } from '@elastic/esql-ast';
import { Walker } from '../walker';

describe('Walker: lambda', () => {
  const build = () =>
    Builder.expression.query([
      Builder.command({
        name: 'row',
        args: [
          Builder.expression.func.call('f', [
            Builder.expression.column('arr'),
            Builder.expression.lambda(
              [Builder.identifier({ name: 'x' }), Builder.identifier({ name: 'y' })],
              Builder.expression.func.binary('+', [
                Builder.expression.column('x'),
                Builder.expression.column('y'),
              ])
            ),
          ]),
        ],
      }),
    ]);

  it('visits lambda params and body', () => {
    const lambdas: string[] = [];
    const columns: string[] = [];
    const identifiers: string[] = [];

    Walker.walk(build(), {
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
