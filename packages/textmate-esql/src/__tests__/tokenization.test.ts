/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the MIT license (the "License"); you may
 * not use this file except in compliance with the License.
 */

import { processingCommandNames, sourceCommandNames } from '@elastic/esql-definitions/commandNames';
import { functionNames } from '@elastic/esql-definitions/functionNames';
import {
  createHighlighter,
  createJavaScriptRegexEngine,
  type Highlighter,
  type LanguageRegistration,
} from 'shiki';
import { grammar } from '..';

let highlighter: Highlighter;

beforeAll(async () => {
  highlighter = await createHighlighter({
    themes: ['github-dark'],
    langs: [{ ...grammar, name: 'esql' } as unknown as LanguageRegistration],
    engine: createJavaScriptRegexEngine(),
  });
}, 30_000);

afterAll(() => {
  highlighter.dispose();
});

const tokenize = (code: string): Array<[string, string]> => {
  const lines = highlighter.codeToTokensBase(code, {
    lang: 'esql',
    theme: 'github-dark',
    includeExplanation: 'scopeName',
  });

  const pairs: Array<[string, string]> = [];

  for (const line of lines) {
    for (const token of line) {
      for (const explanation of token.explanation ?? []) {
        if (!explanation.content.trim()) continue;
        const scopes = explanation.scopes.map((scope) => scope.scopeName);
        pairs.push([explanation.content, scopes[scopes.length - 1]]);
      }
    }
  }

  return pairs;
};

/** Returns the scope of the first token whose text matches. */
const scopeOf = (code: string, tokenText: string): string | undefined =>
  tokenize(code).find(([text]) => text.trim() === tokenText)?.[1];

describe('commands', () => {
  test.each(sourceCommandNames)('source command %s', (command) => {
    expect(scopeOf(`${command} something`, command)).toBe('keyword.control.source.esql');
  });

  test('SHOW INFO is matched as a single source command token', () => {
    expect(scopeOf('SHOW INFO', 'SHOW INFO')).toBe('keyword.control.source.esql');
  });

  const singleWordProcessing = processingCommandNames.filter((name) => !name.includes(' '));
  const multiWordProcessing = processingCommandNames.filter((name) => name.includes(' '));

  test.each(singleWordProcessing)('processing command %s', (command) => {
    expect(scopeOf(`FROM a | ${command} x`, command)).toBe('keyword.control.processing.esql');
  });

  test.each(multiWordProcessing)('multi-word processing command %s', (command) => {
    expect(scopeOf(`FROM a | ${command} x`, command)).toBe('keyword.control.processing.esql');
  });

  test('header command SET', () => {
    expect(scopeOf('SET a = 1;', 'SET')).toBe('keyword.control.header.esql');
  });

  test('commands are case-insensitive', () => {
    expect(scopeOf('from a', 'from')).toBe('keyword.control.source.esql');
    expect(scopeOf('FROM a | where x', 'where')).toBe('keyword.control.processing.esql');
  });
});

describe('functions', () => {
  test.each(functionNames)('function %s followed by ( is a function call', (fn) => {
    const pairs = tokenize(`ROW ${fn}(1)`);
    const fnToken = pairs.find(([text]) => text === fn);
    expect(fnToken?.[1]).toBe('support.function.esql');
  });

  test('function name without parenthesis is not a function call', () => {
    expect(scopeOf('FROM a | KEEP abs', 'abs')).not.toBe('support.function.esql');
  });

  test('longest name wins over its prefix', () => {
    expect(scopeOf('ROW MV_MEDIAN_ABSOLUTE_DEVIATION(x)', 'MV_MEDIAN_ABSOLUTE_DEVIATION')).toBe(
      'support.function.esql'
    );
  });
});

