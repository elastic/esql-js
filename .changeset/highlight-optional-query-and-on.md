---
'@elastic/esql-parser': minor
---

Fixes the `HIGHLIGHT` incomplete flag when the query or the `ON` clause is omitted. Both are optional: an omitted query reuses the full-text conditions from earlier `WHERE` commands, and an omitted `ON` derives the highlighted fields from the query. Forms such as `HIGHLIGHT`, `HIGHLIGHT ON title`, `HIGHLIGHT MATCH(title, "fox")` and `HIGHLIGHT WITH { ... }` are no longer reported as incomplete. A missing `ON` field list, an `ASSIGN` without a prefix string and a `WITH` without a map are still reported as incomplete.
