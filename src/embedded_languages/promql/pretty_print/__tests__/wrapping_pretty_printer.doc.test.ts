/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { doc, print } from '../wrapping_pretty_printer';
import { PromQLBuilder } from '../../ast/builder';
import { dump } from '../../../../printer/dump';

describe('"unknown" nodes', () => {
  test('emits correct print tree', () => {
    const unk = PromQLBuilder.unknown();

    expect(doc(unk)).toBe('<unknown>');
  });
});

describe('"identifier" nodes', () => {
  test('emits correct text node', () => {
    const node = PromQLBuilder.identifier('hello');

    expect(doc(node)).toBe('hello');
  });
});

describe('"literal" nodes', () => {
  describe('numeric', () => {
    test('integer (numeric)', () => {
      const node = PromQLBuilder.expression.literal.integer(42);

      expect(doc(node)).toBe('42');
    });

    test('decimal', () => {
      const node = PromQLBuilder.expression.literal.decimal(3.14);

      expect(doc(node)).toBe('3.14');
    });

    test('hexadecimal', () => {
      const node = PromQLBuilder.expression.literal.hexadecimal(0x2a, '0x2a');

      expect(doc(node)).toBe('0x2a');
    });
  });

  describe('string', () => {
    test('unquoted', () => {
      const node = PromQLBuilder.expression.literal.string('hello world');

      expect(doc(node)).toBe('"hello world"');
    });

    test('quoted', () => {
      const node = PromQLBuilder.expression.literal.string('"hello world"');

      expect(doc(node)).toBe('"\\"hello world\\""');
    });

    test('escaped', () => {
      const node = PromQLBuilder.expression.literal.string('hello\nworld');

      expect(doc(node)).toBe('"hello\\nworld"');
    });
  });

  describe('time', () => {
    test('basic', () => {
      const node = PromQLBuilder.expression.literal.time('5m');

      expect(doc(node)).toBe('5m');
    });
  });
});

describe('"parens" nodes', () => {
  test('emits correct print tree', () => {
    const node = PromQLBuilder.expression.parens(PromQLBuilder.identifier('hello'));

    expect(dump(doc(node))).toMatchInlineSnapshot(`
"group
└─ contents: []
   ├─ text "("
   ├─ indent
   │  └─ contents: []
   │     ├─ line (soft)
   │     └─ text "hello"
   ├─ line (soft)
   └─ text ")""
`);
  });
});

describe('"unary-expression" nodes', () => {
  test('emits correct print tree', () => {
    const node = PromQLBuilder.expression.unary('+', PromQLBuilder.identifier('hello_world'));

    expect(dump(doc(node))).toMatchInlineSnapshot(`
"[]
├─ text "+"
└─ text "hello_world""
`);
  });
});

describe('"binary-expression" nodes', () => {
  test('emits correct print tree', () => {
    const node = PromQLBuilder.expression.binary(
      '+',
      PromQLBuilder.identifier('foo'),
      PromQLBuilder.identifier('bar')
    );

    expect(dump(doc(node))).toMatchInlineSnapshot(`
"group
└─ contents: []
   ├─ text "foo"
   └─ indent
      └─ contents: []
         ├─ line
         ├─ text "+"
         ├─ text " "
         └─ text "bar""
`);
    expect(print(node)).toBe('foo + bar');
    expect(print(node, { printWidth: 6 })).toBe('foo\n  + bar');
  });
});
