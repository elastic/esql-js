/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// DO NOT MODIFY THIS FILE BY HAND. IT IS GENERATED FROM `elasticsearch/` BY
// `yarn workspace @elastic/esql-definitions generate`.

import type { SettingDefinition } from '../definition_types';

export const settingDefinitions: SettingDefinition[] = [
  {
    name: 'approximation',
    type: [
      'boolean',
      'map_param',
    ],
    description: 'Enables [query approximation](https://www.elastic.co/docs/reference/query-languages/esql/esql-query-approximation) if possible for the query. A boolean value `false` (default) disables query approximation and `true` enables it with default settings. Map values enable query approximation with custom settings.',
    serverlessOnly: false,
    preview: false,
    snapshotOnly: false,
    mapParams: '{name=\'rows\', values=[], description=\'Number of sampled rows used for approximating the query. Must be at least 10,000. Null uses the system default.\', type=[integer]}, {name=\'confidence_level\', values=[], description=\'Confidence level of the computed confidence intervals. Default is 0.90. Null disables computing confidence intervals.\', type=[double]}',
  },
  {
    name: 'column_metadata',
    type: [
      'boolean',
    ],
    description: 'When enabled, column metadata is added to the `_query` response as additional `_meta` properties. Defaults to `false`. Currently, only `_meta.bucket` is added for columns corresponding to the `BUCKET` function and contains bucket interval and unit for queries where it can be determined.',
    serverlessOnly: false,
    preview: true,
    snapshotOnly: false,
  },
  {
    name: 'project_routing',
    type: [
      'keyword',
    ],
    description: 'Limits the scope of a [cross-project search (CPS)](https://www.elastic.co/docs/reference/query-languages/esql/esql-cross-serverless-projects) to specific projects before query execution, based on a [Lucene query expression](docs-content://explore-analyze/cross-project-search/cross-project-search-project-routing.md) evaluated against project tags. Excluded projects are not queried, which can reduce cost and latency. ',
    serverlessOnly: true,
    preview: true,
    snapshotOnly: false,
  },
  {
    name: 'time_zone',
    type: [
      'keyword',
    ],
    description: 'The default timezone to be used in the query. Defaults to UTC, and overrides the `time_zone` request parameter. See [timezones](https://www.elastic.co/docs/reference/query-languages/esql/esql-rest#esql-timezones).',
    serverlessOnly: false,
    preview: false,
    snapshotOnly: false,
  },
  {
    name: 'unmapped_fields',
    type: [
      'keyword',
    ],
    description: 'Determines how unmapped fields are treated.\nFor a conceptual overview and use cases, refer to [Unmapped fields](https://www.elastic.co/docs/reference/query-languages/esql/esql-unmapped-fields).\n\nPossible values are:\n\n- `DEFAULT` : Standard ESQL queries fail when referencing unmapped fields.\n- `NULLIFY` : Treats unmapped fields as null values.\n- `LOAD` : Loads unmapped fields from the stored [`_source`](https://www.elastic.co/docs/reference/elasticsearch/mapping-reference/mapping-source-field)\nwith type `keyword`. Or nullifies them if absent from `_source`. {applies_to}`stack: preview 9.4`\n\n[`PROMQL`](https://www.elastic.co/docs/reference/query-languages/esql/commands/promql) queries have their own specific semantics for unmapped fields.\n\nSpecial notes about the `LOAD` option:\n- `FORK`, `LOOKUP JOIN`, subqueries, and views are not yet supported anywhere in the query.\n- Referencing subfields of `flattened` parents is not supported.\n- [Full-text search functions](https://www.elastic.co/docs/reference/query-languages/esql/functions-operators/search-functions) are supported.\n  {applies_to}`stack: preview 9.5`\n  - Full-text search functions are not supported anywhere in the query. {applies_to}`stack: preview =9.4`\n- [`KNN`](https://www.elastic.co/docs/reference/query-languages/esql/functions-operators/dense-vector-functions/knn) on partially unmapped\n  `dense_vector` fields is not yet supported.\n- Partially unmapped non-`keyword` fields can be used in expressions. If the field is mapped to a single type and there\'s an\n  available conversion from `keyword` to that type, the implicit conversion is applied. If there\'s no available conversion,\n  and an explicit one has not been provided by the user, values remain typed where mapped and are `null` for rows from\n  indices where the field is unmapped. {applies_to}`stack: preview 9.5`\n  - Partially unmapped non-`keyword` fields must be referenced inside a cast or conversion function (e.g. `::TYPE` or `TO_TYPE`),\n    unless referenced in `KEEP` or `DROP`. {applies_to}`stack: preview =9.4`\n',
    serverlessOnly: false,
    preview: true,
    snapshotOnly: false,
  },
];
