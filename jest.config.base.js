/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/** @type {import('jest').Config} */
export const baseConfig = {
  testEnvironment: 'node',
  // Disable Prettier for inline snapshots (Jest 29 does not support Prettier 3.x)
  prettierPath: null,
  // Only treat *.test.ts files as test suites (excludes fixtures, helpers, etc. in __tests__/)
  testMatch: ['**/*.test.ts'],
  moduleNameMapper: {
    // rewriteRelativeImportExtensions rewrites .ts → .js in transpiled output;
    // this maps those .js imports back so Jest can resolve the .ts source files
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.[jt]s$': [
      'ts-jest',
      {
        useESM: false,
        tsconfig: {
          // Override to CommonJS for tests so --experimental-vm-modules is not needed
          module: 'commonjs',
        },
      },
    ],
  },
};
