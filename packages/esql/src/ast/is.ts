/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { Walker } from './walker';
import type { ESQLProperNode } from '../types';

export * from '@elastic/esql-ast';

export const isParametrized = (node: ESQLProperNode): boolean => Walker.params(node).length > 0;
