/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// DO NOT MODIFY THIS FILE BY HAND. IT IS GENERATED FROM `elasticsearch/` BY
// `yarn workspace @elastic/esql-definitions generate`.

import type { InlineCastMap } from '../definition_types';

export const inlineCasts: InlineCastMap = {
  aggregate_metric_double: 'to_aggregate_metric_double',
  bool: 'to_boolean',
  boolean: 'to_boolean',
  cartesian_point: 'to_cartesianpoint',
  cartesian_shape: 'to_cartesianshape',
  date: 'to_datetime',
  date_nanos: 'to_date_nanos',
  date_period: 'to_dateperiod',
  date_range: 'to_date_range',
  datetime: 'to_datetime',
  dense_vector: 'to_dense_vector',
  double: 'to_double',
  exponential_histogram: 'to_exponential_histogram',
  geo_point: 'to_geopoint',
  geo_shape: 'to_geoshape',
  geohash: 'to_geohash',
  geohex: 'to_geohex',
  geotile: 'to_geotile',
  int: 'to_integer',
  integer: 'to_integer',
  ip: 'to_ip',
  keyword: 'to_string',
  long: 'to_long',
  string: 'to_string',
  tdigest: 'to_tdigest',
  time_duration: 'to_timeduration',
  unsigned_long: 'to_unsigned_long',
  version: 'to_version',
  counter: 'to_counter',
  gauge: 'to_gauge',
};
