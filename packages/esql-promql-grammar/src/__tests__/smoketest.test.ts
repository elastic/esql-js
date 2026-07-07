/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import {
  CharStream,
  CommonTokenStream,
  ErrorListener,
  Recognizer,
  RecognitionException,
} from 'antlr4';
import { default as PromQLLexer } from '../promql_lexer';
import { default as PromQLParser } from '../promql_parser';

class TestErrorListener extends ErrorListener<unknown> {
  private errors: string[] = [];
  syntaxError(
    _recognizer: Recognizer<unknown>,
    _offendingSymbol: unknown,
    _line: number,
    _column: number,
    message: string,
    _error: RecognitionException | null
  ): void {
    this.errors.push(message);
  }
  getErrors(): string[] {
    return this.errors;
  }
}

describe('PromQL Lexer/Parser', () => {
  it('should lex a simple metric name', () => {
    const text = 'up';
    const lexer = new PromQLLexer(new CharStream(text));
    const stream = new CommonTokenStream(lexer);

    stream.fill();

    const types = stream.tokens.map((token) => token.type);
    // IDENTIFIER token followed by EOF (-1)
    expect(types).toHaveLength(2);
  });

  it('should parse a simple metric selector', () => {
    const text = 'up';
    const lexer = new PromQLLexer(new CharStream(text));
    const stream = new CommonTokenStream(lexer);
    const parser = new PromQLParser(stream);

    const errorListener = new TestErrorListener();
    parser.removeErrorListeners();
    parser.addErrorListener(errorListener);

    parser.singleStatement();

    expect(errorListener.getErrors()).toHaveLength(0);
  });

  it('should parse an arithmetic expression', () => {
    const text = 'http_requests_total + 1';
    const lexer = new PromQLLexer(new CharStream(text));
    const stream = new CommonTokenStream(lexer);
    const parser = new PromQLParser(stream);

    const errorListener = new TestErrorListener();
    parser.removeErrorListeners();
    parser.addErrorListener(errorListener);

    parser.singleStatement();

    expect(errorListener.getErrors()).toHaveLength(0);
  });
});
