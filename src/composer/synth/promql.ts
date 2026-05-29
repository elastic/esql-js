/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { ParseOptions } from '../../parser';
import { PromQLParser } from '../../embedded_languages/promql/parser';
import type { PromQLAstQueryExpression } from '../../embedded_languages/promql/types';
import { createTag } from './tag';
import type { SynthGenerator } from './types';
import { SynthNode } from './synth_node';

const generator: SynthGenerator<PromQLAstQueryExpression> = (
  src: string,
  { withFormatting = true }: ParseOptions = {}
): PromQLAstQueryExpression => {
  const { root } = PromQLParser.parse(src.trim(), { withFormatting });

  return SynthNode.from(root);
};

export const promqlExpression = createTag<PromQLAstQueryExpression>(generator);

/**
 * Short 3-letter alias for DX convenience.
 */
export const pql = promqlExpression;
