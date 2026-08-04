/*
 * Copyright Elasticsearch B.V. and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESQL } from '../..';

describe('completion', () => {
  it('renders basic completion with string prompt', () => {
    const q = ESQL.from('docs').completion('Summarize this document');
    expect(q.render()).toBe('FROM docs\n| COMPLETION "Summarize this document"');
  });

  it('renders completion with options', () => {
    const q = ESQL.from('docs')
      .completion('Summarize this document')
      .with({ inferenceId: 'my-llm' });
    expect(q.render()).toBe(
      'FROM docs\n| COMPLETION "Summarize this document" WITH inferenceId = "my-llm"'
    );
  });

  it('renders named prompt (record form)', () => {
    const q = ESQL.from('docs').completion({ summary: 'Summarize the content' });
    expect(q.render()).toBe('FROM docs\n| COMPLETION summary = "Summarize the content"');
  });

  it('renders named prompt with options', () => {
    const q = ESQL.from('docs')
      .completion({ summary: 'Summarize' })
      .with({ inferenceId: 'my-llm' });
    expect(q.render()).toBe(
      'FROM docs\n| COMPLETION summary = "Summarize" WITH inferenceId = "my-llm"'
    );
  });

  it('chains with subsequent commands', () => {
    const q = ESQL.from('docs')
      .completion('Summarize this')
      .with({ inferenceId: 'my-llm' })
      .keep('title', 'summary')
      .limit(10);
    expect(q.render()).toBe(
      'FROM docs\n| COMPLETION "Summarize this" WITH inferenceId = "my-llm"\n| KEEP title, summary\n| LIMIT 10'
    );
  });
});

describe('rerank', () => {
  it('renders basic rerank', () => {
    const q = ESQL.from('docs').rerank('user query');
    expect(q.render()).toBe('FROM docs\n| RERANK "user query"');
  });

  it('renders rerank with ON fields', () => {
    const q = ESQL.from('docs').rerank('user query').on('title', 'body');
    expect(q.render()).toBe('FROM docs\n| RERANK "user query" ON title, body');
  });

  it('renders rerank with options', () => {
    const q = ESQL.from('docs')
      .rerank('user query')
      .on('title', 'body')
      .with({ inferenceId: 'my-reranker', topN: 10 });
    expect(q.render()).toBe(
      'FROM docs\n| RERANK "user query" ON title, body WITH inferenceId = "my-reranker", topN = 10'
    );
  });

  it('chains with subsequent commands', () => {
    const q = ESQL.from('docs')
      .rerank('search query')
      .on('title')
      .with({ inferenceId: 'my-reranker' })
      .limit(5);
    expect(q.render()).toBe(
      'FROM docs\n| RERANK "search query" ON title WITH inferenceId = "my-reranker"\n| LIMIT 5'
    );
  });

  it('is immutable', () => {
    const base = ESQL.from('docs').rerank('query');
    const r1 = base.on('title');
    const r2 = base.on('body');
    expect(r1.render()).toBe('FROM docs\n| RERANK "query" ON title');
    expect(r2.render()).toBe('FROM docs\n| RERANK "query" ON body');
  });
});
