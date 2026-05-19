/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { CharStreams, CommonTokenStream } from 'antlr4';
import { default as PromQLLexer } from '../../../../parser/antlr/promql_lexer';
import { attachPromQLDecorations, collectPromQLDecorations } from '../decorations';
import { PromQLParser } from '../parser';
import type { PromQLFunction, PromQLSelector } from '../../types';

/**
 * Helper: lex the source text and fill the token stream so that
 * `collectPromQLDecorations` can iterate over all tokens.
 */
const tokenize = (src: string): CommonTokenStream => {
  const lexer = new PromQLLexer(CharStreams.fromString(src));
  const tokens = new CommonTokenStream(lexer);
  tokens.fill();
  return tokens;
};

describe('collectPromQLDecorations', () => {
  describe('no comments', () => {
    it('returns empty list for plain expression', () => {
      const result = collectPromQLDecorations(tokenize('rate(http_requests_total[5m])'));

      expect(result).toHaveLength(0);
    });

    it('returns empty list for empty input', () => {
      const result = collectPromQLDecorations(tokenize(''));

      expect(result).toHaveLength(0);
    });
  });

  describe('whole-line comments (no content to left)', () => {
    it('collects a single whole-line comment', () => {
      const result = collectPromQLDecorations(tokenize('# hello world\n'));

      expect(result).toHaveLength(1);
      expect(result[0].node.subtype).toBe('single-line');
      expect(result[0].node.text).toBe(' hello world');
      expect(result[0].hasContentToLeft).toBe(false);
    });

    it('collects comment without trailing newline (EOF)', () => {
      const result = collectPromQLDecorations(tokenize('# end of file'));

      expect(result).toHaveLength(1);
      expect(result[0].node.text).toBe(' end of file');
      expect(result[0].hasContentToLeft).toBe(false);
    });

    it('collects comment before an expression', () => {
      const result = collectPromQLDecorations(tokenize('# the rate\nrate(x[5m])'));

      expect(result).toHaveLength(1);
      expect(result[0].node.text).toBe(' the rate');
      expect(result[0].hasContentToLeft).toBe(false);
    });

    it('collects multiple whole-line comments', () => {
      const src = '# line one\n# line two\nup';
      const result = collectPromQLDecorations(tokenize(src));

      expect(result).toHaveLength(2);
      expect(result[0].node.text).toBe(' line one');
      expect(result[0].hasContentToLeft).toBe(false);
      expect(result[1].node.text).toBe(' line two');
      expect(result[1].hasContentToLeft).toBe(false);
    });
  });

  describe('trailing comments (content to left)', () => {
    it('collects a trailing comment after an expression', () => {
      const result = collectPromQLDecorations(tokenize('up # is it up?\n'));

      expect(result).toHaveLength(1);
      expect(result[0].node.text).toBe(' is it up?');
      expect(result[0].hasContentToLeft).toBe(true);
    });

    it('collects trailing comment after complex expression', () => {
      const result = collectPromQLDecorations(
        tokenize('rate(http_requests_total[5m]) # request rate\n')
      );

      expect(result).toHaveLength(1);
      expect(result[0].node.text).toBe(' request rate');
      expect(result[0].hasContentToLeft).toBe(true);
    });

    it('trailing comment without trailing newline (EOF)', () => {
      const result = collectPromQLDecorations(tokenize('up # trailing'));

      expect(result).toHaveLength(1);
      expect(result[0].node.text).toBe(' trailing');
      expect(result[0].hasContentToLeft).toBe(true);
    });
  });

  describe('mixed comments', () => {
    it('collects trailing + whole-line comments', () => {
      const src = 'up # trailing\n# whole line\ndown';
      const result = collectPromQLDecorations(tokenize(src));

      expect(result).toHaveLength(2);
      expect(result[0].node.text).toBe(' trailing');
      expect(result[0].hasContentToLeft).toBe(true);
      expect(result[1].node.text).toBe(' whole line');
      expect(result[1].hasContentToLeft).toBe(false);
    });

    it('collects whole-line + trailing comments', () => {
      const src = '# header\nup # inline\n';
      const result = collectPromQLDecorations(tokenize(src));

      expect(result).toHaveLength(2);
      expect(result[0].node.text).toBe(' header');
      expect(result[0].hasContentToLeft).toBe(false);
      expect(result[1].node.text).toBe(' inline');
      expect(result[1].hasContentToLeft).toBe(true);
    });

    it('handles multiple lines with mixed comments', () => {
      const src = [
        '# top comment',
        'rate(x[5m]) # rate comment',
        '# middle comment',
        'sum(y) # sum comment',
      ].join('\n');
      const result = collectPromQLDecorations(tokenize(src));

      expect(result).toHaveLength(4);

      expect(result[0].node.text).toBe(' top comment');
      expect(result[0].hasContentToLeft).toBe(false);

      expect(result[1].node.text).toBe(' rate comment');
      expect(result[1].hasContentToLeft).toBe(true);

      expect(result[2].node.text).toBe(' middle comment');
      expect(result[2].hasContentToLeft).toBe(false);

      expect(result[3].node.text).toBe(' sum comment');
      expect(result[3].hasContentToLeft).toBe(true);
    });
  });

  describe('location tracking', () => {
    it('tracks location of a simple comment', () => {
      const result = collectPromQLDecorations(tokenize('# hi\n'));

      expect(result).toHaveLength(1);
      expect(result[0].node.location).toEqual({ min: 0, max: 3 });
    });

    it('tracks location of a trailing comment', () => {
      const result = collectPromQLDecorations(tokenize('up # x\n'));

      expect(result).toHaveLength(1);
      expect(result[0].node.location).toEqual({ min: 3, max: 5 });
    });

    it('applies offset to locations', () => {
      const result = collectPromQLDecorations(tokenize('# hi\n'), 100);

      expect(result).toHaveLength(1);
      expect(result[0].node.location).toEqual({ min: 100, max: 103 });
    });

    it('comment at EOF without newline has correct location', () => {
      const result = collectPromQLDecorations(tokenize('up # end'));

      expect(result).toHaveLength(1);
      expect(result[0].node.location).toEqual({ min: 3, max: 7 });
    });
  });

  describe('edge cases', () => {
    it('empty comment', () => {
      const result = collectPromQLDecorations(tokenize('#\n'));

      expect(result).toHaveLength(1);
      expect(result[0].node.text).toBe('');
      expect(result[0].hasContentToLeft).toBe(false);
    });

    it('comment with only spaces', () => {
      const result = collectPromQLDecorations(tokenize('#   \n'));

      expect(result).toHaveLength(1);
      expect(result[0].node.text).toBe('   ');
    });

    it('punctuation-only tokens do not set hasContentToLeft', () => {
      // Though unusual, a comment right after `(` should not have content to left
      // since `(` is punctuation, and there's no identifier before it.
      // This is more of a theoretical edge case.
      const result = collectPromQLDecorations(tokenize('(# inside\n)'));

      expect(result).toHaveLength(1);
      expect(result[0].hasContentToLeft).toBe(false);
    });
  });
});

