---
'@elastic/esql-types': major
'@elastic/esql-traversal': major
'@elastic/esql-parser': minor
'@elastic/esql': minor
---

Remove array-boxed nodes (`[node]`) from the ES|QL AST — in parser output and in the type system.

**Breaking changes in `@elastic/esql-types`:**

- `ESQLAstItem` no longer has an array arm: it is now a deprecated alias of `ESQLSingleAstItem`. Code that hand-builds boxed args (`args: [left, [right]]`) no longer compiles — write `args: [left, right]` instead.
- `args` is narrowed from `ESQLAstItem[]` to `ESQLAstExpression[]` on `ESQLCommand`, `ESQLCommandOption`, `ESQLFunction`, and `ESQLFunctionCallExpression`, and the `ESQLUnaryExpression`, `ESQLPostfixUnaryExpression`, `ESQLOrderExpression`, and `ESQLBinaryExpression` tuples are narrowed accordingly.
- `ESQLProperNode` is now a deprecated alias of `ESQLAstNode` — all nodes are *proper* nodes now.

**Breaking changes in `@elastic/esql-traversal`:**

- `Walker.walkExpression()` is typed `ESQLAstExpression | ESQLAstExpression[]` (previously relied on the `ESQLAstItem` array arm).
- `VisitorContext.args()` yields `ESQLAstExpression` and no longer yields raw arrays.
- `firstItem`, `lastItem`, `resolveItem`, and `singleItems` are deprecated: the AST no longer contains array-boxed nodes, so access args directly (`args[0]`, `args.at(-1)`, plain iteration). They remain exported and runtime-tolerant of legacy boxed input for one major cycle.

**Parser output changes (`@elastic/esql-parser`):**

- No AST node is ever wrapped in an array anymore. Notable shapes that changed: `LIMIT ?` / `SAMPLE ?` (`args: [[param]]` to `args: [param]`), `DISSECT ... append_separator=?`, `RERANK ?` (`query` was an array in violation of its declared type), `WHERE x : ?`, and field assignments (`args: [column, [expression]]` to `args: [column, expression]`).
- A missing assignment right-hand side (`SET x =`, `ENRICH p WITH x =`) is now an explicit `{ type: 'unknown', incomplete: true }` placeholder node instead of an empty array.

**Migration:** replace `[node]` boxing with `node` when building ASTs; replace `firstItem(args)`/`resolveItem(arg)`/`lastItem(args)`/`singleItems(args)` with `args[0]`/`arg`/`args.at(-1)`/`args`.
