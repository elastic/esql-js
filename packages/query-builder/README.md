# @elastic/elasticsearch-query-builder

Shared utilities for building Elasticsearch queries in JavaScript/TypeScript: operator symbols, escaping helpers, and a base expression type for cross-package type checks.

## Installation

```bash
npm install @elastic/elasticsearch-query-builder
```

## Usage

### Operator symbols (Op)

Use the `Op` object for consistent operator keys in query ASTs:

```typescript
import { Op, type OpType } from '@elastic/elasticsearch-query-builder'

// e.g. Op.eq, Op.gt, Op.and, Op.or
const op = Op.eq
const allOps: OpType[] = Object.values(Op)
```

### Escaping

Escape values and identifiers for safe use in queries:

```typescript
import {
  escapeValue,
  isValidIdentifier,
  escapeIdentifier,
} from '@elastic/elasticsearch-query-builder'

escapeValue('foo "bar"')   // escaped string for value context
isValidIdentifier('field') // true if safe as unquoted identifier
escapeIdentifier('field-with-dash') // quoted if needed
```

### BaseExpression and type checks

`BaseExpression` is an abstract base class used for shared type checking across packages. Use `instanceof BaseExpression` or `BaseExpression.isExpression(value)` to detect expression nodes:

```typescript
import {
  BaseExpression,
  type Primitive,
  type ExpressionLike,
  type FieldType,
} from '@elastic/elasticsearch-query-builder'

if (BaseExpression.isExpression(value)) {
  console.log(value.toString())
}
```

## License

[Apache 2.0](../../LICENSE)