describe('keywords and operators', () => {
  test('option keywords', () => {
    expect(scopeOf('FROM a | STATS c = COUNT(*) BY x', 'BY')).toBe('keyword.other.option.esql');
    expect(scopeOf('FROM a METADATA _index', 'METADATA')).toBe('keyword.other.option.esql');
  });

  test('named operators', () => {
    expect(scopeOf('FROM a | WHERE x LIKE "y*"', 'LIKE')).toBe('keyword.operator.word.esql');
    expect(scopeOf('FROM a | WHERE x IS NULL AND y > 1', 'AND')).toBe('keyword.operator.word.esql');
    expect(scopeOf('FROM a | SORT x DESC NULLS LAST', 'NULLS')).toBe('keyword.operator.word.esql');
  });

  test('pipe', () => {
    expect(scopeOf('FROM a | LIMIT 1', '|')).toBe('keyword.operator.pipe.esql');
  });

  test('comparison, assignment and arithmetic operators', () => {
    expect(scopeOf('FROM a | WHERE x == 1', '==')).toBe('keyword.operator.comparison.esql');
    expect(scopeOf('FROM a | EVAL y = 1', '=')).toBe('keyword.operator.assignment.esql');
    expect(scopeOf('FROM a | EVAL y = x % 2', '%')).toBe('keyword.operator.arithmetic.esql');
  });
});

describe('literals', () => {
  test('boolean and null literals', () => {
    expect(scopeOf('ROW a = TRUE', 'TRUE')).toBe('constant.language.esql');
    expect(scopeOf('ROW a = false', 'false')).toBe('constant.language.esql');
    expect(scopeOf('ROW a = NULL', 'NULL')).toBe('constant.language.esql');
  });

  test('numbers', () => {
    expect(scopeOf('ROW a = 42', '42')).toBe('constant.numeric.integer.esql');
    expect(scopeOf('ROW a = 3.14', '3.14')).toBe('constant.numeric.float.esql');
    expect(scopeOf('ROW a = 1e10', '1e10')).toBe('constant.numeric.float.esql');
    expect(scopeOf('ROW a = 1_000_000', '1_000_000')).toBe('constant.numeric.integer.esql');
  });

  test('time intervals', () => {
    expect(scopeOf('FROM a | WHERE t > NOW() - 1 hour', '1 hour')).toBe(
      'constant.numeric.time.esql'
    );
    expect(scopeOf('ROW a = 5 minutes', '5 minutes')).toBe('constant.numeric.time.esql');
  });

  test('strings', () => {
    const pairs = tokenize('ROW a = "hello"');
    expect(pairs.some(([, scope]) => scope === 'string.quoted.double.esql')).toBe(true);
  });

  test('triple-quoted strings', () => {
    const pairs = tokenize('ROW a = """raw "quoted" text"""');
    expect(pairs.some(([, scope]) => scope === 'string.quoted.triple.esql')).toBe(true);
  });

  test('escape sequences in double-quoted strings', () => {
    const pairs = tokenize('ROW a = "line\\nbreak"');
    expect(pairs.some(([, scope]) => scope === 'constant.character.escape.esql')).toBe(true);
  });
});

describe('parameters and casts', () => {
  test('named, positional and unnamed parameters', () => {
    expect(scopeOf('FROM a | WHERE x == ?name', '?name')).toBe('variable.parameter.named.esql');
    expect(scopeOf('FROM a | WHERE x == ?1', '?1')).toBe('variable.parameter.positional.esql');
    expect(scopeOf('FROM a | WHERE x == ?', '?')).toBe('variable.parameter.unnamed.esql');
  });

  test('type cast', () => {
    expect(scopeOf('ROW a = 1::long', '::long')).toBe('storage.type.esql');
  });
});

describe('comments', () => {
  test('line comment', () => {
    expect(scopeOf('FROM a // trailing', '// trailing')).toBe('comment.line.double-slash.esql');
  });

  test('block comment', () => {
    const pairs = tokenize('FROM a /* block */ | LIMIT 1');
    expect(pairs.some(([, scope]) => scope.startsWith('comment.block'))).toBe(true);
  });

  test('doc comment', () => {
    const pairs = tokenize('/** doc */ FROM a');
    expect(pairs.some(([, scope]) => scope === 'comment.block.documentation.esql')).toBe(true);
  });
});
