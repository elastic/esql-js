/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import * as antlr4 from 'antlr4';
import { EsqlLexer } from '@elastic/esql-grammar';
import { getPosition } from './tokens';
import type { EditorError } from '../../types';

// These will need to be manually updated whenever the relevant grammar changes.
const SYNTAX_ERRORS_TO_IGNORE = [
  `mismatched input '<EOF>' expecting {'row', 'from', 'ts', 'set', 'show'}`,
];

const TOKEN_RECOGNITION_ERROR_PREFIX = 'token recognition error at:';

// Lexer modes in which an unquoted identifier/pattern is expected (e.g. RENAME's
// old/new names). A "token recognition error" raised while in one of these modes
// means the offending character can never form a valid unquoted identifier there
// (unlike, say, WHERE, where the same character may be a valid operator) — i.e.
// the identifier likely needs backticks.
const UNQUOTED_IDENTIFIER_ERROR_MODES = new Set<number>([EsqlLexer.RENAME_MODE]);

function isUnquotedIdentifierError(
  recognizer: antlr4.Recognizer<unknown>,
  offendingSymbol: unknown,
  message: string
): boolean {
  return (
    offendingSymbol == null &&
    message.startsWith(TOKEN_RECOGNITION_ERROR_PREFIX) &&
    recognizer instanceof antlr4.Lexer &&
    UNQUOTED_IDENTIFIER_ERROR_MODES.has(recognizer.getMode())
  );
}

const ID_CHARS_BEFORE = /[a-zA-Z0-9._@*]+$/;
const ID_CHARS_AFTER = /^[^\s|,()[\]]+/;

function expandSpanToIdentifier(
  lexer: antlr4.Lexer,
  column: number
): { startColumn: number; endColumn: number } {
  const input = (lexer as unknown as { inputStream: antlr4.CharStream }).inputStream;
  const errorIdx = lexer._tokenStartCharIndex;
  const src = input.getText(0, input.size - 1);

  const beforeLen = ID_CHARS_BEFORE.exec(src.slice(0, errorIdx))?.[0].length ?? 0;
  const afterLen = ID_CHARS_AFTER.exec(src.slice(errorIdx + 1))?.[0].length ?? 0;

  return {
    startColumn: column + 1 - beforeLen,
    endColumn: column + 2 + afterLen,
  };
}

const REPLACE_DEV = /,{0,1}(?<!\s)\s*DEV_\w+\s*/g;
const REPLACE_ORPHAN_COMMA = /{, /g;

export class ESQLErrorListener extends antlr4.ErrorListener<unknown> {
  protected errors: EditorError[] = [];

  syntaxError(
    recognizer: antlr4.Recognizer<unknown>,
    offendingSymbol: unknown,
    line: number,
    column: number,
    message: string,
    error: antlr4.RecognitionException | undefined
  ): void {
    // Remove any DEV_ tokens from the error message
    message = message.replace(REPLACE_DEV, '');

    // Remove any trailing commas from the error message... this handles
    // cases where the dev token was at the start of a list
    // e.g. "mismatched input 'PROJECT' expecting {, 'enrich', 'dissect', 'eval', 'grok'}"
    message = message.replace(REPLACE_ORPHAN_COMMA, '{');

    if (SYNTAX_ERRORS_TO_IGNORE.includes(message)) {
      return;
    }

    const tokenPosition = getPosition(offendingSymbol as antlr4.Token);
    let startColumn = offendingSymbol && tokenPosition ? tokenPosition.min + 1 : column + 1;
    let endColumn = offendingSymbol && tokenPosition ? tokenPosition.max + 1 : column + 2;

    const unquotedIdentifierError = isUnquotedIdentifierError(recognizer, offendingSymbol, message);
    if (unquotedIdentifierError) {
      ({ startColumn, endColumn } = expandSpanToIdentifier(recognizer as antlr4.Lexer, column));
    }
    const invalidChar = unquotedIdentifierError
      ? message.replace(TOKEN_RECOGNITION_ERROR_PREFIX, '').trim()
      : undefined;

    const code = unquotedIdentifierError ? 'invalidUnquotedIdentifier' : 'syntaxError';
    const textMessage = unquotedIdentifierError
      ? `invalidUnquotedIdentifier: Field name contains invalid character ${invalidChar}`
      : `SyntaxError: ${message}`;

    this.errors.push({
      startLineNumber: line,
      endLineNumber: line,
      startColumn,
      endColumn,
      message: textMessage,
      severity: 'error',
      code,
    });
  }

  getErrors(): EditorError[] {
    return this.errors;
  }
}
