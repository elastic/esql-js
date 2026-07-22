/*
 * Copyright Elasticsearch B.V. and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { escapeIdentifier } from '@elastic/elasticsearch-query-builder';

/**
 * Formats a name as an ES|QL identifier, escaping with backticks when necessary.
 * When `allowPatterns` is true, names containing `*` are passed through unescaped
 * to support wildcard patterns (e.g. `logs-*`).
 *
 * @param name - The identifier to format.
 * @param opts - Options. Set `allowPatterns: true` to allow wildcards.
 */
export function formatIdentifier(name: string, opts?: { allowPatterns?: boolean }): string {
  if (opts?.allowPatterns && name.includes('*')) {
    return name;
  }
  return escapeIdentifier(name);
}

/** ES|QL source (index) names allow hyphens, dots, digits, and wildcards in addition to identifier chars. */
const SOURCE_NAME_REGEX = /^[a-zA-Z_@*][a-zA-Z0-9_.*<>:, /-]*$/;

/**
 * Formats an index/source name for ES|QL FROM/TS commands.
 * Index names have more relaxed rules than field identifiers — hyphens,
 * dots, wildcards, and date math expressions are all valid unquoted.
 */
export function formatSourceName(name: string): string {
  if (SOURCE_NAME_REGEX.test(name)) {
    return name;
  }
  return escapeIdentifier(name);
}
