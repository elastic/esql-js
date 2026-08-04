<h1 align="center">
  @elastic/esql
</h1>
<p align="center">
  <a href="https://buildkite.com/elastic/esql-js-grammar-sync">
    <img alt="Grammar Sync" src="https://badge.buildkite.com/455a3e37b4061fc25a448cba264e622b6c71be8101cd7b74f3.svg?branch=main">
  </a>
  <a href="https://www.npmjs.com/package/@elastic/esql">
    <img alt="NPM version" src="https://img.shields.io/npm/v/@elastic/esql.svg">
  </a>
</p>

ES|QL and PromQL parser, AST builder, traversal, mutation, and pretty-printing for JavaScript and TypeScript. Used in Kibana and other Elastic tooling.

## Installation

<table>
<tr>
<th>npm</th>
<th>yarn</th>
<th>pnpm</th>
</tr>
<tr>
<td>

```bash
npm install @elastic/esql
```

</td>
<td>

```bash
yarn add @elastic/esql
```

</td>
<td>

```bash
pnpm add @elastic/esql
```

</td>
</tr>
</table>

## Sub-module reference

| Module | Description |
|--------|-------------|
| [`src/parser/`](./src/parser/README.md) | `Parser` class — parse query strings to AST |
| [`src/composer/`](./src/composer/README.md) | `esql` tagged-template query builder |
| [`src/composer/synth/`](./src/composer/synth/README.md) | `synth` — synthesize AST nodes from template strings; PromQL node builders |
| [`src/ast/builder/`](./src/ast/builder/README.md) | `Builder` — low-level AST node construction |
| [`src/ast/walker/`](./src/ast/walker/README.md) | `Walker` — simple full-tree traversal |
| [`src/ast/visitor/`](./src/ast/visitor/README.md) | `Visitor` — typed, controlled traversal with input/output passing |
| [`src/ast/mutate/`](./src/ast/mutate/README.md) | `mutate` — named helpers for structural AST edits |
| [`src/pretty_print/`](./src/pretty_print/README.md) | `BasicPrettyPrinter`, `WrappingPrettyPrinter` |

## Creating an ES|QL AST

### Parsing a query

The [`Parser`](./src/parser/README.md) converts a query string into an AST synchronously.

```ts
import { Parser } from '@elastic/esql';

const { root, errors } = Parser.parse('FROM index | WHERE col0 > 100');
```

Pass `{ withFormatting: true }` to attach comments and whitespace to AST nodes (needed for round-trip formatting):

```ts
const { root } = Parser.parse('FROM /* comment */ index', { withFormatting: true });
```

Parse a single command or expression without a full query string:

```ts
const { root: expr } = Parser.parseExpression('count(*) + 1');
const { root: cmd } = Parser.parseCommand('WHERE col > 10');
```

### Composing a query

The [`esql` composer](./src/composer/README.md) is a tagged-template API for building queries with safe parameter injection:

```ts
import { esql } from '@elastic/esql';

const start = '2024-01-01';
const limit = 100;

const query = esql`
  FROM index
    | WHERE @timestamp >= ${{ start }}
    | SORT @timestamp DESC
    | KEEP service.name, log.level`;

query.pipe`LIMIT ${{ limit }}`;

// Get the Elasticsearch request payload:
query.toRequest();
// { query: 'FROM index | WHERE @timestamp >= ?start | ...', params: [{ start: '2024-01-01' }, ...] }
```

Use `.query` to append multiple piped commands at once:

```ts
query.query`WHERE status == ${{ status }} | STATS count = COUNT(*) | LIMIT ${{ limit }}`;
```

See the [`synth`](src/composer/synth/README.md) API for synthesizing individual AST nodes from template strings.

### Building AST nodes manually

The [`Builder`](./src/ast/builder/README.md) is a low-level API for constructing AST nodes programmatically:

