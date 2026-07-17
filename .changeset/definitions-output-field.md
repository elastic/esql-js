---
"@elastic/esql-definitions": minor
---

Add `output` field to `CommandDefinition` for commands that produce a fixed set of output columns (`IP_LOCATION`, `URI_PARTS`, `REGISTERED_DOMAIN`, `USER_AGENT`). The field carries variant-based column metadata synced from Elasticsearch and is passed through verbatim by the generator.
