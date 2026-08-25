/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Query fixtures for the `printAst` tests, built with {@link Builder} rather
 * than parsed, since the parser sits above this package in the dependency
 * graph. `printAst` renders each node's location and `.text`, so unlike the
 * other fixtures in this package these carry the exact values the parser
 * produces; they were generated from real parser output and verified against
 * it node by node.
 */

import { Builder } from '@elastic/esql-ast';
import { expr } from '../../__tests__/builders';
import type { ESQLAstQueryExpression } from '@elastic/esql-types';

// FROM index
export const fromIndex = (): ESQLAstQueryExpression =>
  Builder.expression.query(
    [
      Builder.command(
        {
          name: 'from',
          args: [
            expr.source.node(
              {
                sourceType: 'index',
                index: expr.literal.string(
                  'index',
                  { name: '"index"', unquoted: true },
                  { location: { min: 5, max: 9 }, text: 'index' }
                ),
              },
              { location: { min: 5, max: 9 }, text: 'index' }
            ),
          ],
        },
        { location: { min: 0, max: 9 }, text: 'FROMindex' }
      ),
    ],
    { location: { min: 0, max: 9 }, text: 'FROMindex' }
  );

// ROW 123, "foo"
export const rowNumberAndString = (): ESQLAstQueryExpression =>
  Builder.expression.query(
    [
      Builder.command(
        {
          name: 'row',
          args: [
            expr.literal.integer(123, undefined, { location: { min: 4, max: 6 }, text: '123' }),
            expr.literal.string(
              'foo',
              { name: '"foo"' },
              { location: { min: 9, max: 13 }, text: '"foo"' }
            ),
          ],
        },
        { location: { min: 0, max: 13 }, text: 'ROW123,"foo"' }
      ),
    ],
    { location: { min: 0, max: 13 }, text: 'ROW123,"foo"' }
  );

// FROM a | STATS fn = count(a * (1 + 3), {"adf": 123}) BY b | LIMIT 123
export const fromStatsByLimit = (): ESQLAstQueryExpression =>
  Builder.expression.query(
    [
      Builder.command(
        {
          name: 'from',
          args: [
            expr.source.node(
              {
                sourceType: 'index',
                index: expr.literal.string(
                  'a',
                  { name: '"a"', unquoted: true },
                  { location: { min: 5, max: 5 }, text: 'a' }
                ),
              },
              { location: { min: 5, max: 5 }, text: 'a' }
            ),
          ],
        },
        { location: { min: 0, max: 5 }, text: 'FROMa' }
      ),
      Builder.command(
        {
          name: 'stats',
          args: [
            expr.func.node(
              {
                name: '=',
                subtype: 'binary-expression',
                args: [
                  expr.column(
                    {
                      args: [
                        Builder.identifier(
                          { name: 'fn' },
                          { location: { min: 15, max: 16 }, text: 'fn' }
                        ),
                      ],
                    },
                    undefined,
                    { location: { min: 15, max: 16 }, text: 'fn' }
                  ),
                  [
                    expr.func.node(
                      {
                        name: 'count',
                        subtype: 'variadic-call',
                        operator: Builder.identifier(
                          { name: 'count' },
                          { location: { min: 20, max: 24 }, text: 'count' }
                        ),
                        args: [
                          expr.func.node(
                            {
                              name: '*',
                              subtype: 'binary-expression',
                              args: [
                                expr.column(
                                  {
                                    args: [
                                      Builder.identifier(
                                        { name: 'a' },
                                        { location: { min: 26, max: 26 }, text: 'a' }
                                      ),
                                    ],
                                  },
                                  undefined,
                                  { location: { min: 26, max: 26 }, text: 'a' }
                                ),
                                expr.func.node(
                                  {
                                    name: '+',
                                    subtype: 'binary-expression',
                                    args: [
                                      expr.literal.integer(1, undefined, {
                                        location: { min: 31, max: 31 },
                                        text: '1',
                                      }),
                                      expr.literal.integer(3, undefined, {
                                        location: { min: 35, max: 35 },
                                        text: '3',
                                      }),
                                    ],
                                  },
                                  { location: { min: 31, max: 35 }, text: '1+3' }
                                ),
                              ],
                            },
                            { location: { min: 26, max: 36 }, text: 'a*(1+3)' }
                          ),
                          expr.map(
                            {
                              entries: [
                                expr.entry(
                                  expr.literal.string(
                                    'adf',
                                    { name: '"adf"' },
                                    { location: { min: 40, max: 44 }, text: '"adf"' }
                                  ),
                                  expr.literal.integer(123, undefined, {
                                    location: { min: 47, max: 49 },
                                    text: '123',
                                  }),
                                  { location: { min: 40, max: 49 }, text: '"adf": 123' }
                                ),
                              ],
                            },
                            { location: { min: 39, max: 50 }, text: '{"adf": 123}' }
                          ),
                        ],
                      },
                      { location: { min: 20, max: 51 }, text: 'count(a*(1+3),{"adf":123})' }
                    ),
                  ],
                ],
              },
              { location: { min: 15, max: 51 }, text: 'fn=count(a*(1+3),{"adf":123})' }
            ),
            Builder.option(
              {
                name: 'by',
                args: [
                  expr.column(
                    {
                      args: [
                        Builder.identifier(
                          { name: 'b' },
                          { location: { min: 56, max: 56 }, text: 'b' }
                        ),
                      ],
                    },
                    undefined,
                    { location: { min: 56, max: 56 }, text: 'b' }
                  ),
                ],
              },
              { location: { min: 53, max: 56 }, text: 'STATSfn=count(a*(1+3),{"adf":123})BYb' }
            ),
          ],
        },
        { location: { min: 9, max: 56 }, text: 'STATSfn=count(a*(1+3),{"adf":123})BYb' }
      ),
      Builder.command(
        {
          name: 'limit',
          args: [
            expr.literal.integer(123, undefined, { location: { min: 66, max: 68 }, text: '123' }),
          ],
        },
        { location: { min: 60, max: 68 }, text: 'LIMIT123' }
      ),
    ],
    { location: { min: 0, max: 5 }, text: 'FROMa' }
  );
