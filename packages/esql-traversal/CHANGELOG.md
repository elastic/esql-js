# @elastic/esql-traversal

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
