/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { ESQLAstComment, ESQLLocation, ESQLSingleAstItem } from '../types.ts';

export const within = (
  inner: number | { location: ESQLLocation },
  outer: { location?: ESQLLocation } | ESQLSingleAstItem | ESQLAstComment | undefined
) => {
  if (!outer?.location) {
    return false;
  }

  if (typeof inner === 'number') {
    return Boolean(outer.location.min <= inner && outer.location.max >= inner);
  }

  return Boolean(
    outer.location.min <= inner.location.min && outer.location.max >= inner.location.max
  );
};
