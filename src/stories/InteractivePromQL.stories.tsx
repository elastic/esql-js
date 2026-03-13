/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { InteractivePromQL } from './InteractivePromQL';

const meta: Meta<typeof InteractivePromQL> = {
  title: 'PromQL/InteractivePromQL',
  component: InteractivePromQL,
  argTypes: {
    query: { control: 'text' },
    initialWidth: { control: { type: 'number', min: 10, max: 160 } },
    tabWidth: { control: { type: 'number', min: 1, max: 8 } },
    lowercaseFunctions: { control: 'boolean' },
    lowercaseKeywords: { control: 'boolean' },
    lowercaseOperators: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<typeof InteractivePromQL>;

export const Default: Story = {
  args: {
    query: 'sum(rate(http_requests_total{job="apiserver",handler="/api/comments"}[5m])) by (job)',
    initialWidth: 80,
  },
};

export const HistogramQuantile: Story = {
  args: {
    query:
      'histogram_quantile(0.9, sum(rate(http_request_duration_seconds_bucket{job="apiserver"}[10m])) by (le, verb))',
    initialWidth: 60,
  },
};

export const BinaryExpression: Story = {
  args: {
    query:
      '(node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes * 100',
    initialWidth: 80,
  },
};

export const Long: Story = {
  args: {
    query: `histogram_quantile(0.9, rate(demo_api_request_duration_seconds_bucket{job="demo"}[5m])) > 0.05
        and
      rate(demo_api_request_duration_seconds_count{job="demo"}[5m]) > 1
      and ((node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes + node_remainder * Math_PI) / node_memory_MemTotal_bytes * 100)
      or (sum(rate(http_requests_total{job="apiserver",handler="/api/comments"}[5m])) by (job))`,
    initialWidth: 80,
  },
};
