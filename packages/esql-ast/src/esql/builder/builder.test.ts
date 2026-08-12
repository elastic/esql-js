/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { Builder } from '.';
import { LeafPrinter } from '../leaf_printer';
import { PromQLBuilder } from '../../promql/builder';

describe('command', () => {
  test('can create a LIMIT command', () => {
    const node = Builder.command({
      name: 'limit',
      args: [Builder.expression.literal.integer(10)],
    });

    expect(node).toMatchObject({
      type: 'command',
      name: 'limit',
      args: [
        {
          type: 'literal',
          literalType: 'integer',
          value: 10,
        },
      ],
    }); // 'LIMIT 10'
  });

  test('can create a FROM command with BY option', () => {
    const node = Builder.command({
      name: 'from',
      args: [
        Builder.expression.source.node({ index: 'my_index', sourceType: 'index' }),
        Builder.option({
          name: 'by',
          args: [
            Builder.expression.column({
              args: [Builder.identifier({ name: '_id' })],
            }),
            Builder.expression.column({
              args: [Builder.identifier('_source')],
            }),
          ],
        }),
      ],
    });

    expect(node).toMatchObject({
      type: 'command',
      name: 'from',
      args: [
        {
          type: 'source',
          sourceType: 'index',
          name: 'my_index',
        },
        {
          type: 'option',
          name: 'by',
          args: [
            { type: 'column', name: '_id' },
            { type: 'column', name: '_source' },
          ],
        },
      ],
    }); // 'FROM my_index BY _id, _source'
  });
});

describe('function', () => {
  test('can mint a binary expression', () => {
    const node = Builder.expression.func.binary('+', [
      Builder.expression.literal.integer(1),
      Builder.expression.literal.integer(2),
    ]);

    expect(node).toMatchObject({
      type: 'function',
      subtype: 'binary-expression',
      name: '+',
      args: [
        { type: 'literal', literalType: 'integer', value: 1 },
        { type: 'literal', literalType: 'integer', value: 2 },
      ],
    }); // '1 + 2'
  });

  test('can mint a unary expression', () => {
    const node = Builder.expression.func.unary('not', Builder.expression.literal.integer(123));

    expect(node).toMatchObject({
      type: 'function',
      subtype: 'unary-expression',
      name: 'not',
      args: [{ type: 'literal', literalType: 'integer', value: 123 }],
    }); // 'NOT 123'
  });

  test('can mint "-" unary expression', () => {
    const node = Builder.expression.func.unary('-', Builder.expression.literal.integer(123));

    expect(node).toMatchObject({
      type: 'function',
      subtype: 'unary-expression',
      name: '-',
      args: [{ type: 'literal', literalType: 'integer', value: 123 }],
    }); // '-123'
  });

  test('can mint a unary postfix expression', () => {
    const node = Builder.expression.func.postfix(
      'is not null',
      Builder.expression.literal.integer(123)
    );

    expect(node).toMatchObject({
      type: 'function',
      subtype: 'postfix-unary-expression',
      name: 'is not null',
      args: [{ type: 'literal', literalType: 'integer', value: 123 }],
    }); // '123 IS NOT NULL'
  });

  test('can mint a function call', () => {
    const node = Builder.expression.func.call('agg', [
      Builder.expression.literal.integer(1),
      Builder.expression.literal.integer(2),
      Builder.expression.literal.integer(3),
    ]);

    expect(node).toMatchObject({
      type: 'function',
      subtype: 'variadic-call',
      name: 'agg',
      args: [
        { type: 'literal', literalType: 'integer', value: 1 },
        { type: 'literal', literalType: 'integer', value: 2 },
        { type: 'literal', literalType: 'integer', value: 3 },
      ],
    }); // 'AGG(1, 2, 3)'
  });
});

