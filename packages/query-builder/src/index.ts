/*
 * Copyright Elasticsearch B.V. and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Elasticsearch Query Builder
 */

export const VERSION = '0.0.1';

export { BaseExpression } from './base';
export { escapeIdentifier, escapeValue, isValidIdentifier } from './escaping';
export { Op, type OpType } from './operators';
export type { ExpressionLike, FieldType, Primitive } from './types';
