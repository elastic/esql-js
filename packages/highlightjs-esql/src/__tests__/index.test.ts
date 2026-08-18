/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the MIT license (the "License"); you may
 * not use this file except in compliance with the License.
 */

import * as fs from 'fs';
import * as path from 'path';
import hljs from 'highlight.js/lib/core';
import { esql } from '..';

hljs.registerLanguage('esql', esql);

const highlight = (code: string): string => hljs.highlight(code, { language: 'esql' }).value;

test('registers under the "esql" name', () => {
  expect(hljs.getLanguage('esql')).toBeDefined();
  expect(hljs.getLanguage('esql')!.name).toBe('esql');
});

test('highlights commands and keywords', () => {
  expect(highlight('FROM index METADATA _id')).toMatchInlineSnapshot(
    `"<span class="hljs-keyword">FROM</span> index <span class="hljs-keyword">METADATA</span> _id"`
  );
});

test('highlights strings, numbers, and literals', () => {
  expect(highlight('ROW a = "value", b = 123, c = TRUE')).toMatchInlineSnapshot(
    `"<span class="hljs-keyword">ROW</span> a = <span class="hljs-string">&quot;value&quot;</span><span class="hljs-punctuation">,</span> b = <span class="hljs-number">123</span><span class="hljs-punctuation">,</span> c = <span class="hljs-literal">TRUE</span>"`
  );
});

test('highlights comments', () => {
  expect(highlight('// line comment')).toContain('hljs-comment');
  expect(highlight('/* block comment */')).toContain('hljs-comment');
});

test('highlights function calls', () => {
  expect(highlight('STATS s = SUM(bytes)')).toContain('hljs-function');
});

test('highlights params and casts', () => {
  expect(highlight('WHERE a == ?param')).toContain('hljs-variable');
  expect(highlight('EVAL b = a::INTEGER')).toContain('hljs-type');
});

test('highlights the default markup fixture', () => {
  const fixture = fs.readFileSync(path.join(__dirname, 'fixtures', 'default.txt'), 'utf8');

  expect(highlight(fixture)).toMatchSnapshot();
});
