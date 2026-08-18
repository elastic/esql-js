/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    outDir: 'lib',
    // The build script cleans `lib` up front: tsup runs array configs in
    // parallel, so `clean: true` here would race with the CDN builds below.
    clean: false,
    sourcemap: true,
    dts: false,
    splitting: false,
    target: 'es2022',
    // ESM as .mjs so Node treats it as ESM without "type": "module" in root
    outExtension({ format }) {
      return format === 'esm' ? { js: '.mjs' } : {};
    },
  },
  {
    // Browser <script> build for CDN usage; self-registers the language on the
    // global `hljs` object, mirroring highlight.js's own CDN language builds.
    entry: { 'esql.min': 'src/cdn.ts' },
    format: ['iife'],
    outDir: 'lib',
    minify: true,
    sourcemap: false,
    splitting: false,
    target: 'es2022',
    noExternal: [/^@elastic\//],
    outExtension: () => ({ js: '.js' }),
  },
  {
    // Minified ESM build for CDN `import` usage.
    entry: { 'esql.es.min': 'src/index.ts' },
    format: ['esm'],
    outDir: 'lib',
    minify: true,
    sourcemap: false,
    splitting: false,
    target: 'es2022',
    noExternal: [/^@elastic\//],
    outExtension: () => ({ js: '.js' }),
  },
]);
