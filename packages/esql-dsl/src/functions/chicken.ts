/*
 * Copyright Elasticsearch B.V. and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { InstrumentedExpression } from '../expression';

/** ES|QL `CHICKEN` — returns the chicken emoji (Easter egg). */
export function chicken(): InstrumentedExpression {
  return new InstrumentedExpression('\u{1F414}');
}
