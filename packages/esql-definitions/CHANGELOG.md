# @elastic/esql-definitions

## 4.15.0

## 4.14.0

### Minor Changes

- [#196](https://github.com/elastic/esql-js/pull/196) [`b1bcc33`](https://github.com/elastic/esql-js/commit/b1bcc33b5ae40cf5c7c08fad0ea8c78bace2d7db) Thanks [@vadimkibana](https://github.com/vadimkibana)! - Add `output` field to `CommandDefinition` for commands that produce a fixed set of output columns (`IP_LOCATION`, `URI_PARTS`, `REGISTERED_DOMAIN`, `USER_AGENT`). The field carries variant-based column metadata synced from Elasticsearch and is passed through verbatim by the generator.

## 4.13.0

### Minor Changes

- [#188](https://github.com/elastic/esql-js/pull/188) [`cdcb836`](https://github.com/elastic/esql-js/commit/cdcb8366e0a55ef9a071621429552359d5ec89aa) Thanks [@vadimkibana](https://github.com/vadimkibana)! - Use shared option name and other keyword lists

- [#189](https://github.com/elastic/esql-js/pull/189) [`f7895a3`](https://github.com/elastic/esql-js/commit/f7895a3a75f6842beb0fb905869eb715b4d4caa1) Thanks [@vadimkibana](https://github.com/vadimkibana)! - Ingest command and function name definitions from Elasticsearch

## 4.12.0

### Minor Changes

- [#183](https://github.com/elastic/esql-js/pull/183) [`3f5ee77`](https://github.com/elastic/esql-js/commit/3f5ee777a6693fd614d17fb4aea0f87d17f96631) Thanks [@vadimkibana](https://github.com/vadimkibana)! - Add `@elastic/esql-definitions` package with shared `commandsNames` and `functionNames` lists, and use it in `@elastic/prismjs-esql` instead of its own hardcoded lists.
