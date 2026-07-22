/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// DO NOT MODIFY THIS FILE BY HAND. IT IS GENERATED FROM `elasticsearch/` BY
// `yarn workspace @elastic/esql-definitions generate`.

import type { FunctionDefinition } from '../../definition_types';

import absDefinition from './abs';
import absentDefinition from './absent';
import absentOverTimeDefinition from './absent_over_time';
import acosDefinition from './acos';
import acoshDefinition from './acosh';
import asinDefinition from './asin';
import asinhDefinition from './asinh';
import atanDefinition from './atan';
import atan2Definition from './atan2';
import atanhDefinition from './atanh';
import avgDefinition from './avg';
import avgOverTimeDefinition from './avg_over_time';
import bitLengthDefinition from './bit_length';
import bucketDefinition from './bucket';
import byteLengthDefinition from './byte_length';
import caseDefinition from './case';
import categorizeDefinition from './categorize';
import cbrtDefinition from './cbrt';
import ceilDefinition from './ceil';
import chunkDefinition from './chunk';
import cidrMatchDefinition from './cidr_match';
import clampDefinition from './clamp';
import clampMaxDefinition from './clamp_max';
import clampMinDefinition from './clamp_min';
import coalesceDefinition from './coalesce';
import concatDefinition from './concat';
import containsDefinition from './contains';
import copySignDefinition from './copy_sign';
import cosDefinition from './cos';
import coshDefinition from './cosh';
import countDefinition from './count';
import countDistinctDefinition from './count_distinct';
import countDistinctOverTimeDefinition from './count_distinct_over_time';
import countOverTimeDefinition from './count_over_time';
import dateDiffDefinition from './date_diff';
import dateExtractDefinition from './date_extract';
import dateFormatDefinition from './date_format';
import dateParseDefinition from './date_parse';
import dateTruncDefinition from './date_trunc';
import dateUnitCountDefinition from './date_unit_count';
import dayNameDefinition from './day_name';
import decayDefinition from './decay';
import deltaDefinition from './delta';
import derivDefinition from './deriv';
import eDefinition from './e';
import earliestDefinition from './earliest';
import embeddingDefinition from './embedding';
import endsWithDefinition from './ends_with';
import expDefinition from './exp';
import fieldExtractDefinition from './field_extract';
import firstDefinition from './first';
import firstOverTimeDefinition from './first_over_time';
import floorDefinition from './floor';
import fromBase64Definition from './from_base64';
import greatestDefinition from './greatest';
import hashDefinition from './hash';
import hypotDefinition from './hypot';
import ideltaDefinition from './idelta';
import increaseDefinition from './increase';
import ipPrefixDefinition from './ip_prefix';
import irateDefinition from './irate';
import jsonExtractDefinition from './json_extract';
import knnDefinition from './knn';
import kqlDefinition from './kql';
import lastDefinition from './last';
import lastOverTimeDefinition from './last_over_time';
import latestDefinition from './latest';
import leastDefinition from './least';
import leftDefinition from './left';
import lengthDefinition from './length';
import locateDefinition from './locate';
import logDefinition from './log';
import log10Definition from './log10';
import ltrimDefinition from './ltrim';
import matchDefinition from './match';
import matchPhraseDefinition from './match_phrase';
import maxDefinition from './max';
import maxOverTimeDefinition from './max_over_time';
import md5Definition from './md5';
import medianDefinition from './median';
import medianAbsoluteDeviationDefinition from './median_absolute_deviation';
import minDefinition from './min';
import minOverTimeDefinition from './min_over_time';
import monthNameDefinition from './month_name';
import mvAppendDefinition from './mv_append';
import mvAvgDefinition from './mv_avg';
import mvConcatDefinition from './mv_concat';
import mvContainsDefinition from './mv_contains';
import mvCountDefinition from './mv_count';
import mvDedupeDefinition from './mv_dedupe';
import mvDifferenceDefinition from './mv_difference';
import mvFirstDefinition from './mv_first';
import mvInRangeDefinition from './mv_in_range';
import mvIntersectionDefinition from './mv_intersection';
import mvIntersectsDefinition from './mv_intersects';
import mvLastDefinition from './mv_last';
import mvMaxDefinition from './mv_max';
import mvMedianDefinition from './mv_median';
import mvMedianAbsoluteDeviationDefinition from './mv_median_absolute_deviation';
import mvMinDefinition from './mv_min';
import mvPercentileDefinition from './mv_percentile';
import mvPseriesWeightedSumDefinition from './mv_pseries_weighted_sum';
import mvSliceDefinition from './mv_slice';
import mvSortDefinition from './mv_sort';
import mvSumDefinition from './mv_sum';
import mvUnionDefinition from './mv_union';
import mvZipDefinition from './mv_zip';
import networkDirectionDefinition from './network_direction';
import nowDefinition from './now';
import percentileDefinition from './percentile';
import percentileOverTimeDefinition from './percentile_over_time';
import piDefinition from './pi';
import powDefinition from './pow';
import presentDefinition from './present';
import presentOverTimeDefinition from './present_over_time';
import qstrDefinition from './qstr';
import rangeContainsDefinition from './range_contains';
import rangeIntersectsDefinition from './range_intersects';
import rangeMaxDefinition from './range_max';
import rangeMinDefinition from './range_min';
import rangeWithinDefinition from './range_within';
import rateDefinition from './rate';
import repeatDefinition from './repeat';
import replaceDefinition from './replace';
import reverseDefinition from './reverse';
import rightDefinition from './right';
import roundDefinition from './round';
import roundToDefinition from './round_to';
import rtrimDefinition from './rtrim';
import sampleDefinition from './sample';
import scalbDefinition from './scalb';
import scoreDefinition from './score';
import sha1Definition from './sha1';
import sha256Definition from './sha256';
import signumDefinition from './signum';
import sinDefinition from './sin';
import sinhDefinition from './sinh';
import spaceDefinition from './space';
import sparklineDefinition from './sparkline';
import splitDefinition from './split';
import sqrtDefinition from './sqrt';
import stBufferDefinition from './st_buffer';
import stCentroidAggDefinition from './st_centroid_agg';
import stContainsDefinition from './st_contains';
import stDifferenceDefinition from './st_difference';
import stDimensionDefinition from './st_dimension';
import stDisjointDefinition from './st_disjoint';
import stDistanceDefinition from './st_distance';
import stEnvelopeDefinition from './st_envelope';
import stExtentAggDefinition from './st_extent_agg';
import stGeohashDefinition from './st_geohash';
import stGeohexDefinition from './st_geohex';
import stGeometrytypeDefinition from './st_geometrytype';
import stGeotileDefinition from './st_geotile';
import stIntersectionDefinition from './st_intersection';
import stIntersectsDefinition from './st_intersects';
import stIsemptyDefinition from './st_isempty';
import stNpointsDefinition from './st_npoints';
import stSimplifyDefinition from './st_simplify';
import stSimplifypreservetopologyDefinition from './st_simplifypreservetopology';
import stSymdifferenceDefinition from './st_symdifference';
import stUnionDefinition from './st_union';
import stWithinDefinition from './st_within';
import stXDefinition from './st_x';
import stXmaxDefinition from './st_xmax';
import stXminDefinition from './st_xmin';
import stYDefinition from './st_y';
import stYmaxDefinition from './st_ymax';
import stYminDefinition from './st_ymin';
import startsWithDefinition from './starts_with';
import stdDevDefinition from './std_dev';
import stddevOverTimeDefinition from './stddev_over_time';
import substringDefinition from './substring';
import sumDefinition from './sum';
import sumOverTimeDefinition from './sum_over_time';
import tanDefinition from './tan';
import tanhDefinition from './tanh';
import tauDefinition from './tau';
import tbucketDefinition from './tbucket';
import textEmbeddingDefinition from './text_embedding';
import toAggregateMetricDoubleDefinition from './to_aggregate_metric_double';
import toBase64Definition from './to_base64';
import toBooleanDefinition from './to_boolean';
import toCartesianpointDefinition from './to_cartesianpoint';
import toCartesianshapeDefinition from './to_cartesianshape';
import toCounterDefinition from './to_counter';
import toDateNanosDefinition from './to_date_nanos';
import toDateRangeDefinition from './to_date_range';
import toDateperiodDefinition from './to_dateperiod';
import toDatetimeDefinition from './to_datetime';
import toDegreesDefinition from './to_degrees';
import toDenseVectorDefinition from './to_dense_vector';
import toDoubleDefinition from './to_double';
import toExponentialHistogramDefinition from './to_exponential_histogram';
import toGaugeDefinition from './to_gauge';
import toGeohashDefinition from './to_geohash';
import toGeohexDefinition from './to_geohex';
import toGeopointDefinition from './to_geopoint';
import toGeoshapeDefinition from './to_geoshape';
import toGeotileDefinition from './to_geotile';
import toIntegerDefinition from './to_integer';
import toIpDefinition from './to_ip';
import toLongDefinition from './to_long';
import toLowerDefinition from './to_lower';
import toRadiansDefinition from './to_radians';
import toRangeDefinition from './to_range';
import toStringDefinition from './to_string';
import toTdigestDefinition from './to_tdigest';
import toTextDefinition from './to_text';
import toTimedurationDefinition from './to_timeduration';
import toUnsignedLongDefinition from './to_unsigned_long';
import toUpperDefinition from './to_upper';
import toVersionDefinition from './to_version';
import topDefinition from './top';
import topSnippetsDefinition from './top_snippets';
import trangeDefinition from './trange';
import trimDefinition from './trim';
import tstepDefinition from './tstep';
import urlDecodeDefinition from './url_decode';
import urlEncodeDefinition from './url_encode';
import urlEncodeComponentDefinition from './url_encode_component';
import vCosineDefinition from './v_cosine';
import vDotProductDefinition from './v_dot_product';
import vHammingDefinition from './v_hamming';
import vL1NormDefinition from './v_l1_norm';
import vL2NormDefinition from './v_l2_norm';
import vMagnitudeDefinition from './v_magnitude';
import valuesDefinition from './values';
import varianceDefinition from './variance';
import varianceOverTimeDefinition from './variance_over_time';
import weightedAvgDefinition from './weighted_avg';
import withoutDefinition from './without';

