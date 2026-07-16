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
import andDocs from './and';
import divDocs from './div';
import eqDocs from './eq';
import gtDocs from './gt';
import gteDocs from './gte';
import labelEqDocs from './label_eq';
import labelNeqDocs from './label_neq';
import labelNreDocs from './label_nre';
import labelReDocs from './label_re';
import ltDocs from './lt';
import lteDocs from './lte';
import modDocs from './mod';
import mulDocs from './mul';
import negDocs from './neg';
import neqDocs from './neq';
import orDocs from './or';
import powDocs from './pow';
import subDocs from './sub';
import unlessDocs from './unless';

export const promqlOperatorDocs: Record<string, DefinitionDocs> = {
  add: addDocs,
  and: andDocs,
  div: divDocs,
  eq: eqDocs,
  gt: gtDocs,
  gte: gteDocs,
  label_eq: labelEqDocs,
  label_neq: labelNeqDocs,
  label_nre: labelNreDocs,
  label_re: labelReDocs,
  lt: ltDocs,
  lte: lteDocs,
  mod: modDocs,
  mul: mulDocs,
  neg: negDocs,
  neq: neqDocs,
  or: orDocs,
  pow: powDocs,
  sub: subDocs,
  unless: unlessDocs,
};
