# `@elastic/prismjs-esql`

ES|QL grammar for [Prism.js](https://prismjs.com/) and [refractor](https://github.com/wooorm/refractor).

## Install

```bash
npm install @elastic/prismjs-esql
```

## Usage

### With refractor

```js
import { register } from 'refractor';
import { esql } from '@elastic/prismjs-esql';

register(esql);

// Highlight a snippet
const result = refractor.highlight('FROM index | WHERE x > 100', 'esql');
```

### With Prism.js

```js
import Prism from 'prismjs';
import { esql } from '@elastic/prismjs-esql';

Prism.languages.esql = esql.languages.esql;

const html = Prism.highlight('FROM index | WHERE x > 100', Prism.languages.esql, 'esql');
```

## Licence

MIT