describe('attachPromQLDecorations', () => {
  const parseAndAttach = (src: string) => {
    const lexer = new PromQLLexer(CharStreams.fromString(src));
    const tokens = new CommonTokenStream(lexer);
    tokens.fill();
    const comments = collectPromQLDecorations(tokens);

    const { root } = PromQLParser.parse(src);
    attachPromQLDecorations(root, comments);

    return root;
  };

  describe('trailing comments', () => {
    it('attaches a trailing comment as rightSingleLine on the outermost expression', () => {
      const root = parseAndAttach('up # is it up?');
      const selector = root.expression as PromQLSelector;

      expect(selector.formatting?.rightSingleLine?.text).toBe(' is it up?');
    });

    it('attaches a trailing comment after a function call onto the function', () => {
      const root = parseAndAttach('rate(x[5m]) # request rate');
      const fn = root.expression as PromQLFunction;

      expect(fn.formatting?.rightSingleLine?.text).toBe(' request rate');
    });
  });

  describe('whole-line comments', () => {
    it('attaches a whole-line comment as top on the following expression', () => {
      const root = parseAndAttach('# header\nup');
      const selector = root.expression as PromQLSelector;

      expect(selector.formatting?.top?.[0]?.text).toBe(' header');
    });

    it('accumulates multiple consecutive whole-line comments', () => {
      const root = parseAndAttach('# one\n# two\nup');
      const selector = root.expression as PromQLSelector;

      expect(selector.formatting?.top).toHaveLength(2);
      expect(selector.formatting?.top?.[0]?.text).toBe(' one');
      expect(selector.formatting?.top?.[1]?.text).toBe(' two');
    });

    it('attaches a trailing whole-line comment as bottom on the root', () => {
      const root = parseAndAttach('up\n# trailing whole line');

      expect(root.formatting?.bottom?.[0]?.text).toBe(' trailing whole line');
    });
  });

  describe('mixed comments', () => {
    it('handles top + trailing + bottom together', () => {
      const root = parseAndAttach('# top\nup # inline\n# bottom');
      const selector = root.expression as PromQLSelector;

      expect(selector.formatting?.top?.[0]?.text).toBe(' top');
      expect(selector.formatting?.rightSingleLine?.text).toBe(' inline');
      expect(root.formatting?.bottom?.[0]?.text).toBe(' bottom');
    });
  });
});

describe('PromQLParser.parse withFormatting', () => {
  it('does not attach comments by default', () => {
    const { root } = PromQLParser.parse('# header\nup # trailing');
    const selector = root.expression as PromQLSelector;

    expect(selector.formatting).toBeUndefined();
    expect(root.formatting).toBeUndefined();
  });

  it('attaches comments when withFormatting is true', () => {
    const { root } = PromQLParser.parse('# header\nup # trailing', { withFormatting: true });
    const selector = root.expression as PromQLSelector;

    expect(selector.formatting?.top?.[0]?.text).toBe(' header');
    expect(selector.formatting?.rightSingleLine?.text).toBe(' trailing');
  });

  it('respects the offset option when attaching comments', () => {
    const { root } = PromQLParser.parse('# header\nup', { withFormatting: true, offset: 100 });
    const selector = root.expression as PromQLSelector;
    const comment = selector.formatting?.top?.[0];

    expect(comment?.text).toBe(' header');
    expect(comment?.location).toEqual({ min: 100, max: 107 });
  });
});
