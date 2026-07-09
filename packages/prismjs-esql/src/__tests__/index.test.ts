/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the MIT license (the "License"); you may
 * not use this file except in compliance with the License.
 */

import { refractor } from 'refractor';
import type { Syntax, RefractorRoot, RefractorElement } from 'refractor';
import { esql } from '..';

refractor.register(esql as Syntax);

type Token = [text: string, type: string];

const walk = (prefix: string, node: RefractorRoot | RefractorElement): Token[] => {
  const tokens: Token[] = [];

  for (const child of node.children) {
    if (child.type === 'element') {
      const classNames = child.properties?.className
        ? Array.isArray(child.properties?.className)
          ? child.properties.className.join('+')
          : String(child.properties?.className)
        : '';
      const type = prefix ? prefix + '.' + classNames : classNames;

      tokens.push(...walk(type, child));
    }
    if (child.type === 'text') {
      tokens.push([child.value, prefix]);
    }
  }

  return tokens;
};

const tokenize = (src: string): Token[] => {
  const root: RefractorRoot = refractor.highlight(src, 'esql');
  const tokens: Token[] = walk('', root);

  return tokens;
};

test('basic FROM command', () => {
  const tokens = tokenize('FROM index');

  expect(tokens).toMatchSnapshot();
});

test('comments', () => {
  const tokens = tokenize(`// This is comment
/* This is multiline comment */`);

  expect(tokens).toMatchSnapshot();
});

test('booleans', () => {
  const tokens = tokenize(`ROW TRUE, FALSE`);

  expect(tokens).toMatchSnapshot();
});

test('numbers', () => {
  const tokens = tokenize(`ROW 1, 3.14`);

  expect(tokens).toMatchSnapshot();
});

test('strings', () => {
  const tokens = tokenize(`ROW "abc"`);

  expect(tokens).toMatchSnapshot();
});

test('functions', () => {
  const tokens = tokenize(`ROW AVG(COUNT(123))`);

  expect(tokens).toMatchSnapshot();
});

test('cast', () => {
  const tokens = tokenize(`ROW 1.1::INTEGER`);

  expect(tokens).toMatchSnapshot();
});
