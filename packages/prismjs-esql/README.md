# Prism.js and `refractor` ES|QL grammar

This package contains the ES|QL grammar for Prism.js and `refractor`.

Usage:

```js
import {register} from 'refractor';
import {esql} from '@elastic/prismjs-esql';

register(esql)
```

## Development

This package is part of the [esql-js](https://github.com/elastic/esql-js)
monorepo. From the repo root:

```
yarn test
yarn lint
yarn format:check
yarn build
```

Releases are managed with changesets and published in lockstep with the other
`esql-js` packages.

## License

MIT

