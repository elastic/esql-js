---
'@elastic/esql': minor
---

The `Walker` now traverses embedded PromQL expressions across its whole API surface:

- `Walker.params()` collects PromQL param literals (e.g. `?host` in label matchers, `??labels` in grouping label lists) alongside ES|QL params, in source order.
- `Walker.find()`, `findAll()`, `match()`, `matchAll()`, `replace()`, and `replaceAll()` match and mutate nodes of both dialects, match templates accept PromQL node types and keys (e.g. `{type: 'selector'}`, `{dialect: 'promql'}`).
- `Walker.parent()` and `parents()` resolve parents of PromQL nodes, ancestry crosses the dialect boundary (the parent of a PromQL root expression is the containing ES|QL node).
- `Walker.visitComments()` reports comments inside PromQL expressions.
- `Walker.findFunction()` and `hasFunction()` accept a `dialects` option (default `['esql']`) — same-named ES|QL and PromQL functions are unrelated, so PromQL matching is opt-in.
- The PromQL walker visitor API gains `skipChildren()`, for parity with the ES|QL walker.
- Statics that take caller options now chain caller-supplied visitors instead of overriding them.
