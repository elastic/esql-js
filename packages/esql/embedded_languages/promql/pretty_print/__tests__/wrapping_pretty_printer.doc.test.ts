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

describe('"selector" nodes', () => {
  test('simple metric name', () => {
    const node = PromQLBuilder.expression.selector.node({
      metric: PromQLBuilder.identifier('http_requests_total'),
    });

    expect(dump(doc(node))).toMatchInlineSnapshot(`
"group
└─ contents: []
   └─ text "http_requests_total""
`);
    expect(print(node)).toBe('http_requests_total');
  });

  test('labels only (no metric name)', () => {
    const node = PromQLBuilder.expression.selector.node({
      labelMap: PromQLBuilder.labelMap([
        PromQLBuilder.label(
          PromQLBuilder.identifier('job'),
          '=',
          PromQLBuilder.expression.literal.string('api')
        ),
      ]),
    });

    expect(dump(doc(node))).toMatchInlineSnapshot(`
"group
└─ contents: []
   └─ group
      └─ contents: []
         ├─ text "{"
         ├─ indent
         │  └─ contents: []
         │     ├─ line (soft)
         │     └─ []
         │        └─ fill
         │           ├─ parts[0]: text "job"
         │           ├─ parts[1]: text " "
         │           ├─ parts[2]: text "="
         │           └─ parts[3]: indent
         │              └─ contents: []
         │                 ├─ line
         │                 └─ text "\\"api\\""
         ├─ line (soft)
         └─ text "}""
`);
    expect(print(node)).toBe('{job = "api"}');
  });

  test('metric with label matchers', () => {
    const node = PromQLBuilder.expression.selector.node({
      metric: PromQLBuilder.identifier('http_requests_total'),
      labelMap: PromQLBuilder.labelMap([
        PromQLBuilder.label(
          PromQLBuilder.identifier('job'),
          '=',
          PromQLBuilder.expression.literal.string('api')
        ),
      ]),
    });

    expect(print(node)).toBe('http_requests_total{job = "api"}');
  });

  test('multiple label matchers', () => {
    const node = PromQLBuilder.expression.selector.node({
      metric: PromQLBuilder.identifier('http_requests_total'),
      labelMap: PromQLBuilder.labelMap([
        PromQLBuilder.label(
          PromQLBuilder.identifier('job'),
          '=',
          PromQLBuilder.expression.literal.string('api')
        ),
        PromQLBuilder.label(
          PromQLBuilder.identifier('status'),
          '=~',
          PromQLBuilder.expression.literal.string('5..')
        ),
      ]),
    });

    expect(print(node)).toBe('http_requests_total{job = "api", status =~ "5.."}');
  });

  test('range vector (metric with duration)', () => {
    const node = PromQLBuilder.expression.selector.node({
      metric: PromQLBuilder.identifier('http_requests_total'),
      duration: PromQLBuilder.expression.literal.time('5m'),
    });

    expect(dump(doc(node))).toMatchInlineSnapshot(`
"group
└─ contents: []
   ├─ text "http_requests_total"
   ├─ text "["
   ├─ text "5m"
   └─ text "]""
`);
    expect(print(node)).toBe('http_requests_total[5m]');
  });

  test('metric with labels and duration', () => {
    const node = PromQLBuilder.expression.selector.node({
      metric: PromQLBuilder.identifier('http_requests_total'),
      labelMap: PromQLBuilder.labelMap([
        PromQLBuilder.label(
          PromQLBuilder.identifier('job'),
          '=',
          PromQLBuilder.expression.literal.string('api')
        ),
      ]),
      duration: PromQLBuilder.expression.literal.time('5m'),
    });

    expect(print(node)).toBe('http_requests_total{job = "api"}[5m]');
  });

  test('with offset modifier', () => {
    const node = PromQLBuilder.expression.selector.node({
      metric: PromQLBuilder.identifier('http_requests_total'),
      evaluation: PromQLBuilder.evaluation(
        PromQLBuilder.offset(PromQLBuilder.expression.literal.time('5m'))
      ),
    });

    expect(dump(doc(node))).toMatchInlineSnapshot(`
"group
└─ contents: []
   ├─ text "http_requests_total"
   └─ []
      ├─ text " "
      └─ []
         ├─ text "offset "
         ├─ text ""
         └─ text "5m""
`);
    expect(print(node)).toBe('http_requests_total offset 5m');
  });

  test('with negative offset modifier', () => {
    const node = PromQLBuilder.expression.selector.node({
      metric: PromQLBuilder.identifier('http_requests_total'),
      evaluation: PromQLBuilder.evaluation(
        PromQLBuilder.offset(PromQLBuilder.expression.literal.time('5m'), true)
      ),
    });

    expect(print(node)).toBe('http_requests_total offset - 5m');
  });

  test('with @ timestamp modifier', () => {
    const node = PromQLBuilder.expression.selector.node({
      metric: PromQLBuilder.identifier('http_requests_total'),
      evaluation: PromQLBuilder.evaluation(
        undefined,
        PromQLBuilder.at(PromQLBuilder.expression.literal.time('1609459200'))
      ),
    });

    expect(print(node)).toBe('http_requests_total @ 1609459200');
  });

  test('with @ start() modifier', () => {
    const node = PromQLBuilder.expression.selector.node({
      metric: PromQLBuilder.identifier('http_requests_total'),
      evaluation: PromQLBuilder.evaluation(undefined, PromQLBuilder.at('start()')),
    });

    expect(print(node)).toBe('http_requests_total @ start()');
  });

  test('with offset and @ modifiers', () => {
    const node = PromQLBuilder.expression.selector.node({
      metric: PromQLBuilder.identifier('http_requests_total'),
      duration: PromQLBuilder.expression.literal.time('5m'),
      evaluation: PromQLBuilder.evaluation(
        PromQLBuilder.offset(PromQLBuilder.expression.literal.time('10m')),
        PromQLBuilder.at('end()')
      ),
    });

    expect(print(node)).toBe('http_requests_total[5m] offset 10m @ end()');
  });

  test('labels wrap when exceeding print width', () => {
    const node = PromQLBuilder.expression.selector.node({
      metric: PromQLBuilder.identifier('http_requests_total'),
      labelMap: PromQLBuilder.labelMap([
        PromQLBuilder.label(
          PromQLBuilder.identifier('job'),
          '=',
          PromQLBuilder.expression.literal.string('api')
        ),
        PromQLBuilder.label(
          PromQLBuilder.identifier('status'),
          '=~',
          PromQLBuilder.expression.literal.string('5..')
        ),
      ]),
    });

    expect(print(node, { printWidth: 30 })).toBe(
      'http_requests_total{\n  job = "api",\n  status =~ "5.."\n}'
    );
  });
});

