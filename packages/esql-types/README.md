# `@elastic/esql-types`

Shared TypeScript type definitions for the ES|QL and PromQL ASTs. Pure type definitions — no runtime code, no dependencies.

## Install

```bash
npm install @elastic/esql-types
```

## Usage

```ts
import type {
  // Top-level AST
  ESQLAstQueryExpression,
  ESQLAst,

  // Commands
  ESQLCommand,
  ESQLAstHeaderCommand,

  // Expressions
  ESQLFunction,
  ESQLFunctionCallExpression,
  ESQLBinaryExpression,
  ESQLColumn,
  ESQLLiteral,
  ESQLSource,
  ESQLInlineCast,
  ESQLOrderExpression,

  // ... and more

} from '@elastic/esql-types';
```

### PromQL types

```ts
import type {
  PromQLAstQueryExpression,
  PromQLAstExpression,
  PromQLFunction,
  PromQLSelector,
  PromQLBinaryExpression,
  PromQLLabel,
} from '@elastic/esql-types';
```

## Key type relationships

```
ESQLAstQueryExpression          root node — holds commands[]
  ESQLCommand                   a pipeline stage (FROM, WHERE, STATS, …)
    ESQLCommandOption           named sub-clause (e.g. BY in STATS … BY)
    ESQLAstExpression           any expression in a command argument
      ESQLFunction              function call, binary op, unary op
      ESQLColumn                column reference (@timestamp, user.name)
      ESQLLiteral               scalar literal (number, string, boolean, null)
      ESQLSource                index source reference (logs-*, cluster:index)
      ESQLList                  list literal ([1, 2, 3])
      ESQLInlineCast            inline cast (expr::type)
      ESQLParamLiteral          parameter placeholder (?, ?name, ?1)
  ESQLAstHeaderCommand          pre-query instructions (SET key = value)
```

## Notes

- `ESQLAst` is `ESQLAstCommand[]`, the historic array form of a query. Prefer `ESQLAstQueryExpression` (which wraps the command list as a proper AST node) for new code.
- `ESQLFunction` covers function calls, binary expressions (`a + b`, `a == b`), and unary expressions (`-x`, `NOT x`). Narrow with the `subtype` field: `'variadic-call'`, `'binary-expression'`, `'unary-expression'`, `'postfix-unary-expression'`.
- Location info (`ESQLLocation` with `min`/`max` offsets) is set during parsing and zeroed when nodes are constructed with `Builder`.
