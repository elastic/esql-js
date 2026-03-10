/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { text, line, hardline } from '../builders';
import { propagateBreaks } from '../prepare';
import type { GroupNode } from '../types';

describe('propagateBreaks', () => {
  it('sets `shouldBreak` on parent groups', () => {
    const inner: GroupNode = { type: 'group', contents: [text('a'), hardline, text('b')] };
    const outer: GroupNode = { type: 'group', contents: inner };

    propagateBreaks(outer);

    expect(inner.shouldBreak).toBe(true);
    expect(outer.shouldBreak).toBe(true);
  });

  it('does not set `shouldBreak` when there is no hardline', () => {
    const doc: GroupNode = { type: 'group', contents: [text('a'), line, text('b')] };

    propagateBreaks(doc);

    expect(!!doc.shouldBreak).toBe(false);
  });
});
