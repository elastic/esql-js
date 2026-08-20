/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { Token } from 'antlr4';
import { headerCommandNames, sourceCommandNames } from '@elastic/esql-definitions/commandNames';

export const DEFAULT_CHANNEL: number = +Token.DEFAULT_CHANNEL;
export const HIDDEN_CHANNEL: number = +Token.HIDDEN_CHANNEL;

export const HEADER_COMMANDS = new Set<string>(headerCommandNames);
export const SOURCE_COMMANDS = new Set<string>(sourceCommandNames);
