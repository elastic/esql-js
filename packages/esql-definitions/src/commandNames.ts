/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

export const headerCommandNames = ['SET'];

export const sourceCommandNames = ['EXPLAIN', 'FROM', 'PROMQL', 'ROW', 'SHOW', 'TS'];

export const processingCommandNames = [
  'CHANGE_POINT',
  'COMPLETION',
  'DEDUP',
  'DISSECT',
  'DROP',
  'ENRICH',
  'EVAL',
  'EXTERNAL',
  'FORK',
  'FULL JOIN',
  'FUSE',
  'GROK',
  'HIGHLIGHT',
  'INLINE',
  'INLINESTATS',
  'INSIST',
  'IP_LOCATION',
  'JOIN',
  'KEEP',
  'LEFT JOIN',
  'LIMIT',
  'LOOKUP',
  'LOOKUP JOIN',
  'METRICS_INFO',
  'MMR',
  'MV_EXPAND',
  'REGISTERED_DOMAIN',
  'RENAME',
  'RERANK',
  'RIGHT JOIN',
  'SAMPLE',
  'SORT',
  'STATS',
  'TS_COLLAPSE',
  'TS_INFO',
  'URI_PARTS',
  'USER_AGENT',
  'WHERE',
];

/* Legacy commands - don't exist anymore */
export const legacyCommandNames = ['METRICS', 'OPTIONS', 'TIMESERIES'];

export const commandNames = [
  ...headerCommandNames,
  ...sourceCommandNames,
  ...processingCommandNames,
  ...legacyCommandNames,
];
