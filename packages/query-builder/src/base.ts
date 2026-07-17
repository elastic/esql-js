/*
 * Copyright Elasticsearch B.V. and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Abstract base class for expression type checking across packages.
 * Use instanceof BaseExpression or BaseExpression.isExpression(value) to detect expressions.
 */
export abstract class BaseExpression {
  static readonly EXPRESSION_IDENTIFIER = Symbol.for('elastic.expression');

  abstract toString(): string;

  static isExpression(value: unknown): value is BaseExpression {
    return value instanceof BaseExpression;
  }
}
