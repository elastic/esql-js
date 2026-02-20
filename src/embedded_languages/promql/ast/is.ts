/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { isProperNode } from '../../../ast/is.ts';
import type { PromQLAstNode } from '../types.ts';

export const isPromqlNode = (node: unknown): node is PromQLAstNode =>
  isProperNode(node) && 'dialect' in node && node.dialect === 'promql';
