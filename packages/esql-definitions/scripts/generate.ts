/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// Regenerates `src/generated/` from the raw ES|QL and PromQL definition JSON
// in `elasticsearch/`
//
// Usage: yarn workspace @elastic/esql-definitions generate

import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateAll } from './generate_lib.ts';

const packageDir = dirname(dirname(fileURLToPath(import.meta.url)));
const elasticsearchDir = join(packageDir, 'elasticsearch');
const outputDir = join(packageDir, 'src', 'generated');

if (!existsSync(elasticsearchDir)) {
  process.stderr.write(
    `No raw definition JSON found at: ${elasticsearchDir}\n` +
      'Run the sync first: .buildkite/scripts/grammar_sync_local.sh [path-to-elasticsearch]\n'
  );
  process.exit(1);
}

const { files, warnings } = generateAll(elasticsearchDir);

for (const warning of warnings) {
  process.stderr.write(`warning: ${warning}\n`);
}

rmSync(outputDir, { recursive: true, force: true });
mkdirSync(outputDir, { recursive: true });

for (const file of files) {
  const path = join(outputDir, file.relativePath);

  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, file.content);
}

process.stdout.write(`generated ${files.length} files in src/generated/\n`);
