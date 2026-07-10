/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the MIT license (the "License"); you may
 * not use this file except in compliance with the License.
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
