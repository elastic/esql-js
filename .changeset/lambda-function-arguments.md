---
"@elastic/esql": minor
"@elastic/esql-types": minor
"@elastic/esql-parser": minor
"@elastic/esql-ast": minor
"@elastic/esql-traversal": minor
---

Add a `lambda` AST node (`ESQLLambda`) for lambda function arguments such as `MV_FILTER(arr, v -> v > 1)`. Adds `Builder.expression.lambda`, `is.isLambda` and `Walker`, and `visitLambda` in `Visitor`.
