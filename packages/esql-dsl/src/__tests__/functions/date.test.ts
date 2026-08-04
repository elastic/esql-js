/*
 * Copyright Elasticsearch B.V. and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { E, f } from '../..';

describe('date functions', () => {
  it('now', () => {
    expect(f.now().toString()).toBe('NOW()');
  });

  it('dateDiff', () => {
    expect(f.dateDiff('day', E('start'), E('end')).toString()).toBe('DATE_DIFF("day", start, end)');
  });

  it('dateExtract', () => {
    expect(f.dateExtract('year', E('@timestamp')).toString()).toBe(
      'DATE_EXTRACT("year", @timestamp)'
    );
  });

  it('dateFormat with format', () => {
    expect(f.dateFormat(E('@timestamp'), 'yyyy-MM-dd').toString()).toBe(
      'DATE_FORMAT(@timestamp, "yyyy-MM-dd")'
    );
  });

  it('dateFormat without format', () => {
    expect(f.dateFormat(E('@timestamp')).toString()).toBe('DATE_FORMAT(@timestamp)');
  });

  it('dateParse', () => {
    expect(f.dateParse('2024-01-15', 'yyyy-MM-dd').toString()).toBe(
      'DATE_PARSE("2024-01-15", "yyyy-MM-dd")'
    );
  });

  it('dateTrunc', () => {
    expect(f.dateTrunc(E('@timestamp'), '1 day').toString()).toBe(
      'DATE_TRUNC(@timestamp, "1 day")'
    );
  });

  it('toDatetime', () => {
    expect(f.toDatetime(E('date_string')).toString()).toBe('TO_DATETIME(date_string)');
    expect(f.toDatetime('date_string').toString()).toBe('TO_DATETIME(date_string)');
  });

  it('dateAdd', () => {
    expect(f.dateAdd(E('@timestamp'), 1, 'day').toString()).toBe('DATE_ADD(@timestamp, 1, "day")');
  });

  it('dateDiff with expression args', () => {
    expect(f.dateDiff('hour', E('created_at'), f.now()).toString()).toBe(
      'DATE_DIFF("hour", created_at, NOW())'
    );
  });
});
