/*
 * Copyright Elasticsearch B.V. and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { E, f } from '../..';

describe('geo functions', () => {
  it('stDistance', () => {
    expect(f.stDistance(E('location1'), E('location2')).toString()).toBe(
      'ST_DISTANCE(location1, location2)'
    );
  });

  it('stIntersects', () => {
    expect(f.stIntersects(E('geo1'), E('geo2')).toString()).toBe('ST_INTERSECTS(geo1, geo2)');
  });

  it('stContains', () => {
    expect(f.stContains(E('polygon'), E('point')).toString()).toBe('ST_CONTAINS(polygon, point)');
  });

  it('stWithin', () => {
    expect(f.stWithin(E('point'), E('polygon')).toString()).toBe('ST_WITHIN(point, polygon)');
  });

  it('stX', () => {
    expect(f.stX(E('point')).toString()).toBe('ST_X(point)');
  });

  it('stY', () => {
    expect(f.stY(E('point')).toString()).toBe('ST_Y(point)');
  });

  it('stDisjoint', () => {
    expect(f.stDisjoint(E('geo1'), E('geo2')).toString()).toBe('ST_DISJOINT(geo1, geo2)');
  });
});
