/*
 * Copyright Elasticsearch B.V. and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ExpressionLike } from '@elastic/elasticsearch-query-builder';
import { InstrumentedExpression } from '../expression';
import { fn } from '../fn';

/** ES|QL `ABS` — returns absolute value. */
export function abs(value: ExpressionLike): InstrumentedExpression {
  return fn('ABS', value);
}

/** ES|QL `CEIL` — rounds up to nearest integer. */
export function ceil(value: ExpressionLike): InstrumentedExpression {
  return fn('CEIL', value);
}

/** ES|QL `FLOOR` — rounds down to nearest integer. */
export function floor(value: ExpressionLike): InstrumentedExpression {
  return fn('FLOOR', value);
}

/** ES|QL `ROUND` — rounds to nearest integer or given decimals. */
export function round(value: ExpressionLike, decimals?: number): InstrumentedExpression {
  if (decimals !== undefined) {
    return fn('ROUND', value, decimals);
  }
  return fn('ROUND', value);
}

/** ES|QL `SQRT` — returns square root. */
export function sqrt(value: ExpressionLike): InstrumentedExpression {
  return fn('SQRT', value);
}

/** ES|QL `POW` — raises base to exponent. */
export function pow(base: ExpressionLike, exp: ExpressionLike): InstrumentedExpression {
  return fn('POW', base, exp);
}

/** ES|QL `LOG` — returns logarithm (natural or given base). */
export function log(value: ExpressionLike, base?: ExpressionLike): InstrumentedExpression {
  if (base !== undefined) {
    return fn('LOG', value, base);
  }
  return fn('LOG', value);
}

/** ES|QL `LOG10` — returns base-10 logarithm. */
export function log10(value: ExpressionLike): InstrumentedExpression {
  return fn('LOG10', value);
}

/** ES|QL `EXP` — returns e raised to the power of value. */
export function exp(value: ExpressionLike): InstrumentedExpression {
  return fn('EXP', value);
}

/** ES|QL `SIN` — returns sine of angle in radians. */
export function sin(angle: ExpressionLike): InstrumentedExpression {
  return fn('SIN', angle);
}

/** ES|QL `COS` — returns cosine of angle in radians. */
export function cos(angle: ExpressionLike): InstrumentedExpression {
  return fn('COS', angle);
}

/** ES|QL `TAN` — returns tangent of angle in radians. */
export function tan(angle: ExpressionLike): InstrumentedExpression {
  return fn('TAN', angle);
}

/** ES|QL `ASIN` — returns arc sine. */
export function asin(value: ExpressionLike): InstrumentedExpression {
  return fn('ASIN', value);
}

/** ES|QL `ACOS` — returns arc cosine. */
export function acos(value: ExpressionLike): InstrumentedExpression {
  return fn('ACOS', value);
}

/** ES|QL `ATAN` — returns arc tangent. */
export function atan(value: ExpressionLike): InstrumentedExpression {
  return fn('ATAN', value);
}

/** ES|QL `ATAN2` — returns arc tangent of y/x. */
export function atan2(y: ExpressionLike, x: ExpressionLike): InstrumentedExpression {
  return fn('ATAN2', y, x);
}

/** ES|QL `PI` — returns the constant π. */
export function pi(): InstrumentedExpression {
  return new InstrumentedExpression('PI()');
}

/** ES|QL `TAU` — returns the constant 2π. */
export function tau(): InstrumentedExpression {
  return new InstrumentedExpression('TAU()');
}

/** ES|QL `E` — returns the constant e. */
export function e(): InstrumentedExpression {
  return new InstrumentedExpression('E()');
}

/** ES|QL `SIGNUM` — returns the sign of a number (-1, 0, 1). */
export function signum(value: ExpressionLike): InstrumentedExpression {
  return fn('SIGNUM', value);
}

/** ES|QL `CBRT` — returns cube root. */
export function cbrt(value: ExpressionLike): InstrumentedExpression {
  return fn('CBRT', value);
}

/** ES|QL `HYPOT` — returns hypotenuse of right triangle. */
export function hypot(a: ExpressionLike, b: ExpressionLike): InstrumentedExpression {
  return fn('HYPOT', a, b);
}

/** ES|QL `COSH` — returns hyperbolic cosine. */
export function cosh(value: ExpressionLike): InstrumentedExpression {
  return fn('COSH', value);
}

/** ES|QL `SINH` — returns hyperbolic sine. */
export function sinh(value: ExpressionLike): InstrumentedExpression {
  return fn('SINH', value);
}

/** ES|QL `TANH` — returns hyperbolic tangent. */
export function tanh(value: ExpressionLike): InstrumentedExpression {
  return fn('TANH', value);
}

/** ES|QL `CLAMP` — clamps value between min and max. */
export function clamp(
  value: ExpressionLike,
  min: ExpressionLike,
  max: ExpressionLike
): InstrumentedExpression {
  return fn('CLAMP', value, min, max);
}

/** ES|QL `CLAMP_MAX` — clamps value to maximum. */
export function clampMax(value: ExpressionLike, max: ExpressionLike): InstrumentedExpression {
  return fn('CLAMP_MAX', value, max);
}

/** ES|QL `CLAMP_MIN` — clamps value to minimum. */
export function clampMin(value: ExpressionLike, min: ExpressionLike): InstrumentedExpression {
  return fn('CLAMP_MIN', value, min);
}

/** ES|QL `COPY_SIGN` — returns magnitude with sign of sign argument. */
export function copySign(magnitude: ExpressionLike, sign: ExpressionLike): InstrumentedExpression {
  return fn('COPY_SIGN', magnitude, sign);
}

/** ES|QL `SCALB` — scales value by 2^exp. */
export function scalb(value: ExpressionLike, exp: ExpressionLike): InstrumentedExpression {
  return fn('SCALB', value, exp);
}

/** ES|QL `TO_DEGREES` — converts radians to degrees. */
export function toDegrees(radians: ExpressionLike): InstrumentedExpression {
  return fn('TO_DEGREES', radians);
}

/** ES|QL `TO_RADIANS` — converts degrees to radians. */
export function toRadians(degrees: ExpressionLike): InstrumentedExpression {
  return fn('TO_RADIANS', degrees);
}

/** ES|QL `ROUND_TO` — rounds value to nearest multiple. */
export function roundTo(value: ExpressionLike, ...rest: ExpressionLike[]): InstrumentedExpression {
  return fn('ROUND_TO', value, ...rest);
}
