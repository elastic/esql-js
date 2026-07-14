/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// DO NOT MODIFY THIS FILE BY HAND. IT IS GENERATED FROM `elasticsearch/` BY
// `yarn workspace @elastic/esql-definitions generate`.

import type { DefinitionDocs } from '../../definition_types';

import addDocs from './add';
import castDocs from './cast';
import divDocs from './div';
import equalsDocs from './equals';
import greaterThanDocs from './greater_than';
import greaterThanOrEqualDocs from './greater_than_or_equal';
import inDocs from './in';
import isNotNullDocs from './is_not_null';
import isNullDocs from './is_null';
import lessThanDocs from './less_than';
import lessThanOrEqualDocs from './less_than_or_equal';
import likeDocs from './like';
import matchOperatorDocs from './match_operator';
import modDocs from './mod';
import mulDocs from './mul';
import negDocs from './neg';
import notEqualsDocs from './not_equals';
import notInDocs from './not_in';
import notLikeDocs from './not_like';
import notRlikeDocs from './not_rlike';
import rlikeDocs from './rlike';
import subDocs from './sub';

export const operatorDocs: Record<string, DefinitionDocs> = {
  add: addDocs,
  cast: castDocs,
  div: divDocs,
  equals: equalsDocs,
  greater_than: greaterThanDocs,
  greater_than_or_equal: greaterThanOrEqualDocs,
  in: inDocs,
  is_not_null: isNotNullDocs,
  is_null: isNullDocs,
  less_than: lessThanDocs,
  less_than_or_equal: lessThanOrEqualDocs,
  like: likeDocs,
  match_operator: matchOperatorDocs,
  mod: modDocs,
  mul: mulDocs,
  neg: negDocs,
  not_equals: notEqualsDocs,
  not_in: notInDocs,
  not_like: notLikeDocs,
  not_rlike: notRlikeDocs,
  rlike: rlikeDocs,
  sub: subDocs,
};
