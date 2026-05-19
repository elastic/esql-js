/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { EsqlQuery } from '../../../composer/query';
import type { ESQLIntegerLiteral } from '../../../types';
import { Walker } from '../walker';

describe('skipping children', () => {
  test('can skip command arguments', () => {
    const { ast } = EsqlQuery.fromSrc('FROM a, b, c');
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
    const { ast } = EsqlQuery.fromSrc('ROW fn(1, 2, 3, gg(4, 5))');
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
    const { ast } = EsqlQuery.fromSrc('FROM index METADATA a, b, c');
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
    const { ast } = EsqlQuery.fromSrc('ROW fn(TRUE, { "foo": 1, "bar": 2, "baz": 3 })');
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
    const { ast } = EsqlQuery.fromSrc('ROW fn(TRUE, { "foo": 1, "bar": 2, "baz": 3 })');
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
    const { ast } = EsqlQuery.fromSrc('FROM index | LIMIT 123');
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
    const { ast } = EsqlQuery.fromSrc('FROM a:b, c::d');
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
    const { ast } = EsqlQuery.fromSrc('FROM a:b, c::d');
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
