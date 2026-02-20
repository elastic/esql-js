/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { isPromqlNode } from './is';
import type { PromQLAstNode } from '../types';

export function* childrenOfPromqlNode(node: PromQLAstNode): Iterable<PromQLAstNode> {
  if (!isPromqlNode(node)) {
    return;
  }

  switch (node.type) {
    case 'query': {
      if (node.expression) {
        yield node.expression;
      }
      return;
    }
    case 'function': {
      if (node.grouping) {
        yield node.grouping;
      }
      yield* node.args;
      return;
    }
    case 'selector': {
      yield* node.args;
      return;
    }
    case 'label': {
      const { labelName, value } = node;
      if (labelName) yield labelName;
      if (value) yield value;
      return;
    }
  }

  if ('args' in node && Array.isArray(node.args)) {
    yield* node.args;
    return;
  }
}
