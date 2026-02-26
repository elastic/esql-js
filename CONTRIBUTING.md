# Contributing to ES|QL JS

Thank you for your interest in contributing to `@elastic/esql`! This document provides guidelines and instructions for contributing to this project.

## Prerequisites

- **Node.js** — see [`.nvmrc`](./.nvmrc) for the required version. We recommend using [nvm](https://github.com/nvm-sh/nvm) to manage Node versions:
  ```bash
  nvm use
  ```
- **Yarn** — this project uses Yarn as its package manager (see `packageManager` in `package.json`).

## Getting Started

1. Fork the repository and clone your fork:
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

### Commit Types

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

When merging a pull request, select **squash and merge**. This collapses all commits into a single commit on `main`, keeping the history clean.

Before completing the merge, verify that the squash commit message follows the [conventional commit format](#commit-message-convention) — this is critical because `semantic-release` reads the commit messages on `main` to determine version bumps and generate changelogs. A malformed merge commit will not trigger a release or may produce an incorrect one.


## Releasing (Maintainers only)

Releases are fully automated via [semantic-release](https://github.com/semantic-release/semantic-release). There is no need to manually bump versions, tag commits, or publish to npm — the tooling handles all of it based on the commit history.

### How it works

1. `semantic-release` analyzes all commits on the target branch since the last release.
2. It determines the next version based on the [commit message types](#commit-message-convention).
3. It generates a changelog, creates a GitHub release, and publishes to npm with provenance.

### Triggering a release

The release is triggered manually via the **Release** GitHub Actions workflow (`workflow_dispatch`):

1. Go to **Actions** > **Release** in the GitHub repository.
2. Click **Run workflow**.
3. Select the branch to release from (defaults to `main`).
4. The workflow will lint, format-check, build, and test the code before releasing.

### Dry run

To preview what the next release would look like without actually publishing:

```bash
yarn semantic-release:dry-run
```

This runs `semantic-release --dry-run` locally and logs the version that would be released and the changelog that would be generated.

## Backporting

In rare cases you may need to patch an older release line where upgrading to the latest `main` version is not feasible. This project supports backporting via the [backport](https://github.com/sorenlouv/backport) tool and automated GitHub Actions.

### Creating a maintenance branch

To backport to an older release line, first create a maintenance branch from the latest tag in that line. For example, if `main` is on `2.x.x` and you need to patch `1.x`:

```bash
# Find the latest 1.x tag
git tag --list 'v1.*' --sort=-v:refname | head -1

# Create the maintenance branch from that tag
git checkout -b 1.x v1.4.2
git push upstream 1.x
```

The branch name **must** follow the `semantic-release` [maintenance branch convention](https://semantic-release.gitbook.io/semantic-release/usage/workflow-configuration#maintenance-branches) (e.g., `1.x`, `1.2.x`, or `1.x.x`). This is already configured in `.releaserc.js`.

### Automated backporting (recommended)

The easiest way to backport is via PR labels:

1. Add a label `backport:<branch>` to your PR **before or after merging** (e.g., `backport:1.x`). **Remember to create the branch first**.
2. When the PR is merged, the **Backport** GitHub Action automatically creates a backport PR targeting the specified branch.
3. If there are merge conflicts, the action will comment on the original PR with instructions for resolving them manually.

You can target multiple branches by adding multiple labels (e.g., `backport:1.x` and `backport:2.x`).

### Manual backporting

If you prefer to backport manually or need to resolve conflicts:
#### Setting up the backport CLI (one-time)

Install the backport CLI globally:

```bash
npm install -g backport
```

Create a global config at `~/.backport/config.json` with a [GitHub personal access token](https://github.com/settings/tokens) (needs `repo` scope):

```json
{
  "accessToken": "<your-github-token>"
}
```



```bash
# Select a PR to backport interactively
npx backport --branch 1.x

# Or specify the PR number directly
npx backport --branch 1.x --pr 42
```

The first time you run this, it will create a local fork at `~/.backport/repositories/elastic/esql-js`. Resolve any merge conflicts in this fork, **not** your main working copy.

### Releasing from a maintenance branch

Once the backport PR is merged into the maintenance branch, trigger a release by running the **Release** workflow from the GitHub Actions tab, selecting the maintenance branch (e.g., `1.x`) instead of `main`.

## Code Owners

This repository is maintained by the **@elastic/kibana-esql** team. All pull requests require review from the team.

## License

By contributing, you agree that your contributions will be licensed under the [Elastic License 2.0](./LICENSE.txt).
