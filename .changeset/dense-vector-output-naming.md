---
'@elastic/esql-grammar': patch
'@elastic/esql-types': patch
'@elastic/esql-parser': patch
---

Support the `DENSE_VECTOR` output-naming clauses from the synced grammar: `DENSE_VECTOR target = field`, `DENSE_VECTOR suffix = "_dv" ON a, b`, and constant inputs such as `DENSE_VECTOR target = "text"`. The command now exposes `targetField`, `suffix`, and `literalInput` on the AST, and an absent field list no longer throws while converting the CST.
