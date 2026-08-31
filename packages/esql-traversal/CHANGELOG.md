# @elastic/esql-traversal

## 4.22.0

### Minor Changes

- [#232](https://github.com/elastic/esql-js/pull/232) [`bbf69c0`](https://github.com/elastic/esql-js/commit/bbf69c0148dfad620d7603e0cc0c030b28da7545) Thanks [@vadimkibana](https://github.com/vadimkibana)! - Extract the parser and the AST visitor out of `@elastic/esql` into the packages that own them.

  `@elastic/esql-parser` now holds the ES|QL parser (`parse`, `Parser`, `ParseOptions`, `ParseResult`, `ESQLErrorListener`), the PromQL parser (`PromQLParser`, `PromQLErrorListener`, `PromQLCstToAstConverter`), the ANTLR token helpers (`getPosition`, `findTokens`, `findFirstToken`, `findVisibleToken`, `findPunctuationToken`, `isLikelyPunctuation`), and the parser constants (`DEFAULT_CHANNEL`, `HIDDEN_CHANNEL`, `HEADER_COMMANDS`, `SOURCE_COMMANDS`). It also declares the runtime dependencies it needs (`antlr4`, `@elastic/esql-ast`, `@elastic/esql-definitions`, `@elastic/esql-promql-grammar`, `@elastic/esql-traversal`, `@elastic/esql-types`); previously it declared none, so its CommonJS build inlined the ANTLR runtime and failed to load under `require`.

  `@elastic/esql-traversal` now holds the AST `Visitor` together with its visitor contexts, and `printAst`.

  `@elastic/esql` re-exports all of the above, so its public API is unchanged.

- [#234](https://github.com/elastic/esql-js/pull/234) [`2e9ed09`](https://github.com/elastic/esql-js/commit/2e9ed09869b154b16fa7f7ad57e4fa165e233d3d) Thanks [@vadimkibana](https://github.com/vadimkibana)! - Add `DENSE_VECTOR` command parsing and traversal support

### Patch Changes

- Updated dependencies [[`2e9ed09`](https://github.com/elastic/esql-js/commit/2e9ed09869b154b16fa7f7ad57e4fa165e233d3d)]:
  - @elastic/esql-types@4.22.0
  - @elastic/esql-ast@4.22.0

## 4.21.1

### Patch Changes

- Updated dependencies []:
  - @elastic/esql-types@4.21.1
  - @elastic/esql-ast@4.21.1

## 4.21.0

### Patch Changes

- Updated dependencies []:
  - @elastic/esql-types@4.21.0
  - @elastic/esql-ast@4.21.0

## 4.20.0

### Patch Changes

- Updated dependencies []:
  - @elastic/esql-types@4.20.0
  - @elastic/esql-ast@4.20.0

## 4.19.2

### Patch Changes

- Updated dependencies []:
  - @elastic/esql-types@4.19.2
  - @elastic/esql-ast@4.19.2

## 4.19.1

### Patch Changes

- Updated dependencies []:
  - @elastic/esql-types@4.19.1
  - @elastic/esql-ast@4.19.1

## 4.19.0

### Minor Changes

- [#211](https://github.com/elastic/esql-js/pull/211) [`d1f87cb`](https://github.com/elastic/esql-js/commit/d1f87cb9b67642665fbc29e57a3e55fd272a89ff) Thanks [@vadimkibana](https://github.com/vadimkibana)! - Setup new `@elastic/esql-traversal` package

- [#211](https://github.com/elastic/esql-js/pull/211) [`d1f87cb`](https://github.com/elastic/esql-js/commit/d1f87cb9b67642665fbc29e57a3e55fd272a89ff) Thanks [@vadimkibana](https://github.com/vadimkibana)! - Move `Walker` to `@elastic/esql-traversal` and `Builder` to `@elastic/esql-ast`

  `Walker` (and `walk`) now live in `@elastic/esql-traversal`, and the ES|QL
  `Builder` — along with the `TIME_DURATION_UNITS`, `DATE_PERIOD_UNITS` and
  `TIME_SPAN_UNITS` constants — now lives in `@elastic/esql-definitions`.

  `@elastic/esql` re-exports all of them, so its public API is unchanged.

### Patch Changes

- Updated dependencies [[`8771d0c`](https://github.com/elastic/esql-js/commit/8771d0c408d6f943f30bb7b9b608130aac78cbf9), [`d1f87cb`](https://github.com/elastic/esql-js/commit/d1f87cb9b67642665fbc29e57a3e55fd272a89ff), [`d1f87cb`](https://github.com/elastic/esql-js/commit/d1f87cb9b67642665fbc29e57a3e55fd272a89ff)]:
  - @elastic/esql-types@4.19.0
  - @elastic/esql-ast@4.19.0
