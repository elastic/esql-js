/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { Builder } from '@elastic/esql-ast';
import type { ESQLIntegerLiteral } from '@elastic/esql-types';
import { Walker } from '../walker';
import {
  expr,
  fromSourceComponents,
  fromSources,
  rowNestedCall,
  rowWithMap,
} from '../../../__tests__/builders';

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

/** `FROM index | LIMIT 123` */
const fromLimit = () =>
  Builder.expression.query([
    Builder.command({ name: 'from', args: [expr.source.index('index')] }),
    Builder.command({ name: 'limit', args: [expr.literal.integer(123)] }),
  ]);

describe('aborting traversal', () => {
  test('can abort traversal after second comand argument', () => {
    const ast = fromSources();
    const sources: string[] = [];

    Walker.walk(ast, {
      visitSource: (node, parent, walker) => {
        sources.push(node.name);
        if (sources.length === 2) {
          walker.abort();
        }
      },
    });

    expect(sources).toStrictEqual(['a', 'b']);
  });

  test('can abort traversal after second function argument', () => {
    const ast = rowNestedCall();
    const sources: number[] = [];

    Walker.walk(ast, {
      visitLiteral: (node, parent, walker) => {
        sources.push(node.value as number);
        if (sources.length === 2) {
          walker.abort();
        }
      },
    });

    expect(sources).toStrictEqual([1, 2]);
  });

  test('can abort traversal after second field', () => {
    const ast = fromWithMetadata();
    const sources: string[] = [];

    Walker.walk(ast, {
      visitColumn: (node, parent, walker) => {
        sources.push(node.name);
        if (sources.length === 2) {
          walker.abort();
        }
      },
    });

    expect(sources).toStrictEqual(['a', 'b']);
  });

  test('can abort traversal after second map entry', () => {
    const ast = rowWithMap();
    const keys: string[] = [];
    const values: number[] = [];

    Walker.walk(ast, {
      visitMapEntry: (node, parent, walker) => {
        if (node.key.type === 'literal' && node.key.literalType === 'keyword') {
          keys.push(node.key.valueUnquoted);
        }
        values.push((node.value as ESQLIntegerLiteral).value);
        if (keys.length === 2) {
          walker.abort();
        }
      },
    });

    expect(keys).toStrictEqual(['foo', 'bar']);
    expect(values).toStrictEqual([1, 2]);
  });

  test('can abort traversal after second key entry', () => {
    const ast = rowWithMap();
    const keys: string[] = [];
    const values: number[] = [];

    Walker.walk(ast, {
      visitLiteral: (node, parent, walker) => {
        if (node.literalType === 'keyword') {
          keys.push(node.valueUnquoted);
          if (keys.length === 2) {
            walker.abort();
          }
        } else if (node.literalType === 'integer') {
          values.push((node as ESQLIntegerLiteral).value);
        }
      },
    });

    expect(keys).toStrictEqual(['foo', 'bar']);
    expect(values).toStrictEqual([1]);
  });

  test('can abort traversal before next command', () => {
    const ast = fromLimit();
    const commands: string[] = [];

    Walker.walk(ast, {
      visitCommand: (node, parent, walker) => {
        commands.push(node.name);
        if (commands.length === 1) {
          walker.abort();
        }
      },
    });

    expect(commands).toStrictEqual(['from']);
  });

  test('can abort traversal in the middle of source component', () => {
    const ast = fromSourceComponents();
    const components: string[] = [];

    Walker.walk(ast, {
      visitLiteral: (node, parent, walker) => {
        components.push(node.value as string);
        if (components.length === 1) {
          walker.abort();
        }
      },
    });

    expect(components).toStrictEqual(['a']);
  });

  test('can abort traversal in the middle of source component (backward)', () => {
    const ast = fromSourceComponents();
    const components: string[] = [];

    Walker.walk(ast, {
      visitLiteral: (node, parent, walker) => {
        components.push(node.value as string);
        if (components.length === 3) {
          walker.abort();
        }
      },
      order: 'backward',
    });

    expect(components).toStrictEqual(['d', 'c', 'b']);
  });
});
