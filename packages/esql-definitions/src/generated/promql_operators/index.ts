/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// DO NOT MODIFY THIS FILE BY HAND. IT IS GENERATED FROM `elasticsearch/` BY
// `yarn workspace @elastic/esql-definitions generate`.

import type { PromqlOperatorDefinition } from '../../definition_types';

import addDefinition from './add';
import andDefinition from './and';
import divDefinition from './div';
import eqDefinition from './eq';
import gtDefinition from './gt';
import gteDefinition from './gte';
import labelEqDefinition from './label_eq';
import labelNeqDefinition from './label_neq';
import labelNreDefinition from './label_nre';
import labelReDefinition from './label_re';
import ltDefinition from './lt';
import lteDefinition from './lte';
import modDefinition from './mod';
import mulDefinition from './mul';
import negDefinition from './neg';
import neqDefinition from './neq';
import orDefinition from './or';
import powDefinition from './pow';
import subDefinition from './sub';
import unlessDefinition from './unless';

export const promqlOperatorDefinitions: PromqlOperatorDefinition[] = [
  addDefinition,
  andDefinition,
  divDefinition,
  eqDefinition,
  gtDefinition,
  gteDefinition,
  labelEqDefinition,
  labelNeqDefinition,
  labelNreDefinition,
  labelReDefinition,
  ltDefinition,
  lteDefinition,
  modDefinition,
  mulDefinition,
  negDefinition,
  neqDefinition,
  orDefinition,
  powDefinition,
  subDefinition,
  unlessDefinition,
];
