/*
 * Copyright Elasticsearch B.V. and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { VERSION } from '../index';

describe('search-dsl', () => {
  it('should export VERSION', () => {
    expect(VERSION).toBe('0.0.1');
  });
});
