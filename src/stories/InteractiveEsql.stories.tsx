/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { InteractiveEsql } from './InteractiveEsql';

const meta: Meta<typeof InteractiveEsql> = {
  title: 'ESQL/InteractiveEsql',
  component: InteractiveEsql,
  argTypes: {
    query: { control: 'text' },
    wrap: { control: { type: 'number', min: 20, max: 200 } },
    indent: { control: 'text' },
    tab: { control: 'text' },
    pipeTab: { control: 'text' },
    commandTab: { control: 'text' },
    multiline: { control: 'boolean' },
    skipHeader: { control: 'boolean' },
    lowercase: { control: 'boolean' },
    lowercaseCommands: { control: 'boolean' },
    lowercaseOptions: { control: 'boolean' },
    lowercaseFunctions: { control: 'boolean' },
    lowercaseKeywords: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<typeof InteractiveEsql>;

const query = `FROM events_*
  | EVAL client_ip = TO_IP(client_ip)
  | KEEP @timestamp, client_ip, event_duration, message
  | SORT @timestamp DESC`;

export const Default: Story = {
  args: {
    query,
    initialWidth: 80,
  },
};

const queryPromql = `PROMQL index=k8s step=1h result = (sum(rate(http_requests_total{job="apiserver",handler="/api/comments"}[5m])) by (job))
  | EVAL client_ip = TO_IP(client_ip)
  | KEEP @timestamp, client_ip, event_duration, message
  | SORT @timestamp DESC
  | LIMIT 100`;

export const WithPromQL: Story = {
  args: {
    query: queryPromql,
    initialWidth: 80,
  },
};
