/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { PromQLBuilder } from '@elastic/esql-ast';
import { findNodeAtOrAfter, findNodeAtOrBefore } from '../find_node';

const { expression: expr } = PromQLBuilder;

/**
 * Builds a locator over `src` that returns the parser fields for the first
 * occurrence of a snippet, so fixtures carry the same offsets the PromQL parser
 * would mint for that source. `location.max` is inclusive.
 */
const locator = (src: string) => (text: string) => {
  const min = src.indexOf(text);

  if (min < 0) {
    throw new Error(`Snippet "${text}" not found in "${src}".`);
  }

  return { location: { min, max: min + text.length - 1 } };
};

/** `up` */
const plainSelector = () => {
  const at = locator('up');

  return expr.query(
    expr.selector.node({ metric: PromQLBuilder.identifier('up', at('up')) }, at('up')),
    at('up')
  );
};

/** `a + b` */
const binaryExpression = () => {
  const at = locator('a + b');
  const operand = (name: string) =>
    expr.selector.node({ metric: PromQLBuilder.identifier(name, at(name)) }, at(name));

  return expr.query(
    expr.binary('+', operand('a'), operand('b'), undefined, at('a + b')),
    at('a + b')
  );
};

/** `rate(x[5m])` */
const functionCall = () => {
  const at = locator('rate(x[5m])');
  const selector = expr.selector.node(
    {
      metric: PromQLBuilder.identifier('x', at('x')),
      duration: expr.literal.time('5m', at('5m')),
    },
    at('x[5m]')
  );

  return expr.query(
    expr.func.call('rate', [selector], undefined, undefined, at('rate(x[5m])')),
    at('rate(x[5m])')
  );
};

/** `(a + b)` */
const parenthesized = () => {
  const at = locator('(a + b)');
  const operand = (name: string) =>
    expr.selector.node({ metric: PromQLBuilder.identifier(name, at(name)) }, at(name));

  return expr.query(
    expr.parens(
      expr.binary('+', operand('a'), operand('b'), undefined, at('a + b')),
      at('(a + b)')
    ),
    at('(a + b)')
  );
};

/** `a offset 5m` */
const withOffset = () => {
  const at = locator('a offset 5m');
  const evaluation = PromQLBuilder.evaluation(
    PromQLBuilder.offset(expr.literal.time('5m', at('5m')), false, at('offset 5m')),
    undefined,
    at('offset 5m')
  );

  return expr.query(
    expr.selector.node(
      { metric: PromQLBuilder.identifier('a', at('a')), evaluation },
      at('a offset 5m')
    ),
    at('a offset 5m')
  );
};

describe('findNodeAtOrAfter', () => {
  describe('plain selector', () => {
    const ast = plainSelector();

    it('returns the deepest node at the start of the source', () => {
      const node = findNodeAtOrAfter(ast, 0);

      expect(node?.type).toBe('identifier');
      expect(node?.name).toBe('up');
    });

    it('returns the deepest node containing pos', () => {
      const node = findNodeAtOrAfter(ast, 1);

      expect(node?.type).toBe('identifier');
      expect(node?.name).toBe('up');
    });

    it('returns null when pos is past the end of the tree', () => {
      expect(findNodeAtOrAfter(ast, 2)).toBeNull();
      expect(findNodeAtOrAfter(ast, 100)).toBeNull();
    });
  });

  describe('binary expression', () => {
    const ast = binaryExpression();

    it('finds left operand when pos is on left', () => {
      const node = findNodeAtOrAfter(ast, 0);

      expect(node?.type).toBe('identifier');
      expect(node?.name).toBe('a');
    });

    it('finds right operand selector when pos is between operands', () => {
      const node = findNodeAtOrAfter(ast, 2);

      expect(node?.type).toBe('selector');
      expect(node?.name).toBe('b');
    });

    it('finds right operand selector when pos is right before it', () => {
      const node = findNodeAtOrAfter(ast, 3);

      expect(node?.type).toBe('selector');
      expect(node?.name).toBe('b');
    });

    it('descends to identifier b at its exact position', () => {
      const node = findNodeAtOrAfter(ast, 4);

      expect(node?.type).toBe('identifier');
      expect(node?.name).toBe('b');
    });

    it('returns null past the end', () => {
      expect(findNodeAtOrAfter(ast, 5)).toBeNull();
    });
  });

  describe('nested function call', () => {
    const ast = functionCall();

    it('descends to the deepest node containing pos', () => {
      const node = findNodeAtOrAfter(ast, 5);

      expect(node?.type).toBe('identifier');
      expect(node?.name).toBe('x');
    });

    it('finds the duration literal', () => {
      const node = findNodeAtOrAfter(ast, 7);

      expect(node?.type).toBe('literal');
      expect(node?.name).toBe('5m');
    });

    it('returns the outermost child selector when pos is at function start', () => {
      const node = findNodeAtOrAfter(ast, 0);

      expect(node?.type).toBe('selector');
      expect(node?.name).toBe('x');
    });
  });

  describe('parens', () => {
    const ast = parenthesized();

    it('descends through parens to find a', () => {
      const node = findNodeAtOrAfter(ast, 1);

      expect(node?.type).toBe('identifier');
      expect(node?.name).toBe('a');
    });

    it('descends through parens to find b', () => {
      const node = findNodeAtOrAfter(ast, 5);

      expect(node?.type).toBe('identifier');
      expect(node?.name).toBe('b');
    });
  });
});

