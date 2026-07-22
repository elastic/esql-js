/*
 * Copyright Elasticsearch B.V. and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { E, ESQL, f } from '../..';

describe('search functions', () => {
  it('match', () => {
    expect(f.match('title', 'search').toString()).toBe('MATCH(title, "search")');
  });

  it('match with expression', () => {
    expect(f.match(E('title'), 'search query').toString()).toBe('MATCH(title, "search query")');
  });

  it('matchPhrase', () => {
    expect(f.matchPhrase('title', 'exact phrase').toString()).toBe(
      'MATCH_PHRASE(title, "exact phrase")'
    );
  });

  it('multiMatch', () => {
    expect(f.multiMatch('search', 'title', 'body').toString()).toBe(
      'MULTI_MATCH("search", title, body)'
    );
  });

  it('term', () => {
    expect(f.term('status', 'active').toString()).toBe('TERM(status, "active")');
  });

  it('kql', () => {
    expect(f.kql('status: active AND level: error').toString()).toBe(
      'KQL("status: active AND level: error")'
    );
  });

  it('qstr', () => {
    expect(f.qstr('title:search OR body:search').toString()).toBe(
      'QSTR("title:search OR body:search")'
    );
  });

  it('knn', () => {
    expect(f.knn('embedding', 10).toString()).toBe('KNN(embedding, 10)');
  });

  it('score', () => {
    expect(f.score().toString()).toBe('SCORE()');
  });

  it('decay', () => {
    expect(f.decay('gauss', 'location', 'origin', 'scale').toString()).toBe(
      'DECAY("gauss", location, origin, scale)'
    );
  });

  it('textEmbedding', () => {
    expect(f.textEmbedding('my-model', 'input text').toString()).toBe(
      'TEXT_EMBEDDING("my-model", "input text")'
    );
  });

  it('topSnippets', () => {
    expect(f.topSnippets('body').toString()).toBe('TOP_SNIPPETS(body)');
  });

  it('works in where clause', () => {
    const q = ESQL.from('articles').where(f.match('title', 'elasticsearch')).limit(10);
    expect(q.render()).toBe('FROM articles\n| WHERE MATCH(title, "elasticsearch")\n| LIMIT 10');
  });
});
