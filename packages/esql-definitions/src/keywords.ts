/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

export const literalNames = ['TRUE', 'FALSE', 'NULL'];

/**
 * Keywords which appear as options or sub-clauses inside commands.
 */
export const optionNames = [
  'BY',
  'ON',
  'WITH',
  'METADATA',

  // Besides being a command, also a per-aggregation filter in STATS:
  // `STATS agg(field) WHERE condition`.
  'WHERE',

  'SCORE',
  'KEY',
  'GROUP',

  // Besides being a command, also an option of MMR: `MMR ... ON field LIMIT n`.
  'LIMIT',
];

/**
 * Keywords which modify SORT expressions.
 */
export const sortModifierNames = ['ASC', 'DESC', 'FIRST', 'LAST', 'NULLS'];

/**
 * Binary expressions with a latin name.
 */
export const namedBinaryOperatorNames = ['AND', 'OR', 'IS', 'IN', 'AS', 'LIKE', 'RLIKE'];

/**
 * Unary expressions with a latin name.
 */
export const namedUnaryOperatorNames = ['NOT'];
