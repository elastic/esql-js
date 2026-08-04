/*
 * Copyright Elasticsearch B.V. and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseExpression } from '../base';

class ConcreteExpression extends BaseExpression {
  constructor(private _str: string) {
    super();
  }

  toString(): string {
    return this._str;
  }
}

describe('BaseExpression', () => {
  it('has EXPRESSION_IDENTIFIER symbol', () => {
    expect(BaseExpression.EXPRESSION_IDENTIFIER).toBeDefined();
    expect(typeof BaseExpression.EXPRESSION_IDENTIFIER).toBe('symbol');
    expect((BaseExpression.EXPRESSION_IDENTIFIER as symbol).description).toBe('elastic.expression');
  });

  it('isExpression returns true for subclass instances', () => {
    const expr = new ConcreteExpression('x > 5');
    expect(BaseExpression.isExpression(expr)).toBe(true);
  });

  it('isExpression returns false for primitives', () => {
    expect(BaseExpression.isExpression('hello')).toBe(false);
    expect(BaseExpression.isExpression(42)).toBe(false);
    expect(BaseExpression.isExpression(true)).toBe(false);
    expect(BaseExpression.isExpression(null)).toBe(false);
  });

  it('isExpression returns false for plain objects', () => {
    expect(BaseExpression.isExpression({})).toBe(false);
  });

  it('instanceof BaseExpression works for subclasses', () => {
    const expr = new ConcreteExpression('field');
    expect(expr instanceof BaseExpression).toBe(true);
  });

  it('toString is called on subclass', () => {
    const expr = new ConcreteExpression('salary > 50000');
    expect(expr.toString()).toBe('salary > 50000');
  });
});
