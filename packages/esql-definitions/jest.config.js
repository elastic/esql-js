/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { baseConfig } from '../../jest.config.base.js';

/** @type {import('jest').Config} */
export default {
  ...baseConfig,
  roots: ['<rootDir>/src'],
  // The ref parser is ESM-only, while this package's tests run as CommonJS.
  transformIgnorePatterns: ['node_modules/(?!.*@apidevtools(?:/|\\+)json-schema-ref-parser)'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  transform: {
    '^.+\\.[jt]s$': ['ts-jest', { useESM: false, tsconfig: { module: 'commonjs', allowJs: true } }],
  },
};
