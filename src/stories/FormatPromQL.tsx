/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';
import { PromQLParser } from '../embedded_languages/promql/parser';
import {
  PromQLWrappingPrettyPrinter,
  type PromQLWrappingPrettyPrinterOptions,
} from '../embedded_languages/promql/pretty_print';
import { FormatText } from './FormatText';

export interface FormatPromQLProps extends PromQLWrappingPrettyPrinterOptions {
  /** The PromQL query string to format. */
  query: string;
}

export const FormatPromQL: React.FC<FormatPromQLProps> = ({ query, ...opts }) => {
  let formatted: string;
  let error: string | undefined;

  try {
    const { root, errors } = PromQLParser.parse(query);

    if (errors.length > 0) {
      error = errors.map((e) => e.message).join('\n');
    }

    formatted = PromQLWrappingPrettyPrinter.print(root, opts);
  } catch (e) {
    formatted = query;
    error = String(e);
  }

  return <FormatText text={formatted} error={error} />;
};
