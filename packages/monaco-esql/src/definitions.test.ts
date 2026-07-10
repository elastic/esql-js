/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the MIT license (the "License"); you may
 * not use this file except in compliance with the License.
 */

import * as definitions from './definitions';

const keywordLists = [
  'headerCommands',
  'sourceCommands',
  'processingCommands',
  'options',
  'literals',
  'functions',
] as const;

describe.each(keywordLists)('%s', (name) => {
  const list = definitions[name];

  it('is a non-empty array of unique keywords', () => {
    expect(list.length).toBeGreaterThan(0);
    expect(new Set(list).size).toBe(list.length);
  });
});

describe('delimiters', () => {
  // Symbol-matching list, not keywords — duplicates are harmless.
  it('is a non-empty array', () => {
    expect(definitions.delimiters.length).toBeGreaterThan(0);
  });
});

describe('temporalUnits', () => {
  it('pairs each canonical unit with its abbreviations, all unique', () => {
    const allUnits = definitions.temporalUnits.flat();

    expect(new Set(allUnits).size).toBe(allUnits.length);
  });
});
