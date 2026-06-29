/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormatDoc } from './FormatDoc';

const meta: Meta<typeof FormatDoc> = {
  title: 'Pretty-printer/FormatDoc',
  component: FormatDoc,
  argTypes: {
    items: { control: { type: 'number', min: 1, max: 20 } },
    printWidth: { control: { type: 'number', min: 10, max: 200 } },
  },
};

export default meta;

type Story = StoryObj<typeof FormatDoc>;

export const Default: Story = {
  args: {
    items: 4,
    printWidth: 40,
  },
};
