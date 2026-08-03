<h1 align="center">
  esql-js
</h1>
<p align="center">
  <a href="https://buildkite.com/elastic/esql-js-grammar-sync">
    <img alt="Grammar Sync" src="https://badge.buildkite.com/455a3e37b4061fc25a448cba264e622b6c71be8101cd7b74f3.svg?branch=main">
  </a>
  <a href="https://www.npmjs.com/package/@elastic/esql">
    <img alt="npm @elastic/esql" src="https://img.shields.io/npm/v/@elastic/esql.svg?label=%40elastic%2Fesql">
  </a>
</p>

A Yarn Workspaces monorepo providing ES|QL (Elasticsearch Query Language) tooling for JavaScript and TypeScript: parsing, AST manipulation, pretty-printing, query building, editor integrations, and syntax highlighting.

## Packages

| Package | npm | Description |
|---------|-----|-------------|
| [`@elastic/esql`](packages/esql/) | [![npm](https://img.shields.io/npm/v/@elastic/esql.svg)](https://www.npmjs.com/package/@elastic/esql) | Core package — ES\|QL parser, AST builder, traversal, mutation, pretty-printing, and the `esql` composer tag |
| [`@elastic/esql-types`](packages/esql-types/) | [![npm](https://img.shields.io/npm/v/@elastic/esql-types.svg)](https://www.npmjs.com/package/@elastic/esql-types) | Pure TypeScript type definitions for ES\|QL and PromQL ASTs; zero runtime code |
| [`@elastic/esql-definitions`](packages/esql-definitions/) | [![npm](https://img.shields.io/npm/v/@elastic/esql-definitions.svg)](https://www.npmjs.com/package/@elastic/esql-definitions) | Language definitions synced from `elastic/elasticsearch`: commands, functions, operators, settings, and docs |
| [`@elastic/elasticsearch-esql-dsl`](packages/esql-dsl/) | [![npm](https://img.shields.io/npm/v/@elastic/elasticsearch-esql-dsl.svg)](https://www.npmjs.com/package/@elastic/elasticsearch-esql-dsl) | Fluent, type-safe ES\|QL query builder — builds query strings from method chains |
| [`@elastic/elasticsearch-query-builder`](packages/query-builder/) | [![npm](https://img.shields.io/npm/v/@elastic/elasticsearch-query-builder.svg)](https://www.npmjs.com/package/@elastic/elasticsearch-query-builder) | Shared query-building primitives: operator symbols, escaping helpers, base expression type |
| [`@elastic/pretty-printer`](packages/pretty-printer/) | [![npm](https://img.shields.io/npm/v/@elastic/pretty-printer.svg)](https://www.npmjs.com/package/@elastic/pretty-printer) | Standalone Wadler-Lindig document algebra and layout engine; no ES\|QL knowledge |
| [`@elastic/monaco-esql`](packages/monaco-esql/) | [![npm](https://img.shields.io/npm/v/@elastic/monaco-esql.svg)](https://www.npmjs.com/package/@elastic/monaco-esql) | Monaco Editor language support for ES\|QL (syntax highlighting via Monarch) |
| [`@elastic/prismjs-esql`](packages/prismjs-esql/) | [![npm](https://img.shields.io/npm/v/@elastic/prismjs-esql.svg)](https://www.npmjs.com/package/@elastic/prismjs-esql) | Prism.js / refractor grammar for ES\|QL syntax highlighting |
| `@elastic/esql-grammar` *(internal)* | — | Auto-generated ANTLR4 TypeScript artifacts for the ES\|QL grammar; not published |
| `@elastic/esql-promql-grammar` *(internal)* | — | Auto-generated ANTLR4 TypeScript artifacts for the embedded PromQL grammar; not published |

## Quick start

The most commonly used package is `@elastic/esql`.

```bash
npm install @elastic/esql
```

Parse a query:

```ts
import { Parser } from '@elastic/esql';

const { root, errors } = Parser.parse('FROM index | WHERE col > 100');
```

Build a parameterized query with the `esql` composer:

```ts
import { esql } from '@elastic/esql';

const query = esql`FROM index | WHERE @timestamp >= ${{ start }} | LIMIT ${{ limit }}`;
console.log(query.toRequest());
// { query: 'FROM index | WHERE @timestamp >= ?start | LIMIT ?limit', params: [...] }
```

Build a query programmatically with the DSL:

```ts
import { ESQL, E, f } from '@elastic/elasticsearch-esql-dsl';

const query = ESQL.from('employees')
  .where(E('still_hired').eq(true))
  .stats({ avg_salary: f.avg('salary') })
  .by('department')
  .limit(10);

console.log(query.render());
```

See [`packages/esql/`](packages/esql/) for the full `@elastic/esql` API reference.

## Development setup

**Prerequisites:** Node.js ≥ 18, Corepack.

```bash
corepack enable          # once per machine
yarn install             # install all workspace dependencies
yarn build               # build all packages
yarn test                # run all tests
yarn lint                # ESLint
yarn format:check        # Prettier
```

To regenerate the ANTLR4 TypeScript artifacts after grammar file changes:

```bash
yarn build:antlr4
```

This requires the `antlr` CLI. On macOS:

```bash
brew bundle --file=./.buildkite/scripts/antlr4_tools/brewfile
```

## Grammar sync

The ES|QL and PromQL grammars and language definitions are automatically synced from the `elastic/elasticsearch` repository by a Buildkite CI job (`.buildkite/scripts/esql_grammar_sync.sh`). The job copies updated grammar files, regenerates the ANTLR4 TypeScript artifacts, updates the definition trees, and opens a PR. **Do not edit any file under `packages/esql-grammar/src/`, `packages/esql-promql-grammar/src/`, or `packages/esql-definitions/src/generated/` by hand.**

To run the same sync against a local Elasticsearch checkout:

```bash
yarn sync:grammars [path-to-elasticsearch]
```

When a grammar sync adds new commands or grammar rules, a follow-up PR is needed to wire them into the AST layer; see the [`/grammar-sync-update`](.claude/CLAUDE.md) skill for the workflow.

## Repository structure

```
packages/
  esql/                   @elastic/esql — core package
  esql-types/             @elastic/esql-types — AST TypeScript types
  esql-definitions/       @elastic/esql-definitions — language definitions
  esql-grammar/           @elastic/esql-grammar — generated ANTLR4 artifacts (internal)
  esql-promql-grammar/    @elastic/esql-promql-grammar — generated PromQL ANTLR4 artifacts (internal)
  esql-dsl/               @elastic/elasticsearch-esql-dsl — fluent query builder
  query-builder/          @elastic/elasticsearch-query-builder — shared query primitives
  pretty-printer/         @elastic/pretty-printer — Wadler-Lindig layout engine
  monaco-esql/            @elastic/monaco-esql — Monaco editor integration
  prismjs-esql/           @elastic/prismjs-esql — Prism.js / refractor grammar
```

## Licences

| Packages | Licence |
|----------|---------|
| `@elastic/esql`, `@elastic/esql-types`, `@elastic/esql-definitions`, `@elastic/esql-grammar`, `@elastic/esql-promql-grammar`, `@elastic/pretty-printer` | [Elastic License 2.0](LICENSE) |
| `@elastic/monaco-esql`, `@elastic/prismjs-esql` | MIT |
| `@elastic/elasticsearch-esql-dsl`, `@elastic/elasticsearch-query-builder` | Apache 2.0 |
