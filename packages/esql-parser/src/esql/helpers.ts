/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import * as antlr4 from 'antlr4';
import { EsqlLexer } from '@elastic/esql-grammar';

export const TOKEN_RECOGNITION_ERROR_PREFIX = 'token recognition error at:';

// Lexer modes where identifier patterns are expected and operators like `-` are not valid tokens.
// A token-recognition error in these modes means the identifier needs quoting, not a structural fix.
export const UNQUOTED_IDENTIFIER_ERROR_MODES = new Set<number>([EsqlLexer.RENAME_MODE]);

export function isUnquotedIdentifierError(
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

export function expandSpanToIdentifier(
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

export const nonNullable = <T>(v: T): v is NonNullable<T> => {
  return v != null;
};

/**
 * Removes backtick quotes from around a field name and un-escapes any
 * backticks (double ``) within the field name.
 *
 * @param field A potentially escaped field (column).
 */
export const unescapeColumn = (field: string) => {
  if (!field) {
    return '';
  }

  return field.replace(/^`{1}|`{1}$/g, '').replace(/``/g, '`');
};
