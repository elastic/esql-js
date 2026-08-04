/*
 * Copyright Elasticsearch B.V. and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Symbol-based operators for POJO-style conditions (e.g. where({ field: { [Op.gt]: 5 } })).
 * Uses Symbol.for() so symbols are stable across module versions and work when Op is
 * imported from different packages.
 */
export const Op = {
  eq: Symbol.for('elastic.op.eq'),
  ne: Symbol.for('elastic.op.ne'),
  gt: Symbol.for('elastic.op.gt'),
  gte: Symbol.for('elastic.op.gte'),
  lt: Symbol.for('elastic.op.lt'),
  lte: Symbol.for('elastic.op.lte'),
  is: Symbol.for('elastic.op.is'),
  isNot: Symbol.for('elastic.op.isNot'),
  like: Symbol.for('elastic.op.like'),
  rlike: Symbol.for('elastic.op.rlike'),
  in: Symbol.for('elastic.op.in'),
  between: Symbol.for('elastic.op.between'),
  and: Symbol.for('elastic.op.and'),
  or: Symbol.for('elastic.op.or'),
  not: Symbol.for('elastic.op.not'),
} as const;

export type OpType = typeof Op;
