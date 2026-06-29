/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { parse } from '../core/parser';

describe('TS_INFO', () => {
  it('parses ts_info command', () => {
    const text = 'TS index | ts_info';
    const { root, errors } = parse(text);

    expect(errors.length).toBe(0);
    expect(root.commands[1]).toMatchObject({
      type: 'command',
      name: 'ts_info',
      incomplete: false,
      args: [],
    });
  });
});
