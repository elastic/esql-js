/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { ESQLAstExpression, ESQLAstItem, ESQLSingleAstItem } from '@elastic/esql-types';

/**
 * Normalizes AST "item" list to only contain *single* items.
 *
 * @deprecated The AST no longer contains array-boxed nodes — iterate the list
 *     directly. Kept (runtime-tolerant of legacy boxed input) for one major
 *     release cycle.
 * @param items A list of single or nested items.
 */
export function* singleItems(
  items: Iterable<ESQLAstItem | ESQLAstExpression>
): Iterable<ESQLAstExpression> {
  for (const item of items) {
    if (Array.isArray(item)) {
      yield* singleItems(item);
    } else {
      yield item;
    }
  }
}

/**
 * Returns the first normalized "single item" from the "item" list.
 *
 * @deprecated The AST no longer contains array-boxed nodes — use `items[0]`
 *     directly. Kept (runtime-tolerant of legacy boxed input) for one major
 *     release cycle.
 * @param items Returns the first "single item" from the "item" list.
 * @returns A "single item", if any.
 */
export const firstItem = (items: ESQLAstItem[]): ESQLAstExpression | undefined => {
  for (const item of singleItems(items)) {
    return item;
  }
};

/**
 * @deprecated The AST no longer contains array-boxed nodes — use the item
 *     directly. Kept (runtime-tolerant of legacy boxed input) for one major
 *     release cycle.
 */
export const resolveItem = (items: ESQLAstItem | ESQLAstItem[]): ESQLSingleAstItem => {
  return Array.isArray(items) ? resolveItem(items[0]) : items;
};

/**
 * Returns the last normalized "single item" from the "item" list.
 *
 * @deprecated The AST no longer contains array-boxed nodes — use
 *     `items.at(-1)` directly. Kept (runtime-tolerant of legacy boxed input)
 *     for one major release cycle.
 * @param items Returns the last "single item" from the "item" list.
 * @returns A "single item", if any.
 */
export const lastItem = (items: ESQLAstItem[]): ESQLSingleAstItem | undefined => {
  const last = items[items.length - 1];
  if (!last) return undefined;
  if (Array.isArray(last)) return lastItem(last as ESQLAstItem[]);
  return last as ESQLSingleAstItem;
};
