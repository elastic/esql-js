# @elastic/elasticsearch-esql-dsl

> **Technical Preview:** This package is in technical preview and may be changed or removed in a future release.

A fluent, type-safe ES|QL query builder for JavaScript and TypeScript. Build ES|QL queries using method chaining and render them to query strings for use with the Elasticsearch client.

## Installation

```bash
npm install @elastic/elasticsearch-esql-dsl
```

## Quick start

```typescript
import { ESQL, E, f } from '@elastic/elasticsearch-esql-dsl'

const query = ESQL.from('employees')
  .sort(E('emp_no'))
  .keep('first_name', 'last_name', 'height')
  .eval({
    height_feet: E('height').mul(3.281),
    height_cm: E('height').mul(100),
  })
  .limit(3)

console.log(query.render())
```

This prints the following ES|QL query:

```
FROM employees
| SORT emp_no
| KEEP first_name, last_name, height
| EVAL height_feet = height * 3.281, height_cm = height * 100
| LIMIT 3
```

## Executing queries

To execute a query, pass it to the `client.esql.query()` endpoint:

```typescript
import { Client } from '@elastic/elasticsearch'
import { ESQL, E } from '@elastic/elasticsearch-esql-dsl'

const client = new Client({ node: 'http://localhost:9200' })

const query = ESQL.from('employees')
  .where(E('still_hired').eq(true))
  .limit(10)

const response = await client.esql.query({ query: query.render() })
```

The response body contains a `columns` array with column metadata and a `values` array with the rows. You can also use the built-in helper for typed records:

```typescript
const { records } = await client.helpers
  .esql({ query: query.render() })
  .toRecords<{ first_name: string; last_name: string; height: number }>()
```

## Creating an ES|QL query

Every ES|QL query starts with a source command.

### `ESQL.from()`

The `FROM` command selects the indices, data streams, or aliases to query.

```typescript
import { ESQL } from '@elastic/elasticsearch-esql-dsl'

// FROM employees
const q1 = ESQL.from('employees')

// FROM employees-00001, other-employees-*
const q2 = ESQL.from('employees-00001', 'other-employees-*')

// FROM employees METADATA _id
const q3 = ESQL.from('employees').metadata('_id')

// FROM employees METADATA _id, _score
const q4 = ESQL.from('employees').metadata('_id', '_score')
```

### `ESQL.row()`

The `ROW` command produces a row with one or more columns.

```typescript
import { ESQL, f } from '@elastic/elasticsearch-esql-dsl'

// ROW a = 1, b = "two", c = null
const q1 = ESQL.row({ a: 1, b: 'two', c: null })

// ROW a = ROUND(1.23, 0)
const q2 = ESQL.row({ a: f.round(1.23, 0) })
```

### `ESQL.show()`

```typescript
// SHOW INFO
const q = ESQL.show('INFO')
```

### `ESQL.ts()`

The `TS` command is for time-series indices.

```typescript
// TS metrics METADATA _id
const q = ESQL.ts('metrics').metadata('_id')
```

## Adding processing commands

Once you have a query object, chain processing commands to filter and transform results.

```typescript
import { ESQL, E } from '@elastic/elasticsearch-esql-dsl'

// FROM employees
// | WHERE still_hired == true
// | LIMIT 10
const query = ESQL.from('employees')
  .where(E('still_hired').eq(true))
  .limit(10)
```

All queries are **immutable** — each method returns a new query object, so you can safely branch:

```typescript
const base = ESQL.from('employees').where(E('still_hired').eq(true))
const byName = base.sort(E('last_name')).limit(10)
const bySalary = base.sort(E('salary').desc()).limit(5)
```

### Available processing commands

