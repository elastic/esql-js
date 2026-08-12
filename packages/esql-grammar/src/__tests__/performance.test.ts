/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { CharStream, CommonTokenStream } from 'antlr4';
import { default as ESQLLexer } from '../esql_lexer';
import { default as ESQLParser } from '../esql_parser';

const QUERY_WITH_MANY_DASHES = `
FROM logs-*
| WHERE @timestamp >= "2024-01-15" AND @timestamp < "2024-12-31"
    AND response_time - latency > 0
    AND price - discount - tax > -1
| EVAL diff = end_date - start_date, adjusted = value - 1
| STATS
    avg_val = AVG(price - cost),
    net     = SUM(revenue - expense)
  BY category
| SORT avg_val DESC
| LIMIT 100
`.trim();

const ITERATIONS = 200;
const MAX_MS_PER_PARSE = 40;

describe('lexer/parser performance', () => {
  it(`parses in under ${MAX_MS_PER_PARSE} ms/parse on a query with many '-' characters`, () => {
    // Warm up
    for (let i = 0; i < 10; i++) {
      const lexer = new ESQLLexer(new CharStream(QUERY_WITH_MANY_DASHES));
      new CommonTokenStream(lexer).fill();
    }

    const start = performance.now();
    for (let i = 0; i < ITERATIONS; i++) {
      const lexer = new ESQLLexer(new CharStream(QUERY_WITH_MANY_DASHES));
      const stream = new CommonTokenStream(lexer);
      const parser = new ESQLParser(stream);
      parser.removeErrorListeners();
      parser.singleStatement();
    }
    const msPerParse = (performance.now() - start) / ITERATIONS;

    expect(msPerParse).toBeLessThan(MAX_MS_PER_PARSE);
  }, 30_000);
});
