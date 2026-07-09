# @elastic/monaco-esql

Monaco Editor language support for ES|QL (the Elasticsearch Query Language),
including its embedded PromQL command.

<img width="725" alt="image" src="https://github.com/user-attachments/assets/a725841e-68d6-4765-aa29-54a3062e6a3e" />

## Install

```sh
npm install @elastic/monaco-esql
```

## Usage

Register the `esql` language with Monaco and set its Monarch tokens provider:

```ts
import * as monaco from 'monaco-editor';
import { language } from '@elastic/monaco-esql';

monaco.languages.register({ id: 'esql' });
monaco.languages.setMonarchTokensProvider('esql', language);
```

### Customizing definitions

`language` is built from the default ES|QL command/function/operator lists in
`definitions`. Use `create()` directly to build a variant with your own lists
(e.g. functions fetched dynamically from Elasticsearch):

```ts
import { create, definitions } from '@elastic/monaco-esql';

const language = create({
  ...definitions,
  functions: [...definitions.functions, 'MY_FUNCTION'],
});
```

## License

MIT

