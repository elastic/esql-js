# @elastic/esql-definitions

## 4.19.1

## 4.19.0

### Minor Changes

- [#211](https://github.com/elastic/esql-js/pull/211) [`d1f87cb`](https://github.com/elastic/esql-js/commit/d1f87cb9b67642665fbc29e57a3e55fd272a89ff) Thanks [@vadimkibana](https://github.com/vadimkibana)! - Move `Walker` to `@elastic/esql-traversal` and `Builder` to `@elastic/esql-ast`

  `Walker` (and `walk`) now live in `@elastic/esql-traversal`, and the ES|QL
  `Builder` — along with the `TIME_DURATION_UNITS`, `DATE_PERIOD_UNITS` and
  `TIME_SPAN_UNITS` constants — now lives in `@elastic/esql-definitions`.

  `@elastic/esql` re-exports all of them, so its public API is unchanged.

## 4.18.0

### Minor Changes

- [#215](https://github.com/elastic/esql-js/pull/215) [`260dcca`](https://github.com/elastic/esql-js/commit/260dccadff4b0b03a1d809aa6ff3317e19affcdb) Thanks [@bartoval](https://github.com/bartoval)! - update esql grammars and definitions from ES

- [#210](https://github.com/elastic/esql-js/pull/210) [`c313e76`](https://github.com/elastic/esql-js/commit/c313e7657afcd9b80dd10b87e798be732436b21c) Thanks [@vadimkibana](https://github.com/vadimkibana)! - Update ES|QL gramamr and definitions; remove `isDevVersion()` automatically from grammars on ingestion

## 4.17.0

## 4.16.0

### Minor Changes

- [#200](https://github.com/elastic/esql-js/pull/200) [`5170acf`](https://github.com/elastic/esql-js/commit/5170acfa2bd2e06b639a44f15e9d18a11b078808) Thanks [@elastic-vault-github-plugin-prod](https://github.com/apps/elastic-vault-github-plugin-prod)! - the PromQL labelList rule now yields labelListItem nodes instead of labelName ones

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
