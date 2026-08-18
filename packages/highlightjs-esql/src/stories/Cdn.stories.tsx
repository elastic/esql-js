/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the MIT license (the "License"); you may
 * not use this file except in compliance with the License.
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { CdnHighlightedCode } from './CdnHighlightedCode';

const meta: Meta<typeof CdnHighlightedCode> = {
  title: 'HighlightjsEsql/CDN',
  component: CdnHighlightedCode,
  argTypes: {
    code: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof CdnHighlightedCode>;

export const Example: Story = {
  args: {
    code: [
      '// Highlighted by lib/esql.min.js + highlight.js from cdnjs',
      'FROM kibana_sample_data_logs',
      '  | WHERE message LIKE "Connected*" AND bytes > 1024',
      '  | EVAL kb = ROUND(bytes / 1024, 1)::INTEGER',
      '  | STATS visits = COUNT(*), p95 = PERCENTILE(kb, 95) BY geo.dest',
      '  | SORT visits DESC',
      '  | LIMIT 25',
    ].join('\n'),
  },
};
