/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

export const nonNullable = <T>(v: T): v is NonNullable<T> => {
  return v != null;
};

/**
 * Removes backtick quotes from around a field name and un-escapes any
 * backticks (double ``) within the field name.
 *
 * @param field A potentially escaped field (column).
 */
export const unescapeColumn = (field: string) => {
  if (!field) {
    return '';
  }

  return field.replace(/^`{1}|`{1}$/g, '').replace(/``/g, '`');
};
