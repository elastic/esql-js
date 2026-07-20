/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// DO NOT MODIFY THIS FILE BY HAND. IT IS GENERATED FROM `elasticsearch/` BY
// `yarn workspace @elastic/esql-definitions generate`.

import type { DefinitionDocs } from '../../definition_types';

import absDocs from './abs';
import absentDocs from './absent';
import absentOverTimeDocs from './absent_over_time';
import acosDocs from './acos';
import acoshDocs from './acosh';
import asinDocs from './asin';
import asinhDocs from './asinh';
import atanDocs from './atan';
import atan2Docs from './atan2';
import atanhDocs from './atanh';
import avgDocs from './avg';
import avgOverTimeDocs from './avg_over_time';
import bitLengthDocs from './bit_length';
import bucketDocs from './bucket';
import byteLengthDocs from './byte_length';
import caseDocs from './case';
import categorizeDocs from './categorize';
import cbrtDocs from './cbrt';
import ceilDocs from './ceil';
import chunkDocs from './chunk';
import cidrMatchDocs from './cidr_match';
import clampDocs from './clamp';
import clampMaxDocs from './clamp_max';
import clampMinDocs from './clamp_min';
import coalesceDocs from './coalesce';
import concatDocs from './concat';
import containsDocs from './contains';
import copySignDocs from './copy_sign';
import cosDocs from './cos';
import coshDocs from './cosh';
import countDocs from './count';
import countDistinctDocs from './count_distinct';
import countDistinctOverTimeDocs from './count_distinct_over_time';
import countOverTimeDocs from './count_over_time';
import dateDiffDocs from './date_diff';
import dateExtractDocs from './date_extract';
import dateFormatDocs from './date_format';
import dateParseDocs from './date_parse';
import dateTruncDocs from './date_trunc';
import dateUnitCountDocs from './date_unit_count';
import dayNameDocs from './day_name';
import decayDocs from './decay';
import deltaDocs from './delta';
import derivDocs from './deriv';
import eDocs from './e';
import earliestDocs from './earliest';
import embeddingDocs from './embedding';
import endsWithDocs from './ends_with';
import expDocs from './exp';
import fieldExtractDocs from './field_extract';
import firstDocs from './first';
import firstOverTimeDocs from './first_over_time';
import floorDocs from './floor';
import fromBase64Docs from './from_base64';
import greatestDocs from './greatest';
import hashDocs from './hash';
import hypotDocs from './hypot';
import ideltaDocs from './idelta';
import increaseDocs from './increase';
import ipPrefixDocs from './ip_prefix';
import irateDocs from './irate';
import jsonExtractDocs from './json_extract';
import knnDocs from './knn';
import kqlDocs from './kql';
import lastDocs from './last';
import lastOverTimeDocs from './last_over_time';
import latestDocs from './latest';
import leastDocs from './least';
import leftDocs from './left';
import lengthDocs from './length';
import locateDocs from './locate';
import logDocs from './log';
import log10Docs from './log10';
import ltrimDocs from './ltrim';
import matchDocs from './match';
import matchPhraseDocs from './match_phrase';
import maxDocs from './max';
import maxOverTimeDocs from './max_over_time';
import md5Docs from './md5';
import medianDocs from './median';
import medianAbsoluteDeviationDocs from './median_absolute_deviation';
import minDocs from './min';
import minOverTimeDocs from './min_over_time';
import monthNameDocs from './month_name';
import mvAppendDocs from './mv_append';
import mvAvgDocs from './mv_avg';
import mvConcatDocs from './mv_concat';
import mvContainsDocs from './mv_contains';
import mvCountDocs from './mv_count';
import mvDedupeDocs from './mv_dedupe';
import mvDifferenceDocs from './mv_difference';
import mvFirstDocs from './mv_first';
import mvInRangeDocs from './mv_in_range';
import mvIntersectionDocs from './mv_intersection';
import mvIntersectsDocs from './mv_intersects';
import mvLastDocs from './mv_last';
import mvMaxDocs from './mv_max';
import mvMedianDocs from './mv_median';
import mvMedianAbsoluteDeviationDocs from './mv_median_absolute_deviation';
import mvMinDocs from './mv_min';
import mvPercentileDocs from './mv_percentile';
import mvPseriesWeightedSumDocs from './mv_pseries_weighted_sum';
import mvSliceDocs from './mv_slice';
import mvSortDocs from './mv_sort';
import mvSumDocs from './mv_sum';
import mvUnionDocs from './mv_union';
import mvZipDocs from './mv_zip';
import networkDirectionDocs from './network_direction';
import nowDocs from './now';
import percentileDocs from './percentile';
import percentileOverTimeDocs from './percentile_over_time';
import piDocs from './pi';
import powDocs from './pow';
import presentDocs from './present';
import presentOverTimeDocs from './present_over_time';
import qstrDocs from './qstr';
import rangeContainsDocs from './range_contains';
import rangeIntersectsDocs from './range_intersects';
import rangeMaxDocs from './range_max';
import rangeMinDocs from './range_min';
import rangeWithinDocs from './range_within';
import rateDocs from './rate';
import repeatDocs from './repeat';
import replaceDocs from './replace';
import reverseDocs from './reverse';
import rightDocs from './right';
import roundDocs from './round';
import roundToDocs from './round_to';
import rtrimDocs from './rtrim';
import sampleDocs from './sample';
import scalbDocs from './scalb';
import scoreDocs from './score';
import sha1Docs from './sha1';
import sha256Docs from './sha256';
import signumDocs from './signum';
import sinDocs from './sin';
import sinhDocs from './sinh';
import spaceDocs from './space';
import sparklineDocs from './sparkline';
import splitDocs from './split';
import sqrtDocs from './sqrt';
import stBufferDocs from './st_buffer';
import stCentroidAggDocs from './st_centroid_agg';
import stContainsDocs from './st_contains';
import stDifferenceDocs from './st_difference';
import stDimensionDocs from './st_dimension';
import stDisjointDocs from './st_disjoint';
import stDistanceDocs from './st_distance';
import stEnvelopeDocs from './st_envelope';
import stExtentAggDocs from './st_extent_agg';
import stGeohashDocs from './st_geohash';
import stGeohexDocs from './st_geohex';
import stGeometrytypeDocs from './st_geometrytype';
import stGeotileDocs from './st_geotile';
import stIntersectionDocs from './st_intersection';
import stIntersectsDocs from './st_intersects';
import stIsemptyDocs from './st_isempty';
import stNpointsDocs from './st_npoints';
import stSimplifyDocs from './st_simplify';
import stSimplifypreservetopologyDocs from './st_simplifypreservetopology';
import stSymdifferenceDocs from './st_symdifference';
import stUnionDocs from './st_union';
import stWithinDocs from './st_within';
import stXDocs from './st_x';
import stXmaxDocs from './st_xmax';
import stXminDocs from './st_xmin';
import stYDocs from './st_y';
import stYmaxDocs from './st_ymax';
import stYminDocs from './st_ymin';
import startsWithDocs from './starts_with';
import stdDevDocs from './std_dev';
import stddevOverTimeDocs from './stddev_over_time';
import substringDocs from './substring';
import sumDocs from './sum';
import sumOverTimeDocs from './sum_over_time';
import tanDocs from './tan';
import tanhDocs from './tanh';
import tauDocs from './tau';
import tbucketDocs from './tbucket';
import textEmbeddingDocs from './text_embedding';
import toAggregateMetricDoubleDocs from './to_aggregate_metric_double';
import toBase64Docs from './to_base64';
import toBooleanDocs from './to_boolean';
import toCartesianpointDocs from './to_cartesianpoint';
import toCartesianshapeDocs from './to_cartesianshape';
import toCounterDocs from './to_counter';
import toDateNanosDocs from './to_date_nanos';
import toDateRangeDocs from './to_date_range';
import toDateperiodDocs from './to_dateperiod';
import toDatetimeDocs from './to_datetime';
import toDegreesDocs from './to_degrees';
import toDenseVectorDocs from './to_dense_vector';
import toDoubleDocs from './to_double';
import toExponentialHistogramDocs from './to_exponential_histogram';
import toGaugeDocs from './to_gauge';
import toGeohashDocs from './to_geohash';
import toGeohexDocs from './to_geohex';
import toGeopointDocs from './to_geopoint';
import toGeoshapeDocs from './to_geoshape';
import toGeotileDocs from './to_geotile';
import toIntegerDocs from './to_integer';
import toIpDocs from './to_ip';
import toLongDocs from './to_long';
import toLowerDocs from './to_lower';
import toRadiansDocs from './to_radians';
import toRangeDocs from './to_range';
import toStringDocs from './to_string';
import toTdigestDocs from './to_tdigest';
import toTextDocs from './to_text';
import toTimedurationDocs from './to_timeduration';
import toUnsignedLongDocs from './to_unsigned_long';
import toUpperDocs from './to_upper';
import toVersionDocs from './to_version';
import topDocs from './top';
import topSnippetsDocs from './top_snippets';
import trangeDocs from './trange';
import trimDocs from './trim';
import tstepDocs from './tstep';
import urlDecodeDocs from './url_decode';
import urlEncodeDocs from './url_encode';
import urlEncodeComponentDocs from './url_encode_component';
import vCosineDocs from './v_cosine';
import vDotProductDocs from './v_dot_product';
import vHammingDocs from './v_hamming';
import vL1NormDocs from './v_l1_norm';
import vL2NormDocs from './v_l2_norm';
import vMagnitudeDocs from './v_magnitude';
import valuesDocs from './values';
import varianceDocs from './variance';
import varianceOverTimeDocs from './variance_over_time';
import weightedAvgDocs from './weighted_avg';
import withoutDocs from './without';

