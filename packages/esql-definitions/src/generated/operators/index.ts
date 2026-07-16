/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// DO NOT MODIFY THIS FILE BY HAND. IT IS GENERATED FROM `elasticsearch/` BY
// `yarn workspace @elastic/esql-definitions generate`.

import type { OperatorDefinition } from '../../definition_types';

import addDefinition from './add';
import castDefinition from './cast';
import divDefinition from './div';
import equalsDefinition from './equals';
import greaterThanDefinition from './greater_than';
import greaterThanOrEqualDefinition from './greater_than_or_equal';
import inDefinition from './in';
import isNotNullDefinition from './is_not_null';
import isNullDefinition from './is_null';
import lessThanDefinition from './less_than';
import lessThanOrEqualDefinition from './less_than_or_equal';
import likeDefinition from './like';
import matchOperatorDefinition from './match_operator';
import modDefinition from './mod';
import mulDefinition from './mul';
import negDefinition from './neg';
import notEqualsDefinition from './not_equals';
import notInDefinition from './not_in';
import notLikeDefinition from './not_like';
import notRlikeDefinition from './not_rlike';
import rlikeDefinition from './rlike';
import subDefinition from './sub';

export const operatorDefinitions: OperatorDefinition[] = [
  addDefinition,
  castDefinition,
  divDefinition,
  equalsDefinition,
  greaterThanDefinition,
  greaterThanOrEqualDefinition,
  inDefinition,
  isNotNullDefinition,
  isNullDefinition,
  lessThanDefinition,
  lessThanOrEqualDefinition,
  likeDefinition,
  matchOperatorDefinition,
  modDefinition,
  mulDefinition,
  negDefinition,
  notEqualsDefinition,
  notInDefinition,
  notLikeDefinition,
  notRlikeDefinition,
  rlikeDefinition,
  subDefinition,
];
