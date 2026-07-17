/*
 * Copyright Elasticsearch B.V. and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Abstract base class for all ES|QL command objects. Handles parent chaining
 * and rendering the full query string by walking the command chain.
 */
export abstract class ESQLBase {
  protected _parent: ESQLBase | null = null;

  protected setParent(parent: ESQLBase): this {
    this._parent = parent;
    return this;
  }

  /** Renders the full ES|QL query string by walking the parent chain. */
  render(): string {
    const parentStr = this._parent ? `${this._parent.render()}\n| ` : '';
    return parentStr + this._renderInternal();
  }

  protected abstract _renderInternal(): string;

  /** Returns the rendered ES|QL query string. Alias for {@link render}. */
  toString(): string {
    return this.render();
  }

  /** Returns a JSON-serializable object with the rendered query. */
  toJSON(): { query: string } {
    return { query: this.render() };
  }
}
