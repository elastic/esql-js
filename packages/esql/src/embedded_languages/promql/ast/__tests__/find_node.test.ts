/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { PromQLParser } from '../../parser/parser';
import { findNodeAtOrAfter, findNodeAtOrBefore } from '../find_node';

const parse = (src: string) => PromQLParser.parse(src).root;

describe('findNodeAtOrAfter', () => {
  describe('plain selector', () => {
    const ast = parse('up');

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
    const ast = parse('a + b');

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
    const ast = parse('rate(x[5m])');

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
    const ast = parse('(a + b)');

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
    const ast = parse('up');

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
    const ast = parse('a + b');

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
    const ast = parse('rate(x[5m])');

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
    const ast = parse('a offset 5m');

    it('finds the deep offset duration literal', () => {
      const node = findNodeAtOrBefore(ast, 10);

      expect(node?.type).toBe('literal');
      expect(node?.name).toBe('5m');
    });
  });
});