describe('source', () => {
  test('basic index', () => {
    const node = Builder.expression.source.node({ index: 'my_index', sourceType: 'index' });
    const text = LeafPrinter.print(node);

    expect(text).toBe('my_index');
  });

  test('basic index using shortcut', () => {
    const node = Builder.expression.source.node('my_index');
    const text = LeafPrinter.print(node);

    expect(text).toBe('my_index');
  });

  test('basic quoted index using shortcut', () => {
    const node = Builder.expression.source.node(Builder.expression.literal.string('my_index'));
    const text = LeafPrinter.print(node);

    expect(text).toBe('"my_index"');
  });

  test('index with cluster', () => {
    const node = Builder.expression.source.node({
      index: 'my_index',
      sourceType: 'index',
      prefix: Builder.expression.literal.string('my_cluster', { unquoted: true }),
    });
    const text = LeafPrinter.print(node);

    expect(text).toBe('my_cluster:my_index');
  });

  test('index with cluster - plain text cluster', () => {
    const node = Builder.expression.source.node({
      index: 'my_index',
      sourceType: 'index',
      prefix: 'my_cluster',
    });
    const text = LeafPrinter.print(node);

    expect(text).toBe('my_cluster:my_index');
  });

  test('policy index', () => {
    const node = Builder.expression.source.node({ index: 'my_policy', sourceType: 'policy' });
    const text = LeafPrinter.print(node);

    expect(text).toBe('my_policy');
  });

  describe('.index', () => {
    test('can use .source.index() shorthand to specify cluster', () => {
      const node = Builder.expression.source.index('my_index', 'my_cluster');
      const text = LeafPrinter.print(node);

      expect(text).toBe('my_cluster:my_index');
    });

    test('can use .source.index() and specify quotes around cluster', () => {
      const node = Builder.expression.source.index(
        'my_index',
        Builder.expression.literal.string('hello 👋')
      );
      const text = LeafPrinter.print(node);

      expect(text).toBe('"hello 👋":my_index');
    });

    test('can use .source.index() shorthand to specify selector', () => {
      const node = Builder.expression.source.index('my_index', '', 'my_selector');
      const text = LeafPrinter.print(node);

      expect(text).toBe('my_index::my_selector');
    });
  });
});

describe('column', () => {
  test('a simple field', () => {
    const node = Builder.expression.column({ args: [Builder.identifier('my_field')] });
    const text = LeafPrinter.print(node);

    expect(text).toBe('my_field');
  });

  test('a simple field using shorthand', () => {
    const node = Builder.expression.column('my_field');
    const text = LeafPrinter.print(node);

    expect(text).toBe('my_field');
  });

  test('a nested field', () => {
    const node = Builder.expression.column({
      args: [Builder.identifier('locale'), Builder.identifier('region')],
    });
    const text = LeafPrinter.print(node);

    expect(text).toBe('locale.region');
  });

  test('a nested field using shortcut', () => {
    const node = Builder.expression.column(['locale', 'region']);
    const text = LeafPrinter.print(node);

    expect(text).toBe('locale.region');
  });

  test('a nested with params using shortcut', () => {
    const node = Builder.expression.column(['locale', '?param', 'region']);
    const text = LeafPrinter.print(node);

    expect(text).toBe('locale.?param.region');
  });
});