describe('"subquery" nodes', () => {
  test('without resolution', () => {
    const node = PromQLBuilder.expression.subquery(
      PromQLBuilder.identifier('http_requests_total'),
      PromQLBuilder.expression.literal.time('5m')
    );

    expect(dump(doc(node))).toMatchInlineSnapshot(`
"group
└─ contents: []
   ├─ text "http_requests_total"
   ├─ text "["
   ├─ text "5m"
   ├─ text ":"
   ├─ text ""
   └─ text "]""
`);
    expect(print(node)).toBe('http_requests_total[5m:]');
  });

  test('with resolution', () => {
    const node = PromQLBuilder.expression.subquery(
      PromQLBuilder.identifier('http_requests_total'),
      PromQLBuilder.expression.literal.time('5m'),
      PromQLBuilder.expression.literal.time('1m')
    );

    expect(dump(doc(node))).toMatchInlineSnapshot(`
"group
└─ contents: []
   ├─ text "http_requests_total"
   ├─ text "["
   ├─ text "5m"
   ├─ text ":"
   ├─ text "1m"
   └─ text "]""
`);
    expect(print(node)).toBe('http_requests_total[5m:1m]');
  });

  test('with offset modifier', () => {
    const node = PromQLBuilder.expression.subquery(
      PromQLBuilder.identifier('http_requests_total'),
      PromQLBuilder.expression.literal.time('5m'),
      PromQLBuilder.expression.literal.time('1m'),
      PromQLBuilder.evaluation(PromQLBuilder.offset(PromQLBuilder.expression.literal.time('10m')))
    );

    expect(print(node)).toBe('http_requests_total[5m:1m] offset 10m');
  });

  test('with nested expression', () => {
    const inner = PromQLBuilder.expression.selector.node({
      metric: PromQLBuilder.identifier('http_requests_total'),
      duration: PromQLBuilder.expression.literal.time('5m'),
    });
    const node = PromQLBuilder.expression.subquery(
      inner,
      PromQLBuilder.expression.literal.time('30m'),
      PromQLBuilder.expression.literal.time('1m')
    );

    expect(print(node)).toBe('http_requests_total[5m][30m:1m]');
  });
});

