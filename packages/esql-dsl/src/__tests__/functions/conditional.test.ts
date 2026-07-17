/*
 * Copyright Elasticsearch B.V. and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { E, f } from '../..';

describe('conditional functions', () => {
  describe('case_', () => {
    it('single when/else', () => {
      const result = f.case_().when(E('x').gt(0), 'positive').else_('non-positive');
      expect(result.toString()).toBe('CASE WHEN x > 0 THEN "positive" ELSE "non-positive" END');
    });

    it('multiple when clauses', () => {
      const result = f
        .case_()
        .when(E('salary').lt(50000), 'Low')
        .when(E('salary').lt(100000), 'Medium')
        .else_('High');
      expect(result.toString()).toBe(
        'CASE WHEN salary < 50000 THEN "Low" WHEN salary < 100000 THEN "Medium" ELSE "High" END'
      );
    });

    it('with numeric results', () => {
      const result = f.case_().when(E('x').gt(0), 1).else_(0);
      expect(result.toString()).toBe('CASE WHEN x > 0 THEN 1 ELSE 0 END');
    });

    it('with expression results', () => {
      const result = f
        .case_()
        .when(E('discount').gt(0), E('price').mul(E('discount')))
        .else_(0);
      expect(result.toString()).toBe('CASE WHEN discount > 0 THEN price * discount ELSE 0 END');
    });

    it('build without else', () => {
      const result = f.case_().when(E('x').gt(0), 'yes').build();
      expect(result.toString()).toBe('CASE WHEN x > 0 THEN "yes" END');
    });

    it('is immutable', () => {
      const base = f.case_().when(E('x').gt(0), 'a');
      const branch1 = base.else_('b');
      const branch2 = base.when(E('x').lt(0), 'c').else_('d');
      expect(branch1.toString()).toBe('CASE WHEN x > 0 THEN "a" ELSE "b" END');
      expect(branch2.toString()).toBe('CASE WHEN x > 0 THEN "a" WHEN x < 0 THEN "c" ELSE "d" END');
    });
  });

  it('coalesce', () => {
    expect(f.coalesce(E('preferred_name'), E('first_name'), 'Unknown').toString()).toBe(
      'COALESCE(preferred_name, first_name, Unknown)'
    );
  });

  it('greatest', () => {
    expect(f.greatest(E('a'), E('b'), E('c')).toString()).toBe('GREATEST(a, b, c)');
  });

  it('least', () => {
    expect(f.least(E('a'), E('b'), E('c')).toString()).toBe('LEAST(a, b, c)');
  });

  it('nullif', () => {
    expect(f.nullif(E('a'), E('b')).toString()).toBe('NULLIF(a, b)');
  });
});
