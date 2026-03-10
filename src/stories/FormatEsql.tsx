/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';
import { Parser } from '../parser';
import { WrappingPrettyPrinter, type WrappingPrettyPrinterOptions } from '../pretty_print';
import { FormatText } from './FormatText';

export interface FormatEsqlProps extends WrappingPrettyPrinterOptions {
  /** The ES|QL query string to format. */
  query: string;
}

export const FormatEsql: React.FC<FormatEsqlProps> = ({ query, ...opts }) => {
  let formatted: string;
  let error: string | undefined;

  try {
    const { root, errors } = Parser.parse(query);

    if (errors.length > 0) {
      error = errors.map((e) => e.message).join('\n');
    }

    formatted = WrappingPrettyPrinter.print(root, opts);
  } catch (e) {
    formatted = query;
    error = String(e);
  }

  return <FormatText text={formatted} error={error} />;
};
