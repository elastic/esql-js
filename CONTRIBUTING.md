# Contributing to ES|QL JS

Thank you for your interest in contributing to `@elastic/esql`! This document provides guidelines and instructions for contributing to this project.

## Prerequisites

- **Node.js** — see [`.nvmrc`](./.nvmrc) for the required version. We recommend using [nvm](https://github.com/nvm-sh/nvm) to manage Node versions:
  ```bash
  nvm use
  ```
- **Yarn** — this project uses Yarn as its package manager (see `packageManager` in `package.json`).

## Getting Started

1. Fork the repository and clone your fork (external contributors only):
   ```bash
   git clone https://github.com/<your-username>/esql-js.git
   cd esql-js
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Verify everything works:
   ```bash
   yarn build
   yarn test
   yarn lint
   yarn format:check
   ```

## Development Workflow

### Building

```bash
yarn build
```

This runs `tsup` (bundling) followed by `tsc` (type checking / declaration emit).

To automatically rebuild on every file save, run:

```bash
yarn build:watch
```

This starts `tsup` in watch mode and re-runs `tsc` after each successful rebuild, so both the JS bundle and `.d.ts` declaration files stay up to date. This is especially useful when working with a linked package (`yarn link`), as the host project will pick up changes immediately.

### Testing

```bash
yarn test
```

Tests are run using [Jest](https://jestjs.io/). Please add or update tests when making changes to ensure adequate coverage.

### Linting and Formatting

This project uses [ESLint](https://eslint.org/) for linting and [Prettier](https://prettier.io/) for code formatting.

```bash
yarn lint          # Check for lint errors
yarn lint:fix      # Auto-fix lint errors
yarn format:check  # Check formatting
yarn format        # Auto-format all files
```

A [Husky](https://typicode.github.io/husky/) pre-commit hook runs `lint-staged` automatically, which applies ESLint and Prettier to staged `.ts` files and Prettier to staged `.json`/`.yml`/`.yaml` files. You don't need to run these manually before committing — the hook handles it.

### ANTLR Grammar

The parser is generated from ANTLR4 grammar files. These grammar files are synced once a week from the ElasticSearch repository.

## Commit Message Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/) following the **Angular** preset. Releases are automated via [semantic-release](https://github.com/semantic-release/semantic-release), so commit messages directly determine version bumps.

### Format

```
<type>(<optional scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

| Type       | Description                          | Version Bump |
|------------|--------------------------------------|--------------|
| `feat`     | A new feature                        | Minor        |
| `fix`      | A bug fix                            | Patch        |
| `refactor` | Code change (no new feature or fix)  | Patch        |
| `perf`     | Performance improvement              | Patch        |
| `build`    | Build system or dependency changes   | Patch        |
| `chore`    | Maintenance tasks                    | Patch        |
| `revert`   | Reverts a previous commit            | Patch        |
| `docs`     | Documentation only                   | No release   |

### Breaking Changes

To trigger a **major** version bump, include `BREAKING CHANGE` or `BREAKING CHANGES` in the commit footer:

```
feat: redesign AST node structure

BREAKING CHANGE: The `ESQLCommand` node shape has changed.
```

### Examples

```
feat(parser): add support for INLINESTATS command
fix(walker): handle nested function expressions correctly
docs: update pretty_print README with new options
refactor(composer): simplify template tag internals
```

## Submitting Changes

1. Create a feature branch from `main`:
   ```bash
   git checkout -b my-feature
   ```

2. Make your changes, adding tests as appropriate.

3. Ensure all checks pass:
   ```bash
   yarn lint
   yarn format:check
   yarn build
   yarn test
   ```

4. Commit your changes using a [conventional commit message](#commit-message-convention).

5. Push your branch and open a pull request against `main`.

## Project Structure

| Path | Description |
|------|-------------|
| `src/parser/` | [ANTLR-based ES\|QL parser](./src/parser/README.md) |
| `src/composer/` | [High-level query builder (template tag)](./src/composer/README.md) |
| `src/composer/synth/` | [Node synthesis API](./src/composer/synth/README.md) |
| `src/ast/builder/` | [Low-level AST node builder](./src/ast/builder/README.md) |
| `src/ast/walker/` | [AST walker (callback-based traversal)](./src/ast/walker/README.md) |
| `src/ast/visitor/` | [AST visitor (advanced traversal)](./src/ast/visitor/README.md) |
| `src/ast/mutate/` | [AST mutation utilities](./src/ast/mutate/README.md) |
| `src/pretty_print/` | [AST-to-text formatting](./src/pretty_print/README.md) |

## Code Owners

This repository is maintained by the **@elastic/kibana-esql** team. All pull requests require review from the team.

## License

By contributing, you agree that your contributions will be licensed under the [Elastic License 2.0](./LICENSE.txt).
