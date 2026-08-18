# `@elastic/highlightjs-esql`

[Highlight.js](https://highlightjs.org/) language syntax definitions for
[ES|QL](https://www.elastic.co/docs/explore-analyze/query-filter/languages/esql)
(Elasticsearch Query Language).

## Usage

ESM:

```javascript
import hljs from 'highlight.js/lib/core';
import esql from '@elastic/highlightjs-esql';

hljs.registerLanguage('esql', esql);
```

CommonJS:

```javascript
const hljs = require('highlight.js/lib/core');
const { esql } = require('@elastic/highlightjs-esql');

hljs.registerLanguage('esql', esql);
```

Then highlight:

```javascript
const { value } = hljs.highlight('FROM index | LIMIT 10', { language: 'esql' });
```

## License

MIT
