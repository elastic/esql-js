/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { PromqlWalker } from '../walker';
import {
  binary,
  func,
  grouping,
  groupModifier,
  id,
  label,
  labelMap,
  modifier,
  query,
  sel,
  str,
  time,
} from './helpers';
import type { PromQLIdentifier, PromQLSelector } from '@elastic/esql-types';

describe('PromQL walker traversal order', () => {
  describe('selector args', () => {
    // metric{a="1", b="2", c="3"}
    const tree = () =>
      query(
        sel('metric', {
          labelMap: labelMap([
            label('a', '=', str('1')),
            label('b', '=', str('2')),
            label('c', '=', str('3')),
          ]),
        })
      );

    test('by default walks in "forward" order', () => {
      const identifiers: string[] = [];

      PromqlWalker.walk(tree(), {
        visitPromqlIdentifier: (node) => identifiers.push(node.name),
      });

      // First identifier is the metric name, then label names
      expect(identifiers).toStrictEqual(['metric', 'a', 'b', 'c']);
    });

    test('can explicitly specify "forward" order', () => {
      const identifiers: string[] = [];

      PromqlWalker.walk(tree(), {
        visitPromqlIdentifier: (node) => identifiers.push(node.name),
        order: 'forward',
      });

      expect(identifiers).toStrictEqual(['metric', 'a', 'b', 'c']);
    });

    test('can walk in "backward" order', () => {
      const identifiers: string[] = [];

      PromqlWalker.walk(tree(), {
        visitPromqlIdentifier: (node) => identifiers.push(node.name),
        order: 'backward',
      });

      expect(identifiers).toStrictEqual(['c', 'b', 'a', 'metric']);
    });
  });

  describe('function arguments', () => {
    // label_join(metric, "dst", ",", "a", "b")
    const tree = () =>
      query(func('label_join', [sel('metric'), str('dst'), str(','), str('a'), str('b')]));

    test('in "forward" order', () => {
      const literals: Array<string | number> = [];

      PromqlWalker.walk(tree(), {
        visitPromqlLiteral: (node) => {
          if (node.literalType === 'string' || node.literalType === 'integer') {
            literals.push(node.value as string | number);
          }
        },
        order: 'forward',
      });

      expect(literals).toStrictEqual(['"dst"', '","', '"a"', '"b"']);
    });

    test('in "backward" order', () => {
      const literals: Array<string | number> = [];

      PromqlWalker.walk(tree(), {
        visitPromqlLiteral: (node) => {
          if (node.literalType === 'string' || node.literalType === 'integer') {
            literals.push(node.value as string | number);
          }
        },
        order: 'backward',
      });

      expect(literals).toStrictEqual(['"b"', '"a"', '","', '"dst"']);
    });
  });

  describe('binary expression operands', () => {
    const collectMetricNames = (selectors: string[]) => (node: PromQLSelector) => {
      // Get metric name from args
      const metricId = node.args.find((arg) => arg.type === 'identifier') as
        | PromQLIdentifier
        | undefined;
      if (metricId) {
        selectors.push(metricId.name);
      }
    };

    test('in "forward" order', () => {
      const selectors: string[] = [];

      PromqlWalker.walk(query(binary('+', sel('a'), sel('b'))), {
        visitPromqlSelector: collectMetricNames(selectors),
        order: 'forward',
      });

      expect(selectors).toStrictEqual(['a', 'b']);
    });

    test('in "backward" order', () => {
      const selectors: string[] = [];

      PromqlWalker.walk(query(binary('+', sel('a'), sel('b'))), {
        visitPromqlSelector: collectMetricNames(selectors),
        order: 'backward',
      });

      expect(selectors).toStrictEqual(['b', 'a']);
    });

    // Mirrors `a + b * c`, which parses as `a + (b * c)` by precedence.
    const nested = () => query(binary('+', sel('a'), binary('*', sel('b'), sel('c'))));

    test('complex binary expression in "forward" order', () => {
      const selectors: string[] = [];

      PromqlWalker.walk(nested(), {
        visitPromqlSelector: collectMetricNames(selectors),
        order: 'forward',
      });

      expect(selectors).toStrictEqual(['a', 'b', 'c']);
    });

    test('complex binary expression in "backward" order', () => {
      const selectors: string[] = [];

      PromqlWalker.walk(nested(), {
        visitPromqlSelector: collectMetricNames(selectors),
        order: 'backward',
      });

      expect(selectors).toStrictEqual(['c', 'b', 'a']);
    });
  });

  describe('label map labels', () => {
    // metric{x="1", y="2", z="3"}
    const tree = () =>
      query(
        sel('metric', {
          labelMap: labelMap([
            label('x', '=', str('1')),
            label('y', '=', str('2')),
            label('z', '=', str('3')),
          ]),
        })
      );

    test('in "forward" order', () => {
      const labelNames: string[] = [];

      PromqlWalker.walk(tree(), {
        visitPromqlLabel: (node) => {
          if (node.labelName.type === 'identifier') {
            labelNames.push(node.labelName.name);
          }
        },
        order: 'forward',
      });

      expect(labelNames).toStrictEqual(['x', 'y', 'z']);
    });

    test('in "backward" order', () => {
      const labelNames: string[] = [];

      PromqlWalker.walk(tree(), {
        visitPromqlLabel: (node) => {
          if (node.labelName.type === 'identifier') {
            labelNames.push(node.labelName.name);
          }
        },
        order: 'backward',
      });

      expect(labelNames).toStrictEqual(['z', 'y', 'x']);
    });
  });

  describe('grouping labels', () => {
    // sum by (a, b, c) (metric)
    const tree = () =>
      query(func('sum', [sel('metric')], grouping('by', [id('a'), id('b'), id('c')]), 'before'));

    test('in "forward" order', () => {
      const identifiers: string[] = [];

      PromqlWalker.walk(tree(), {
        visitPromqlGrouping: () => {
          // Skip the grouping node itself, we want its children
        },
        visitPromqlIdentifier: (node, parent) => {
          // Only collect identifiers that are part of grouping
          if (parent && parent.type === 'grouping') {
            identifiers.push(node.name);
          }
        },
        order: 'forward',
      });

      expect(identifiers).toStrictEqual(['a', 'b', 'c']);
    });

    test('in "backward" order', () => {
      const identifiers: string[] = [];

      PromqlWalker.walk(tree(), {
        visitPromqlGrouping: () => {
          // Skip the grouping node itself, we want its children
        },
        visitPromqlIdentifier: (node, parent) => {
          if (parent && parent.type === 'grouping') {
            identifiers.push(node.name);
          }
        },
        order: 'backward',
      });

      expect(identifiers).toStrictEqual(['c', 'b', 'a']);
    });
  });

  describe('label key-value pairs', () => {
    // metric{job="api"}
    const tree = () =>
      query(sel('metric', { labelMap: labelMap([label('job', '=', str('api'))]) }));

    test('in "forward" order walks key before value', () => {
      const nodes: string[] = [];

      PromqlWalker.walk(tree(), {
        visitPromqlIdentifier: (node) => nodes.push(`id:${node.name}`),
        visitPromqlLiteral: (node) => {
          if (node.literalType === 'string') {
            nodes.push(`lit:${node.value}`);
          }
        },
        order: 'forward',
      });

      // metric (identifier), job (identifier), "api" (literal)
      expect(nodes).toStrictEqual(['id:metric', 'id:job', 'lit:"api"']);
    });

    test('in "backward" order walks value before key', () => {
      const nodes: string[] = [];

      PromqlWalker.walk(tree(), {
        visitPromqlIdentifier: (node) => nodes.push(`id:${node.name}`),
        visitPromqlLiteral: (node) => {
          if (node.literalType === 'string') {
            nodes.push(`lit:${node.value}`);
          }
        },
        order: 'backward',
      });

      // Backward: "api" (literal), job (identifier), metric (identifier)
      expect(nodes).toStrictEqual(['lit:"api"', 'id:job', 'id:metric']);
    });
  });

  describe('nested functions', () => {
    // sum(rate(metric[5m]))
    const tree = () =>
      query(func('sum', [func('rate', [sel('metric', { duration: time('5m') })])]));

    test('in "forward" order', () => {
      const functions: string[] = [];

      PromqlWalker.walk(tree(), {
        visitPromqlFunction: (node) => functions.push(node.name),
        order: 'forward',
      });

      expect(functions).toStrictEqual(['sum', 'rate']);
    });

    test('in "backward" order', () => {
      const functions: string[] = [];

      PromqlWalker.walk(tree(), {
        visitPromqlFunction: (node) => functions.push(node.name),
        order: 'backward',
      });

      // Functions are visited in the same order because we visit parent before children
      // The order option affects the order of children, not parent-child relationship
      expect(functions).toStrictEqual(['sum', 'rate']);
    });
  });

  describe('function with grouping', () => {
    // sum by (job) (metric)
    const tree = () => query(func('sum', [sel('metric')], grouping('by', [id('job')]), 'before'));

    test('in "forward" order walks grouping before args', () => {
      const nodeTypes: string[] = [];

      PromqlWalker.walk(tree(), {
        visitPromqlGrouping: () => nodeTypes.push('grouping'),
        visitPromqlSelector: () => nodeTypes.push('selector'),
        order: 'forward',
      });

      expect(nodeTypes).toStrictEqual(['grouping', 'selector']);
    });

    test('in "backward" order walks args before grouping', () => {
      const nodeTypes: string[] = [];

      PromqlWalker.walk(tree(), {
        visitPromqlGrouping: () => nodeTypes.push('grouping'),
        visitPromqlSelector: () => nodeTypes.push('selector'),
        order: 'backward',
      });

      expect(nodeTypes).toStrictEqual(['selector', 'grouping']);
    });
  });

  describe('modifier with group modifier', () => {
    test('in "forward" order walks labels before group_modifier', () => {
      // a + on(job) group_left(instance) b
      const tree = query(
        binary('+', sel('a'), sel('b'), {
          modifier: modifier('on', [id('job')], groupModifier('group_left', [id('instance')])),
        })
      );
      const nodeTypes: string[] = [];

      PromqlWalker.walk(tree, {
        visitPromqlModifier: () => nodeTypes.push('modifier'),
        visitPromqlGroupModifier: () => nodeTypes.push('group-modifier'),
        visitPromqlIdentifier: (node, parent) => {
          if (parent && parent.type === 'modifier') {
            nodeTypes.push(`label:${node.name}`);
          }
        },
        order: 'forward',
      });

      // modifier is visited, then its labels (job), then group_modifier
      expect(nodeTypes).toStrictEqual(['modifier', 'label:job', 'group-modifier']);
    });
  });
});
