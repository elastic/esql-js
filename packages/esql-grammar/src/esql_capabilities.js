/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// JavaScript stand-in for the Java EsqlCapabilities class used in ANTLR semantic
// predicates. The TypeScript parser is deliberately permissive — it parses all
// capability-gated syntax and lets the server enforce what is actually enabled.
export const EsqlCapabilities = {
  Cap: {
    EXTERNAL_COMMAND: { isEnabled: () => true },
  },
};
