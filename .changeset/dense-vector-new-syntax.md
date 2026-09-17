---
'@elastic/esql-grammar': minor
'@elastic/esql-types': minor
'@elastic/esql-parser': minor
---

Add `DENSE_VECTOR` output-naming support, following the latest Elasticsearch grammar.

Two new forms now parse, and round-trip through the pretty-printer:

- `DENSE_VECTOR target = field` — an explicit output column name, exposed as `targetField`
- `DENSE_VECTOR suffix = "_dv" ON a, b` — a shared output-name suffix, exposed as `suffix`, with the input fields carried on an `on` option

The grammar also makes the field list optional, which previously caused the CST to AST conversion to throw on queries such as `FROM logs | DENSE_VECTOR` and discard the whole AST. Those queries now convert to an incomplete command.

That same grammar accepts a string literal where a field name is expected, as in `FROM books | DENSE_VECTOR "the quick brown fox"`. Elasticsearch rejects these queries with a `parsing_exception`, so the converter builds no command parts for them: the command is marked `incomplete` with no arguments, fields, target field or named parameters, and any trailing `WITH` clause is dropped.
