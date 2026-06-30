---
'@elastic/esql': minor
---

Add a `withParens` parse option to opt into preserving redundant expression parentheses in the AST. Defaults to `false` (parens around expressions are dropped, producing a normalized AST for validation). Set it to `true`, mainly for pretty-printing, to keep the parentheses so they round-trip.
