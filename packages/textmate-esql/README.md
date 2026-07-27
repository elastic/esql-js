# @elastic/textmate-esql

TextMate grammar for [ES|QL](https://www.elastic.co/guide/en/elasticsearch/reference/current/esql.html) syntax highlighting.

Usable in any editor or tool that supports TextMate grammars: VS Code, Sublime Text, Zed, and syntax highlighters such as [shiki](https://shiki.style/).

## Installation

```bash
npm install @elastic/textmate-esql
```

## Usage

```ts
import { esqlGrammar } from '@elastic/textmate-esql';
```

The `esqlGrammar` export is a plain object matching the TextMate grammar JSON schema. Pass it directly to any tool that accepts a TextMate grammar (e.g. shiki's `langs` option).

The raw grammar files are also shipped in the `syntaxes/` directory of the package:

- `syntaxes/esql.tmLanguage.json` — JSON source (canonical)
- `syntaxes/esql.tmLanguage` — XML plist (generated from the JSON)

## License

MIT
