/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { isPromqlNode } from '@elastic/esql-ast';
import type { PromQLAstNode } from '@elastic/esql-types';
import type {
  ESQLAstExpression,
  ESQLAstHeaderCommand,
  ESQLCommand,
  ESQLProperNode,
} from '@elastic/esql-types';
import { singleItems } from './utils';
import { childrenOfPromqlNode } from '../promql/children';

export function* children(
  node: ESQLProperNode
): Iterable<ESQLAstExpression | ESQLCommand | ESQLAstHeaderCommand> {
  switch (node.type) {
    case 'function':
    case 'command':
    case 'header-command':
    case 'order':
    case 'option': {
      yield* singleItems(node.args);
      break;
    }
    case 'list': {
      yield* singleItems(node.values);
      break;
    }
    case 'map': {
      yield* node.entries;
      break;
    }
    case 'map-entry': {
      yield node.key;
      yield node.value;
      break;
    }
    case 'inlineCast': {
      if (Array.isArray(node.value)) {
        yield* singleItems(node.value);
      } else {
        yield node.value;
      }
      break;
    }
    case 'parens': {
      yield node.child;
      break;
    }
  }
}

export function* childrenOfAnyNode(
  node: ESQLProperNode | PromQLAstNode
): Iterable<ESQLAstExpression | ESQLCommand | ESQLAstHeaderCommand | PromQLAstNode> {
  if (isPromqlNode(node)) {
    yield* childrenOfPromqlNode(node);
    return;
  }

  if ('args' in node && Array.isArray(node.args)) {
    yield* singleItems(node.args);
    return;
  }

  switch (node.type) {
    case 'query': {
      if (node.header) {
        yield* node.header;
      }
      yield* node.commands;
      break;
    }
    case 'source': {
      if (node.prefix) {
        yield node.prefix;
      }
      if (node.index) {
        yield node.index;
      }
      if (node.selector) {
        yield node.selector;
      }
      break;
    }
    default: {
      yield* children(node);
      break;
    }
  }
}
