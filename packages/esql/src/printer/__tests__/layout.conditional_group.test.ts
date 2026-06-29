/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { text, softline, hardline, group, indent, conditionalGroup, join, layout } from '..';

describe('conditionalGroup', () => {
  it('uses first state (flat) when it fits', () => {
    const items = [text('alpha'), text('beta'), text('gamma')];

    const doc = conditionalGroup([
      // Phase 1: flat with spaces — "alpha, beta, gamma"
      group(join(text(', '), items)),
      // Phase 2: compact — "alpha,beta,gamma"
      group(join([text(','), softline], items)),
      // Phase 3: one per line
      group([indent([hardline, join([text(','), hardline], items)]), hardline], {
        shouldBreak: true,
      }),
    ]);

    expect(layout(doc, { printWidth: 20 })).toBe('alpha, beta, gamma');
    expect(layout(doc, { printWidth: 17 })).toBe('alpha,beta,gamma');
    expect(layout(doc, { printWidth: 10 })).toBe('\n  alpha,\n  beta,\n  gamma\n');
  });

  it('three-phase list with brackets', () => {
    const items = [text('alpha'), text('beta'), text('gamma'), text('delta')];
    const sep = text(',');

    const doc = conditionalGroup([
      // Phase 1: all on one line — "(alpha, beta, gamma, delta)" = 27
      group([text('('), join([sep, text(' ')], items), text(')')]),
      // Phase 2: compact (no spaces) — "(alpha,beta,gamma,delta)" = 24
      group([text('('), join([sep, softline], items), text(')')]),
      // Phase 3: one per line
      group([text('('), indent([hardline, join([sep, hardline], items)]), hardline, text(')')], {
        shouldBreak: true,
      }),
    ]);

    expect(layout(doc, { printWidth: 30 })).toBe('(alpha, beta, gamma, delta)');
    expect(layout(doc, { printWidth: 25 })).toBe('(alpha,beta,gamma,delta)');
    expect(layout(doc, { printWidth: 10 })).toBe('(\n  alpha,\n  beta,\n  gamma,\n  delta\n)');
  });

  it('with two states only', () => {
    const doc = conditionalGroup([
      // Try flat
      join([text(', ')], [text('aaa'), text('bbb'), text('ccc')]),
      // Fallback: broken
      group(
        [indent([hardline, join([text(','), hardline], [text('aaa'), text('bbb'), text('ccc')])])],
        { shouldBreak: true }
      ),
    ]);

    expect(layout(doc, { printWidth: 20 })).toBe('aaa, bbb, ccc');
    expect(layout(doc, { printWidth: 10 })).toBe('\n  aaa,\n  bbb,\n  ccc');
  });
});
