/*
 * Copyright Elasticsearch B.V. and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  and_,
  BranchCommand,
  col,
  E,
  ESQL,
  ESQLBase,
  ESQLQuery,
  esql,
  FromCommand,
  formatIdentifier,
  InstrumentedExpression,
  not_,
  Op,
  or_,
  RowCommand,
  ShowCommand,
  TsCommand,
  VERSION,
} from '../index';

describe('esql-dsl exports', () => {
  it('exports VERSION', () => {
    expect(VERSION).toBe('1.0.1');
  });

  it('exports Op symbols', () => {
    expect(Op.eq).toBe(Symbol.for('elastic.op.eq'));
    expect(Op.gt).toBe(Symbol.for('elastic.op.gt'));
    expect(Op.or).toBe(Symbol.for('elastic.op.or'));
  });

  it('exports core classes', () => {
    expect(ESQLBase).toBeDefined();
    expect(ESQLQuery).toBeDefined();
    expect(InstrumentedExpression).toBeDefined();
  });

  it('exports source command classes', () => {
    expect(FromCommand).toBeDefined();
    expect(RowCommand).toBeDefined();
    expect(ShowCommand).toBeDefined();
    expect(TsCommand).toBeDefined();
    expect(BranchCommand).toBeDefined();
  });

  it('exports factory and helpers', () => {
    expect(ESQL).toBeDefined();
    expect(E).toBeDefined();
    expect(col).toBeDefined();
    expect(esql).toBeDefined();
    expect(formatIdentifier).toBeDefined();
    expect(and_).toBeDefined();
    expect(or_).toBeDefined();
    expect(not_).toBeDefined();
  });
});