describe('findNodeAtOrBefore', () => {
  describe('plain selector', () => {
    const ast = plainSelector();

    it('returns the deepest node at the end of the source', () => {
      const node = findNodeAtOrBefore(ast, 1);

      expect(node?.type).toBe('identifier');
      expect(node?.name).toBe('up');
    });

    it('returns the outermost preceding node when pos is past the end', () => {
      const node = findNodeAtOrBefore(ast, 5);

      expect(node?.type).toBe('selector');
      expect(node?.name).toBe('up');
    });

    it('returns null when pos is before the start of the tree', () => {
      expect(findNodeAtOrBefore(ast, -1)).toBeNull();
    });
  });

  describe('binary expression', () => {
    const ast = binaryExpression();

    it('finds left operand when pos is on left', () => {
      const node = findNodeAtOrBefore(ast, 0);

      expect(node?.type).toBe('identifier');
      expect(node?.name).toBe('a');
    });

    it('finds left operand selector when pos is between operands', () => {
      const node = findNodeAtOrBefore(ast, 2);

      expect(node?.type).toBe('selector');
      expect(node?.name).toBe('a');
    });

    it('finds left operand selector when pos is right before right operand', () => {
      const node = findNodeAtOrBefore(ast, 3);

      expect(node?.type).toBe('selector');
      expect(node?.name).toBe('a');
    });

    it('descends to identifier b when pos is on it', () => {
      const node = findNodeAtOrBefore(ast, 4);

      expect(node?.type).toBe('identifier');
      expect(node?.name).toBe('b');
    });

    it('returns the binary expression when pos is past every child', () => {
      const node = findNodeAtOrBefore(ast, 10);

      expect(node?.type).toBe('binary-expression');
    });
  });

  describe('nested function call', () => {
    const ast = functionCall();

    it('descends to ident x at its position', () => {
      const node = findNodeAtOrBefore(ast, 5);

      expect(node?.type).toBe('identifier');
      expect(node?.name).toBe('x');
    });

    it('descends to literal 5m', () => {
      const node = findNodeAtOrBefore(ast, 8);

      expect(node?.type).toBe('literal');
      expect(node?.name).toBe('5m');
    });

    it('returns the function when pos is past the function end', () => {
      const node = findNodeAtOrBefore(ast, 11);

      expect(node?.type).toBe('function');
      expect(node?.name).toBe('rate');
    });
  });

  describe('offset', () => {
    const ast = withOffset();

    it('finds the deep offset duration literal', () => {
      const node = findNodeAtOrBefore(ast, 10);

      expect(node?.type).toBe('literal');
      expect(node?.name).toBe('5m');
    });
  });
});
