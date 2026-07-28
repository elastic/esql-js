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
  transformIgnorePatterns: [],

  // shiki is ESM-only (.mjs). transform it to CJS with ts-jest.
  moduleFileExtensions: ['ts', 'tsx', 'mjs', 'js', 'json', 'node'],
  transform: {
    '^.+\\.(m?js|ts)$': [
      'ts-jest',
      { useESM: false, tsconfig: { module: 'commonjs', allowJs: true } },
    ],
  },
};
