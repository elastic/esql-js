# @elastic/esql

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
