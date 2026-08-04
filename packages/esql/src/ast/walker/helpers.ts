/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type {
  PromQLAstNode,
  ESQLAstCommand,
  ESQLAstQueryExpression,
  ESQLColumn,
  ESQLCommandOption,
  ESQLFunction,
  ESQLIdentifier,
  ESQLInlineCast,
  ESQLList,
  ESQLLiteral,
  ESQLOrderExpression,
  ESQLProperNode,
  ESQLSource,
  ESQLUnknownItem,
} from '@elastic/esql-types';

/**
 * Any single proper AST node the walker can visit, regardless of dialect.
 */
export type WalkerProperNode = ESQLProperNode | PromQLAstNode;

type KeysOfUnion<T> = T extends unknown ? keyof T : never;

export type NodeMatchKeys =
  | keyof ESQLAstCommand
  | keyof ESQLAstQueryExpression
  | keyof ESQLFunction
  | keyof ESQLCommandOption
  | keyof ESQLSource
  | keyof ESQLColumn
  | keyof ESQLList
  | keyof ESQLLiteral
  | keyof ESQLIdentifier
  | keyof ESQLInlineCast
  | keyof ESQLOrderExpression
  | keyof ESQLUnknownItem
  | KeysOfUnion<PromQLAstNode>;

export type NodeMatchTemplateKey<V> = V | V[] | RegExp;

export type NodeMatchTemplate = {
  [K in NodeMatchKeys]?: K extends keyof WalkerProperNode
    ? NodeMatchTemplateKey<WalkerProperNode[K]>
    : NodeMatchTemplateKey<unknown>;
};

/**
 * Creates a predicate function which matches a single AST node against a
 * template object. The template object should have the same keys as the
 * AST node, and the values should be:
 *
 * - An array matches if the node key is in the array.
 * - A RegExp matches if the node key matches the RegExp.
 * - Any other value matches if the node key is triple-equal to the value.
 *
 * @param template Template from which to create a predicate function.
 * @returns A predicate function that matches nodes against the template.
 */
export const templateToPredicate = (
  template: NodeMatchTemplate
): ((node: WalkerProperNode) => boolean) => {
  const keys = Object.keys(template) as NodeMatchKeys[];
  const predicate = (node: WalkerProperNode) => {
    const record = node as unknown as Record<string, unknown>;
    for (const key of keys) {
      const matcher = template[key];
      if (matcher instanceof Array) {
        if (!(matcher as unknown[]).includes(record[key])) {
          return false;
        }
      } else if (matcher instanceof RegExp) {
        if (!matcher.test(String(record[key]))) {
          return false;
        }
      } else if (record[key] !== matcher) {
        return false;
      }
    }

    return true;
  };

  return predicate;
};

export const replaceProperties = (obj: object, replacement: object) => {
  for (const key in obj) {
    if (typeof key === 'string' && Object.prototype.hasOwnProperty.call(obj, key))
      delete (obj as Record<string, unknown>)[key];
  }
  Object.assign(obj, replacement);
};

export const isPromqlNode = (node: unknown): node is PromQLAstNode => {
  return (
    typeof node === 'object' &&
    node !== null &&
    'dialect' in node &&
    (node as { dialect: unknown }).dialect === 'promql'
  );
};
