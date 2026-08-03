/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the MIT license (the "License"); you may
 * not use this file except in compliance with the License.
 */

import { grammar } from '..';

describe('structure', () => {
  test('has the required top-level TextMate keys', () => {
    expect(grammar.name).toBe('ES|QL');
    expect(grammar.scopeName).toBe('source.esql');
    expect(grammar.fileTypes).toEqual(['esql']);
    expect(Array.isArray(grammar.patterns)).toBe(true);
    expect(grammar.patterns.length).toBeGreaterThan(0);
    expect(typeof grammar.repository).toBe('object');
  });

  test('every top-level pattern includes an existing repository rule', () => {
    for (const pattern of grammar.patterns) {
      const ref = pattern.include.replace(/^#/, '');

      expect(grammar.repository).toHaveProperty([ref]);
    }
  });

  test('is JSON-serializable without loss', () => {
    expect(JSON.parse(JSON.stringify(grammar))).toEqual(grammar);
  });
});

describe('alternation ordering', () => {
  const extractAlternations = (regex: string): string[] | null => {
    const match = regex.match(/\((?:\?:)?((?:[^()]+|\([^()]*\))*)\)/);

    if (!match) return null;

    return match[1].split('|');
  };

  const normalizeAlt = (alt: string): string => alt.replace(/\\s\+/g, ' ').replace(/\\\\/g, '\\');

  const collectWordBoundedMatches = (): Array<[rule: string, match: string]> => {
    const collected: Array<[string, string]> = [];

    for (const [name, rule] of Object.entries(grammar.repository)) {
      if ('match' in rule && rule.match.startsWith('(?i)\\b')) {
        collected.push([name, rule.match]);
      }
      if ('patterns' in rule && Array.isArray(rule.patterns)) {
        for (const pattern of rule.patterns) {
          if ('match' in pattern && pattern.match.startsWith('(?i)\\b')) {
            collected.push([name, pattern.match]);
          }
        }
      }
    }

    return collected;
  };

  test('finds the keyword-list rules', () => {
    const names = collectWordBoundedMatches().map(([name]) => name);
    expect(names).toEqual(
      expect.arrayContaining([
        'function-call',
        'source-command',
        'processing-command',
        'header-command',
        'option-keyword',
        'named-operator',
        'literal',
        'time-interval',
      ])
    );
  });

  test('all case-insensitive word-bounded alternations are ordered longest-first', () => {
    const violations: string[] = [];

    for (const [name, match] of collectWordBoundedMatches()) {
      const alts = extractAlternations(match);

      if (!alts || alts.length < 2) continue;

      for (let i = 0; i < alts.length - 1; i++) {
        const current = normalizeAlt(alts[i]);
        const next = normalizeAlt(alts[i + 1]);

        if (current.length < next.length) {
          violations.push(
            `[${name}] "${alts[i]}" (${current.length} chars) comes before ` +
              `"${alts[i + 1]}" (${next.length} chars)`
          );
        }
      }
    }

    expect(violations).toEqual([]);
  });
});

describe('regex validity', () => {
  const collectRegexes = (node: unknown, out: string[] = []): string[] => {
    if (Array.isArray(node)) {
      for (const item of node) collectRegexes(item, out);
    } else if (typeof node === 'object' && node !== null) {
      for (const [key, value] of Object.entries(node)) {
        if ((key === 'match' || key === 'begin' || key === 'end') && typeof value === 'string') {
          out.push(value);
        } else {
          collectRegexes(value, out);
        }
      }
    }
    return out;
  };

  test('every match/begin/end pattern compiles as a regex', () => {
    const regexes = collectRegexes(grammar.repository);

    expect(regexes.length).toBeGreaterThan(0);

    for (const source of regexes) {
      const jsSource = source.replace(/^\(\?i\)/, '');

      expect(() => new RegExp(jsSource, 'i')).not.toThrow();
    }
  });
});