```ts
import { Builder } from '@elastic/esql';

const node = Builder.command({
  name: 'limit',
  args: [Builder.expression.literal.integer(10)],
});
```

## Traversing an ES|QL AST

### Walker

The [`Walker`](./src/ast/walker/README.md) visits every node in the AST, calling your callbacks for each node type:

```ts
import { Walker } from '@elastic/esql';
import type { ESQLCommand, ESQLFunction } from '@elastic/esql-types';

const walker = new Walker({
  visitCommand: (node: ESQLCommand) => {
    console.log('command:', node.name);
  },
  visitFunction: (fn: ESQLFunction) => {
    console.log('function:', fn.name);
  },
});

walker.walk(root);
```

Static helpers like `Walker.findAll()`, `Walker.params()`, and `Walker.replace()` cover the most common search-and-modify patterns without needing to instantiate a walker.

The walker also traverses embedded PromQL expressions — see [PromQL support](./src/ast/walker/README.md#promql-support) in the walker docs.

### Visitor

The [`Visitor`](./src/ast/visitor/README.md) provides a more powerful traversal model where you control which children to visit, and callbacks can pass typed values up and down the tree:

```ts
import { Visitor } from '@elastic/esql';

const columnNames = new Visitor()
  .on('visitColumnExpression', (ctx) => ctx.node.name)
  .on('visitExpression', () => null)
  .on('visitCommand', (ctx) => [...ctx.visitArguments()])
  .on('visitQuery', (ctx) => [...ctx.visitCommands()])
  .visitQuery(root);
```

## Modifying an ES|QL AST

The [`mutate`](./src/ast/mutate/README.md) API provides named methods for common structural edits:

```ts
import { Parser, mutate, BasicPrettyPrinter } from '@elastic/esql';

const { root } = Parser.parse('FROM index METADATA _lang');

console.log([...mutate.commands.from.metadata.list(root)]);
// [ '_lang' ]

mutate.commands.from.metadata.upsert(root, '_id');

console.log([...mutate.commands.from.metadata.list(root)]);
// [ '_lang', '_id' ]

console.log(BasicPrettyPrinter.print(root));
// FROM index METADATA _lang, _id
```

## Pretty-printing

The [`pretty_print`](./src/pretty_print/README.md) module formats an AST back to a query string.

**`BasicPrettyPrinter`** — single-line or pipe-separated multiline output:

```ts
import { Parser, BasicPrettyPrinter } from '@elastic/esql';

const { root } = Parser.parse('FROM index | WHERE x > 100 | LIMIT 100');

BasicPrettyPrinter.print(root);
// FROM index | WHERE x > 100 | LIMIT 100

BasicPrettyPrinter.multiline(root, { pipeTab: '  ' });
// FROM index
//   | WHERE x > 100
//   | LIMIT 100
```

**`WrappingPrettyPrinter`** — width-aware, preserves comments (requires `{ withFormatting: true }` on parse):

```ts
import { Parser, WrappingPrettyPrinter } from '@elastic/esql';

const { root } = Parser.parse(
  'FROM index /* source */ | WHERE x > 100 | LIMIT 100',
  { withFormatting: true },
);

console.log(WrappingPrettyPrinter.print(root, { multiline: true }));
// FROM index /* source */
// | WHERE x > 100
// | LIMIT 100
```

## PromQL support

ES|QL embeds PromQL via the `PROMQL` source command. Use `esql.promql()` in the composer:

```ts
import { esql } from '@elastic/esql';

esql.promql(esql.pql`sum(rate(metric[5m])) by (job)`)
  .where`value > 0`
  .limit(100)
  .print();
// PROMQL (sum(rate(metric[5m])) by (job)) | WHERE value > 0 | LIMIT 100
```

See the [`synth` README](./src/composer/synth/README.md) for `pql`, `pqlSel`, `pqlFunc`, and other PromQL node builders.

## Licence

Licensed under [Elastic License 2.0](./LICENSE.txt).
