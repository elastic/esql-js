/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { Builder } from '@elastic/esql-ast';
import type { ESQLIntegerLiteral } from '@elastic/esql-types';
import { Walker } from '../walker';

const { expression: expr } = Builder;

/** `FROM a, b, c` */
const fromSources = () =>
  Builder.expression.query([
    Builder.command({
      name: 'from',
      args: ['a', 'b', 'c'].map((name) => expr.source.index(name)),
    }),
  ]);

/** `ROW fn(1, 2, 3, gg(4, 5))` */
const rowNestedCall = () =>
  Builder.expression.query([
    Builder.command({
      name: 'row',
      args: [
        expr.func.call('fn', [
          expr.literal.integer(1),
          expr.literal.integer(2),
          expr.literal.integer(3),
          expr.func.call('gg', [expr.literal.integer(4), expr.literal.integer(5)]),
        ]),
      ],
    }),
  ]);

/** `FROM index METADATA a, b, c` */
const fromWithMetadata = () =>
  Builder.expression.query([
    Builder.command({
      name: 'from',
      args: [
        expr.source.index('index'),
        Builder.option({
          name: 'metadata',
          args: ['a', 'b', 'c'].map((name) =>
            expr.column({ args: [Builder.identifier({ name })] })
          ),
        }),
      ],
    }),
  ]);

/** `ROW fn(TRUE, { "foo": 1, "bar": 2, "baz": 3 })` */
const rowWithMap = () =>
  Builder.expression.query([
    Builder.command({
      name: 'row',
      args: [
        expr.func.call('fn', [
          expr.literal.boolean(true),
          expr.map({
            entries: [
              expr.entry('foo', expr.literal.integer(1)),
              expr.entry('bar', expr.literal.integer(2)),
              expr.entry('baz', expr.literal.integer(3)),
            ],
          }),
        ]),
      ],
    }),
  ]);

/** `FROM index | LIMIT 123` */
const fromLimit = () =>
  Builder.expression.query([
    Builder.command({ name: 'from', args: [expr.source.index('index')] }),
    Builder.command({ name: 'limit', args: [expr.literal.integer(123)] }),
  ]);

/** `FROM a:b, c::d` */
const fromSourceComponents = () =>
  Builder.expression.query([
    Builder.command({
      name: 'from',
      args: [expr.source.index('b', 'a'), expr.source.index('c', undefined, 'd')],
    }),
  ]);

describe('skipping children', () => {
  test('can skip command arguments', () => {
    const ast = fromSources();
    const sources: string[] = [];

    Walker.walk(ast, {
      visitCommand: (_node, _parent, walker) => {
        walker.skipChildren();
      },
      visitSource: (node) => {
        sources.push(node.name);
      },
    });

    expect(sources).toStrictEqual([]);
  });

  test('can skip function arguments', () => {
    const ast = rowNestedCall();
    const literals: number[] = [];

    Walker.walk(ast, {
      visitFunction: (node, _parent, walker) => {
        if (node.name === 'fn') walker.skipChildren();
      },
      visitLiteral: (node) => {
        literals.push(node.value as number);
      },
    });

    expect(literals).toStrictEqual([]);
  });

  test('can skip fields of a command option', () => {
    const ast = fromWithMetadata();
    const columns: string[] = [];

    Walker.walk(ast, {
      visitCommandOption: (_node, _parent, walker) => {
        walker.skipChildren();
      },
      visitColumn: (node) => {
        columns.push(node.name);
      },
    });

    expect(columns).toStrictEqual([]);
  });

  test('can skip entries of a map', () => {
    const ast = rowWithMap();
    const keys: string[] = [];
    const values: number[] = [];

    Walker.walk(ast, {
      visitMap: (_node, _parent, walker) => {
        walker.skipChildren();
      },
      visitMapEntry: (node) => {
        if (node.key.type === 'literal' && node.key.literalType === 'keyword') {
          keys.push(node.key.valueUnquoted);
        }
        values.push((node.value as ESQLIntegerLiteral).value);
      },
    });

    expect(keys).toStrictEqual([]);
    expect(values).toStrictEqual([]);
  });

  test('can skip children of a map entry', () => {
    const ast = rowWithMap();
    const keys: string[] = [];
    const values: number[] = [];

    Walker.walk(ast, {
      visitMapEntry: (node, _parent, walker) => {
        if (node.key.type === 'literal' && node.key.literalType === 'keyword') {
          keys.push(node.key.valueUnquoted);
        }
        walker.skipChildren();
      },
      visitLiteral: (node) => {
        if (node.literalType === 'integer') {
          values.push((node as ESQLIntegerLiteral).value);
        }
      },
    });

    expect(keys).toStrictEqual(['foo', 'bar', 'baz']);
    expect(values).toStrictEqual([]);
  });

  test('sibling commands are still traversed when a command skips its children', () => {
    const ast = fromLimit();
    const commands: string[] = [];
    const sources: string[] = [];
    const literals: number[] = [];

    Walker.walk(ast, {
      visitCommand: (node, parent, walker) => {
        commands.push(node.name);
        if (node.name === 'from') walker.skipChildren();
      },
      visitSource: (node) => sources.push(node.name),
      visitLiteral: (node) => literals.push(node.value as number),
    });

    expect(commands).toStrictEqual(['from', 'limit']);
    expect(sources).toStrictEqual([]);
    expect(literals).toStrictEqual([123]);
  });

  test('can skip components of a source', () => {
    const ast = fromSourceComponents();
    const components: string[] = [];

    Walker.walk(ast, {
      visitSource: (node, _parent, walker) => {
        if (node.name === 'a:b') walker.skipChildren();
      },
      visitLiteral: (node) => {
        components.push(node.value as string);
      },
    });

    expect(components).toStrictEqual(['c', 'd']);
  });

  test('can skip components of a source (backward)', () => {
    const ast = fromSourceComponents();
    const components: string[] = [];

    Walker.walk(ast, {
      visitSource: (node, _parent, walker) => {
        if (node.name === 'a:b') walker.skipChildren();
      },
      visitLiteral: (node) => {
        components.push(node.value as string);
      },
      order: 'backward',
    });

    expect(components).toStrictEqual(['d', 'c']);
  });
});