export const functionDefinitions: FunctionDefinition[] = [
  absDefinition,
  absentDefinition,
  absentOverTimeDefinition,
  acosDefinition,
  acoshDefinition,
  asinDefinition,
  asinhDefinition,
  atanDefinition,
  atan2Definition,
  atanhDefinition,
  avgDefinition,
  avgOverTimeDefinition,
  bitLengthDefinition,
  bucketDefinition,
  byteLengthDefinition,
  caseDefinition,
  categorizeDefinition,
  cbrtDefinition,
  ceilDefinition,
  chunkDefinition,
  cidrMatchDefinition,
  clampDefinition,
  clampMaxDefinition,
  clampMinDefinition,
  coalesceDefinition,
  concatDefinition,
  containsDefinition,
  copySignDefinition,
  cosDefinition,
  coshDefinition,
  countDefinition,
  countDistinctDefinition,
  countDistinctOverTimeDefinition,
  countOverTimeDefinition,
  dateDiffDefinition,
  dateExtractDefinition,
  dateFormatDefinition,
  dateParseDefinition,
  dateTruncDefinition,
  dateUnitCountDefinition,
  dayNameDefinition,
  decayDefinition,
  deltaDefinition,
  derivDefinition,
  eDefinition,
  earliestDefinition,
  embeddingDefinition,
  endsWithDefinition,
  expDefinition,
  fieldExtractDefinition,
  firstDefinition,
  firstOverTimeDefinition,
  floorDefinition,
  fromBase64Definition,
  greatestDefinition,
  hashDefinition,
  hypotDefinition,
  ideltaDefinition,
  increaseDefinition,
  ipPrefixDefinition,
  irateDefinition,
  jsonExtractDefinition,
  knnDefinition,
  kqlDefinition,
  lastDefinition,
  lastOverTimeDefinition,
  latestDefinition,
  leastDefinition,
  leftDefinition,
  lengthDefinition,
  locateDefinition,
  logDefinition,
  log10Definition,
  ltrimDefinition,
  matchDefinition,
  matchPhraseDefinition,
  maxDefinition,
  maxOverTimeDefinition,
  md5Definition,
  medianDefinition,
  medianAbsoluteDeviationDefinition,
  minDefinition,
  minOverTimeDefinition,
  monthNameDefinition,
  mvAppendDefinition,
  mvAvgDefinition,
  mvConcatDefinition,
  mvContainsDefinition,
  mvCountDefinition,
  mvDedupeDefinition,
  mvDifferenceDefinition,
  mvFirstDefinition,
  mvInRangeDefinition,
  mvIntersectionDefinition,
  mvIntersectsDefinition,
  mvLastDefinition,
  mvMaxDefinition,
  mvMedianDefinition,
  mvMedianAbsoluteDeviationDefinition,
  mvMinDefinition,
  mvPercentileDefinition,
  mvPseriesWeightedSumDefinition,
  mvSliceDefinition,
  mvSortDefinition,
  mvSumDefinition,
  mvUnionDefinition,
  mvZipDefinition,
  networkDirectionDefinition,
  nowDefinition,
  percentileDefinition,
  percentileOverTimeDefinition,
  piDefinition,
  powDefinition,
  presentDefinition,
  presentOverTimeDefinition,
  qstrDefinition,
  rangeContainsDefinition,
  rangeIntersectsDefinition,
  rangeMaxDefinition,
  rangeMinDefinition,
  rangeWithinDefinition,
  rateDefinition,
  repeatDefinition,
  replaceDefinition,
  reverseDefinition,
  rightDefinition,
  roundDefinition,
  roundToDefinition,
  rtrimDefinition,
  sampleDefinition,
  scalbDefinition,
  scoreDefinition,
  sha1Definition,
  sha256Definition,
  signumDefinition,
  sinDefinition,
  sinhDefinition,
  spaceDefinition,
  sparklineDefinition,
  splitDefinition,
  sqrtDefinition,
  stBufferDefinition,
  stCentroidAggDefinition,
  stContainsDefinition,
  stDifferenceDefinition,
  stDimensionDefinition,
  stDisjointDefinition,
  stDistanceDefinition,
  stEnvelopeDefinition,
  stExtentAggDefinition,
  stGeohashDefinition,
  stGeohexDefinition,
  stGeometrytypeDefinition,
  stGeotileDefinition,
  stIntersectionDefinition,
  stIntersectsDefinition,
  stIsemptyDefinition,
  stNpointsDefinition,
  stSimplifyDefinition,
  stSimplifypreservetopologyDefinition,
  stSymdifferenceDefinition,
  stUnionDefinition,
  stWithinDefinition,
  stXDefinition,
  stXmaxDefinition,
  stXminDefinition,
  stYDefinition,
  stYmaxDefinition,
  stYminDefinition,
  startsWithDefinition,
  stdDevDefinition,
  stddevOverTimeDefinition,
  substringDefinition,
  sumDefinition,
  sumOverTimeDefinition,
  tanDefinition,
  tanhDefinition,
  tauDefinition,
  tbucketDefinition,
  textEmbeddingDefinition,
  toAggregateMetricDoubleDefinition,
  toBase64Definition,
  toBooleanDefinition,
  toCartesianpointDefinition,
  toCartesianshapeDefinition,
  toCounterDefinition,
  toDateNanosDefinition,
  toDateRangeDefinition,
  toDateperiodDefinition,
  toDatetimeDefinition,
  toDegreesDefinition,
  toDenseVectorDefinition,
  toDoubleDefinition,
  toExponentialHistogramDefinition,
  toGaugeDefinition,
  toGeohashDefinition,
  toGeohexDefinition,
  toGeopointDefinition,
  toGeoshapeDefinition,
  toGeotileDefinition,
  toIntegerDefinition,
  toIpDefinition,
  toLongDefinition,
  toLowerDefinition,
  toRadiansDefinition,
  toRangeDefinition,
  toStringDefinition,
  toTdigestDefinition,
  toTextDefinition,
  toTimedurationDefinition,
  toUnsignedLongDefinition,
  toUpperDefinition,
  toVersionDefinition,
  topDefinition,
  topSnippetsDefinition,
  trangeDefinition,
  trimDefinition,
  tstepDefinition,
  urlDecodeDefinition,
  urlEncodeDefinition,
  urlEncodeComponentDefinition,
  vCosineDefinition,
  vDotProductDefinition,
  vHammingDefinition,
  vL1NormDefinition,
  vL2NormDefinition,
  vMagnitudeDefinition,
  valuesDefinition,
  varianceDefinition,
  varianceOverTimeDefinition,
  weightedAvgDefinition,
  withoutDefinition,
];
