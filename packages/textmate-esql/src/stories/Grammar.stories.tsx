/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the MIT license (the "License"); you may
 * not use this file except in compliance with the License.
 */

/// <reference types="vite/client" />

import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import example from '../../samples/example.esql?raw';
import { HighlightedCode, themes, type ThemeName } from './HighlightedCode';

const meta: Meta<typeof HighlightedCode> = {
  title: 'TextmateEsql/Grammar',
  component: HighlightedCode,
  argTypes: {
    theme: { control: 'select', options: themes },
    code: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof HighlightedCode>;

export const Example: Story = {
  args: {
    code: example,
    theme: 'github-light',
  },
};

export const Playground: Story = {
  args: {
    code: [
      'FROM logs-*, other-index METADATA _index, _score',
      '  | WHERE @timestamp >= NOW() - 1 hour AND status_code != 200',
      '  | EVAL duration_ms = ROUND(duration / 1_000_000, 2), ip = TO_IP(client_ip)',
      '  | STATS count = COUNT(*), p95 = PERCENTILE(duration_ms, 95) BY host.name',
      '  | SORT p95 DESC NULLS LAST',
      '  | LIMIT 10',
    ].join('\n'),
    theme: 'github-dark',
  },
};

const ThemeGrid: React.FC<{ code: string; shown: readonly ThemeName[] }> = ({ code, shown }) => (
  <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
    {shown.map((theme) => (
      <div key={theme} style={{ flex: '1 1 40%', minWidth: 320 }}>
        <h4 style={{ fontFamily: 'sans-serif', margin: '0 0 8px' }}>{theme}</h4>
        <HighlightedCode code={code} theme={theme} />
      </div>
    ))}
  </div>
);

export const LightAndDark: Story = {
  args: {
    code: example,
  },
  parameters: {
    controls: { exclude: ['theme'] },
  },
  render: ({ code }) => <ThemeGrid code={code ?? ''} shown={['github-light', 'github-dark']} />,
};

export const AllThemes: Story = {
  args: {
    code: example,
  },
  parameters: {
    controls: { exclude: ['theme'] },
  },
  render: ({ code }) => <ThemeGrid code={code ?? ''} shown={themes} />,
};
