---
'@elastic/esql': patch
---

Fix broken type re-export of `DATE_PERIOD_UNITS`, `TIME_DURATION_UNITS`, and `TIME_SPAN_UNITS`: add `@elastic/esql-definitions` as an explicit dependency so the `./time` subpath resolves to the correct version in consumers that have an older version hoisted.
