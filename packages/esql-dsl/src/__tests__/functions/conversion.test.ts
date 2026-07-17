/*
 * Copyright Elasticsearch B.V. and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { E, f } from '../..';

describe('conversion functions', () => {
  it('toBoolean', () => {
    expect(f.toBoolean(E('value')).toString()).toBe('TO_BOOLEAN(value)');
  });

  it('toDouble', () => {
    expect(f.toDouble(E('value')).toString()).toBe('TO_DOUBLE(value)');
  });

  it('toInteger', () => {
    expect(f.toInteger(E('str')).toString()).toBe('TO_INTEGER(str)');
  });

  it('toLong', () => {
    expect(f.toLong(E('value')).toString()).toBe('TO_LONG(value)');
  });

  it('toString_', () => {
    expect(f.toString_(E('value')).toString()).toBe('TO_STRING(value)');
  });

  it('toIp', () => {
    expect(f.toIp(E('ip_string')).toString()).toBe('TO_IP(ip_string)');
  });

  it('toVersion', () => {
    expect(f.toVersion(E('version_string')).toString()).toBe('TO_VERSION(version_string)');
  });

  it('toUnsignedLong', () => {
    expect(f.toUnsignedLong(E('value')).toString()).toBe('TO_UNSIGNED_LONG(value)');
  });

  it('toGeoPoint', () => {
    expect(f.toGeoPoint(E('point')).toString()).toBe('TO_GEOPOINT(point)');
  });

  it('toGeoShape', () => {
    expect(f.toGeoShape(E('shape')).toString()).toBe('TO_GEOSHAPE(shape)');
  });

  it('toCartesianPoint', () => {
    expect(f.toCartesianPoint(E('point')).toString()).toBe('TO_CARTESIANPOINT(point)');
  });

  it('toCartesianShape', () => {
    expect(f.toCartesianShape(E('shape')).toString()).toBe('TO_CARTESIANSHAPE(shape)');
  });

  it('works with string field names', () => {
    expect(f.toInteger('count').toString()).toBe('TO_INTEGER(count)');
  });
});
