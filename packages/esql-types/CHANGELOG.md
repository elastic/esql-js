# @elastic/esql-types

## 4.26.0

### Minor Changes

- [#249](https://github.com/elastic/esql-js/pull/249) [`18334b7`](https://github.com/elastic/esql-js/commit/18334b7338f24afdb8957a094f19cd97c662720e) Thanks [@momovdg](https://github.com/momovdg)! - Add `DENSE_VECTOR` output-naming support, following the latest Elasticsearch grammar.

  Two new forms now parse, and round-trip through the pretty-printer:

  - `DENSE_VECTOR target = field` — an explicit output column name, exposed as `targetField`
  - `DENSE_VECTOR suffix = "_dv" ON a, b` — a shared output-name suffix, exposed as `suffix`, with the input fields carried on an `on` option

  The grammar also makes the field list optional, which previously caused the CST to AST conversion to throw on queries such as `FROM logs | DENSE_VECTOR` and discard the whole AST. Those queries now convert to an incomplete command.

  That same grammar accepts a string literal where a field name is expected, as in `FROM books | DENSE_VECTOR "the quick brown fox"`. Elasticsearch rejects these queries with a `parsing_exception`, so the converter builds no command parts for them: the command is marked `incomplete` with no arguments, fields, target field or named parameters, and any trailing `WITH` clause is dropped.

## 4.25.0

## 4.24.0

## 4.23.0

## 4.22.0

### Minor Changes

- [#234](https://github.com/elastic/esql-js/pull/234) [`2e9ed09`](https://github.com/elastic/esql-js/commit/2e9ed09869b154b16fa7f7ad57e4fa165e233d3d) Thanks [@vadimkibana](https://github.com/vadimkibana)! - Add `DENSE_VECTOR` command parsing and traversal support

## 4.21.1

## 4.21.0

## 4.20.0

## 4.19.2

## 4.19.1

## 4.19.0

### Patch Changes

- [#216](https://github.com/elastic/esql-js/pull/216) [`8771d0c`](https://github.com/elastic/esql-js/commit/8771d0c408d6f943f30bb7b9b608130aac78cbf9) Thanks [@momovdg](https://github.com/momovdg)! - Add prefix support to HIGHLIGHT command AST: parse the optional `prefix = "..."` clause into `ESQLAstHighlightCommand.prefix` and expose the binary-expression assignment in `args`.

## 4.18.0

### Patch Changes

- [#207](https://github.com/elastic/esql-js/pull/207) [`bc85162`](https://github.com/elastic/esql-js/commit/bc851624a0849eceda113b3bfb1739cd3c279855) Thanks [@vadimkibana](https://github.com/vadimkibana)! - Update package READMEs

## 4.17.0

## 4.16.0

### Minor Changes

- [#200](https://github.com/elastic/esql-js/pull/200) [`5170acf`](https://github.com/elastic/esql-js/commit/5170acfa2bd2e06b639a44f15e9d18a11b078808) Thanks [@elastic-vault-github-plugin-prod](https://github.com/apps/elastic-vault-github-plugin-prod)! - the PromQL labelList rule now yields labelListItem nodes instead of labelName ones

## 4.15.0

## 4.14.0

## 4.13.0

## 4.12.0

## 4.11.0

## 4.10.0

### Minor Changes

- [#177](https://github.com/elastic/esql-js/pull/177) [`a614713`](https://github.com/elastic/esql-js/commit/a61471351e4ef6d26810a22dd8023d3c0b940483) Thanks [@vadimkibana](https://github.com/vadimkibana)! - Create standalone `@elastic/esql-types`, `@elastic/esql-grammar`, and `@elastic/esql-promql-grammar` packages