export const functionDocs: Record<string, DefinitionDocs> = {
  abs: absDocs,
  absent: absentDocs,
  absent_over_time: absentOverTimeDocs,
  acos: acosDocs,
  acosh: acoshDocs,
  asin: asinDocs,
  asinh: asinhDocs,
  atan: atanDocs,
  atan2: atan2Docs,
  atanh: atanhDocs,
  avg: avgDocs,
  avg_over_time: avgOverTimeDocs,
  bit_length: bitLengthDocs,
  bucket: bucketDocs,
  byte_length: byteLengthDocs,
  case: caseDocs,
  categorize: categorizeDocs,
  cbrt: cbrtDocs,
  ceil: ceilDocs,
  chunk: chunkDocs,
  cidr_match: cidrMatchDocs,
  clamp: clampDocs,
  clamp_max: clampMaxDocs,
  clamp_min: clampMinDocs,
  coalesce: coalesceDocs,
  concat: concatDocs,
  contains: containsDocs,
  copy_sign: copySignDocs,
  cos: cosDocs,
  cosh: coshDocs,
  count: countDocs,
  count_distinct: countDistinctDocs,
  count_distinct_over_time: countDistinctOverTimeDocs,
  count_over_time: countOverTimeDocs,
  date_diff: dateDiffDocs,
  date_extract: dateExtractDocs,
  date_format: dateFormatDocs,
  date_parse: dateParseDocs,
  date_trunc: dateTruncDocs,
  date_unit_count: dateUnitCountDocs,
  day_name: dayNameDocs,
  decay: decayDocs,
  delta: deltaDocs,
  deriv: derivDocs,
  e: eDocs,
  earliest: earliestDocs,
  embedding: embeddingDocs,
  ends_with: endsWithDocs,
  exp: expDocs,
  field_extract: fieldExtractDocs,
  first: firstDocs,
  first_over_time: firstOverTimeDocs,
  floor: floorDocs,
  from_base64: fromBase64Docs,
  greatest: greatestDocs,
  hash: hashDocs,
  hypot: hypotDocs,
  idelta: ideltaDocs,
  increase: increaseDocs,
  ip_prefix: ipPrefixDocs,
  irate: irateDocs,
  json_extract: jsonExtractDocs,
  knn: knnDocs,
  kql: kqlDocs,
  last: lastDocs,
  last_over_time: lastOverTimeDocs,
  latest: latestDocs,
  least: leastDocs,
  left: leftDocs,
  length: lengthDocs,
  locate: locateDocs,
  log: logDocs,
  log10: log10Docs,
  ltrim: ltrimDocs,
  match: matchDocs,
  match_phrase: matchPhraseDocs,
  max: maxDocs,
  max_over_time: maxOverTimeDocs,
  md5: md5Docs,
  median: medianDocs,
  median_absolute_deviation: medianAbsoluteDeviationDocs,
  min: minDocs,
  min_over_time: minOverTimeDocs,
  month_name: monthNameDocs,
  mv_append: mvAppendDocs,
  mv_avg: mvAvgDocs,
  mv_concat: mvConcatDocs,
  mv_contains: mvContainsDocs,
  mv_count: mvCountDocs,
  mv_dedupe: mvDedupeDocs,
  mv_difference: mvDifferenceDocs,
  mv_first: mvFirstDocs,
  mv_in_range: mvInRangeDocs,
  mv_intersection: mvIntersectionDocs,
  mv_intersects: mvIntersectsDocs,
  mv_last: mvLastDocs,
  mv_max: mvMaxDocs,
  mv_median: mvMedianDocs,
  mv_median_absolute_deviation: mvMedianAbsoluteDeviationDocs,
  mv_min: mvMinDocs,
  mv_percentile: mvPercentileDocs,
  mv_pseries_weighted_sum: mvPseriesWeightedSumDocs,
  mv_slice: mvSliceDocs,
  mv_sort: mvSortDocs,
  mv_sum: mvSumDocs,
  mv_union: mvUnionDocs,
  mv_zip: mvZipDocs,
  network_direction: networkDirectionDocs,
  now: nowDocs,
  percentile: percentileDocs,
  percentile_over_time: percentileOverTimeDocs,
  pi: piDocs,
  pow: powDocs,
  present: presentDocs,
  present_over_time: presentOverTimeDocs,
  qstr: qstrDocs,
  range_contains: rangeContainsDocs,
  range_intersects: rangeIntersectsDocs,
  range_max: rangeMaxDocs,
  range_min: rangeMinDocs,
  range_within: rangeWithinDocs,
  rate: rateDocs,
  repeat: repeatDocs,
  replace: replaceDocs,
  reverse: reverseDocs,
  right: rightDocs,
  round: roundDocs,
  round_to: roundToDocs,
  rtrim: rtrimDocs,
  sample: sampleDocs,
  scalb: scalbDocs,
  score: scoreDocs,
  sha1: sha1Docs,
  sha256: sha256Docs,
  signum: signumDocs,
  sin: sinDocs,
  sinh: sinhDocs,
  space: spaceDocs,
  sparkline: sparklineDocs,
  split: splitDocs,
  sqrt: sqrtDocs,
  st_buffer: stBufferDocs,
  st_centroid_agg: stCentroidAggDocs,
  st_contains: stContainsDocs,
  st_difference: stDifferenceDocs,
  st_dimension: stDimensionDocs,
  st_disjoint: stDisjointDocs,
  st_distance: stDistanceDocs,
  st_envelope: stEnvelopeDocs,
  st_extent_agg: stExtentAggDocs,
  st_geohash: stGeohashDocs,
  st_geohex: stGeohexDocs,
  st_geometrytype: stGeometrytypeDocs,
  st_geotile: stGeotileDocs,
  st_intersection: stIntersectionDocs,
  st_intersects: stIntersectsDocs,
  st_isempty: stIsemptyDocs,
  st_npoints: stNpointsDocs,
  st_simplify: stSimplifyDocs,
  st_simplifypreservetopology: stSimplifypreservetopologyDocs,
  st_symdifference: stSymdifferenceDocs,
  st_union: stUnionDocs,
  st_within: stWithinDocs,
  st_x: stXDocs,
  st_xmax: stXmaxDocs,
  st_xmin: stXminDocs,
  st_y: stYDocs,
  st_ymax: stYmaxDocs,
  st_ymin: stYminDocs,
  starts_with: startsWithDocs,
  std_dev: stdDevDocs,
  stddev_over_time: stddevOverTimeDocs,
  substring: substringDocs,
  sum: sumDocs,
  sum_over_time: sumOverTimeDocs,
  tan: tanDocs,
  tanh: tanhDocs,
  tau: tauDocs,
  tbucket: tbucketDocs,
  text_embedding: textEmbeddingDocs,
  to_aggregate_metric_double: toAggregateMetricDoubleDocs,
  to_base64: toBase64Docs,
  to_boolean: toBooleanDocs,
  to_cartesianpoint: toCartesianpointDocs,
  to_cartesianshape: toCartesianshapeDocs,
  to_counter: toCounterDocs,
  to_date_nanos: toDateNanosDocs,
  to_date_range: toDateRangeDocs,
  to_dateperiod: toDateperiodDocs,
  to_datetime: toDatetimeDocs,
  to_degrees: toDegreesDocs,
  to_dense_vector: toDenseVectorDocs,
  to_double: toDoubleDocs,
  to_exponential_histogram: toExponentialHistogramDocs,
  to_gauge: toGaugeDocs,
  to_geohash: toGeohashDocs,
  to_geohex: toGeohexDocs,
  to_geopoint: toGeopointDocs,
  to_geoshape: toGeoshapeDocs,
  to_geotile: toGeotileDocs,
  to_integer: toIntegerDocs,
  to_ip: toIpDocs,
  to_long: toLongDocs,
  to_lower: toLowerDocs,
  to_radians: toRadiansDocs,
  to_range: toRangeDocs,
  to_string: toStringDocs,
  to_tdigest: toTdigestDocs,
  to_text: toTextDocs,
  to_timeduration: toTimedurationDocs,
  to_unsigned_long: toUnsignedLongDocs,
  to_upper: toUpperDocs,
  to_version: toVersionDocs,
  top: topDocs,
  top_snippets: topSnippetsDocs,
  trange: trangeDocs,
  trim: trimDocs,
  tstep: tstepDocs,
  url_decode: urlDecodeDocs,
  url_encode: urlEncodeDocs,
  url_encode_component: urlEncodeComponentDocs,
  v_cosine: vCosineDocs,
  v_dot_product: vDotProductDocs,
  v_hamming: vHammingDocs,
  v_l1_norm: vL1NormDocs,
  v_l2_norm: vL2NormDocs,
  v_magnitude: vMagnitudeDocs,
  values: valuesDocs,
  variance: varianceDocs,
  variance_over_time: varianceOverTimeDocs,
  weighted_avg: weightedAvgDocs,
  without: withoutDocs,
};
