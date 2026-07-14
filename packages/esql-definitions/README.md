# `@elastic/esql-definitions`

Shared definitions for the ES|QL and PromQL languages — commands, functions,
operators, settings, and their metadata.

## Install

```bash
npm install @elastic/esql-definitions
```

## Usage

The main entry holds the hand-maintained name lists and the definition
TypeScript types:

```ts
import { commandsNames, functionNames } from '@elastic/esql-definitions';
import type { FunctionDefinition } from '@elastic/esql-definitions';
```

The full definition metadata (synced from the `elasticsearch` repo) is exposed
via subpath exports:

```ts
import { commandDefinitions } from '@elastic/esql-definitions/commands';
import { functionDefinitions } from '@elastic/esql-definitions/functions';
import { operatorDefinitions } from '@elastic/esql-definitions/operators';
import { settingDefinitions } from '@elastic/esql-definitions/settings';
import { inlineCasts } from '@elastic/esql-definitions/inline-cast';
import { promqlFunctionDefinitions } from '@elastic/esql-definitions/promql-functions';
import { promqlOperatorDefinitions } from '@elastic/esql-definitions/promql-operators';
```

Documentation (descriptions, examples, notes, parameter docs) is split
into parallel docs modules keyed by definition name:

```ts
import { functionDocs } from '@elastic/esql-definitions/function-docs';
import { operatorDocs } from '@elastic/esql-definitions/operator-docs';
import { promqlFunctionDocs } from '@elastic/esql-definitions/promql-function-docs';
import { promqlOperatorDocs } from '@elastic/esql-definitions/promql-operator-docs';

functionDocs.bucket.description;
functionDocs.bucket.params?.field; // ES|QL param docs live here, not in signatures
```

One asymmetry to know about: ES|QL parameter descriptions are identical across
all signatures of a definition, so they live in `docs.params` keyed by
parameter name. PromQL parameter descriptions vary per signature (e.g. `lhs`
is "Instant vector." in one overload and "Scalar." in another).

## How the definitions are synced

- `elasticsearch/` — the machine-readable language definitions that
  Elasticsearch publishes for Kibana, copied verbatim from
  `docs/reference/query-languages/{esql,promql}/kibana/generated/` in the
  `elasticsearch` repo by the grammar sync CI job
  (`.buildkite/scripts/esql_grammar_sync.sh`).
- `src/generated/` — TypeScript modules generated from `elasticsearch/` by
  `scripts/generate.ts`.
  ```bash
  yarn workspace @elastic/esql-definitions generate
  ```
- `src/definition_types.ts` — hand-written TypeScript shapes of the raw JSON,
  used by the codegen script and exported from the main entry.


Note: the synced `commands/` data does not cover all commands (e.g. `FROM`,
`ROW`, `JOIN` variants are missing upstream), so the hand-maintained
`commandsNames` and `functionNames` lists remain the source of truth for name
lists.
