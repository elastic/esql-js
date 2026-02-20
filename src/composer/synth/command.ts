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
import type { ESQLCommand } from '../../types.ts';

const generator: SynthGenerator<ESQLCommand> = (
  src: string,
  { withFormatting = true, ...rest }: ParseOptions = {}
): ESQLCommand => {
  src = src.trimStart();

  const { root } = Parser.parseCommand(src, { withFormatting, ...rest });

  if (root.type !== 'command') {
    throw new Error('Expected a command node');
  }

  const node = SynthNode.from(root);

  return node;
};

export const command = createTag<ESQLCommand>(generator);

/**
 * Short 3-letter alias for DX convenience.
 */
export const cmd = command;
