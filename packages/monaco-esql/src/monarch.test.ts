/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the MIT license (the "License"); you may
 * not use this file except in compliance with the License.
 */

import type { languages } from 'monaco-editor';
import { create } from './monarch';
import { language } from './monarch-shared';
import * as definitions from './definitions';

type Definition = languages.IMonarchLanguage & Record<string, unknown>;

describe('create', () => {
  it('defaults every list to empty when no dependencies are given', () => {
    const result = create() as Definition;

    expect(result.ignoreCase).toBe(false);
    expect(result.headerCommands).toEqual([]);
    expect(result.sourceCommands).toEqual([]);
    expect(result.processingCommands).toEqual([]);
    expect(result.functions).toEqual([]);
  });

  it('adds lowercase variants of every provided keyword list', () => {
    const result = create({ headerCommands: ['SET'], sourceCommands: ['FROM'] }) as Definition;

    expect(result.headerCommands).toEqual(expect.arrayContaining(['SET', 'set']));
    expect(result.sourceCommands).toEqual(expect.arrayContaining(['FROM', 'from']));
  });

  it('includes the PromQL tokenizer states so PROMQL can be embedded', () => {
    const result = create() as Definition;
    const tokenizer = result.tokenizer as Record<string, unknown>;

    expect(tokenizer.promQLCommand).toBeDefined();
    expect(tokenizer.promQLQuery).toBeDefined();
  });
});

describe('language', () => {
  it('is create() applied to the default ES|QL definitions', () => {
    expect(language).toEqual(create(definitions));
  });
});
