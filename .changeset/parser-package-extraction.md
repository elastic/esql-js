---
'@elastic/esql-parser': minor
'@elastic/esql-traversal': minor
'@elastic/esql': patch
---

Extract the parser and the AST visitor out of `@elastic/esql` into the packages that own them.

`@elastic/esql-parser` now holds the ES|QL parser (`parse`, `Parser`, `ParseOptions`, `ParseResult`, `ESQLErrorListener`), the PromQL parser (`PromQLParser`, `PromQLErrorListener`, `PromQLCstToAstConverter`), the ANTLR token helpers (`getPosition`, `findTokens`, `findFirstToken`, `findVisibleToken`, `findPunctuationToken`, `isLikelyPunctuation`), and the parser constants (`DEFAULT_CHANNEL`, `HIDDEN_CHANNEL`, `HEADER_COMMANDS`, `SOURCE_COMMANDS`). It also declares the runtime dependencies it needs (`antlr4`, `@elastic/esql-ast`, `@elastic/esql-definitions`, `@elastic/esql-promql-grammar`, `@elastic/esql-traversal`, `@elastic/esql-types`); previously it declared none, so its CommonJS build inlined the ANTLR runtime and failed to load under `require`.

`@elastic/esql-traversal` now holds the AST `Visitor` together with its visitor contexts, and `printAst`.

`@elastic/esql` re-exports all of the above, so its public API is unchanged.