describe('literal', () => {
  describe('"time intervals"', () => {
    test('a basic time duration node', () => {
      const node = Builder.expression.literal.timespan(42, 'second');
      const text = LeafPrinter.print(node);

      expect(text).toBe('42 second');
    });

    test('a basic date period node', () => {
      const node = Builder.expression.literal.timespan(42, 'days');
      const text = LeafPrinter.print(node);

      expect(text).toBe('42 days');
    });
  });

  describe('null', () => {
    test('can create a NULL node', () => {
      const node = Builder.expression.literal.nil();
      const text = LeafPrinter.print(node);

      expect(text).toBe('NULL');
      expect(node).toMatchObject({
        type: 'literal',
        literalType: 'null',
      });
    });
  });

  describe('numeric', () => {
    test('integer shorthand', () => {
      const node = Builder.expression.literal.integer(42);

      expect(node).toMatchObject({
        type: 'literal',
        literalType: 'integer',
        name: '42',
        value: 42,
      });
    });

    test('decimal shorthand', () => {
      const node = Builder.expression.literal.decimal(3.14);

      expect(node).toMatchObject({
        type: 'literal',
        literalType: 'double',
        name: '3.14',
        value: 3.14,
      });
    });
  });

  describe('string', () => {
    test('can create a basic string', () => {
      const node = Builder.expression.literal.string('abc');
      const text = LeafPrinter.print(node);

      expect(text).toBe('"abc"');
      expect(node).toMatchObject({
        type: 'literal',
        literalType: 'keyword',
        name: '"abc"',
        value: '"abc"',
        valueUnquoted: 'abc',
      });
    });
  });

  describe('boolean', () => {
    test('TRUE literal', () => {
      const node = Builder.expression.literal.boolean(true);
      const text = LeafPrinter.print(node);

      expect(text).toBe('TRUE');
      expect(node).toMatchObject({
        type: 'literal',
        literalType: 'boolean',
        name: 'true',
        value: 'true',
      });
    });
  });

  describe('lists', () => {
    test('string list', () => {
      const node = Builder.expression.list.literal({
        values: [
          Builder.expression.literal.string('a'),
          Builder.expression.literal.string('b'),
          Builder.expression.literal.string('c'),
        ],
      });

      expect(node).toMatchObject({
        type: 'list',
        values: [
          { type: 'literal', literalType: 'keyword', valueUnquoted: 'a' },
          { type: 'literal', literalType: 'keyword', valueUnquoted: 'b' },
          { type: 'literal', literalType: 'keyword', valueUnquoted: 'c' },
        ],
      }); // '["a", "b", "c"]'
    });

    test('integer list', () => {
      const node = Builder.expression.list.literal({
        values: [
          Builder.expression.literal.integer(1),
          Builder.expression.literal.integer(2),
          Builder.expression.literal.integer(3),
        ],
      });

      expect(node).toMatchObject({
        type: 'list',
        values: [
          { type: 'literal', literalType: 'integer', value: 1 },
          { type: 'literal', literalType: 'integer', value: 2 },
          { type: 'literal', literalType: 'integer', value: 3 },
        ],
      }); // '[1, 2, 3]'
    });

    test('boolean list', () => {
      const node = Builder.expression.list.literal({
        values: [
          Builder.expression.literal.boolean(true),
          Builder.expression.literal.boolean(false),
        ],
      });

      expect(node).toMatchObject({
        type: 'list',
        values: [
          { type: 'literal', literalType: 'boolean', value: 'true' },
          { type: 'literal', literalType: 'boolean', value: 'false' },
        ],
      }); // '[TRUE, FALSE]'
    });
  });
});

describe('identifier', () => {
  test('a single identifier node', () => {
    const node = Builder.identifier('text');
    const text = LeafPrinter.print(node);

    expect(text).toBe('text');
  });
});

