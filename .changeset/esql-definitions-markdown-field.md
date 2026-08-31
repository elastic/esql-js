---
"@elastic/esql-definitions": minor
---

Add `markdown` field to `DefinitionDocs` for ES|QL functions and operators. The field contains the full markdown documentation sourced from the corresponding `.md` file in `elasticsearch/esql/<project>/docs/`, with the leading generator comment line stripped. This allows consumers to display rich documentation without needing direct access to the Elasticsearch source repository.
