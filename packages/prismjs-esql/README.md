# Prism.js and `refractor` ES|QL grammar

This package contains the ES|QL grammar for Prism.js and `refractor`.

Usage:

```js
import {register} from 'refractor';
import {esql} from '@elastic/prismjs-esql';

register(esql)
```


## Releasing

Run test and build steps:

```
yarn test
yarn format
yarn lint
yarn build
```

Publish with `release-it` tool:

```
npx release-it
```


## License

MIT