describe('param', () => {
  test('unnamed', () => {
    const node = Builder.param.build('?');
    const text = LeafPrinter.print(node);

    expect(text).toBe('?');
    expect(node).toMatchObject({
      type: 'literal',
      paramKind: '?',
      literalType: 'param',
      paramType: 'unnamed',
    });
  });

  test('unnamed (double)', () => {
    const node = Builder.param.build('??');
    const text = LeafPrinter.print(node);

    expect(text).toBe('??');
    expect(node).toMatchObject({
      type: 'literal',
      paramKind: '??',
      literalType: 'param',
      paramType: 'unnamed',
    });
  });

  test('named', () => {
    const node = Builder.param.build('?the_name');
    const text = LeafPrinter.print(node);

    expect(text).toBe('?the_name');
    expect(node).toMatchObject({
      type: 'literal',
      paramKind: '?',
      literalType: 'param',
      paramType: 'named',
      value: 'the_name',
    });
  });

  test('named (double)', () => {
    const node = Builder.param.build('??the_name');
    const text = LeafPrinter.print(node);

    expect(text).toBe('??the_name');
    expect(node).toMatchObject({
      type: 'literal',
      paramKind: '??',
      literalType: 'param',
      paramType: 'named',
      value: 'the_name',
    });
  });

  test('positional', () => {
    const node = Builder.param.build('?123');
    const text = LeafPrinter.print(node);

    expect(text).toBe('?123');
    expect(node).toMatchObject({
      type: 'literal',
      paramKind: '?',
      literalType: 'param',
      paramType: 'positional',
      value: 123,
    });
  });

  test('positional (double)', () => {
    const node = Builder.param.build('??123');
    const text = LeafPrinter.print(node);

    expect(text).toBe('??123');
    expect(node).toMatchObject({
      type: 'literal',
      paramKind: '??',
      literalType: 'param',
      paramType: 'positional',
      value: 123,
    });
  });
});

describe('cast', () => {
  test('cast to integer', () => {
    const node = Builder.expression.inlineCast({
      value: Builder.expression.literal.decimal(123.45),
      castType: 'integer',
    });

    expect(node).toMatchObject({
      type: 'inlineCast',
      castType: 'integer',
      value: {
        type: 'literal',
        literalType: 'double',
        value: 123.45,
      },
    }); // '123.45::INTEGER'
  });
});

describe('order', () => {
  test('field with no modifiers', () => {
    const node = Builder.expression.order(Builder.expression.column('my_field'), {
      nulls: '',
      order: '',
    });

    expect(node).toMatchObject({
      type: 'order',
      nulls: '',
      order: '',
      args: [{ type: 'column', name: 'my_field' }],
    }); // 'my_field'
  });

  test('field with ASC and NULL FIRST modifiers', () => {
    const node = Builder.expression.order(Builder.expression.column(['a', 'b', 'c']), {
      nulls: 'NULLS FIRST',
      order: 'ASC',
    });

    expect(node).toMatchObject({
      type: 'order',
      nulls: 'NULLS FIRST',
      order: 'ASC',
      args: [{ type: 'column', name: 'a.b.c' }],
    }); // 'a.b.c ASC NULLS FIRST'
  });
});

describe('map', () => {
  test('can construct an empty map', () => {
    const node1 = Builder.expression.map();
    const node2 = Builder.expression.map({});
    const node3 = Builder.expression.map({
      entries: [],
    });

    expect(node1).toMatchObject({
      type: 'map',
      entries: [],
    });
    expect(node2).toMatchObject({
      type: 'map',
      entries: [],
    });
    expect(node3).toMatchObject({
      type: 'map',
      entries: [],
    });
  });

  test('can construct a map with two keys', () => {
    const node = Builder.expression.map({
      entries: [
        Builder.expression.entry('foo', Builder.expression.literal.integer(1)),
        Builder.expression.entry('bar', Builder.expression.literal.integer(2)),
      ],
    });

    expect(node).toMatchObject({
      type: 'map',
      entries: [
        {
          type: 'map-entry',
          key: {
            type: 'literal',
            literalType: 'keyword',
            valueUnquoted: 'foo',
          },
          value: {
            type: 'literal',
            literalType: 'integer',
            value: 1,
          },
        },
        {
          type: 'map-entry',
          key: {
            type: 'literal',
            literalType: 'keyword',
            valueUnquoted: 'bar',
          },
          value: {
            type: 'literal',
            literalType: 'integer',
            value: 2,
          },
        },
      ],
    });
  });
});

