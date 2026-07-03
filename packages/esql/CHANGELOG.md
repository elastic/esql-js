# @elastic/esql

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
