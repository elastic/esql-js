/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { printTree } from 'tree-dump';
import type { Doc, AnyNode } from './types';

/**
 * Returns the child nodes of a node.
 */
const children = (node: AnyNode): Array<[string, Doc]> => {
  switch (node.type) {
    case 'group': {
      const children: Array<[string, Doc]> = [['contents', node.contents]];
      if (node.expandedStates) {
        for (let i = 0; i < node.expandedStates.length; i++) {
          children.push([`expandedStates[${i}]`, node.expandedStates[i]]);
        }
      }
      return children;
    }
    case 'fill':
      return node.parts.map((part, i) => [`parts[${i}]`, part]);
    case 'indent':
    case 'label':
    case 'line-suffix':
      return [['contents', node.contents]];
    case 'indent-if-break':
      return [['contents', node.contents]];
    case 'align':
      return [['contents', node.contents]];
    case 'if-break': {
      const children: Array<[string, Doc]> = [];
      children.push(['breakContents', node.breakContents]);
      children.push(['flatContents', node.flatContents]);
      return children;
    }
    default:
      return [];
  }
};

/**
 * Formats inline details for a node (flags, attributes other than children).
 */
const nodeDetails = (node: AnyNode): string => {
  switch (node.type) {
    case 'group': {
      const parts: string[] = [];
      if (node.shouldBreak) parts.push('shouldBreak');
      if (node.id) parts.push(`id=<symbol>`);
      return parts.length ? ` (${parts.join(', ')})` : '';
    }
    case 'line': {
      const flags: string[] = [];
      if (node.soft) flags.push('soft');
      if (node.hard) flags.push('hard');
      if (node.literal) flags.push('literal');
      return flags.length ? ` (${flags.join(', ')})` : '';
    }
    case 'align': {
      const n = typeof node.n === 'object' ? 'root' : String(node.n);
      return ` (n=${n})`;
    }
    case 'indent-if-break': {
      const parts: string[] = [];
      if (node.negate) parts.push('negate');
      return parts.length ? ` (${parts.join(', ')})` : '';
    }
    case 'label':
      return ` (label = ${JSON.stringify(node.label)})`;
    default:
      return '';
  }
};

/**
 * Prints a pretty-printer {@link Doc} tree in human-readable form for debugging
 * purposes.
 *
 * @param tree - The root document to dump.
 * @param tab - Starting tab string for indentation (used internally for recursion).
 * @returns A string representation of the tree.
 */
export const dump = (tree: Doc, tab: string = ''): string => {
  if (typeof tree === 'string') {
    return `text ${JSON.stringify(tree)}`;
  }

  if (Array.isArray(tree)) {
    return (
      '[]' +
      printTree(
        tab,
        tree.map((child) => (nextTab: string) => dump(child, nextTab))
      )
    );
  }

  const childrenTree: Array<(tab: string) => string> = children(tree).map(
    ([lbl, child]) =>
      (nextTab: string) =>
        `${lbl}: ${dump(child, nextTab)}`
  );
  const header = tree.type + nodeDetails(tree);

  return header + printTree(tab, childrenTree);
};
