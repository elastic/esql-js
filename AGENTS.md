# esql-js

## Setup
- Run `yarn install` for initial setup or after switching branches.
- Run `yarn build:antlr4` to compile ANTLR grammars after grammar files change (requires `antlr` CLI; on macOS install via `brew bundle --file=./.buildkite/scripts/antlr4_tools/brewfile`).

## Overview
This library provides an ES|QL and PromQL parser, AST builder, and pretty-printer for use in Kibana and other Elastic tooling. It is a TypeScript package compiled with `tsup` + `tsc`.

### Key source areas
| Path | Purpose |
|------|---------|
| `src/parser/antlr/` | Auto-generated ANTLR4 TypeScript files (lexer, parser, listener, interp). **Do not edit by hand.** |
| `src/parser/core/cst_to_ast_converter.ts` | Converts ANTLR CST → Kibana AST. Main place to add new command support. |
| `src/types.ts` | All public AST node types. Add new command interfaces here. |
| `src/ast/builder/builder.ts` | Programmatic AST builder (used in tests and by consumers). |
| `src/pretty_print/basic_pretty_printer.ts` | Visitor-based printer. Mostly generic; rarely needs changes. |
| `src/pretty_print/constants.ts` | Sets/maps for commands with non-standard formatting rules. |
| `src/embedded_languages/promql/` | Parallel structure for PromQL (own parser, builder, pretty-printer). |

### Grammar sync pipeline
The CI job `.buildkite/scripts/esql_grammar_sync.sh` clones `elastic/elasticsearch`, copies the ANTLR grammar files into `src/parser/antlr/`, rebuilds the TypeScript artifacts, and opens a PR automatically.

That PR only touches `src/parser/antlr/`. When a grammar change adds a **new command or new grammar rule**, a follow-up PR is needed to wire the new rule into the AST layer. Use the `/grammar-sync-update` skill for this.

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
