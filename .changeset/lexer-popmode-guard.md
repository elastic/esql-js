---
"@elastic/esql-grammar": patch
---

When a `)` closes more lexer modes than were opened (e.g. `FROM a | FORK (LIMIT 1) | ()`), the lexer no longer crashes, so the editor still gets a partial AST.
