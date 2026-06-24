import { CharStream, CommonTokenStream } from 'antlr4';
import { default as ESQLLexer } from './esql_lexer';
import { default as ESQLParser } from './esql_parser';
import { ESQLErrorListener } from '..';

describe('ES|QL Lexer/Parser', () => {
  it('should lex a simple query', () => {
    const text = 'FROM an_index';
    const lexer = new ESQLLexer(new CharStream(text));

    const stream = new CommonTokenStream(lexer);

    stream.fill();

    const symbolicNames = stream.tokens.map((token) => lexer.symbolicNames[token.type]);

    expect(symbolicNames).toEqual(['FROM', 'FROM_WS', 'UNQUOTED_SOURCE', undefined]);
  });

  it('should rewind to the current token start keeping a token prefix', () => {
    const lexer = new ESQLLexer(new CharStream('(FROM logs)')) as ESQLLexer & {
      rewindToTokenStart(charsToKeep: number): void;
    };

    lexer._tokenStartCharIndex = 0;
    lexer._tokenStartLine = 1;
    lexer._tokenStartColumn = 0;
    lexer._input.seek(6);
    lexer.line = 1;
    lexer.column = 6;

    lexer.rewindToTokenStart(1);

    expect(lexer._input.index).toBe(1);
    expect(lexer.line).toBe(1);
    expect(lexer.column).toBe(1);
  });

  it('should match token numbers between lexer and parser', () => {
    expect(ESQLLexer.FROM).toEqual(ESQLParser.FROM);
    expect(ESQLLexer.RENAME).toEqual(ESQLParser.RENAME);
    expect(ESQLLexer.PIPE).toEqual(ESQLParser.PIPE);
    expect(ESQLLexer.LAST).toEqual(ESQLParser.LAST);
    expect(ESQLLexer.SLASH).toEqual(ESQLParser.SLASH);
  });

  it('should parse a simple query', () => {
    const text = 'FROM an_index';
    const lexer = new ESQLLexer(new CharStream(text));
    const stream = new CommonTokenStream(lexer);

    const parser = new ESQLParser(stream);

    const errorListener = new ESQLErrorListener();
    parser.removeErrorListeners();
    parser.addErrorListener(errorListener);

    parser.singleStatement();

    expect(errorListener.getErrors()).toHaveLength(0);
  });
});
