/*
 * Copyright Elasticsearch B.V. and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESQLBase } from '../base';

class ConcreteCommand extends ESQLBase {
  constructor(
    private readonly body: string,
    parent: ESQLBase | null = null
  ) {
    super();
    if (parent) {
      this.setParent(parent);
    }
  }

  protected _renderInternal(): string {
    return this.body;
  }
}

describe('ESQLBase', () => {
  it('render() returns only own output when no parent', () => {
    const cmd = new ConcreteCommand('FROM x');
    expect(cmd.render()).toBe('FROM x');
  });

  it('parent chain renders with \\n|  separators', () => {
    const from = new ConcreteCommand('FROM x');
    const meta = new ConcreteCommand('METADATA _id', from);
    expect(meta.render()).toBe('FROM x\n| METADATA _id');
  });

  it('three-level chain renders correctly', () => {
    const from = new ConcreteCommand('FROM a');
    const meta = new ConcreteCommand('METADATA _id', from);
    const where = new ConcreteCommand('WHERE x > 1', meta);
    expect(where.render()).toBe('FROM a\n| METADATA _id\n| WHERE x > 1');
  });

  it('toString() returns same as render()', () => {
    const cmd = new ConcreteCommand('FROM y');
    expect(cmd.toString()).toBe(cmd.render());
  });

  it('toJSON() returns { query: string }', () => {
    const cmd = new ConcreteCommand('FROM z');
    expect(cmd.toJSON()).toEqual({ query: 'FROM z' });
  });

  it('chaining returns new instance (immutability)', () => {
    const from = new ConcreteCommand('FROM a');
    const meta = new ConcreteCommand('METADATA _id', from);
    expect(from.render()).toBe('FROM a');
    expect(meta.render()).toBe('FROM a\n| METADATA _id');
    expect(meta).not.toBe(from);
  });
});
