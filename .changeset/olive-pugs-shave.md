---
'@elastic/esql-traversal': minor
'@elastic/esql-ast': minor
'@elastic/esql-definitions': minor
---

Move `Walker` to `@elastic/esql-traversal` and `Builder` to `@elastic/esql-ast`

`Walker` (and `walk`) now live in `@elastic/esql-traversal`, and the ES|QL
`Builder` — along with the `TIME_DURATION_UNITS`, `DATE_PERIOD_UNITS` and
`TIME_SPAN_UNITS` constants — now lives in `@elastic/esql-definitions`.

`@elastic/esql` re-exports all of them, so its public API is unchanged.
