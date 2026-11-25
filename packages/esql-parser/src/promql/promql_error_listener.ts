/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import * as antlr4 from 'antlr4';
import { getErrorColumns } from '../tokens';
import type { EditorError } from '@elastic/esql-types';

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

    const { startColumn, endColumn } = getErrorColumns(
      offendingSymbol as antlr4.Token | null,
      column
    );

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
