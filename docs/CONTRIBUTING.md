# Contributing to ES|QL JS

Thank you for your interest in contributing to `@elastic/esql`! This document provides guidelines and instructions for contributing to this project.

## Prerequisites

- **Node.js** — see [`.nvmrc`](./.nvmrc) for the required version. We recommend using [nvm](https://github.com/nvm-sh/nvm) to manage Node versions:
  ```bash
  nvm use
  ```
- **Yarn** — this project uses Yarn v4 (Berry). Enable Corepack so Node picks the right version automatically (one-time, system-wide):
  ```bash
  corepack enable
  ```

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

This project uses [Conventional Commits](https://www.conventionalcommits.org/) for PR titles, enforced by CI. This keeps the history and changelog clean. Versioning and releases are handled by [Changesets](https://github.com/changesets/changesets): the version bump for each change is declared in a changeset file you add to your PR (see [Submitting Changes](#submitting-changes) and [RELEASE.md](./RELEASE.md)), **not** derived from the commit message.

### Format

```
<type>(<optional scope>): <description>

[optional body]

[optional footer(s)]
```

### Commit Types

These are the allowed PR-title types (validated by CI). They describe the change; they do **not** set the release version — that comes from the changeset.

| Type       | Description                          |
|------------|--------------------------------------|
| `feat`     | A new feature                        |
| `fix`      | A bug fix                            |
| `refactor` | Code change (no new feature or fix)  |
| `perf`     | Performance improvement              |
| `build`    | Build system or dependency changes   |
| `chore`    | Maintenance tasks                    |
| `revert`   | Reverts a previous commit            |
| `docs`     | Documentation only                   |

### Breaking Changes

For a breaking change, select a **major** bump when running `yarn changeset`, and document it in the PR body using a `BREAKING CHANGE:` footer:

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

4. If your change should be released, add a changeset and choose the bump level:
   ```bash
   yarn changeset
   ```
   Commit the generated `.changeset/*.md` file with your PR. See [RELEASE.md](./RELEASE.md) for details. Internal-only changes (e.g. CI, tests, refactors with no published effect) don't need one.

5. Commit your changes and push your branch.

6. Open a pull request against `main` with a [conventional commit](#commit-message-convention) title.

## Merging Pull Requests

When merging a pull request, select **squash and merge**. This collapses all commits into a single commit on `main`, keeping the history clean.

Before completing the merge, verify that the squash commit message follows the [conventional commit format](#commit-message-convention) (the PR title is validated by CI and becomes the squash commit) — this keeps the history clean. Version bumps and changelog entries come from the changeset included in the PR, not from the commit message.


## Releasing (Maintainers only)

Releases are managed by [Changesets](https://github.com/changesets/changesets). In short: changesets accumulated on `main` are collected into an auto-generated "Version Packages" PR; merging that PR bumps versions, updates changelogs, and publishes to npm with provenance. All packages share a single version (fixed mode).

The full process — adding changesets, the Version PR, prereleases, required secrets, and dry-runs — is documented in **[RELEASE.md](./RELEASE.md)**.

### Dry run

To preview the pending version bump and changelog without publishing:

```bash
yarn changeset status
```

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

Use a conventional maintenance branch name (e.g., `1.x`, `1.2.x`, or `1.x.x`). To cut a release from it, enter Changesets prerelease/maintenance mode as described in [RELEASE.md](./RELEASE.md).

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
