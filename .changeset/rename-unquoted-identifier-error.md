---
'@elastic/esql': patch
---

Parser errors caused by invalid characters in unquoted identifiers now produce a dedicated `invalidUnquotedIdentifier` error code instead of the generic `syntaxError`. The error span covers the full identifier rather than just the offending character, making it easier for consumers to extract and rewrite the identifier.
