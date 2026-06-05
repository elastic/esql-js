# ES|QL `synth` module

The `synth` module lets you easily "synthesize" AST nodes from template strings.
This is useful when you need to construct AST nodes programmatically, but don't
want to deal with the complexity of the `Builder` class.

## Usage

You can synthesize a whole query AST node using the `qry` template tag:

```ts
import { synth } from '@elastic/esql';

const node = synth.qry`FROM index | WHERE my.field == 10`;
// { type: 'query', commands: [ ... ]}
```

However, the synth API allows you to be more granular and create
individual expression or command AST nodes.

You can create an assignment expression AST node as simple as:

```ts
import { synth } from '@elastic/esql';

const node = synth.exp`my.field = max(10, ?my_param)`;
// { type: 'function', name: '=', args: [ ... ]}
```

To construct an equivalent AST node using the `Builder` class, you would need to
write the following code:

```ts
import { Builder } from '@elastic/esql';

const node = Builder.expression.func.binary('=', [
  Builder.expression.column({
    args: [Builder.identifier({ name: 'my' }), Builder.identifier({ name: 'field' })],
  }),
  Builder.expression.func.call('max', [
    Builder.expression.literal.integer(10),
    Builder.param.named({ value: 'my_param' }),
  ]),
]);
// { type: 'function', name: '=', args: [ ... ]}
```

You can nest template strings to create more complex AST nodes:

```ts
const field = synth.exp`my.field`;
const value = synth.exp`max(10, ?my_param)`;

const assignment = synth.exp`${field} = ${value}`;
// { type: 'function', name: '=', args: [
//     { type: 'column', args: [ ... ] },
//     { type: 'function', name: 'max', args: [ ... ] }
// ]}
```

Use the `cmd` tag to create command nodes:

```ts
const command = synth.cmd`WHERE my.field == 10`;
// { type: 'command', name: 'WHERE', args: [ ... ]}
```

AST nodes created by the synthesizer are pretty-printed when you coerce them to
a string or call the `toString` method:

```ts
const command = synth.cmd` WHERE my.field == 10 `; // { type: 'command', ... }
String(command); // "WHERE my.field == 10"
```

## Reference

### `synth.exp`

The `synth.exp` synthesizes an expression AST nodes. (_Expressions_ are
basically any thing that can go into a `WHERE` command, like boolean expression,
function call, literal, params, etc.)

Use it as a function:

```ts
const node = synth.exp('my.field = max(10, ?my_param)');
```

Specify parser options:

```ts
const node = synth.exp('my.field = max(10, ?my_param)', { withFormatting: false });
```

Use it as a template string tag:

```ts
const node = synth.exp`my.field = max(10, ?my_param)`;
```

Specify parser options, when using as a template string tag:

```ts
const node = synth.exp({ withFormatting: false })`my.field = max(10, 20)`;
```

Combine nodes using template strings:

```ts
const field = synth.exp`my.field`;
const node = synth.exp`${field} = max(10, 20)`;
```

Print the node as a string:

```ts
const node = synth.exp`my.field = max(10, 20)`;
String(node); // 'my.field = max(10, 20)'
```

### `synth.cmd`

The `cmd` tag synthesizes a command AST node (such as `SELECT`, `WHERE`,
etc.). You use it the same as the `exp` tag. The only difference is that the
`cmd` tag creates a command AST node.

```ts
const node = synth.cmd`WHERE my.field == 10`;
// { type: 'command', name: 'where', args: [ ... ]}
```

### `synth.hdr`

The `hdr` tag synthesizes a header command AST node (such as `SET`). You use it
the same as the `exp` and `cmd` tags. The only difference is that the `hdr` tag
creates a header command AST node.

```ts
const node = synth.hdr`SET param = "value"`;
// { type: 'header-command', name: 'set', args: [ ... ]}
```

### `synth.qry`

The `qry` tag synthesizes a query AST node. Otherwise, it works the same as the
`exp` and `cmd` tags.

```ts
const node = synth.qry`FROM index | WHERE my.field == 10`;
// { type: 'query', commands: [ ... ]}
```

## PromQL expressions

The `synth` module includes first-class support for building embedded PromQL
expressions. These are used with the `PROMQL` ES|QL source command.

### `pql` — parse a PromQL string

The `pql` tag parses a PromQL string into a
`PromQLAstQueryExpression` node. Use it as a tagged template or a function call:

```ts
import { pql } from '@elastic/esql';

// Tagged template
const expr = pql`rate(http_requests_total[5m])`;

// Function call
const expr = pql('rate(http_requests_total[5m])');

// Coerce to string to pretty-print
String(expr); // 'rate(http_requests_total[5m])'
```

PromQL nodes can be composed by interpolating one inside another:

```ts
const range = pql`5m`;
const selector = pql`http_requests_total{job="api"}[${range}]`;
const func = pql`rate(${selector})`;
String(func); // 'rate(http_requests_total{job="api"}[5m])'
```

### Node builders

The node builders let you construct PromQL AST nodes programmatically, without
string parsing.

#### `pqlSel` — selector

```ts
import { pqlSel } from '@elastic/esql';

pqlSel('up')                                    // up
pqlSel('metric', '5m')                          // metric[5m]
pqlSel('metric', { job: 'api' })                // metric{job="api"}
pqlSel('metric', { job: 'api' }, '5m')          // metric{job="api"}[5m]
pqlSel(undefined, { job: 'api' })               // {job="api"}
```

#### `pqlFunc` — function call or aggregation

```ts
import { pqlFunc, pqlSel } from '@elastic/esql';

pqlFunc('rate', pqlSel('metric', '5m'))
// rate(metric[5m])

pqlFunc('sum', pqlSel('metric', '5m'), { by: ['job'] })
// sum(metric[5m]) by (job)

pqlFunc('histogram_quantile', [pqlNum(0.95), pqlSel('le_bucket', '5m')])
// histogram_quantile(0.95, le_bucket[5m])
```

#### `pqlBinary` — binary expression

```ts
import { pqlBinary, pqlSel } from '@elastic/esql';

pqlBinary('+', a, b)
// a + b

pqlBinary('==', a, b, { bool: true })
// a == bool b

pqlBinary('/', a, b, { on: ['job'], groupLeft: [] })
// a / on(job) group_left b
```

#### Literals

```ts
import { pqlNum, pqlStr, pqlTime } from '@elastic/esql';

pqlNum(0.95)   // 0.95
pqlStr('val')  // "val"
pqlTime('5m')  // 5m
```

#### Label matchers

```ts
import { pqlLabel, pqlLabels } from '@elastic/esql';

pqlLabel('job', '=', 'api')            // job="api"
pqlLabel('status', '=~', '2..')        // status=~"2.."

pqlLabels({ job: 'api', env: 'prod' }) // {job="api", env="prod"}
pqlLabels([pqlLabel('s', '!=', 'x')])  // {s!="x"}
```

#### Other builders

| Function | Output |
|---|---|
| `pqlUnary('+' \| '-', expr)` | `+expr` / `-expr` |
| `pqlParens(expr)` | `(expr)` |
| `pqlSubquery(expr, '30m')` | `expr[30m:]` |
| `pqlSubquery(expr, '30m', '5m')` | `expr[30m:5m]` |
| `pqlOffset('5m')` | `offset 5m` |
| `pqlAt('start()')` | `@ start()` |
