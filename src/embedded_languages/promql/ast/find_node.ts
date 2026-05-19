/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { PromQLAstNode, PromQLAstQueryExpression } from '../types';
import { childrenOfPromqlNode } from './traversal';

/**
 * Extra fool-proofing to make sure the nodes are always sorted by their location.
 */
const sortedLocatedChildren = (node: PromQLAstNode): PromQLAstNode[] => {
  const children: PromQLAstNode[] = [];

  for (const child of childrenOfPromqlNode(node)) {
    if (child.location) children.push(child);
  }

  children.sort((a, b) => a.location.min - b.location.min);

  return children;
};

const findForward = (node: PromQLAstNode, pos: number): PromQLAstNode | null => {
  for (const child of sortedLocatedChildren(node)) {
    const { min, max } = child.location;

    if (min <= pos && max >= pos) {
      return findForward(child, pos) ?? child;
    }

    if (min > pos) {
      return child;
    }
  }

  return null;
};

const findBackward = (node: PromQLAstNode, pos: number): PromQLAstNode | null => {
  const children = sortedLocatedChildren(node);

  for (let i = children.length - 1; i >= 0; i--) {
    const child = children[i];
    const { min, max } = child.location;

    if (min <= pos && max >= pos) {
      return findBackward(child, pos) ?? child;
    }

    if (max < pos) {
      return child;
    }
  }

  return null;
};

/**
 * Finds the deepest PromQL AST node at or after the given character position.
 *
 * - If `pos` falls inside a node, descends into that node looking for the most
 * specific descendant containing `pos`.
 * - If no node contains `pos`, returns the first node whose `location.min` is
 * greater than `pos`.
 * - Returns `null` if no such node exists (i.e. `pos` is past the end of the
 * tree).
 */
export const findNodeAtOrAfter = (
  ast: PromQLAstQueryExpression,
  pos: number
): PromQLAstNode | null => findForward(ast, pos);

/**
 * Finds the deepest PromQL AST node at or before the given character position.
 *
 * - If `pos` falls inside a node, descends into that node looking for the most
 * specific descendant containing `pos`.
 * - If no node contains `pos`, returns the last node whose `location.max` is
 * less than `pos`.
 * - Returns `null` if no such node exists (i.e. `pos` is before the start of
 * the tree).
 */
export const findNodeAtOrBefore = (
  ast: PromQLAstQueryExpression,
  pos: number
): PromQLAstNode | null => findBackward(ast, pos);
