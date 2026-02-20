/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { ParseOptions } from '../../parser/index.ts';
import { Parser } from '../../parser/index.ts';
import { createTag } from './tag.ts';
import { SynthNode } from './synth_node.ts';
import type { SynthGenerator } from './types.ts';
import type { ESQLAstHeaderCommand } from '../../types.ts';

const generator: SynthGenerator<ESQLAstHeaderCommand> = (
  src: string,
  { withFormatting = true, ...rest }: ParseOptions = {}
): ESQLAstHeaderCommand => {
  src = src.trimStart();

  const { root } = Parser.parseHeaderCommand(src, { withFormatting, ...rest });

  // The parser returns the header command as ESQLCommand type, but it's actually
  // an ESQLAstSetHeaderCommand at runtime
  const node = SynthNode.from(root as any);

  return node;
};

export const header = createTag<ESQLAstHeaderCommand>(generator);

/**
 * Short 3-letter alias for DX convenience.
 */
export const hdr = header;
