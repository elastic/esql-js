/*
 * Copyright Elasticsearch B.V. and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { f } from '../..';

describe('vector functions', () => {
  it('vCosine', () => {
    expect(f.vCosine('v1', 'v2').toString()).toBe('V_COSINE(v1, v2)');
  });

  it('vDotProduct', () => {
    expect(f.vDotProduct('v1', 'v2').toString()).toBe('V_DOT_PRODUCT(v1, v2)');
  });

  it('vHamming', () => {
    expect(f.vHamming('v1', 'v2').toString()).toBe('V_HAMMING(v1, v2)');
  });

  it('vL1Norm', () => {
    expect(f.vL1Norm('v1', 'v2').toString()).toBe('V_L1_NORM(v1, v2)');
  });

  it('vL2Norm', () => {
    expect(f.vL2Norm('v1', 'v2').toString()).toBe('V_L2_NORM(v1, v2)');
  });

  it('vMagnitude', () => {
    expect(f.vMagnitude('v').toString()).toBe('V_MAGNITUDE(v)');
  });
});
