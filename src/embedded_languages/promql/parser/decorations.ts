/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { type CommonTokenStream } from 'antlr4';
import { Builder } from '../../../ast/builder';
import type { ESQLAstCommentSingleLine } from '../../../types';

/**
 * ANTLR hidden channel number. Comments and whitespace are placed on this
 * channel by the lexer.
 */
const HIDDEN_CHANNEL = 1;

/**
 * Punctuation characters that don't count as "content" for the purposes of
 * determining whether a comment has content to its left.
 */
const punctuationChars = new Set(['.', ',', ';', ':', '(', ')', '[', ']', '{', '}']);

const isLikelyPunctuation = (text: string): boolean =>
  text.length === 1 && punctuationChars.has(text);

/**
 * A collected comment decoration with its positional context.
 */
export interface PromQLCommentDecoration {
  type: 'comment';

  /**
   * Whether there is non-punctuation content to the left of this comment on
   * the same line. When `true`, the comment is a trailing comment (e.g.
   * `rate(x[5m]) # trailing`). When `false`, the comment occupies its own
   * line (e.g. `# whole-line comment`).
   */
  hasContentToLeft: boolean;

  /** The AST comment node. */
  node: ESQLAstCommentSingleLine;
}

/**
 * Strip the `#` prefix and any trailing `\r?\n` from a PromQL comment token.
 */
const cleanCommentText = (text: string): string => {
  let end = text.length;

  if (text[end - 1] === '\n') {
    end--;
  }
  if (end > 0 && text[end - 1] === '\r') {
    end--;
  }

  return text.slice(1, end);
};

/**
 * Collects all comments from the PromQL token stream.
 *
 * Iterates through every token (including hidden-channel tokens) and extracts
 * comment decorations with their positional context.
 *
 * @param tokens ANTLR token stream from the PromQL lexer.
 * @param offset Character offset to add to all locations (for embedded PromQL).
 * @returns List of comment decorations in source order.
 */
export const collectPromQLDecorations = (
  tokens: CommonTokenStream,
  offset: number = 0
): PromQLCommentDecoration[] => {
  const result: PromQLCommentDecoration[] = [];
  const list = tokens.tokens;
  const length = list.length;

  let pos = 0;
  let hasContentToLeft = false;

  // The last token is <EOF>, which we skip.
  for (let i = 0; i < length - 1; i++) {
    const token = list[i];
    const { channel, text } = token;
    const min = pos;
    const max = min + text.length - 1; // max is inclusive, like in ES|QL AST

    pos = max + 1;

    if (channel !== HIDDEN_CHANNEL) {
      if (!isLikelyPunctuation(text)) {
        hasContentToLeft = true;
      }
      continue;
    }

    // Hidden channel token — check if it's a comment (starts with `#`)
    if (text[0] !== '#') {
      // Whitespace token — check for line breaks to reset context
      if (text.indexOf('\n') !== -1) {
        hasContentToLeft = false;
      }
      continue;
    }

    const cleanText = cleanCommentText(text);
    // TODO: Do we need this check after cleaning? Should cleaning remove all line breaks?
    const endsWithNewline = text[text.length - 1] === '\n';
    const maxOffset = endsWithNewline ? (text[text.length - 2] === '\r' ? 2 : 1) : 0;
    const node = Builder.comment('single-line', cleanText, {
      min: min + offset,
      max: max - maxOffset + offset,
    });

    result.push({
      type: 'comment',
      hasContentToLeft,
      node,
    });

    if (endsWithNewline) {
      hasContentToLeft = false;
    }
  }

  return result;
};
