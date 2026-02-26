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

## Merging Pull Requests

When merging a pull request, prefer **squash and merge**. This collapses all commits into a single commit on `main`, keeping the history clean.

Before completing the merge, verify that the squash commit message follows the [conventional commit format](#commit-message-convention) — this is critical because `semantic-release` reads the commit messages on `main` to determine version bumps and generate changelogs. A malformed merge commit will not trigger a release or may produce an incorrect one.


## Code Owners

This repository is maintained by the **@elastic/kibana-esql** team. All pull requests require review from the team.

## License

By contributing, you agree that your contributions will be licensed under the [Elastic License 2.0](./LICENSE.txt).
