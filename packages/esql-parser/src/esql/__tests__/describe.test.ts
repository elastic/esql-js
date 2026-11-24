/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { Parser } from '..';

describe('DESCRIBE', () => {
  it('parses a no-argument command in a pipeline', () => {
    const { root, errors } = Parser.parse('FROM logs | describe | LIMIT 1');

    expect(errors).toEqual([]);
    expect(root.commands.map(({ name }) => name)).toEqual(['from', 'describe', 'limit']);
    expect(root.commands[1]).toMatchObject({
      type: 'command',
      name: 'describe',
      args: [],
      incomplete: false,
    });
  });

  it('parses a single command through Parser.parseCommand', () => {
    const { root, errors } = Parser.parseCommand('DESCRIBE');

    expect(errors).toEqual([]);
    expect(root).toMatchObject({ type: 'command', name: 'describe', args: [] });
  });

  it.each(['DESCRIBE', 'FROM logs | DESCRIBE field'])('rejects %s as a query', (src) => {
    expect(Parser.parseErrors(src).length).toBeGreaterThan(0);
  });

  it('preserves the preceding command when the keyword is incomplete', () => {
    const { root, errors } = Parser.parse('FROM logs | DESCR');

    expect(errors.length).toBeGreaterThan(0);
    expect(root.commands.map(({ name }) => name)).toEqual(['from']);
  });
});
