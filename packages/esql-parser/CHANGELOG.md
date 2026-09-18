# @elastic/esql-parser

## 4.26.0

### Minor Changes

- [#249](https://github.com/elastic/esql-js/pull/249) [`18334b7`](https://github.com/elastic/esql-js/commit/18334b7338f24afdb8957a094f19cd97c662720e) Thanks [@momovdg](https://github.com/momovdg)! - Add `DENSE_VECTOR` output-naming support, following the latest Elasticsearch grammar.

  Two new forms now parse, and round-trip through the pretty-printer:

  - `DENSE_VECTOR target = field` — an explicit output column name, exposed as `targetField`
  - `DENSE_VECTOR suffix = "_dv" ON a, b` — a shared output-name suffix, exposed as `suffix`, with the input fields carried on an `on` option

  The grammar also makes the field list optional, which previously caused the CST to AST conversion to throw on queries such as `FROM logs | DENSE_VECTOR` and discard the whole AST. Those queries now convert to an incomplete command.

  That same grammar accepts a string literal where a field name is expected, as in `FROM books | DENSE_VECTOR "the quick brown fox"`. Elasticsearch rejects these queries with a `parsing_exception`, so the converter builds no command parts for them: the command is marked `incomplete` with no arguments, fields, target field or named parameters, and any trailing `WITH` clause is dropped.

### Patch Changes

- Updated dependencies [[`0df48e7`](https://github.com/elastic/esql-js/commit/0df48e7d0ae86ea75d0f7193cdfd91e82eb87092), [`18334b7`](https://github.com/elastic/esql-js/commit/18334b7338f24afdb8957a094f19cd97c662720e)]:
  - @elastic/esql-definitions@4.26.0
  - @elastic/esql-types@4.26.0
  - @elastic/esql-promql-grammar@4.26.0
  - @elastic/esql-traversal@4.26.0
  - @elastic/esql-ast@4.26.0

## 4.25.0

### Patch Changes

- Updated dependencies []:
  - @elastic/esql-types@4.25.0
  - @elastic/esql-definitions@4.25.0
  - @elastic/esql-promql-grammar@4.25.0
  - @elastic/esql-traversal@4.25.0
  - @elastic/esql-ast@4.25.0

## 4.24.0

### Patch Changes

- Updated dependencies [[`9337d20`](https://github.com/elastic/esql-js/commit/9337d2003f730ca5569047403fc413ddd84b38cc)]:
  - @elastic/esql-definitions@4.24.0
  - @elastic/esql-types@4.24.0
  - @elastic/esql-promql-grammar@4.24.0
  - @elastic/esql-traversal@4.24.0
  - @elastic/esql-ast@4.24.0

## 4.23.0

### Patch Changes

- Updated dependencies [[`a5f1919`](https://github.com/elastic/esql-js/commit/a5f1919a849a7cac52f1b12a777a9b5e276b6f35)]:
  - @elastic/esql-definitions@4.23.0
  - @elastic/esql-types@4.23.0
  - @elastic/esql-promql-grammar@4.23.0
  - @elastic/esql-traversal@4.23.0
  - @elastic/esql-ast@4.23.0

## 4.22.0

### Minor Changes

- [#232](https://github.com/elastic/esql-js/pull/232) [`bbf69c0`](https://github.com/elastic/esql-js/commit/bbf69c0148dfad620d7603e0cc0c030b28da7545) Thanks [@vadimkibana](https://github.com/vadimkibana)! - Extract the parser and the AST visitor out of `@elastic/esql` into the packages that own them.

  `@elastic/esql-parser` now holds the ES|QL parser (`parse`, `Parser`, `ParseOptions`, `ParseResult`, `ESQLErrorListener`), the PromQL parser (`PromQLParser`, `PromQLErrorListener`, `PromQLCstToAstConverter`), the ANTLR token helpers (`getPosition`, `findTokens`, `findFirstToken`, `findVisibleToken`, `findPunctuationToken`, `isLikelyPunctuation`), and the parser constants (`DEFAULT_CHANNEL`, `HIDDEN_CHANNEL`, `HEADER_COMMANDS`, `SOURCE_COMMANDS`). It also declares the runtime dependencies it needs (`antlr4`, `@elastic/esql-ast`, `@elastic/esql-definitions`, `@elastic/esql-promql-grammar`, `@elastic/esql-traversal`, `@elastic/esql-types`); previously it declared none, so its CommonJS build inlined the ANTLR runtime and failed to load under `require`.

  `@elastic/esql-traversal` now holds the AST `Visitor` together with its visitor contexts, and `printAst`.

  `@elastic/esql` re-exports all of the above, so its public API is unchanged.

- [#234](https://github.com/elastic/esql-js/pull/234) [`2e9ed09`](https://github.com/elastic/esql-js/commit/2e9ed09869b154b16fa7f7ad57e4fa165e233d3d) Thanks [@vadimkibana](https://github.com/vadimkibana)! - Add `DENSE_VECTOR` command parsing and traversal support

### Patch Changes

- Updated dependencies [[`bbf69c0`](https://github.com/elastic/esql-js/commit/bbf69c0148dfad620d7603e0cc0c030b28da7545), [`2e9ed09`](https://github.com/elastic/esql-js/commit/2e9ed09869b154b16fa7f7ad57e4fa165e233d3d)]:
  - @elastic/esql-traversal@4.22.0
  - @elastic/esql-types@4.22.0
  - @elastic/esql-definitions@4.22.0
  - @elastic/esql-promql-grammar@4.22.0
  - @elastic/esql-ast@4.22.0

## 4.21.1

## 4.21.0

## 4.20.0

## 4.19.2

## 4.19.1

## 4.19.0

### Minor Changes

- [#211](https://github.com/elastic/esql-js/pull/211) [`d1f87cb`](https://github.com/elastic/esql-js/commit/d1f87cb9b67642665fbc29e57a3e55fd272a89ff) Thanks [@vadimkibana](https://github.com/vadimkibana)! - Setup new `@elastic/esql-parser` package
