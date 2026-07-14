/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { existsSync } from 'node:fs';

import { defineConfig } from 'tsup';

// Generated from elasticsearch/ by `yarn generate`
const generatedEntries = [
  'commands.ts',
  'settings.ts',
  'inline_cast.ts',
  'functions/index.ts',
  'function_docs/index.ts',
  'operators/index.ts',
  'operator_docs/index.ts',
  'promql_functions/index.ts',
  'promql_function_docs/index.ts',
  'promql_operators/index.ts',
  'promql_operator_docs/index.ts',
]
  .map((name) => `src/generated/${name}`)
  .filter((entry) => existsSync(entry));

export default defineConfig({
  entry: ['src/index.ts', ...generatedEntries],
  format: ['cjs', 'esm'],
  outDir: 'lib',
  clean: true,
  sourcemap: true,
  dts: false,
  splitting: false,
  target: 'es2022',
  // ESM as .mjs so Node treats it as ESM without "type": "module" in root
  outExtension({ format }) {
    return format === 'esm' ? { js: '.mjs' } : {};
  },
});
