---
name: add-package
description: >
  Use this skill when adding a new package to the esql-js Yarn Workspaces monorepo — either splitting
  an existing subsystem out of packages/esql/ (unbundling) or creating a brand-new package. Covers every
  config file the package needs (build, tests, storybook), how to wire it into the monorepo (workspace
  dependency, changeset release group, topological build), and the verification steps.
---

# Add a Package

## When to use

- **Unbundling** an existing subsystem out of `packages/esql/` into its own `@elastic/<name>` package (e.g. `@elastic/pretty-printer` was extracted from `packages/esql/src/printer/`).
- Creating a **brand-new** standalone package under `packages/`.

The monorepo is Yarn Workspaces (Yarn v4 / `packageManager: yarn@4.x`) with `workspaces: ["packages/*"]`. Every package is a TypeScript library built with `tsup` (JS bundles) + `tsc` (declarations) and tested with `jest`. Match `packages/esql/` — it is the template.

---

## Step 1 — Move or create the sources

For an **unbundling**, use `git mv` so history is preserved (do not rewrite files from scratch):

```bash
mkdir -p packages/<name>/src
git mv packages/esql/src/<subsystem>/*.ts packages/<name>/src/
git mv packages/esql/src/<subsystem>/__tests__ packages/<name>/src/__tests__
git mv packages/esql/src/<subsystem>/README.md packages/<name>/README.md   # if one exists
rmdir packages/esql/src/<subsystem>                                        # if now empty
```

In-package relative imports (`./foo`, `../bar`, `..` → `src/index.ts`) and the moved `__tests__/` keep working unchanged. Only **cross-package** imports need rewiring (Step 7).

The package entry point is `src/index.ts`. Make sure it re-exports everything consumers and the moved tests need (a moved `__tests__` file that imports from `'..'` resolves to `src/index.ts`).

---

## Step 2 — `packages/<name>/package.json`

```json
{
  "name": "@elastic/<name>",
  "version": "<match the fixed-group version>",
  "author": "Kibana ES|QL team",
  "description": "<one line>",
  "license": "Elastic-2.0",
  "sideEffects": false,
  "main": "./lib/index.js",
  "types": "./lib/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/index.d.ts",
      "import": "./lib/index.mjs",
      "require": "./lib/index.js",
      "default": "./lib/index.js"
    }
  },
  "files": ["NOTICE.txt", "LICENSE.txt", "lib"],
  "publishConfig": { "access": "public", "provenance": true },
  "repository": "https://github.com/elastic/esql-js.git",
  "scripts": {
    "build": "tsup && tsc -p tsconfig.build.json",
    "build:watch": "tsup --watch --onSuccess \"tsc -p tsconfig.build.json\"",
    "test": "jest"
  },
  "dependencies": {},
  "devDependencies": {
    "@types/jest": "30.0.0",
    "jest": "30.4.2",
    "ts-jest": "29.4.11",
    "tsup": "8.5.1",
    "typescript": "6.0.3"
  }
}
```

Notes:
- Best to copy from another package and adapt.
- **Version** must equal the other packages in the changeset `fixed` group (see Step 8). Changesets bumps them in lockstep, so a new member starts at the current shared version (e.g. `4.6.0`), **not** `0.0.0` or `1.0.0`.
- **`dependencies`**: only the package's real runtime deps. Pin exact versions matching the rest of the repo (e.g. `tslib`, `tree-dump`). A dependency on another workspace package uses `"@elastic/other": "workspace:^"` — Yarn/changesets rewrites `workspace:^` to the real version range at publish time.
- **devDependencies**: copy the build/test toolchain versions from `packages/esql/package.json` so the whole repo stays on one toolchain.
- Add a second `exports` subpath + a `typesVersions` block **only** if the package ships more than one entry point (esql does this for `./types`). A single-entry library does not need it.

---

## Step 3 — `packages/<name>/tsconfig.json`

(License header required — see Step 9.)

```jsonc
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./lib",
    "rootDir": "./src",
    "jsx": "react-jsx",
    "types": ["jest", "node"]
  },
  "include": ["src"],
  "exclude": ["node_modules", "lib", "src/stories"]
}
```

`jsx: react-jsx` + excluding `src/stories` keeps `.stories.tsx` files (Step 6) out of the library type-check while still letting them compile under Storybook's Vite build.

## Step 4 — `packages/<name>/tsconfig.build.json`

```jsonc
{
  "extends": "./tsconfig.json",
  "exclude": ["node_modules", "lib", "README.md", "src/stories", "**/*.test.ts", "**/__tests__/**"]
}
```

This is what `tsc -p tsconfig.build.json` uses to emit declarations — tests and stories are excluded from the published `lib/`.

## Step 5 — `tsup.config.ts` and `jest.config.js`

`tsup.config.ts` (license header required):

```ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  outDir: 'lib',
  clean: true,
  sourcemap: true,
  dts: false,            // tsc emits declarations; tsup only emits JS
  splitting: false,
  target: 'es2022',
  outExtension({ format }) {
    return format === 'esm' ? { js: '.mjs' } : {};   // .mjs so Node treats ESM correctly
  },
});
```

`jest.config.js` (license header required) — reuses the repo's shared base config:

```js
import { baseConfig } from '../../jest.config.base.js';

/** @type {import('jest').Config} */
export default { ...baseConfig, roots: ['<rootDir>/src'] };
```

`jest.config.base.js` already handles ESM→CJS for ts-jest, the `.js`→`.ts` moduleNameMapper, and `testMatch: ['**/*.test.ts']` (so `__tests__/` helpers and `.stories.tsx` are never treated as suites).

