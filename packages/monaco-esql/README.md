# `@elastic/monaco-esql`

Monaco Editor language support for ES|QL (the Elasticsearch Query Language), including its embedded PromQL command.

<img width="725" alt="image" src="https://github.com/user-attachments/assets/a725841e-68d6-4765-aa29-54a3062e6a3e" />

## Install

```bash
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

### Customizing keyword lists

`language` is built from the default ES|QL keyword lists in `definitions`. Use `create()` to build a custom Monarch tokenizer — for example, to add functions fetched dynamically from Elasticsearch:

```ts
import { create, definitions } from '@elastic/monaco-esql';

const language = create({
  ...definitions,
  functions: [...definitions.functions, 'MY_CUSTOM_FUNCTION'],
});

monaco.languages.register({ id: 'esql' });
monaco.languages.setMonarchTokensProvider('esql', language);
```

`create()` accepts any subset of the `definitions` object; omitted fields fall back to empty lists. The full set of fields is: `headerCommands`, `sourceCommands`, `processingCommands`, `options`, `literals`, `functions`, `delimiters`, `temporalUnits`.

## Licence

MIT
