/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// Core AST utilities
export * from './is.ts';
export * from './location.ts';
export * from './grouping.ts';

// AST manipulation tools
export { Builder, type AstNodeParserFields, type AstNodeTemplate } from './builder/index.ts';
export { singleItems, resolveItem, lastItem, firstItem } from './visitor/utils.ts';
export { Walker, type WalkerOptions, walk, type WalkerAstNode } from './walker/index.ts';
export * as mutate from './mutate/index.ts';
