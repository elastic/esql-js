# Builder

The `Builder` provides the most
low-level stateless AST node construction API.

It can be used when constructing AST nodes from scratch manually,
and it is also used by the parser to construct the AST nodes during the parsing
process.

When parsing the AST nodes will typically have more information, such as the
position in the source code, and other metadata. When constructing the AST nodes
manually, this information is not available, but the `Builder` API can still be
used as it permits to skip the metadata.


## Examples

#### Construct a `literal` expression node:

```ts
import { Builder } from '@elastic/esql';

const node = Builder.expression.literal.numeric({ value: 42, literalType: 'integer' });
```

Returns:

```ts
{
  type: 'literal',
  literalType: 'integer',
  value: 42,
  name: '42',
  location: { min: 0, max: 0 },
  text: '',
  incomplete: false,
}
```

#### Construct a `LIMIT` command with a `literal` argument:

```ts 
import { Builder } from '@elastic/esql';
const node = Builder.command({
  name: 'limit',
  args: [Builder.expression.literal.integer(10)],
});
```

Returns:
```json
{
  "name": "limit",
  "args": [
    {
      "value": 10,
      "literalType": "integer",
      "location": { "min": 0, "max": 0 },
      "text": "",
      "incomplete": false,
      "type": "literal",
      "name": "10"
    }
  ],
  "location": { "min": 0, "max": 0 },
  "text": "",
  "incomplete": false,
  "type": "command"
}
```


## API

- `.parserFields()` &mdash; Constructs parser metadata fields (`location`, `text`, `incomplete`).
- `.command()` &mdash; Constructs a command node.
- `.option()` &mdash; Constructs a command option node.
- `.comment()` &mdash; Constructs a comment node (single-line or multi-line).
- `.identifier()` &mdash; Constructs an identifier node.
- `.expression`
  - `.query()` &mdash; Constructs a query expression node.
  - `.source`
    - `.node()` &mdash; Constructs a source node from a string, string literal, or template.
    - `.index()` &mdash; Constructs an index source node.
  - `.parens()` &mdash; Constructs a parenthesized expression node.
  - `.column()` &mdash; Constructs a column expression node.
  - `.order()` &mdash; Constructs an order expression node.
  - `.inlineCast()` &mdash; Constructs an inline cast expression node.
  - `.where()` &mdash; Constructs a `WHERE` binary expression node.
  - `.func`
    - `.node()` &mdash; Constructs a raw function node.
    - `.call()` &mdash; Constructs a function call expression (variadic-call).
    - `.unary()` &mdash; Constructs a unary expression.
    - `.postfix()` &mdash; Constructs a postfix unary expression.
    - `.binary()` &mdash; Constructs a binary expression.
  - `.list`
    - `.literal()` &mdash; Constructs a list literal node.
    - `.tuple()` &mdash; Constructs a tuple list node.
    - `.bare()` &mdash; Constructs a bare list node.
  - `.literal`
    - `.nil()` &mdash; Constructs a `NULL` literal node.
    - `.boolean()` &mdash; Constructs a boolean literal node.
    - `.numeric()` &mdash; Constructs a numeric (integer or decimal) literal node.
    - `.integer()` &mdash; Constructs an integer literal node.
    - `.decimal()` &mdash; Constructs a decimal (floating point) literal node.
    - `.timespan()` &mdash; Constructs a timespan literal node (time duration or date period).
    - `.string()` &mdash; Constructs a string literal node.
  - `.map()` &mdash; Constructs a map expression node.
  - `.entry()` &mdash; Constructs a map entry node.
- `.param`
  - `.unnamed()` &mdash; Constructs an unnamed parameter node.
  - `.named()` &mdash; Constructs a named parameter node.
  - `.positional()` &mdash; Constructs a positional parameter node.
  - `.build()` &mdash; Constructs a parameter node from a string, auto-detecting the type.
- `.header`
  - `.command()` &mdash; Constructs a header command node.
  - `.command.set()` &mdash; Constructs a `SET` header command node.
