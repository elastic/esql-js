/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { printAst } from '../../../debug';
import { Parser } from '../../../parser';
import { WrappingPrettyPrinter } from '../printer';
import type { WrappingPrettyPrinterOptions } from '../printer';

export const reprint = (src: string, opts?: WrappingPrettyPrinterOptions) => {
  const { root } = Parser.parse(src, { withFormatting: true });

  return WrappingPrettyPrinter.print(root, opts);
};

export const assertReprint = (src: string, expected: string = src) => {
  const text = reprint(src);
  const text2 = reprint(text);

  expect(text).toBe(expected);
  expect(text2).toBe(expected);

  const ast1 = Parser.parse(src, { withFormatting: true });
  const ast2 = Parser.parse(text2, { withFormatting: true });
  const dump1 = printAst(ast1.root, { location: false });
  const dump2 = printAst(ast2.root, { location: false });

  expect(dump1).toBe(dump2);
};
