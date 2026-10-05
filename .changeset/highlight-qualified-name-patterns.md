---
"@elastic/esql-parser": minor
"@elastic/esql-types": minor
---

Support wildcard field patterns in the `HIGHLIGHT ... ON` clause, following the grammar change from `qualifiedNames` to `qualifiedNamePatterns`. `ESQLAstHighlightCommand['highlightFields']` is widened from `ESQLColumn[]` to `Array<ESQLColumn | ESQLParam | ESQLIdentifier>`.
