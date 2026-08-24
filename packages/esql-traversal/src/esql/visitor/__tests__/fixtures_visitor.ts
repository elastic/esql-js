/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { Builder } from '@elastic/esql-ast';
import type { ESQLAstExpression, ESQLAstQueryExpression } from '@elastic/esql-types';
import { expr } from '../../../__tests__/builders';

const set = (name: string, value: ESQLAstExpression) =>
  Builder.header.command.set([expr.func.binary('=', [Builder.identifier({ name }), value])]);

const from = (index = 'index') =>
  Builder.command({ name: 'from', args: [expr.source.index(index)] });

const limit = (value: number) =>
  Builder.command({ name: 'limit', args: [expr.literal.integer(value)] });

// FROM index | LIMIT 123
export const fromLimit = (): ESQLAstQueryExpression =>
  Builder.expression.query([from(), limit(123)]);

// FROM index | FORK (WHERE 1) (WHERE 2)
export const fromFork = (): ESQLAstQueryExpression =>
  Builder.expression.query([
    from(),
    Builder.command({
      name: 'fork',
      args: [1, 2].map((n) =>
        expr.parens(
          Builder.expression.query([
            Builder.command({ name: 'where', args: [expr.literal.integer(n)] }),
          ])
        )
      ),
    }),
  ]);

// FROM index | SORT asfd | WHERE 1 | ENRICH adsf | LIMIT 123
export const fromSortWhereEnrichLimit = (): ESQLAstQueryExpression =>
  Builder.expression.query([
    from(),
    Builder.command({ name: 'sort', args: [expr.column('asfd')] }),
    Builder.command({ name: 'where', args: [expr.literal.integer(1)] }),
    Builder.command({
      name: 'enrich',
      args: [expr.source.node({ sourceType: 'policy', index: 'adsf' })],
    }),
    limit(123),
  ]);

// SET timeout = "30s"; FROM index | LIMIT 10
export const setTimeoutFromLimit = (): ESQLAstQueryExpression =>
  Builder.expression.query([from(), limit(10)], undefined, [
    set('timeout', expr.literal.string('30s')),
  ]);

// SET timeout = "30s"; FROM index
export const setTimeoutFrom = (): ESQLAstQueryExpression =>
  Builder.expression.query([from()], undefined, [set('timeout', expr.literal.string('30s'))]);

// SET a = 1; FROM index | LIMIT 10
export const setOneFromLimit = (): ESQLAstQueryExpression =>
  Builder.expression.query([from(), limit(10)], undefined, [set('a', expr.literal.integer(1))]);

// SET a = 1; SET b = 2; FROM index
export const setTwoFrom = (): ESQLAstQueryExpression =>
  Builder.expression.query([from()], undefined, [
    set('a', expr.literal.integer(1)),
    set('b', expr.literal.integer(2)),
  ]);

// SET a = 1; SET b = 2; SET c = 3; FROM index
export const setThreeFrom = (): ESQLAstQueryExpression =>
  Builder.expression.query([from()], undefined, [
    set('a', expr.literal.integer(1)),
    set('b', expr.literal.integer(2)),
    set('c', expr.literal.integer(3)),
  ]);

// SET a = 1; SET b = "value"; SET c = true; FROM index
export const setMixedFrom = (): ESQLAstQueryExpression =>
  Builder.expression.query([from()], undefined, [
    set('a', expr.literal.integer(1)),
    set('b', expr.literal.string('value')),
    set('c', expr.literal.boolean(true)),
  ]);
