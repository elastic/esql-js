/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Metadata fields which can be requested with the `METADATA` option of
 * source commands, e.g. `FROM index METADATA _id, _index`.
 *
 * @see https://www.elastic.co/docs/reference/query-languages/esql/esql-metadata-fields
 */
export const METADATA_FIELDS = [
  // Source metadata fields
  '_name',
  '_class',

  // Index metadata fields
  '_id',
  '_ignored',
  '_index',
  '_index_mode',
  '_score',
  '_size',
  '_source',
  '_version',

  // Other
  '_tsid',

  // Gated
  '_slice',
  '_tier',
];
