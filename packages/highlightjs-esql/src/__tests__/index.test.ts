/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the MIT license (the "License"); you may
 * not use this file except in compliance with the License.
 */

import { languageName } from '..';

test('exports the language name', () => {
  expect(languageName).toBe('esql');
});
