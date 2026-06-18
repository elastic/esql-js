/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { EsqlWrappingPlayground } from './EsqlWrappingPlayground';

const meta: Meta<typeof EsqlWrappingPlayground> = {
  title: 'ESQL/WrappingPlayground',
  component: EsqlWrappingPlayground,
  parameters: {
    docs: {
      description: {
        component:
          'Interactive playground for the Doc IR wrapping pretty-printer. Edit the ' +
          'query on the left, tweak printer options (and the width slider) on the ' +
          'right, then watch the formatted output reflow live. The dashed line marks ' +
          'the configured print width.',
      },
    },
  },
  argTypes: {
    query: { control: 'text' },
    initialWidth: { control: { type: 'number', min: 10, max: 200 } },
    initialWithFormatting: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<typeof EsqlWrappingPlayground>;

export const Default: Story = {
  args: {
    initialWidth: 80,
  },
};

export const ComplexPipeline: Story = {
  args: {
    query: `FROM logs
  | DISSECT message "%{date} %{+date} %{msg}" APPEND_SEPARATOR=" "
  | GROK message "%{IP:client} %{WORD:method}"
  | RENAME client AS client_ip, method AS http_method
  | ENRICH policy ON client_ip WITH country = geo_country, city = geo_city
  | STATS hits = COUNT(*) BY country, http_method
  | SORT hits DESC
  | LIMIT 25`,
    initialWidth: 60,
  },
};

export const Rerank: Story = {
  args: {
    query: `FROM a | RERANK "this is a very long long long long long long long long long long text" ON field1, field2 WITH {"inference_id": "my-model", "top_n": 10, "nested": {"k": [1, 2, 3]}}`,
    initialWidth: 80,
  },
};

export const Fork: Story = {
  args: {
    query: `FROM index | FORK (WHERE a > 1 | LIMIT 5) (WHERE b > 2 | SORT c | LIMIT 10) (KEEP d, e, f)`,
    initialWidth: 60,
  },
};

export const WithComments: Story = {
  args: {
    query: `SET timeout = "30s"; // overall request timeout
SET max_results = 1000; // cap the result set
SET allow_partial_results = true; // tolerate shard failures

// ===========================================================================
// Daily traffic, latency and error breakdown for the API service.
//
// Pulls from both the logs and ecommerce sample data sets, filters down to
// recent and sizeable requests, then aggregates per destination and per day.
// ===========================================================================
FROM kibana_sample_data_logs, kibana_sample_data_ecommerce METADATA _index, _id // two sources
  // -- filtering -----------------------------------------------------------
  // keep only recent, sizeable, non-US requests (drops most of the noise)
  | WHERE bytes > 1000 AND @timestamp > NOW() - 1 hour AND (machine.ram >= 1024 OR NOT geo.dest == "US") // noise filter
  // -- derived fields ------------------------------------------------------
  | EVAL kib = bytes / 1024.0, // convert raw bytes to KiB
      tag = CONCAT("x-", TO_STRING(status)), // synthetic status tag
      big = machine.ram::double, // cast ram to a double so AVG behaves
      is_error = status >= 400 // boolean: was this an error response?
  // -- aggregation ---------------------------------------------------------
  | STATS total = SUM(bytes), // total bytes transferred per group
      avg_ram = AVG(machine.ram), // average machine ram in the group
      errors = COUNT(*) WHERE is_error, // number of error responses
      hits = COUNT(*) BY geo.dest, day = BUCKET(@timestamp, 1 day) // group by destination + calendar day
  // -- ranking + projection ------------------------------------------------
  | SORT total DESC NULLS LAST, geo.dest ASC // biggest talkers first
  | KEEP geo.dest, day, total, avg_ram, errors, hits // final, tidy projection
  | LIMIT 100 // safety limit so the UI never melts
// end of pipeline`,
    initialWidth: 80,
    initialWithFormatting: true,
  },
};
