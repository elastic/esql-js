# esql-js

## Setup
- Run `corepack enable` once on a new machine (one-time).
- Run `yarn install` for initial setup or after switching branches.
- Run `yarn build:antlr4` to compile ANTLR grammars after grammar files change (requires `antlr` CLI; on macOS install via `brew bundle --file=./.buildkite/scripts/antlr4_tools/brewfile`).

## Overview
This is a Yarn Workspaces monorepo. Packages live under `packages/*`; the main one is `packages/esql/` (`@elastic/esql`), which provides an ES|QL and PromQL parser, AST builder, and pretty-printer for use in Kibana and other Elastic tooling. It is a TypeScript package compiled with `tsup` + `tsc`.

`packages/pretty-printer/` (`@elastic/pretty-printer`) is a standalone, dependency-free Wadler-Lindig document algebra and layout engine. `@elastic/esql` depends on it.

`packages/esql-types/` (`@elastic/esql-types`) holds all public TypeScript type definitions for the ES|QL and PromQL ASTs. It has zero runtime code and zero dependencies. `@elastic/esql` depends on it; `packages/esql/src/types.ts` is a thin re-export shim from it.

`packages/esql-definitions/` (`@elastic/esql-definitions`) holds shared definitions for the ES|QL language — lists of commands, functions, operators, and their metadata.

`packages/esql-grammar/` (`@elastic/esql-grammar`) and `packages/esql-promql-grammar/` (`@elastic/esql-promql-grammar`) hold the auto-generated ANTLR4 TypeScript artifacts for ES|QL and PromQL respectively. **Do not edit their source files by hand** — they are managed by the CI grammar sync job (`.buildkite/scripts/esql_grammar_sync.sh`). `@elastic/esql` depends on both.

`packages/monaco-esql/` (`@elastic/monaco-esql`) provides Monaco Editor language support for ES|QL.

`packages/prismjs-esql/` (`@elastic/prismjs-esql`) provides Prism.js and refractor syntax highlighting support for ES|QL.

Unlike the rest of the repo, `@elastic/monaco-esql` and `@elastic/prismjs-esql` are MIT-licensed (not Elastic-2.0): their `src/` files carry an MIT header instead of the Elastic one, scoped via overrides in `eslint.config.mjs`.

### Key source areas
Paths are relative to `packages/esql/`.

| Path | Purpose |
|------|---------|
| `src/parser/antlr/` | Auto-generated ANTLR4 TypeScript files (lexer, parser, listener, interp). **Do not edit by hand.** |
| `src/parser/core/cst_to_ast_converter.ts` | Converts ANTLR CST → Kibana AST. Main place to add new command support. |
| `src/types.ts` | Re-export shim. Real AST type definitions live in `packages/esql-types/src/`. Add new command interfaces there. |
| `src/ast/builder/builder.ts` | Programmatic AST builder (used in tests and by consumers). |
| `src/pretty_print/basic_pretty_printer.ts` | Visitor-based printer. Mostly generic; rarely needs changes. |
| `src/pretty_print/constants.ts` | Sets/maps for commands with non-standard formatting rules. |
| `src/embedded_languages/promql/` | Parallel structure for PromQL (own parser, builder, pretty-printer). |

### Grammar sync pipeline
The CI job `.buildkite/scripts/esql_grammar_sync.sh` clones `elastic/elasticsearch`, copies the ANTLR grammar files into `packages/esql/src/parser/antlr/`, rebuilds the TypeScript artifacts, and opens a PR automatically.

That PR only touches `packages/esql/src/parser/antlr/`. When a grammar change adds a **new command or new grammar rule**, a follow-up PR is needed to wire the new rule into the AST layer. Use the `/grammar-sync-update` skill for this.

## Testing
```
yarn test                    # all tests
yarn test --testPathPattern=<file>  # single file
yarn lint                    # ESLint
yarn format:check            # Prettier
yarn build                   # full build (type-check included)
```

## Code style
- TypeScript throughout; no `any`.
- `import type` for type-only imports.
- `PascalCase` for classes/interfaces, `camelCase` for functions/variables.
- No inline comments unless the WHY is non-obvious.
- No trailing summaries in commit messages.

## Contribution
- Keep PRs focused; no unrelated refactors.
- Never skip or comment out tests; fix the underlying code.
- Open PRs as draft until CI is green.
