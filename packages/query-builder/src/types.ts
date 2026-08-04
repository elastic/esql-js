/*
 * Copyright Elasticsearch B.V. and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import type { BaseExpression } from './base';

/** Primitive values that can appear in expressions. */
export type Primitive = string | number | boolean | null | Date;

/** Value that may be an expression or a primitive. */
export type ExpressionLike = BaseExpression | Primitive;

/** Field reference: string name or expression. */
export type FieldType = string | BaseExpression;
