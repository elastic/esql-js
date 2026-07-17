/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
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