describe('header', () => {
  describe('.command()', () => {
    test('can create a generic header command', () => {
      const node = Builder.header.command({
        name: 'custom_header',
        args: [Builder.expression.literal.integer(42)],
      });

      expect(node).toMatchObject({
        type: 'header-command',
        name: 'custom_header',
        args: [
          {
            type: 'literal',
            literalType: 'integer',
            value: 42,
          },
        ],
      });
    });

    test('can create a header command with no args', () => {
      const node = Builder.header.command({
        name: 'some_command',
      });

      expect(node).toMatchObject({
        type: 'header-command',
        name: 'some_command',
        args: [],
      });
    });
  });

  describe('.command.set()', () => {
    test('can create a SET command with single assignment', () => {
      const node = Builder.header.command.set([
        Builder.expression.func.binary('=', [
          Builder.identifier('setting1'),
          Builder.expression.literal.string('value1'),
        ]),
      ]);

      expect(node).toMatchObject({
        type: 'header-command',
        name: 'set',
        args: [
          {
            type: 'function',
            name: '=',
            subtype: 'binary-expression',
            args: [
              {
                type: 'identifier',
                name: 'setting1',
              },
              {
                type: 'literal',
                literalType: 'keyword',
                valueUnquoted: 'value1',
              },
            ],
          },
        ],
      });
    });

    test('can create a SET command with multiple assignments', () => {
      const node = Builder.header.command.set([
        Builder.expression.func.binary('=', [
          Builder.identifier('setting1'),
          Builder.expression.literal.string('value1'),
        ]),
        Builder.expression.func.binary('=', [
          Builder.identifier('setting2'),
          Builder.expression.literal.integer(42),
        ]),
      ]);

      expect(node).toMatchObject({
        type: 'header-command',
        name: 'set',
        args: [
          {
            type: 'function',
            name: '=',
            args: [
              {
                type: 'identifier',
                name: 'setting1',
              },
              {
                type: 'literal',
                literalType: 'keyword',
                valueUnquoted: 'value1',
              },
            ],
          },
          {
            type: 'function',
            name: '=',
            args: [
              {
                type: 'identifier',
                name: 'setting2',
              },
              {
                type: 'literal',
                literalType: 'integer',
                value: 42,
              },
            ],
          },
        ],
      });
    });

    test('can create a SET command with integer value', () => {
      const node = Builder.header.command.set([
        Builder.expression.func.binary('=', [
          Builder.identifier('timeout'),
          Builder.expression.literal.integer(30),
        ]),
      ]);

      expect(node).toMatchObject({
        type: 'header-command',
        name: 'set',
        args: [
          {
            type: 'function',
            name: '=',
            args: [
              {
                type: 'identifier',
                name: 'timeout',
              },
              {
                type: 'literal',
                literalType: 'integer',
                value: 30,
              },
            ],
          },
        ],
      });
    });
  });
});

