<h1 align="center"> 🚧 Under construction 🚧 </h1>

<h1 align="center">
  Elastic ES|QL JS
</h1>
<p align="center">
  <a href="https://buildkite.com/elastic/esql-js-release">
    <img alt="Build Status - main branch" src="https://badge.buildkite.com/79986f76697e661970a3d81057a88b828871b670acfd8d3dec.svg?branch=main">
  </a>
  <a href="https://www.npmjs.com/@elastic/esql"><img alt="NPM version" src="https://img.shields.io/npm/v/@elastic/esql.svg"></a>
</p>

The purpose of this package is to provide comprehensive ES|QL functionality including low-level parsing,
building, traversal, pretty-printing and manipulation features on top of a custom compact AST representation.

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

## Requirements

- **Node.js** >= 18.0.0
- This package is distributed as an ES module.

## Contents of the package

### Creating an ES|QL AST
This package offers 3 tools that allow creating an AST for a query.

The [`parser`](./src/parser/README.md) allows to convert a query in text form into an AST.
```js
import { Parser } from '@elastic/esql';

const src = 'FROM index | WHERE col0 > 100';
const { root, errors } = await Parser.parse(src);
```

The [`composer`](./src/composer/README.md) provides a high-level, secure, and developer-friendly way to build ES|QL queries, allowing to get both an AST or string representation of them.
```ts
import { esql } from '@elastic/esql';

const param = 123; // Dynamic parameter, e.g. received from the UI.

const query = esql`
  FROM index
    | WHERE @timestamp >= ${{ param }}
    | SORT @timestamp DESC
    | KEEP service.name, log.level`;

query.pipe`LIMIT 10`;
```
Check also the [`synth`](src/composer/synth/README.md) API for building independent nodes.


The [`builder`](./src/ast/builder/README.md) is a low level API that allows to create AST nodes.
```ts
import { Builder } from '@elastic/esql';

const limitCommandASTNode = Builder.command({
    name: 'limit',
    args: [Builder.expression.literal.integer(10)],
});
```

### Traversing an ES|QL AST
This package exposes 2 ways of traversing an ES|QL AST.

The [`walker`](./src/ast/walker/README.md) class is simpler to use, the developer can provide a set of callbacks which are called when the walker visits a specific type of node.

```ts
import { Walker } from '@elastic/esql';

const walker = new Walker({
  visitCommand: (node: ESQLCommand) => {
    // Called for every command node.
  },
  visitFunction: (fn: ESQLFunction) => {
    // Called every time a function expression is visited.
  },
});

walker.walk(ast);
```

The [`visitor`](./src/ast/visitor/README.md) API provides a feature-rich way to traverse the ES|QL AST. It is more powerful than the Walker API, as it allows to traverse the AST in a more flexible way.
Said that, it's also more complicated to use as it does not automatically traverse the entire tree, read its dedicated documentation to get insights on it.

```ts
import { Visitor } from '@elastic/esql';

new Visitor()
  .on('visitExpression', (ctx) => console.log(ctx.node.type))
  .on('visitCommand', (ctx) => [...ctx.visitArguments()])
  .on('visitQuery', (ctx) => [...ctx.visitCommands()])
  .visitQuery(root);
```

### Modifying an ES|QL AST
The [`mutate`](./src/ast/mutate/README.md) API provides methods to navigate and modify the AST.

```ts
import { Parser, mutate, BasicPrettyPrinter } from '@elastic/esql';

const { root } = Parser.parse('FROM index METADATA _lang');

// [ '_lang' ]
console.log([...mutate.commands.from.metadata.list(root)]); 

mutate.commands.from.metadata.upsert(root, '_id');

// [ '_lang', '_id' ]
console.log([...mutate.commands.from.metadata.list(root)]); 

const src = BasicPrettyPrinter.print(root);

// FROM index METADATA _lang, _id
console.log(src); 
```

### Pretty printing
The [`pretty_print`](./src/pretty_print/README.md) API lets you format the AST to text.

```ts
import { parse, WrappingPrettyPrinter } from '@elastic/esql';

const src = 'FROM index | WHERE x > 100 | LIMIT 100';
const { root } = parse(src, { withFormatting: true });
const text = WrappingPrettyPrinter.print(root, { multiline: true });

/**
  FROM index
  | WHERE x > 100
  | LIMIT 100
*/
console.log(text);
```

## Licence
TBD