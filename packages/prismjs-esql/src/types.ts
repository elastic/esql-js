/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

export interface RefractorLanguageDefinition {
  displayName: string;
  aliases: string[];
  (prism: PrismGlobal): void;
}

export interface PrismGlobal {
  languages: {
    [language: string]: PrismLanguageDefinition;
  };
}

export interface PrismLanguageDefinition {
  [rule: string]: PrismTokenizerRuleShorthand | PrismTokenizerRule;
}

export type PrismTokenizerRuleShorthand = RegExp;

export interface PrismTokenizerRule {
  pattern: RegExp;
  greedy?: true;
  alias?: string[];
}
