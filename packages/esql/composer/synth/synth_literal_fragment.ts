/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * A simple wrapper class to represent a literal string fragment in the Synth
 * API. This is used to represent string fragments that are not parsed into
 * proper AST nodes, but are still valid parts of the query string. Caution
 * needed when using this, as this allows to insert arbitrary strings into
 * the query, the intended use is for conditionally inserting command names or
 * other keywords.
 *
 * For example, a literal fragment can be used to insert a raw ES|QL keyword:
 *
 * ```ts
 * synth.cmd `SORT a NULLS ${ new SynthLiteralFragment('FIRST') }`
 * ```
 */
export class SynthLiteralFragment {
  constructor(public readonly value: string) {}
}
