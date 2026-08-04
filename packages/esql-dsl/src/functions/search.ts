/*
 * Copyright Elasticsearch B.V. and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ExpressionLike } from '@elastic/elasticsearch-query-builder';
import { InstrumentedExpression } from '../expression';
import { fn, fnLiteral, renderArg, renderLiteralArg } from '../fn';

/** ES|QL `MATCH` — full-text match on field. */
export function match(field: ExpressionLike, query: ExpressionLike): InstrumentedExpression {
  return new InstrumentedExpression(`MATCH(${renderArg(field)}, ${renderLiteralArg(query)})`);
}

/** ES|QL `MATCH_PHRASE` — phrase match on field. */
export function matchPhrase(field: ExpressionLike, query: ExpressionLike): InstrumentedExpression {
  return new InstrumentedExpression(
    `MATCH_PHRASE(${renderArg(field)}, ${renderLiteralArg(query)})`
  );
}

/** ES|QL `MULTI_MATCH` — full-text match across multiple fields. */
export function multiMatch(
  query: ExpressionLike,
  ...fields: ExpressionLike[]
): InstrumentedExpression {
  const args = [renderLiteralArg(query), ...fields.map(renderArg)];
  return new InstrumentedExpression(`MULTI_MATCH(${args.join(', ')})`);
}

/** ES|QL `TERM` — exact term match on field. */
export function term(field: ExpressionLike, value: ExpressionLike): InstrumentedExpression {
  return new InstrumentedExpression(`TERM(${renderArg(field)}, ${renderLiteralArg(value)})`);
}

/** ES|QL `KQL` — KQL query expression. */
export function kql(query: string): InstrumentedExpression {
  return fnLiteral('KQL', query);
}

/** ES|QL `QSTR` — quoted string query. */
export function qstr(query: string): InstrumentedExpression {
  return fnLiteral('QSTR', query);
}

/** ES|QL `KNN` — k-nearest neighbors vector search. */
export function knn(
  field: ExpressionLike,
  k: ExpressionLike,
  ...rest: ExpressionLike[]
): InstrumentedExpression {
  return fn('KNN', field, k, ...rest);
}

/** ES|QL `SCORE` — returns relevance score. */
export function score(): InstrumentedExpression {
  return new InstrumentedExpression('SCORE()');
}

/** ES|QL `DECAY` — decay function for scoring. */
export function decay(
  func: ExpressionLike,
  field: ExpressionLike,
  ...rest: ExpressionLike[]
): InstrumentedExpression {
  return new InstrumentedExpression(
    `DECAY(${renderLiteralArg(func)}, ${[field, ...rest].map(renderArg).join(', ')})`
  );
}

/** ES|QL `TEXT_EMBEDDING` — generates embedding from text via inference. */
export function textEmbedding(
  inferenceId: ExpressionLike,
  input: ExpressionLike
): InstrumentedExpression {
  return fnLiteral('TEXT_EMBEDDING', inferenceId, input);
}

/** ES|QL `TOP_SNIPPETS` — returns top text snippets for matched field. */
export function topSnippets(
  field: ExpressionLike,
  ...rest: ExpressionLike[]
): InstrumentedExpression {
  return fn('TOP_SNIPPETS', field, ...rest);
}
