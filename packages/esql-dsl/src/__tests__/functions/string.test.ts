/*
 * Copyright Elasticsearch B.V. and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { E, f } from '../..';

describe('string functions', () => {
  it('concat', () => {
    expect(f.concat(E('first_name'), ' ', E('last_name')).toString()).toBe(
      'CONCAT(first_name, " ", last_name)'
    );
  });

  it('length', () => {
    expect(f.length('name').toString()).toBe('LENGTH(name)');
    expect(f.length(E('name')).toString()).toBe('LENGTH(name)');
  });

  it('toUpper', () => {
    expect(f.toUpper('name').toString()).toBe('TO_UPPER(name)');
  });

  it('toLower', () => {
    expect(f.toLower('name').toString()).toBe('TO_LOWER(name)');
  });

  it('trim', () => {
    expect(f.trim('message').toString()).toBe('TRIM(message)');
  });

  it('ltrim', () => {
    expect(f.ltrim('message').toString()).toBe('LTRIM(message)');
  });

  it('rtrim', () => {
    expect(f.rtrim('message').toString()).toBe('RTRIM(message)');
  });

  it('substring with length', () => {
    expect(f.substring(E('name'), 0, 5).toString()).toBe('SUBSTRING(name, 0, 5)');
  });

  it('substring without length', () => {
    expect(f.substring(E('name'), 3).toString()).toBe('SUBSTRING(name, 3)');
  });

  it('left', () => {
    expect(f.left(E('name'), 3).toString()).toBe('LEFT(name, 3)');
  });

  it('right', () => {
    expect(f.right(E('name'), 3).toString()).toBe('RIGHT(name, 3)');
  });

  it('replace', () => {
    expect(f.replace(E('text'), 'old', 'new').toString()).toBe('REPLACE(text, "old", "new")');
  });

  it('split', () => {
    expect(f.split(E('tags'), ',').toString()).toBe('SPLIT(tags, ",")');
  });

  it('startsWith', () => {
    expect(f.startsWith(E('name'), 'J').toString()).toBe('STARTS_WITH(name, "J")');
  });

  it('endsWith', () => {
    expect(f.endsWith(E('email'), '.com').toString()).toBe('ENDS_WITH(email, ".com")');
  });

  it('locate', () => {
    expect(f.locate(E('text'), 'needle').toString()).toBe('LOCATE(text, "needle")');
  });

  it('repeat', () => {
    expect(f.repeat(E('char'), 3).toString()).toBe('REPEAT(char, 3)');
  });

  it('reverse', () => {
    expect(f.reverse('name').toString()).toBe('REVERSE(name)');
  });

  it('space', () => {
    expect(f.space(5).toString()).toBe('SPACE(5)');
  });

  it('toBase64', () => {
    expect(f.toBase64('data').toString()).toBe('TO_BASE64(data)');
  });

  it('fromBase64', () => {
    expect(f.fromBase64('encoded').toString()).toBe('FROM_BASE64(encoded)');
  });
});
