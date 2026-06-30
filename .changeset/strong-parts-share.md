---
'@elastic/esql': minor
---

Add a `withParens` parse option to opt out of preserving redundant expression parentheses in the AST. Defaults to `true` (current behavior), set it to `false` to drop parens around expressions, matching the behavior before explicit parens parsing.
