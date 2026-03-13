/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormatPromQL } from './FormatPromQL';

const meta: Meta<typeof FormatPromQL> = {
  title: 'PromQL/FormatPromQL',
  component: FormatPromQL,
  argTypes: {
    query: { control: 'text' },
    printWidth: { control: { type: 'number', min: 20, max: 200 } },
    tabWidth: { control: { type: 'number', min: 1, max: 8 } },
    lowercaseFunctions: { control: 'boolean' },
    lowercaseKeywords: { control: 'boolean' },
    lowercaseOperators: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<typeof FormatPromQL>;

export const SimpleRate: Story = {
  args: {
    query: 'sum(rate(http_requests_total{job="apiserver",handler="/api/comments"}[5m])) by (job)',
    printWidth: 80,
  },
};

export const ComplexQuery: Story = {
  args: {
    query:
      'histogram_quantile(0.9, sum(rate(http_request_duration_seconds_bucket{job="apiserver"}[10m])) by (le, verb))',
    printWidth: 60,
  },
};

export const NarrowWidth: Story = {
  args: {
    query:
      'sum by (job) (rate(http_requests_total{job="apiserver",handler="/api/comments",status=~"5.."}[5m]))',
    printWidth: 40,
    tabWidth: 4,
  },
};
