---
'@elastic/esql': patch
'@elastic/esql-types': patch
---

Add prefix support to HIGHLIGHT command AST: parse the optional `prefix = "..."` clause into `ESQLAstHighlightCommand.prefix` and expose the binary-expression assignment in `args`.
