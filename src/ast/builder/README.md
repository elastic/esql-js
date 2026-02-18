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
      "location": {
        "min": 0,
        "max": 0
      },
      "text": "",
      "incomplete": false,
      "type": "literal",
      "name": "10"
    }
  ],
  "location": {
    "min": 0,
    "max": 0
  },
  "text": "",
  "incomplete": false,
  "type": "command"
}
```