---

## Step 6 — Storybook (no per-package config)

Storybook lives at the **repo root** (`.storybook/main.ts`) and globs:

```
stories: ['../packages/*/src/**/*.stories.@(js|jsx|mjs|ts|tsx)']
```

So a new package is picked up automatically — **do not add a per-package Storybook config**. To give the package a story:

- Put `*.stories.tsx` (+ any component `.tsx`) under `packages/<name>/src/stories/`.
- React, `@storybook/react-vite`, and `vite` are root devDependencies and are hoisted — the package does not need to add them.
- Pure-library packages with nothing visual to demo can skip stories entirely; the infra still covers them.

Story file shape (mirror `packages/esql/src/stories/*.stories.tsx`):

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { MyDemo } from './MyDemo';

const meta: Meta<typeof MyDemo> = { title: '<Name>/MyDemo', component: MyDemo, argTypes: { /* … */ } };
export default meta;
type Story = StoryObj<typeof MyDemo>;
export const Default: Story = { args: { /* … */ } };
```

---

## Step 7 — Rewire cross-package imports

Find every file outside the new package that imported the moved code by its old relative path and repoint it at the package name:

```bash
# from packages/esql/ — find stale relative imports into the old location
grep -rn "<subsystem>/" packages/esql/src --include="*.ts" | grep -v "packages/<name>"
```

Change `import … from '../../../<subsystem>'` → `import … from '@elastic/<name>'`. If a consumer or a test deep-imported a file that is not in the package's public `index.ts` (e.g. `<subsystem>/dump`), either add that export to `src/index.ts` and import from the package root, or expose a dedicated `exports` subpath. Prefer adding it to the index.

---

## Step 8 — Wire into the monorepo

**A — Declare the dependency** in each consuming package (e.g. `packages/esql/package.json`):

```json
"dependencies": {
  "@elastic/<name>": "workspace:^",
  ...
}
```

Then `yarn install` to create the workspace symlink and update `yarn.lock`.

**B — Add to the changeset release group.** `.changeset/config.json` has a `fixed` array — packages released in lockstep at the same version. Add the new package to the existing group so it versions together with `@elastic/esql`:

```json
"fixed": [["@elastic/esql", "@elastic/<name>"]],
```

(Omit it from `fixed` only if the package is intentionally versioned independently — then it needs its own changelog cadence.)

**C — Keep the root build topological.** With more than one package, `packages/esql` type-checks against the new package's emitted `lib/*.d.ts`, so the dependency must build **first**. The root `build` script must use the topological flag:

```json
"build": "yarn workspaces foreach -At run build",
```

`-A` = all workspaces, `-t` = topological (dependencies before dependents). Without `-t`, a clean checkout can build `@elastic/esql` before its new dependency and fail type-check. (`test` does not need `-t`.)

**D — Update [AGENTS.md](../../AGENTS.md)** (the `.claude/CLAUDE.md` symlink points here) — add a one-line entry under Overview describing the new package and what depends on it.

---

## Step 9 — License header

Every `.ts` / `.tsx` file (sources, configs like `tsconfig.*`/`tsup.config.ts`/`jest.config.js`, stories) **must** start with this exact header, enforced by the `local-rules/require-license-header` ESLint rule:

```
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
```

Moved files already have it. New files (configs, stories) need it added. ESLint can autofix (`yarn lint:fix`). Other rules: no `any` (`@typescript-eslint/no-explicit-any: error`), no `console`. Build output (`**/lib/`) is globally ignored by ESLint.

Also copy `LICENSE.txt` from `packages/esql/`, and write a `NOTICE.txt` adapted to the new package, plus an npm-facing `README.md`.

---

## Step 10 — Verify

Run from the repo root:

```bash
yarn install                       # workspace symlink + lockfile
rm -rf packages/*/lib && yarn build # CLEAN build proves topological order works
yarn test                          # all packages
yarn lint                          # license headers, no-any, etc.
yarn format:check                  # prettier
yarn build-storybook               # confirms any new story compiles (macOS has no `timeout`)
```

Build artifacts (`**/lib/`, `storybook-static/`) are gitignored — confirm with `git status` that only source/config files are staged, and that moved files show as renames (`R`), not delete+add.

---

## Checklist

- [ ] Sources moved with `git mv` (or created) under `packages/<name>/src/`, with `src/index.ts` exporting the public API
- [ ] `package.json` — name, version matching the fixed group, exports map, `files`, `publishConfig`, build/test scripts, real deps, toolchain devDeps
- [ ] `tsconfig.json` + `tsconfig.build.json`
- [ ] `tsup.config.ts` + `jest.config.js`
- [ ] `LICENSE.txt`, `NOTICE.txt`, `README.md`
- [ ] Stories under `src/stories/` (optional; root Storybook picks them up automatically)
- [ ] Cross-package imports repointed to `@elastic/<name>`; deep imports either added to the index or given an `exports` subpath
- [ ] Consumers declare `"@elastic/<name>": "workspace:^"`; `yarn install` run
- [ ] `.changeset/config.json` `fixed` group updated
- [ ] Root `build` script is `foreach -At` (topological)
- [ ] `AGENTS.md` Overview mentions the new package
- [ ] License header on every new `.ts`/`.tsx` file
- [ ] Clean `yarn build`, `yarn test`, `yarn lint`, `yarn format:check`, `yarn build-storybook` all pass

---

## Reference example — `@elastic/pretty-printer`

Extracted from `packages/esql/src/printer/`
