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

### CDN

Load after the highlight.js script; the language self-registers on the global
`hljs`:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.12.0/highlight.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@elastic/highlightjs-esql/lib/esql.min.js"></script>
```

Or as an ES module:

```html
<script type="module">
  import hljs from 'https://cdn.jsdelivr.net/npm/highlight.js/es/core.min.js';
  import esql from 'https://cdn.jsdelivr.net/npm/@elastic/highlightjs-esql/lib/esql.es.min.js';

  hljs.registerLanguage('esql', esql);
</script>
```

## License

MIT
