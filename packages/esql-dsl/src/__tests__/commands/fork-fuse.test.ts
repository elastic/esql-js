/*
 * Copyright Elasticsearch B.V. and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESQL } from '../..';

describe('fork', () => {
  it('renders fork with two branches', () => {
    const q = ESQL.from('docs').fork(
      ESQL.branch().where('MATCH(title, "search")'),
      ESQL.branch().where('MATCH(body, "search")')
    );
    expect(q.render()).toBe(
      'FROM docs\n| FORK\n  (WHERE MATCH(title, "search"))\n  (WHERE MATCH(body, "search"))'
    );
  });

  it('renders fork with multi-command branches', () => {
    const q = ESQL.from('docs').fork(
      ESQL.branch().where('MATCH(title, "search")').sort('_score DESC'),
      ESQL.branch().where('MATCH(body, "search")').sort('_score DESC')
    );
    expect(q.render()).toBe(
      'FROM docs\n| FORK\n  (WHERE MATCH(title, "search") | SORT _score DESC)\n  (WHERE MATCH(body, "search") | SORT _score DESC)'
    );
  });

  it('renders fork with three branches', () => {
    const q = ESQL.from('docs').fork(
      ESQL.branch().where('a > 1'),
      ESQL.branch().where('b > 2'),
      ESQL.branch().where('c > 3')
    );
    expect(q.render()).toBe('FROM docs\n| FORK\n  (WHERE a > 1)\n  (WHERE b > 2)\n  (WHERE c > 3)');
  });

  it('branches can have different commands', () => {
    const q = ESQL.from('docs').fork(
      ESQL.branch().where('a > 1').limit(10),
      ESQL.branch().stats({ total: 'COUNT(*)' }).by('category')
    );
    expect(q.render()).toBe(
      'FROM docs\n| FORK\n  (WHERE a > 1 | LIMIT 10)\n  (STATS total = COUNT(*) BY category)'
    );
  });
});

describe('fuse', () => {
  it('renders fuse with RRF strategy', () => {
    const q = ESQL.from('docs')
      .fork(
        ESQL.branch().where('MATCH(title, "search")').sort('_score DESC'),
        ESQL.branch().where('MATCH(body, "search")').sort('_score DESC')
      )
      .fuse('RRF');
    expect(q.render()).toBe(
      'FROM docs\n| FORK\n  (WHERE MATCH(title, "search") | SORT _score DESC)\n  (WHERE MATCH(body, "search") | SORT _score DESC)\n| FUSE RRF'
    );
  });

  it('renders fuse with LINEAR strategy and weights', () => {
    const q = ESQL.from('docs')
      .fork(
        ESQL.branch().where('MATCH(title, "search")'),
        ESQL.branch().where('MATCH(body, "search")')
      )
      .fuse('LINEAR', { weights: [0.7, 0.3] });
    expect(q.render()).toBe(
      'FROM docs\n| FORK\n  (WHERE MATCH(title, "search"))\n  (WHERE MATCH(body, "search"))\n| FUSE LINEAR(0.7, 0.3)'
    );
  });

  it('chains with subsequent commands after fuse', () => {
    const q = ESQL.from('docs')
      .fork(
        ESQL.branch().where('MATCH(title, "search")'),
        ESQL.branch().where('MATCH(body, "search")')
      )
      .fuse('RRF')
      .limit(10)
      .keep('title', 'body', '_score');
    expect(q.render()).toBe(
      'FROM docs\n| FORK\n  (WHERE MATCH(title, "search"))\n  (WHERE MATCH(body, "search"))\n| FUSE RRF\n| LIMIT 10\n| KEEP title, body, _score'
    );
  });
});

describe('hybrid search pattern', () => {
  it('renders a complete hybrid search query', () => {
    const q = ESQL.from('articles')
      .fork(
        ESQL.branch().where('MATCH(title, "elasticsearch")').sort('_score DESC').limit(50),
        ESQL.branch().where('KNN(embedding, 10)').sort('_score DESC').limit(50)
      )
      .fuse('RRF')
      .limit(10);
    expect(q.render()).toBe(
      'FROM articles\n| FORK\n  (WHERE MATCH(title, "elasticsearch") | SORT _score DESC | LIMIT 50)\n  (WHERE KNN(embedding, 10) | SORT _score DESC | LIMIT 50)\n| FUSE RRF\n| LIMIT 10'
    );
  });
});
