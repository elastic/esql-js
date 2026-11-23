/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import LexerConfig from './lexer_config.js';

export default class PromQLLexerRuntime extends LexerConfig {
  private bracketDepth = 0;

  public reset(): void {
    super.reset();
    this.bracketDepth = 0;
  }

  protected incPromqlBracketDepth(): void {
    this.bracketDepth++;
  }

  protected decPromqlBracketDepth(): void {
    this.bracketDepth = Math.max(0, this.bracketDepth - 1);
  }

  protected isInPromqlBrackets(): boolean {
    return this.bracketDepth > 0;
  }
}
