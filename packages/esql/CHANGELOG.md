# @elastic/esql

## 4.19.1

### Patch Changes

- [#218](https://github.com/elastic/esql-js/pull/218) [`a8558f8`](https://github.com/elastic/esql-js/commit/a8558f8e676ee5894c494831b6a7356a65541306) Thanks [@momovdg](https://github.com/momovdg)! - Fix broken type re-export of `DATE_PERIOD_UNITS`, `TIME_DURATION_UNITS`, and `TIME_SPAN_UNITS`: add `@elastic/esql-definitions` as an explicit dependency so the `./time` subpath resolves to the correct version in consumers that have an older version hoisted.

- Updated dependencies []:
  - @elastic/esql-types@4.19.1
  - @elastic/esql-definitions@4.19.1
  - @elastic/esql-grammar@4.19.1
  - @elastic/esql-promql-grammar@4.19.1
  - @elastic/pretty-printer@4.19.1
  - @elastic/esql-traversal@4.19.1
  - @elastic/esql-ast@4.19.1

## 4.19.0

### Patch Changes

- [#216](https://github.com/elastic/esql-js/pull/216) [`8771d0c`](https://github.com/elastic/esql-js/commit/8771d0c408d6f943f30bb7b9b608130aac78cbf9) Thanks [@momovdg](https://github.com/momovdg)! - Add prefix support to HIGHLIGHT command AST: parse the optional `prefix = "..."` clause into `ESQLAstHighlightCommand.prefix` and expose the binary-expression assignment in `args`.

- Updated dependencies [[`d1f87cb`](https://github.com/elastic/esql-js/commit/d1f87cb9b67642665fbc29e57a3e55fd272a89ff), [`8771d0c`](https://github.com/elastic/esql-js/commit/8771d0c408d6f943f30bb7b9b608130aac78cbf9), [`d1f87cb`](https://github.com/elastic/esql-js/commit/d1f87cb9b67642665fbc29e57a3e55fd272a89ff), [`d1f87cb`](https://github.com/elastic/esql-js/commit/d1f87cb9b67642665fbc29e57a3e55fd272a89ff)]:
  - @elastic/esql-traversal@4.19.0
  - @elastic/esql-types@4.19.0
  - @elastic/esql-ast@4.19.0
  - @elastic/esql-grammar@4.19.0
  - @elastic/esql-promql-grammar@4.19.0
  - @elastic/pretty-printer@4.19.0

## 4.18.0

### Minor Changes

- [#215](https://github.com/elastic/esql-js/pull/215) [`260dcca`](https://github.com/elastic/esql-js/commit/260dccadff4b0b03a1d809aa6ff3317e19affcdb) Thanks [@bartoval](https://github.com/bartoval)! - update esql grammars and definitions from ES

- [#210](https://github.com/elastic/esql-js/pull/210) [`c313e76`](https://github.com/elastic/esql-js/commit/c313e7657afcd9b80dd10b87e798be732436b21c) Thanks [@vadimkibana](https://github.com/vadimkibana)! - Update ES|QL gramamr and definitions; remove `isDevVersion()` automatically from grammars on ingestion

### Patch Changes

- [#213](https://github.com/elastic/esql-js/pull/213) [`ba0ef6b`](https://github.com/elastic/esql-js/commit/ba0ef6b68e920d8c0d2a9e7c447f17f92b720083) Thanks [@vadimkibana](https://github.com/vadimkibana)! - Correctly parse escaped sequences

- [#207](https://github.com/elastic/esql-js/pull/207) [`bc85162`](https://github.com/elastic/esql-js/commit/bc851624a0849eceda113b3bfb1739cd3c279855) Thanks [@vadimkibana](https://github.com/vadimkibana)! - Update package READMEs

- Updated dependencies [[`260dcca`](https://github.com/elastic/esql-js/commit/260dccadff4b0b03a1d809aa6ff3317e19affcdb), [`bc85162`](https://github.com/elastic/esql-js/commit/bc851624a0849eceda113b3bfb1739cd3c279855), [`c313e76`](https://github.com/elastic/esql-js/commit/c313e7657afcd9b80dd10b87e798be732436b21c)]:
  - @elastic/esql-grammar@4.18.0
  - @elastic/esql-types@4.18.0
  - @elastic/esql-promql-grammar@4.18.0
  - @elastic/pretty-printer@4.18.0

## 4.17.0

### Minor Changes

- [#203](https://github.com/elastic/esql-js/pull/203) [`68f8cc2`](https://github.com/elastic/esql-js/commit/68f8cc2f4f27d3102eec149425d19f41b2d6c38f) Thanks [@vadimkibana](https://github.com/vadimkibana)! - The `Walker` now traverses embedded PromQL expressions across its whole API surface:

  - `Walker.params()` collects PromQL param literals (e.g. `?host` in label matchers, `??labels` in grouping label lists) alongside ES|QL params, in source order.
  - `Walker.find()`, `findAll()`, `match()`, `matchAll()`, `replace()`, and `replaceAll()` match and mutate nodes of both dialects, match templates accept PromQL node types and keys (e.g. `{type: 'selector'}`, `{dialect: 'promql'}`).
  - `Walker.parent()` and `parents()` resolve parents of PromQL nodes, ancestry crosses the dialect boundary (the parent of a PromQL root expression is the containing ES|QL node).
  - `Walker.visitComments()` reports comments inside PromQL expressions.
  - `Walker.findFunction()` and `hasFunction()` accept a `dialects` option (default `['esql']`) — same-named ES|QL and PromQL functions are unrelated, so PromQL matching is opt-in.
  - The PromQL walker visitor API gains `skipChildren()`, for parity with the ES|QL walker.
  - Statics that take caller options now chain caller-supplied visitors instead of overriding them.

### Patch Changes

- Updated dependencies []:
  - @elastic/esql-types@4.17.0
  - @elastic/esql-grammar@4.17.0
  - @elastic/esql-promql-grammar@4.17.0
  - @elastic/pretty-printer@4.17.0

## 4.16.0

### Minor Changes

- [#200](https://github.com/elastic/esql-js/pull/200) [`5170acf`](https://github.com/elastic/esql-js/commit/5170acfa2bd2e06b639a44f15e9d18a11b078808) Thanks [@elastic-vault-github-plugin-prod](https://github.com/apps/elastic-vault-github-plugin-prod)! - the PromQL labelList rule now yields labelListItem nodes instead of labelName ones

### Patch Changes

- Updated dependencies [[`5170acf`](https://github.com/elastic/esql-js/commit/5170acfa2bd2e06b639a44f15e9d18a11b078808)]:
  - @elastic/esql-promql-grammar@4.16.0
  - @elastic/pretty-printer@4.16.0
  - @elastic/esql-grammar@4.16.0
  - @elastic/esql-types@4.16.0

## 4.15.0

### Patch Changes

- Updated dependencies []:
  - @elastic/esql-types@4.15.0
  - @elastic/esql-grammar@4.15.0
  - @elastic/esql-promql-grammar@4.15.0
  - @elastic/pretty-printer@4.15.0

## 4.14.0

### Patch Changes

- [#194](https://github.com/elastic/esql-js/pull/194) [`9d6b907`](https://github.com/elastic/esql-js/commit/9d6b907d00267a719855cd32a6fc24b8e5d18be0) Thanks [@momovdg](https://github.com/momovdg)! - Fix crash in `WrappingPrettyPrinter` when printing an empty query

- Updated dependencies []:
  - @elastic/esql-types@4.14.0
  - @elastic/esql-grammar@4.14.0
  - @elastic/esql-promql-grammar@4.14.0
  - @elastic/pretty-printer@4.14.0

## 4.13.0

### Patch Changes

- Updated dependencies []:
  - @elastic/esql-types@4.13.0
  - @elastic/esql-grammar@4.13.0
  - @elastic/esql-promql-grammar@4.13.0
  - @elastic/pretty-printer@4.13.0

## 4.12.0

### Minor Changes

- [#191](https://github.com/elastic/esql-js/pull/191) [`0058d27`](https://github.com/elastic/esql-js/commit/0058d27da8a15374395feab03d1a72fdfc2440dc) Thanks [@elastic-vault-github-plugin-prod](https://github.com/apps/elastic-vault-github-plugin-prod)! - Support primary expressions, including function calls, on the left-hand side of match (:) expressions

### Patch Changes

- [#190](https://github.com/elastic/esql-js/pull/190) [`eed8b68`](https://github.com/elastic/esql-js/commit/eed8b6823208d396b685d35ec2465a2b5995bf3a) Thanks [@momovdg](https://github.com/momovdg)! - Parser errors caused by invalid characters in unquoted identifiers now produce a dedicated `invalidUnquotedIdentifier` error code instead of the generic `syntaxError`. The error span covers the full identifier rather than just the offending character, making it easier for consumers to extract and rewrite the identifier.

- Updated dependencies [[`0058d27`](https://github.com/elastic/esql-js/commit/0058d27da8a15374395feab03d1a72fdfc2440dc)]:
  - @elastic/esql-grammar@4.12.0
  - @elastic/esql-types@4.12.0
  - @elastic/esql-promql-grammar@4.12.0
  - @elastic/pretty-printer@4.12.0

## 4.11.0

### Minor Changes

- [#143](https://github.com/elastic/esql-js/pull/143) [`8e45272`](https://github.com/elastic/esql-js/commit/8e452723fa969bca11a9216ae54efdb3149a33f2) Thanks [@vadimkibana](https://github.com/vadimkibana)! - Re-implement ES|QL pretty-printer on top of Doc IR

### Patch Changes

- Updated dependencies []:
  - @elastic/esql-types@4.11.0
  - @elastic/esql-grammar@4.11.0
  - @elastic/esql-promql-grammar@4.11.0
  - @elastic/pretty-printer@4.11.0

## 4.10.0

### Minor Changes

- [#177](https://github.com/elastic/esql-js/pull/177) [`a614713`](https://github.com/elastic/esql-js/commit/a61471351e4ef6d26810a22dd8023d3c0b940483) Thanks [@vadimkibana](https://github.com/vadimkibana)! - Create standalone `@elastic/esql-types`, `@elastic/esql-grammar`, and `@elastic/esql-promql-grammar` packages

### Patch Changes

- Updated dependencies [[`a614713`](https://github.com/elastic/esql-js/commit/a61471351e4ef6d26810a22dd8023d3c0b940483)]:
  - @elastic/esql-types@4.10.0
  - @elastic/esql-grammar@4.10.0
  - @elastic/esql-promql-grammar@4.10.0
  - @elastic/pretty-printer@4.10.0

## 4.9.1

### Patch Changes

- [#169](https://github.com/elastic/esql-js/pull/169) [`8154024`](https://github.com/elastic/esql-js/commit/8154024b64541c2a1d79039353c616bcf3b91839) Thanks [@momovdg](https://github.com/momovdg)! - Fix `WrappingPrettyPrinter` dropping final own-line comments attached as bottom formatting decorations.

- Updated dependencies []:
  - @elastic/pretty-printer@4.9.1

## 4.9.0

### Minor Changes

- [#174](https://github.com/elastic/esql-js/pull/174) [`8e6dd38`](https://github.com/elastic/esql-js/commit/8e6dd38a0cf647ac0385da5dac0fe71123c15438) Thanks [@elastic-vault-github-plugin-prod](https://github.com/apps/elastic-vault-github-plugin-prod)! - publish grammar to enable prod

- [#174](https://github.com/elastic/esql-js/pull/174) [`8e6dd38`](https://github.com/elastic/esql-js/commit/8e6dd38a0cf647ac0385da5dac0fe71123c15438) Thanks [@elastic-vault-github-plugin-prod](https://github.com/apps/elastic-vault-github-plugin-prod)! - update grammar for subqueries

### Patch Changes

- Updated dependencies [[`8e6dd38`](https://github.com/elastic/esql-js/commit/8e6dd38a0cf647ac0385da5dac0fe71123c15438)]:
  - @elastic/pretty-printer@4.9.0

## 4.8.0

### Minor Changes

- [#167](https://github.com/elastic/esql-js/pull/167) [`2e5127e`](https://github.com/elastic/esql-js/commit/2e5127ed343d06fe4b181f05678bb0e4e252c389) Thanks [@momovdg](https://github.com/momovdg)! - Add support for the `HIGHLIGHT` command in the ES|QL parser and AST.

### Patch Changes

- Updated dependencies []:
  - @elastic/pretty-printer@4.8.0

## 4.7.1

### Patch Changes

- [#168](https://github.com/elastic/esql-js/pull/168) [`938d42b`](https://github.com/elastic/esql-js/commit/938d42bf38257857e3d518e32c12edd5d568cef7) Thanks [@bartoval](https://github.com/bartoval)! - Fix package publishing through Yarn workspaces.

- Updated dependencies [[`938d42b`](https://github.com/elastic/esql-js/commit/938d42bf38257857e3d518e32c12edd5d568cef7)]:
  - @elastic/pretty-printer@4.7.1

## 4.7.0

### Minor Changes

- [#162](https://github.com/elastic/esql-js/pull/162) [`8ed8b9e`](https://github.com/elastic/esql-js/commit/8ed8b9e69ef721ff7463d305d27dd307e06e3c3d) Thanks [@vadimkibana](https://github.com/vadimkibana)! - Create a standalone `@elastic/pretty-printer` package

- [#164](https://github.com/elastic/esql-js/pull/164) [`0ddf793`](https://github.com/elastic/esql-js/commit/0ddf79312bf131883bc7b6677b2f467657473192) Thanks [@vadimkibana](https://github.com/vadimkibana)! - Add a `withParens` parse option to opt into preserving redundant expression parentheses in the AST. Defaults to `false` (parens around expressions are dropped, producing a normalized AST for validation). Set it to `true`, mainly for pretty-printing, to keep the parentheses so they round-trip.

### Patch Changes

- Updated dependencies [[`8ed8b9e`](https://github.com/elastic/esql-js/commit/8ed8b9e69ef721ff7463d305d27dd307e06e3c3d)]:
  - @elastic/pretty-printer@4.7.0
