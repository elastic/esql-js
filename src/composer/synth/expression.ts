/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { ParseOptions } from '../../parser/index.ts';
import { Parser } from '../../parser/index.ts';
import { createTag } from './tag.ts';
import type { SynthGenerator } from './types.ts';
import type { ESQLAstExpression } from '../../types.ts';
import { SynthNode } from './synth_node.ts';

const generator: SynthGenerator<ESQLAstExpression> = (
  src: string,
  { withFormatting = true, ...rest }: ParseOptions = {}
): ESQLAstExpression => {
  const { root } = Parser.parseExpression(src, { withFormatting, ...rest });
  const node = SynthNode.from(root);

  return node;
};

export const expression = createTag<ESQLAstExpression>(generator);

/**
 * Short 3-letter alias for DX convenience.
 */
export const exp = expression;
