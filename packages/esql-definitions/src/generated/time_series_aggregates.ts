/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// DO NOT MODIFY THIS FILE BY HAND. IT IS GENERATED FROM `elasticsearch/` BY
// `pnpm --filter @elastic/esql-definitions generate`.

import type { TimeSeriesAggregateMap } from '../definition_types';

export const timeSeriesAggregates: TimeSeriesAggregateMap = {
  _tsid: {
    function: 'last_over_time',
    returnType: '_tsid',
  },
  counter_double: {
    function: 'last_over_time',
    returnType: 'double',
  },
  counter_integer: {
    function: 'last_over_time',
    returnType: 'integer',
  },
  counter_long: {
    function: 'last_over_time',
    returnType: 'long',
  },
  date: {
    function: 'last_over_time',
    returnType: 'date',
  },
  date_nanos: {
    function: 'last_over_time',
    returnType: 'date_nanos',
  },
  double: {
    function: 'last_over_time',
    returnType: 'double',
  },
  exponential_histogram: {
    function: 'histogram_merge_over_time',
    returnType: 'exponential_histogram',
  },
  flattened: {
    function: 'last_over_time',
    returnType: 'flattened',
  },
  integer: {
    function: 'last_over_time',
    returnType: 'integer',
  },
  ip: {
    function: 'last_over_time',
    returnType: 'ip',
  },
  keyword: {
    function: 'last_over_time',
    returnType: 'keyword',
  },
  long: {
    function: 'last_over_time',
    returnType: 'long',
  },
  tdigest: {
    function: 'histogram_merge_over_time',
    returnType: 'tdigest',
  },
  text: {
    function: 'last_over_time',
    returnType: 'keyword',
  },
};
