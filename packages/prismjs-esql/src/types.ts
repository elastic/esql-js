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