describe('Builder.command.promql', () => {
  const selector = (metric: string, duration?: string) =>
    PromQLBuilder.expression.selector.node({
      metric: PromQLBuilder.identifier(metric),
      duration: duration ? PromQLBuilder.expression.literal.time(duration) : undefined,
    });
  const up = () => PromQLBuilder.expression.query(selector('up'));
  const rate = () =>
    PromQLBuilder.expression.query(
      PromQLBuilder.expression.func.call('rate', [selector('http_requests_total', '5m')])
    );

  test('builds a basic PROMQL command', () => {
    const cmd = Builder.command.promql(up());

    expect(cmd).toMatchObject({
      type: 'command',
      name: 'promql',
      args: [
        {
          type: 'parens',
          child: {
            dialect: 'promql',
            type: 'query',
            expression: { type: 'selector', name: 'up' },
          },
        },
      ],
    }); // 'PROMQL (up)'
  });

  test('builds with a single param', () => {
    const cmd = Builder.command.promql(up(), { index: 'k8s' });

    expect(cmd).toMatchObject({
      type: 'command',
      name: 'promql',
      args: [
        {
          type: 'map',
          representation: 'assignment',
          entries: [
            {
              type: 'map-entry',
              key: { type: 'identifier', name: 'index' },
              value: {
                type: 'literal',
                literalType: 'keyword',
                valueUnquoted: 'k8s',
                unquoted: true,
              },
            },
          ],
        },
        {
          type: 'parens',
          child: { type: 'query', expression: { type: 'selector', name: 'up' } },
        },
      ],
    }); // 'PROMQL index = k8s (up)'
  });

  test('builds with multiple params, keeping time-duration values unquoted', () => {
    const cmd = Builder.command.promql(up(), { index: 'k8s', timeout: '10s' });

    expect(cmd).toMatchObject({
      type: 'command',
      name: 'promql',
      args: [
        {
          type: 'map',
          representation: 'assignment',
          entries: [
            {
              type: 'map-entry',
              key: { type: 'identifier', name: 'index' },
              value: {
                type: 'literal',
                literalType: 'keyword',
                valueUnquoted: 'k8s',
                unquoted: true,
              },
            },
            {
              type: 'map-entry',
              key: { type: 'identifier', name: 'timeout' },
              value: {
                type: 'literal',
                literalType: 'keyword',
                valueUnquoted: '10s',
                unquoted: true,
              },
            },
          ],
        },
        {
          type: 'parens',
          child: { type: 'query', expression: { type: 'selector', name: 'up' } },
        },
      ],
    }); // 'PROMQL index = k8s timeout = 10s (up)'
  });

  test('builds with outputName', () => {
    const cmd = Builder.command.promql(up(), undefined, 'health');

    expect(cmd).toMatchObject({
      type: 'command',
      name: 'promql',
      args: [
        {
          type: 'function',
          subtype: 'binary-expression',
          name: '=',
          args: [
            { type: 'identifier', name: 'health' },
            {
              type: 'parens',
              child: { type: 'query', expression: { type: 'selector', name: 'up' } },
            },
          ],
        },
      ],
    }); // 'PROMQL health = (up)'
  });

  test('builds with params and outputName', () => {
    const cmd = Builder.command.promql(rate(), { index: 'k8s' }, 'result');

    expect(cmd).toMatchObject({
      type: 'command',
      name: 'promql',
      args: [
        {
          type: 'map',
          representation: 'assignment',
          entries: [
            {
              type: 'map-entry',
              key: { type: 'identifier', name: 'index' },
              value: {
                type: 'literal',
                literalType: 'keyword',
                valueUnquoted: 'k8s',
                unquoted: true,
              },
            },
          ],
        },
        {
          type: 'function',
          subtype: 'binary-expression',
          name: '=',
          args: [
            { type: 'identifier', name: 'result' },
            {
              type: 'parens',
              child: {
                type: 'query',
                expression: {
                  type: 'function',
                  name: 'rate',
                  args: [
                    {
                      type: 'selector',
                      name: 'http_requests_total',
                      duration: { type: 'literal', literalType: 'time', value: '5m' },
                    },
                  ],
                },
              },
            },
          ],
        },
      ],
    }); // 'PROMQL index = k8s result = (rate(http_requests_total[5m]))'
  });

  test('accepts a pqlSel expression and wraps it in a query node', () => {
    const cmd = Builder.command.promql(selector('http_requests_total', '5m'));

    expect(cmd).toMatchObject({
      type: 'command',
      name: 'promql',
      args: [
        {
          type: 'parens',
          child: {
            dialect: 'promql',
            type: 'query',
            expression: {
              type: 'selector',
              name: 'http_requests_total',
              duration: { type: 'literal', literalType: 'time', value: '5m' },
            },
          },
        },
      ],
    }); // 'PROMQL (http_requests_total[5m])'
  });

  test('sets type and name on the returned node', () => {
    const cmd = Builder.command.promql(up());

    expect(cmd.type).toBe('command');
    expect(cmd.name).toBe('promql');
  });

  test('sets cmd.params and cmd.query convenience properties', () => {
    const cmd = Builder.command.promql(up(), { index: 'k8s' }, 'health');

    expect(cmd.params?.type).toBe('map');
    expect(cmd.query).toBeDefined();
  });
});
