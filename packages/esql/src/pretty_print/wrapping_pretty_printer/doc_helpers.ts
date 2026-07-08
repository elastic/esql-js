/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { breakParent, hardlineWithoutBreakParent, lineSuffix } from '@elastic/pretty-printer';
import { LeafPrinter } from '../leaf_printer';
import type { Doc } from '@elastic/pretty-printer';
import type { ESQLAstBaseItem, ESQLAstComment, ESQLAstCommentMultiLine } from '../../types';

export const commentToDoc = (node: ESQLAstComment): Doc => {
  const raw = LeafPrinter.comment(node);

  if (!raw.includes('\n')) return raw;

  const lines = raw.split('\n');
  const parts: Doc[] = [lines[0]];

  for (let i = 1; i < lines.length; i++) {
    parts.push(hardlineWithoutBreakParent, lines[i]);
  }

  return parts;
};

/**
 * Convert a list of inline-prefix (`left`) comments to a Doc.
 */
export const commentListToDoc = (comments: ESQLAstCommentMultiLine[]): Doc => {
  if (comments.length === 0) return '';
  if (comments.length === 1) return commentToDoc(comments[0]);

  const parts: Doc[] = [];
  for (let i = 0; i < comments.length; i++) {
    if (i > 0) parts.push(' ');
    parts.push(commentToDoc(comments[i]));
  }

  return parts;
};

/**
 * Wraps a Doc with any comment decorations attached to the given AST node.
 */
export const decorateWithComments = (node: ESQLAstBaseItem, doc: Doc): Doc => {
  const formatting = node.formatting;

  if (!formatting) return doc;

  const { top, left, right, rightSingleLine, bottom } = formatting;

  if (!top?.length && !left?.length && !right?.length && !rightSingleLine && !bottom?.length) {
    return doc;
  }

  const parts: Doc[] = [];

  // Top comments go before the node
  if (top?.length) {
    for (const c of top) {
      parts.push(LeafPrinter.comment(c));
      parts.push(hardlineWithoutBreakParent);
    }
  }

  // Left inline comments
  if (left?.length) {
    parts.push(LeafPrinter.commentList(left));
    parts.push(' ');
  }

  parts.push(doc);

  // Right inline comments
  if (right?.length) {
    parts.push(' ');
    parts.push(LeafPrinter.commentList(right));
  }

  // Trailing single-line comment – deferred to end-of-line via lineSuffix
  if (rightSingleLine) {
    parts.push(lineSuffix(' ' + LeafPrinter.comment(rightSingleLine)));
    parts.push(breakParent);
  }

  // Bottom comments go after the node
  if (bottom?.length) {
    for (const c of bottom) {
      parts.push(hardlineWithoutBreakParent, LeafPrinter.comment(c));
    }
  }

  return parts;
};
