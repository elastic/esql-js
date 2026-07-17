/*
 * Copyright Elasticsearch B.V. and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { E, f } from '../..';

describe('math functions', () => {
  it('abs', () => {
    expect(f.abs(E('value')).toString()).toBe('ABS(value)');
    expect(f.abs('value').toString()).toBe('ABS(value)');
  });

  it('ceil', () => {
    expect(f.ceil(E('value')).toString()).toBe('CEIL(value)');
  });

  it('floor', () => {
    expect(f.floor(E('value')).toString()).toBe('FLOOR(value)');
  });

  it('round without decimals', () => {
    expect(f.round(E('value')).toString()).toBe('ROUND(value)');
  });

  it('round with decimals', () => {
    expect(f.round(E('price'), 2).toString()).toBe('ROUND(price, 2)');
  });

  it('sqrt', () => {
    expect(f.sqrt(E('value')).toString()).toBe('SQRT(value)');
  });

  it('pow', () => {
    expect(f.pow(E('base'), 2).toString()).toBe('POW(base, 2)');
    expect(f.pow(E('base'), E('exp')).toString()).toBe('POW(base, exp)');
  });

  it('log without base', () => {
    expect(f.log(E('value')).toString()).toBe('LOG(value)');
  });

  it('log with base', () => {
    expect(f.log(E('value'), 2).toString()).toBe('LOG(value, 2)');
  });

  it('log10', () => {
    expect(f.log10(E('value')).toString()).toBe('LOG10(value)');
  });

  it('exp', () => {
    expect(f.exp(E('value')).toString()).toBe('EXP(value)');
  });

  it('sin', () => {
    expect(f.sin(E('angle')).toString()).toBe('SIN(angle)');
  });

  it('cos', () => {
    expect(f.cos(E('angle')).toString()).toBe('COS(angle)');
  });

  it('tan', () => {
    expect(f.tan(E('angle')).toString()).toBe('TAN(angle)');
  });

  it('asin', () => {
    expect(f.asin(E('value')).toString()).toBe('ASIN(value)');
  });

  it('acos', () => {
    expect(f.acos(E('value')).toString()).toBe('ACOS(value)');
  });

  it('atan', () => {
    expect(f.atan(E('value')).toString()).toBe('ATAN(value)');
  });

  it('atan2', () => {
    expect(f.atan2(E('y'), E('x')).toString()).toBe('ATAN2(y, x)');
  });

  it('pi', () => {
    expect(f.pi().toString()).toBe('PI()');
  });

  it('tau', () => {
    expect(f.tau().toString()).toBe('TAU()');
  });

  it('e', () => {
    expect(f.e().toString()).toBe('E()');
  });

  it('signum', () => {
    expect(f.signum(E('value')).toString()).toBe('SIGNUM(value)');
  });

  it('cbrt', () => {
    expect(f.cbrt(E('value')).toString()).toBe('CBRT(value)');
  });

  it('hypot', () => {
    expect(f.hypot(E('a'), E('b')).toString()).toBe('HYPOT(a, b)');
  });
});