| Method | ES\|QL Command | Example |
|--------|----------------|---------|
| `.where()` | `WHERE` | `.where(E('age').gt(30))` |
| `.eval()` | `EVAL` | `.eval({ bmi: E('weight').div(E('height').mul(E('height'))) })` |
| `.stats().by()` | `STATS ... BY` | `.stats({ avg_salary: f.avg('salary') }).by('dept')` |
| `.sort()` | `SORT` | `.sort(E('salary').desc())` |
| `.limit()` | `LIMIT` | `.limit(100)` |
| `.keep()` | `KEEP` | `.keep('name', 'salary')` |
| `.drop()` | `DROP` | `.drop('temp_*')` |
| `.rename()` | `RENAME` | `.rename({ old_name: 'new_name' })` |
| `.mvExpand()` | `MV_EXPAND` | `.mvExpand('tags')` |
| `.enrich()` | `ENRICH` | `.enrich('policy').on('ip').with('city')` |
| `.dissect()` | `DISSECT` | `.dissect('message', '%{ts} %{level}')` |
| `.grok()` | `GROK` | `.grok('message', '%{IP:client}')` |
| `.lookupJoin()` | `LOOKUP JOIN` | `.lookupJoin('threats').on('ip')` |
| `.inlineStats()` | `INLINESTATS` | `.inlineStats({ avg: f.avg('val') }).by('cat')` |
| `.changePoint()` | `CHANGE_POINT` | `.changePoint('cpu').on('host').as_('type', 'pval')` |
| `.sample()` | `SAMPLE` | `.sample(0.1)` |
| `.fork()` / `.fuse()` | `FORK` / `FUSE` | See [Hybrid search](#hybrid-search) |
| `.completion()` | `COMPLETION` | `.completion('Summarize').with({ inferenceId: 'llm' })` |
| `.rerank()` | `RERANK` | `.rerank('query').on('title').with({ inferenceId: 'id' })` |

## Creating expressions and conditions

There are two ways to create expressions in queries.

### String expressions

The simplest approach — pass ES|QL syntax as strings:

```typescript
const query = ESQL.from('employees')
  .sort('emp_no')
  .keep('first_name', 'last_name', 'height')
  .eval('height_feet = height * 3.281', 'height_cm = height * 100')
```

### The `E()` expression builder

For type-safe expressions, use the `E()` helper to wrap column names:

```typescript
import { E } from '@elastic/elasticsearch-esql-dsl'

const query = ESQL.from('employees')
  .keep('first_name', 'last_name', 'height')
  .where(E('first_name').eq('Larry'))
```

`E()` supports comparison, arithmetic, string matching, and null-check operators:

```typescript
// Comparison
E('salary').gt(50000)        // salary > 50000
E('name').ne('test')         // name != "test"

// Arithmetic
E('height').mul(100)         // height * 100
E('price').add(E('tax'))     // price + tax

// Null checks
E('email').isNull()          // email IS NULL
E('phone').isNotNull()       // phone IS NOT NULL

// Pattern matching
E('name').like('A*')         // name LIKE "A*"
E('msg').rlike('[0-9]+')     // msg RLIKE "[0-9]+"

// Membership
E('status').in(['active', 'pending'])  // status IN ("active", "pending")

// Sort modifiers
E('salary').desc()                    // salary DESC
E('name').asc().nullsLast()           // name ASC NULLS LAST
```

### POJO syntax for `where()`

For object-literal conditions using `Op` symbols:

```typescript
import { Op } from '@elastic/elasticsearch-esql-dsl'

const query = ESQL.from('employees')
  .where({
    salary: { [Op.gt]: 50000 },
    department: 'Engineering',
    [Op.or]: {
      level: { [Op.in]: ['senior', 'staff'] },
    },
  })
```

### The `esql` template tag

For inline ES|QL with safe value interpolation:

```typescript
import { esql, E } from '@elastic/elasticsearch-esql-dsl'

const minSalary = 50000
const expr = esql`salary > ${minSalary} AND department == ${'Engineering'}`
// → salary > 50000 AND department == "Engineering"
```

Values are automatically escaped. `InstrumentedExpression` objects pass through without escaping.

### Logical operators

Combine expressions with `and_()`, `or_()`, and `not_()`:

```typescript
import { and_, or_, not_, E } from '@elastic/elasticsearch-esql-dsl'

const condition = and_(
  E('salary').gt(50000),
  or_(E('dept').eq('Engineering'), E('dept').eq('Sales')),
  not_(E('status').eq('inactive'))
)
```

## Using ES|QL functions

All ES|QL functions are available under the `f` namespace:

```typescript
import { ESQL, E, f } from '@elastic/elasticsearch-esql-dsl'

// Using functions in WHERE
const query = ESQL.from('employees')
  .keep('first_name', 'last_name', 'height')
  .where(f.length('first_name').lt(4))
```

Function argument handling varies by function. Functions like `length()`, `abs()`, and `avg()` treat string arguments as **field references** (identifiers). Functions like `concat()`, `startsWith()`, and `replace()` treat string arguments as **literal values**. When you need to pass a field reference to a literal-mode function, wrap it with `E()`:

```typescript
// Field reference: LENGTH(first_name)
f.length('first_name')

// Field references in CONCAT need E(): CONCAT(first_name, " ", last_name)
f.concat(E('first_name'), ' ', E('last_name'))
```

### Aggregation functions

```typescript
f.avg('salary')              // AVG(salary)
f.count()                    // COUNT(*)
f.countDistinct('dept')      // COUNT_DISTINCT(dept)
f.max('salary')              // MAX(salary)
f.min('salary')              // MIN(salary)
f.sum('hours')               // SUM(hours)
f.median('salary')           // MEDIAN(salary)
f.percentile('latency', 99)  // PERCENTILE(latency, 99)
f.top('salary', 5, 'DESC')   // TOP(salary, 5, DESC)
f.values('tags')             // VALUES(tags)
f.stdDev('salary')           // STD_DEV(salary)
f.variance('salary')         // VARIANCE(salary)
f.weightedAvg('val', 'wt')   // WEIGHTED_AVG(val, wt)
f.first('ts')                // FIRST(ts)
f.last('ts')                 // LAST(ts)
```

Aggregation functions support conditional aggregation with `.where()`:

```typescript
const query = ESQL.from('employees')
  .stats({
    eng_avg: f.avg('salary').where(E('dept').eq('Engineering')),
    total: f.count(),
  })
```

### Search functions

```typescript
f.match('title', 'search')           // MATCH(title, "search")
f.matchPhrase('title', 'exact')      // MATCH_PHRASE(title, "exact")
f.kql('status: active')              // KQL("status: active")
f.qstr('title:search')              // QSTR("title:search")
f.multiMatch('query', 'f1', 'f2')   // MULTI_MATCH("query", f1, f2)
f.term('status', 'active')          // TERM(status, "active")
f.knn('embedding', 10)              // KNN(embedding, 10)
```

### String, math, date, conditional, multivalue, geo, conversion, IP, vector, hash, URL, grouping, and time series functions

The `f` namespace includes 150+ function wrappers covering every ES|QL function. A few examples:

```typescript
// String
f.concat(E('first_name'), ' ', E('last_name'))  // CONCAT(first_name, " ", last_name)
f.toUpper('name')                                // TO_UPPER(name)
f.substring('msg', 0, 100)                      // SUBSTRING(msg, 0, 100)

// Math
f.round('salary', -3)    // ROUND(salary, -3)
f.abs('change')          // ABS(change)
f.clamp('val', 0, 100)   // CLAMP(val, 0, 100)

// Date
f.now()                            // NOW()
f.dateDiff('day', 'hire_date', f.now())  // DATE_DIFF("day", hire_date, NOW())
f.dateTrunc('date', '1 month')    // DATE_TRUNC(date, "1 month")

// Conditional
f.coalesce('nickname', 'first_name')  // COALESCE(nickname, first_name)
f.case_()
  .when(E('age').lt(18), 'minor')
  .when(E('age').lt(65), 'adult')
  .else_('senior')
// → CASE WHEN age < 18 THEN "minor" WHEN age < 65 THEN "adult" ELSE "senior" END

// Grouping
f.bucket('salary', 10000)   // BUCKET(salary, 10000)
f.categorize('message')     // CATEGORIZE(message)

// Time series
f.rate('bytes')              // RATE(bytes)
f.avgOverTime('cpu')         // AVG_OVER_TIME(cpu)
f.tbucket('@timestamp', '1h')  // TBUCKET(@timestamp, 1h)
```

## Advanced patterns

### Hybrid search with FORK and FUSE

```typescript
const query = ESQL.from('articles')
  .fork(
    ESQL.branch().where(f.match('title', 'elasticsearch')).sort(E('_score').desc()).limit(50),
    ESQL.branch().where(f.knn('embedding', 10)).sort(E('_score').desc()).limit(50),
  )
  .fuse('RRF')
  .limit(10)
```

### Data enrichment

```typescript
const query = ESQL.from('logs')
  .enrich('ip_lookup')
  .on('client.ip')
  .with('geo.city', 'geo.country')
  .keep('message', 'geo.city', 'geo.country')
```

### Log parsing with DISSECT and GROK

```typescript
// Dissect
ESQL.from('logs')
  .dissect('message', '%{timestamp} %{level} %{msg}')
  .keep('timestamp', 'level', 'msg')

// Grok
ESQL.from('logs')
  .grok('message', '%{TIMESTAMP_ISO8601:timestamp} %{LOGLEVEL:level}')
  .keep('timestamp', 'level')
```

### AI/ML commands

```typescript
// LLM completion
ESQL.from('docs')
  .completion('Summarize this document')
  .with({ inferenceId: 'my-llm' })
  .keep('title', 'summary')

// Semantic reranking
ESQL.from('docs')
  .rerank('user query')
  .on('title', 'body')
  .with({ inferenceId: 'my-reranker', topN: 10 })
```

### Time series analysis

```typescript
ESQL.ts('metrics')
  .stats({
    bytes_rate: f.rate('bytes'),
    avg_cpu: f.avgOverTime('cpu'),
  })
  .by('host')
```

### Change point detection

```typescript
ESQL.from('metrics')
  .changePoint('cpu_usage')
  .on('host')
  .as_('change_type', 'change_pvalue')
```

### Serialization

Every query object supports `toString()`, `render()`, and `toJSON()`:

```typescript
const query = ESQL.from('employees').where(E('salary').gt(50000)).limit(10)

query.render()    // "FROM employees\n| WHERE salary > 50000\n| LIMIT 10"
query.toString()  // same as render()
query.toJSON()    // { query: "FROM employees\n| WHERE salary > 50000\n| LIMIT 10" }
```

## Preventing injection attacks

ES|QL supports parameter binding to safely handle untrusted user input. Use `E('?')` as a placeholder and pass values via the `params` option:

```typescript
function findEmployeeByName(name: string) {
  const query = ESQL.from('employees')
    .keep('first_name', 'last_name', 'height')
    .where(E('first_name').eq(E('?')))

  return client.esql.query({
    query: query.render(),
    params: [name],
  })
}
```

## API reference

### Source commands

| Factory | Description |
|---------|-------------|
| `ESQL.from(...indices)` | Select indices to query |
| `ESQL.row(values)` | Produce a row with literal values |
| `ESQL.show(item)` | Show deployment info (`'INFO'`) |
| `ESQL.ts(...indices)` | Query time-series indices |
| `ESQL.branch()` | Create a branch for use with `fork()` |

### Expression builder — `E(field)`

| Method | Result |
|--------|--------|
| `.eq(value)` | `field == value` |
| `.ne(value)` | `field != value` |
| `.gt(value)` | `field > value` |
| `.gte(value)` | `field >= value` |
| `.lt(value)` | `field < value` |
| `.lte(value)` | `field <= value` |
| `.isNull()` | `field IS NULL` |
| `.isNotNull()` | `field IS NOT NULL` |
| `.in(values)` | `field IN (values)` |
| `.between(low, high)` | `field >= low AND field <= high` |
| `.like(pattern)` | `field LIKE pattern` |
| `.rlike(pattern)` | `field RLIKE pattern` |
| `.add(value)` | `field + value` |
| `.sub(value)` | `field - value` |
| `.mul(value)` | `field * value` |
| `.div(value)` | `field / value` |
| `.mod(value)` | `field % value` |
| `.asc()` | `field ASC` |
| `.desc()` | `field DESC` |
| `.nullsFirst()` | `field NULLS FIRST` |
| `.nullsLast()` | `field NULLS LAST` |

### Helpers

| Export | Description |
|--------|-------------|
| `col(name)` | Alias for `E()` for column references |
| `esql\`...\`` | Template tag for safe ES\|QL interpolation |
| `and_(...exprs)` | Combine expressions with AND |
| `or_(...exprs)` | Combine expressions with OR |
| `not_(expr)` | Negate an expression |
| `f.*` | All ES\|QL functions (150+) |
| `Op.*` | Operator symbols for POJO `where()` syntax |
| `formatIdentifier(name)` | Escape an identifier for ES\|QL |

## License

[Apache 2.0](../../LICENSE) © Elasticsearch B.V.
