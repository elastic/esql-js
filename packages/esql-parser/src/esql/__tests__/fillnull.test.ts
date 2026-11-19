/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { EsqlQuery } from './query';
import { Walker } from '@elastic/esql-traversal';
import type { ESQLAstFillNullCommand, ESQLAstQueryExpression } from '@elastic/esql-types';

describe('FILLNULL', () => {
  const getFillNull = (ast: ESQLAstQueryExpression): ESQLAstFillNullCommand =>
    Walker.match(ast, { type: 'command', name: 'fillnull' }) as ESQLAstFillNullCommand;

  it('parses value and fields', () => {
    const { ast, errors } = EsqlQuery.fromSrc('FROM a | FILLNULL 0 ON x, y*');
    const cmd = getFillNull(ast);

    expect(errors).toHaveLength(0);
    expect(cmd.incomplete).toBe(false);
    expect(cmd.value).toMatchObject({ type: 'literal', literalType: 'integer', value: 0 });
    expect(cmd.fields).toMatchObject([
      { type: 'column', name: 'x' },
      { type: 'column', name: 'y*' },
    ]);
    expect(cmd.args).toMatchObject([
      { type: 'literal' },
      { type: 'option', name: 'on', args: [{ name: 'x' }, { name: 'y*' }] },
    ]);
  });

  it.each([
    ['null', { type: 'literal', literalType: 'null' }],
    ['default', { type: 'identifier', name: 'default', verbatim: true }],
    ['0', { type: 'literal', literalType: 'integer', value: 0 }],
    ['-1', { type: 'literal', literalType: 'integer', value: -1 }],
    ['1.5', { type: 'literal', literalType: 'double', value: 1.5 }],
    ['-1.5', { type: 'literal', literalType: 'double', value: -1.5 }],
    ['true', { type: 'literal', literalType: 'boolean' }],
    ['"x"', { type: 'literal', literalType: 'keyword', valueUnquoted: 'x' }],
    ['?p', { type: 'literal', literalType: 'param' }],
  ])('parses value %s', (value, expected) => {
    const { ast, errors } = EsqlQuery.fromSrc(`FROM a | FILLNULL ${value} ON x`);

    expect(errors).toHaveLength(0);
    expect(getFillNull(ast).value).toMatchObject(expected);
  });

  it('does not flag a column named default as verbatim', () => {
    const { ast, errors } = EsqlQuery.fromSrc('FROM a | FILLNULL 0 ON `default`, default');

    expect(errors).toHaveLength(0);
    expect(getFillNull(ast).fields).toMatchObject([
      { type: 'column', name: 'default' },
      { type: 'column', name: 'default' },
    ]);
    expect(JSON.stringify(getFillNull(ast).fields)).not.toContain('verbatim');
  });

  it('parses wildcard fields', () => {
    const { ast, errors } = EsqlQuery.fromSrc('FROM a | FILLNULL 0 ON a*, *.b');

    expect(errors).toHaveLength(0);
    expect(getFillNull(ast).fields.map((f) => (f as { name: string }).name)).toEqual(['a*', '*.b']);
  });

  it('parses inside a FORK branch', () => {
    const { ast, errors } = EsqlQuery.fromSrc(
      'FROM a | FORK (FILLNULL 0 ON x) (FILLNULL DEFAULT ON y)'
    );

    expect(errors).toHaveLength(0);
    expect(Walker.matchAll(ast, { type: 'command', name: 'fillnull' })).toHaveLength(2);
  });

  it('Walker visits value and fields', () => {
    const { ast } = EsqlQuery.fromSrc('FROM a | FILLNULL 7 ON x, y');
    const cmd = getFillNull(ast);
    const visited: string[] = [];

    Walker.walk(cmd, {
      visitCommand: (node) => visited.push(`command:${node.name}`),
      visitLiteral: (node) => visited.push(`literal:${node.value}`),
      visitCommandOption: (node) => visited.push(`option:${node.name}`),
      visitColumn: (node) => visited.push(`column:${node.name}`),
    });

    expect(visited).toEqual(['command:fillnull', 'literal:7', 'option:on', 'column:x', 'column:y']);
  });

  it('marks missing value incomplete', () => {
    const { ast, errors } = EsqlQuery.fromSrc('FROM a | FILLNULL ON x');

    expect(errors.length).toBeGreaterThan(0);
    expect(getFillNull(ast).incomplete).toBe(true);
  });

  it('marks missing ON list incomplete', () => {
    const { ast, errors } = EsqlQuery.fromSrc('FROM a | FILLNULL 0 ON');

    expect(errors.length).toBeGreaterThan(0);
    expect(getFillNull(ast).incomplete).toBe(true);
  });

  it('marks missing ON incomplete', () => {
    const { ast, errors } = EsqlQuery.fromSrc('FROM a | FILLNULL 0');

    expect(errors.length).toBeGreaterThan(0);
    expect(getFillNull(ast).incomplete).toBe(true);
  });
});
