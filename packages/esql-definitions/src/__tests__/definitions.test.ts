/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { generateAll } from '../../scripts/generate_lib';
import { commandsNames } from '../commandsNames';
import { functionNames } from '../functionNames';

const packageDir = join(__dirname, '..', '..');
const elasticsearchDir = join(packageDir, 'elasticsearch');
const generatedDir = join(packageDir, 'src', 'generated');

describe('definition sync', () => {
  const result = generateAll(elasticsearchDir);

  test('raw JSON parses without unknown keys', () => {
    expect(result!.warnings).toEqual([]);
  });

  test('checked-in src/generated/ is in sync with elasticsearch/ (run `yarn generate` to fix)', () => {
    for (const file of result!.files) {
      const path = join(generatedDir, file.relativePath);

      expect(existsSync(path)).toBe(true);
      expect(readFileSync(path, 'utf8')).toBe(file.content);
    }
  });

  test('src/generated/ contains no stale files (run `yarn generate` to fix)', () => {
    const listFiles = (dir: string, prefix = ''): string[] =>
      readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
        entry.isDirectory()
          ? listFiles(join(dir, entry.name), `${prefix}${entry.name}/`)
          : [`${prefix}${entry.name}`]
      );

    expect(listFiles(generatedDir).sort()).toEqual(
      result!.files.map(({ relativePath }) => relativePath).sort()
    );
  });

  test('every synced command appears in the hand-maintained commandsNames list', () => {
    for (const command of result!.data.commands) {
      const upper = command.name.toUpperCase();
      const candidates = [upper, upper.replace(/_/g, ' '), upper.replace(/_/g, '')];

      expect(candidates.some((candidate) => commandsNames.includes(candidate))).toBe(true);
    }
  });

  test('every synced function appears in the hand-maintained functionNames list', () => {
    for (const fn of result!.data.functions) {
      expect(functionNames).toContain(fn.name.toUpperCase());
    }
  });

  test('inline cast map targets existing conversion functions', () => {
    const names = new Set(result!.data.functions.map((fn) => fn.name));

    for (const target of Object.values(result!.data.inlineCasts)) {
      expect(names.has(target)).toBe(true);
    }
  });

  test('PromQL definitions are synced', () => {
    expect(result!.data.promqlFunctions.length).toBeGreaterThan(0);
    expect(result!.data.promqlOperators.length).toBeGreaterThan(0);

    for (const operator of result!.data.promqlOperators) {
      expect(['operator', 'label_matching_operator']).toContain(operator.type);
    }
  });

  test('docs modules cover exactly the definitions they were split from', () => {
    const cases = [
      [result!.data.functions, result!.data.functionDocs],
      [result!.data.operators, result!.data.operatorDocs],
      [result!.data.promqlFunctions, result!.data.promqlFunctionDocs],
      [result!.data.promqlOperators, result!.data.promqlOperatorDocs],
    ] as const;

    for (const [definitions, docs] of cases) {
      expect(Object.keys(docs).sort()).toEqual(definitions.map(({ name }) => name).sort());
    }
  });

  test('ES|QL param docs match the param names in the signatures', () => {
    const cases = [
      [result!.data.functions, result!.data.functionDocs],
      [result!.data.operators, result!.data.operatorDocs],
    ] as const;

    for (const [definitions, docs] of cases) {
      for (const definition of definitions) {
        const paramNames = new Set(
          definition.signatures.flatMap((signature) => signature.params.map(({ name }) => name))
        );

        for (const documented of Object.keys(docs[definition.name].params ?? {})) {
          expect(paramNames.has(documented)).toBe(true);
        }

        for (const signature of definition.signatures) {
          for (const param of signature.params) {
            expect(param.description).toBeUndefined();
          }
        }
      }
    }
  });
});