describe('"function" nodes', () => {
  test('no arguments', () => {
    const node = PromQLBuilder.expression.func.call('time', []);

    expect(doc(node)).toBe('time()');
  });

  test('single argument', () => {
    const node = PromQLBuilder.expression.func.call('rate', [PromQLBuilder.identifier('x')]);

    expect(dump(doc(node))).toMatchInlineSnapshot(`
"group
└─ contents: []
   ├─ text "rate("
   ├─ indent
   │  └─ contents: []
   │     ├─ line (soft)
   │     └─ []
   │        └─ text "x"
   ├─ line (soft)
   └─ text ")""
`);
    expect(print(node)).toBe('rate(x)');
  });

  test('multiple arguments', () => {
    const node = PromQLBuilder.expression.func.call('clamp', [
      PromQLBuilder.identifier('x'),
      PromQLBuilder.expression.literal.integer(0),
      PromQLBuilder.expression.literal.integer(100),
    ]);

    expect(dump(doc(node))).toMatchInlineSnapshot(`
"group
└─ contents: []
   ├─ text "clamp("
   ├─ indent
   │  └─ contents: []
   │     ├─ line (soft)
   │     └─ []
   │        ├─ text "x"
   │        ├─ []
   │        │  ├─ text ","
   │        │  └─ line
   │        ├─ text "0"
   │        ├─ []
   │        │  ├─ text ","
   │        │  └─ line
   │        └─ text "100"
   ├─ line (soft)
   └─ text ")""
`);
    expect(print(node)).toBe('clamp(x, 0, 100)');
  });

  test('grouping after (by)', () => {
    const node = PromQLBuilder.expression.func.call(
      'sum',
      [PromQLBuilder.identifier('x')],
      PromQLBuilder.grouping('by', [PromQLBuilder.identifier('job')]),
      'after'
    );

    expect(dump(doc(node))).toMatchInlineSnapshot(`
"group
└─ contents: []
   ├─ group
   │  └─ contents: []
   │     ├─ text "sum("
   │     ├─ indent
   │     │  └─ contents: []
   │     │     ├─ line (soft)
   │     │     └─ []
   │     │        └─ text "x"
   │     ├─ line (soft)
   │     └─ text ")"
   ├─ text " "
   └─ group
      └─ contents: []
         ├─ text "by "
         └─ group
            └─ contents: []
               ├─ text "("
               ├─ indent
               │  └─ contents: []
               │     ├─ line (soft)
               │     └─ []
               │        └─ text "job"
               ├─ line (soft)
               └─ text ")""
`);
    expect(print(node)).toBe('sum(x) by (job)');
  });

  test('grouping before (by)', () => {
    const node = PromQLBuilder.expression.func.call(
      'sum',
      [PromQLBuilder.identifier('x')],
      PromQLBuilder.grouping('by', [PromQLBuilder.identifier('job')]),
      'before'
    );

    expect(dump(doc(node))).toMatchInlineSnapshot(`
"group
└─ contents: []
   ├─ text "sum"
   ├─ text " "
   ├─ group
   │  └─ contents: []
   │     ├─ text "by "
   │     └─ group
   │        └─ contents: []
   │           ├─ text "("
   │           ├─ indent
   │           │  └─ contents: []
   │           │     ├─ line (soft)
   │           │     └─ []
   │           │        └─ text "job"
   │           ├─ line (soft)
   │           └─ text ")"
   ├─ text " "
   └─ group
      └─ contents: []
         ├─ text "("
         ├─ indent
         │  └─ contents: []
         │     ├─ line (soft)
         │     └─ []
         │        └─ text "x"
         ├─ line (soft)
         └─ text ")""
`);
    expect(print(node)).toBe('sum by (job) (x)');
  });

  test('grouping with without', () => {
    const node = PromQLBuilder.expression.func.call(
      'avg',
      [PromQLBuilder.identifier('x')],
      PromQLBuilder.grouping('without', [PromQLBuilder.identifier('instance')]),
      'after'
    );

    expect(print(node)).toBe('avg(x) without (instance)');
  });

  test('grouping with multiple labels', () => {
    const node = PromQLBuilder.expression.func.call(
      'sum',
      [PromQLBuilder.identifier('x')],
      PromQLBuilder.grouping('by', [
        PromQLBuilder.identifier('job'),
        PromQLBuilder.identifier('instance'),
      ]),
      'after'
    );

    expect(print(node)).toBe('sum(x) by (job, instance)');
  });

  test('nested function calls', () => {
    const inner = PromQLBuilder.expression.selector.node({
      metric: PromQLBuilder.identifier('http_requests_total'),
      duration: PromQLBuilder.expression.literal.time('5m'),
    });
    const rate = PromQLBuilder.expression.func.call('rate', [inner]);
    const node = PromQLBuilder.expression.func.call(
      'sum',
      [rate],
      PromQLBuilder.grouping('by', [PromQLBuilder.identifier('job')]),
      'after'
    );

    expect(print(node)).toBe('sum(rate(http_requests_total[5m])) by (job)');
  });

  test('arguments wrap when exceeding print width', () => {
    const node = PromQLBuilder.expression.func.call('clamp', [
      PromQLBuilder.identifier('some_long_metric_name'),
      PromQLBuilder.expression.literal.integer(0),
      PromQLBuilder.expression.literal.integer(100),
    ]);

    expect(print(node, { printWidth: 20 })).toBe(
      'clamp(\n  some_long_metric_name,\n  0,\n  100\n)'
    );
  });
});
