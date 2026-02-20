/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import * as antlr4 from 'antlr4';
import { getPosition } from '../../../parser/core/tokens.ts';
import type { EditorError } from '../../../types.ts';

/**
 * Error listener for PromQL parsing that collects syntax errors.
 */
export class PromQLErrorListener extends antlr4.ErrorListener<unknown> {
  protected errors: EditorError[] = [];

  syntaxError(
    _recognizer: antlr4.Recognizer<unknown>,
    offendingSymbol: unknown,
    line: number,
    column: number,
    message: string,
    _error: antlr4.RecognitionException | undefined
  ): void {
    const textMessage = `SyntaxError: ${message}`;

    const tokenPosition = getPosition(offendingSymbol as antlr4.Token);
    const startColumn = offendingSymbol && tokenPosition ? tokenPosition.min + 1 : column + 1;
    const endColumn = offendingSymbol && tokenPosition ? tokenPosition.max + 1 : column + 2;

    this.errors.push({
      startLineNumber: line,
      endLineNumber: line,
      startColumn,
      endColumn,
      message: textMessage,
      severity: 'error',
      code: 'syntaxError',
    });
  }

  getErrors(): EditorError[] {
    return this.errors;
  }
}
