/*
 * Copyright Elasticsearch B.V. and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { escapeIdentifier } from '@elastic/elasticsearch-query-builder';
import { InstrumentedExpression } from './expression';

/**
 * Creates an {@link InstrumentedExpression} from a column name. Alias for {@link E}.
 *
 * @param name - The column name to reference.
 */
export function col(name: string): InstrumentedExpression {
  if (typeof name !== 'string' || name.length === 0) {
    throw new Error('col() requires a non-empty string');
  }
  return new InstrumentedExpression(escapeIdentifier(name));
}
