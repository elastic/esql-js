/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// Core AST utilities
export * from './is';
export * from './location';
export * from './grouping';

// AST manipulation tools
export { Builder, type AstNodeParserFields, type AstNodeTemplate } from './builder';
export { singleItems, resolveItem, lastItem, firstItem } from './visitor/utils';
export { Walker, type WalkerOptions, walk, type WalkerAstNode } from './walker';
export * as mutate from './mutate';
