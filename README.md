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

ES|QL (Elasticsearch Query Language) tooling for JavaScript and TypeScript: parsing, AST manipulation, pretty-printing, query building, editor integrations, and syntax highlighting. This is a monorepo with multiple packages; see the [Packages](#packages) section below.

## Packages

Syntax highlighting grammars:

| Package | npm | Description |
|---------|-----|-------------|
| [`@elastic/monaco-esql`](packages/monaco-esql/) | [![npm](https://img.shields.io/npm/v/@elastic/monaco-esql.svg)](https://www.npmjs.com/package/@elastic/monaco-esql) | **Monaco Editor** language support for ES\|QL (syntax highlighting via Monarch) |
| [`@elastic/prismjs-esql`](packages/prismjs-esql/) | [![npm](https://img.shields.io/npm/v/@elastic/prismjs-esql.svg)](https://www.npmjs.com/package/@elastic/prismjs-esql) | **Prism.js** / **`refractor`** grammar for ES\|QL syntax highlighting |
| [`@elastic/textmate-esql`](packages/textmate-esql/) | [![npm](https://img.shields.io/npm/v/@elastic/textmate-esql.svg)](https://www.npmjs.com/package/@elastic/textmate-esql) | **TextMate** grammar for ES\|QL syntax highlighting |

ES|QL language tooling:

| Package | npm | Description |
|---------|-----|-------------|
| [`@elastic/esql`](packages/esql/) | [![npm](https://img.shields.io/npm/v/@elastic/esql.svg)](https://www.npmjs.com/package/@elastic/esql) | Core package — ES\|QL parser, AST builder, traversal, mutation, pretty-printing, and the `esql` composer tag |
| [`@elastic/esql-types`](packages/esql-types/) | [![npm](https://img.shields.io/npm/v/@elastic/esql-types.svg)](https://www.npmjs.com/package/@elastic/esql-types) | Pure TypeScript type definitions for ES\|QL and PromQL ASTs; zero runtime code |
| [`@elastic/esql-definitions`](packages/esql-definitions/) | [![npm](https://img.shields.io/npm/v/@elastic/esql-definitions.svg)](https://www.npmjs.com/package/@elastic/esql-definitions) | Language definitions synced from `elastic/elasticsearch`: commands, functions, operators, settings, and docs |
| [`@elastic/elasticsearch-esql-dsl`](packages/esql-dsl/) | [![npm](https://img.shields.io/npm/v/@elastic/elasticsearch-esql-dsl.svg)](https://www.npmjs.com/package/@elastic/elasticsearch-esql-dsl) | Fluent, type-safe ES\|QL query builder — builds query strings from method chains |
| [`@elastic/elasticsearch-query-builder`](packages/query-builder/) | [![npm](https://img.shields.io/npm/v/@elastic/elasticsearch-query-builder.svg)](https://www.npmjs.com/package/@elastic/elasticsearch-query-builder) | Shared query-building primitives: operator symbols, escaping helpers, base expression type |
| [`@elastic/pretty-printer`](packages/pretty-printer/) | [![npm](https://img.shields.io/npm/v/@elastic/pretty-printer.svg)](https://www.npmjs.com/package/@elastic/pretty-printer) | Standalone Wadler-Lindig document algebra and layout engine; no ES\|QL knowledge |
| [`@elastic/esql-grammar`](packages/esql-grammar/) | [![npm](https://img.shields.io/npm/v/@elastic/esql-grammar.svg)](https://www.npmjs.com/package/@elastic/esql-grammar) | Auto-generated ANTLR4 TypeScript artifacts for the ES\|QL grammar |
| [`@elastic/esql-promql-grammar`](packages/esql-promql-grammar/) | [![npm](https://img.shields.io/npm/v/@elastic/esql-promql-grammar.svg)](https://www.npmjs.com/package/@elastic/esql-promql-grammar) | Auto-generated ANTLR4 TypeScript artifacts for the embedded PromQL grammar |


## Quick start

The main package for working with ES|QL language is `@elastic/esql`. See [`packages/esql/`](packages/esql/) for the full `@elastic/esql` API reference.

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

Build a query programmatically with importing ES|QL parser:

```ts
import { ESQL, E, f } from '@elastic/elasticsearch-esql-dsl';

const query = ESQL.from('employees')
  .where(E('still_hired').eq(true))
  .stats({ avg_salary: f.avg('salary') })
  .by('department')
  .limit(10);

console.log(query.render());
```

## Licences

This repository contains multiple packages with different licences. See each package's `package.json` for the full licence text.
