/*
 * Copyright Elasticsearch B.V. and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { f } from '../..';

describe('hash functions', () => {
  it('hash', () => {
    expect(f.hash('sha256', 'message').toString()).toBe('HASH("sha256", message)');
  });

  it('md5', () => {
    expect(f.md5('field').toString()).toBe('MD5(field)');
  });

  it('sha1', () => {
    expect(f.sha1('field').toString()).toBe('SHA1(field)');
  });

  it('sha256', () => {
    expect(f.sha256('field').toString()).toBe('SHA256(field)');
  });
});

describe('URL functions', () => {
  it('urlDecode', () => {
    expect(f.urlDecode('url').toString()).toBe('URL_DECODE(url)');
  });

  it('urlEncode', () => {
    expect(f.urlEncode('url').toString()).toBe('URL_ENCODE(url)');
  });

  it('urlEncodeComponent', () => {
    expect(f.urlEncodeComponent('path').toString()).toBe('URL_ENCODE_COMPONENT(path)');
  });
});
