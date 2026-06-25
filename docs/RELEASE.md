# Release Process

This repo uses [Changesets](https://github.com/changesets/changesets) for versioning and publishing.

All packages in this monorepo are released together under a **single, shared version number** (fixed versioning). A change to any package bumps the version of every package.

---

## How it works

### 1. Adding a changeset to a PR

Any PR that introduces a user-visible change must include a changeset file. Run this from the repo root before opening your PR:

```bash
yarn changeset
```

The interactive CLI asks:

- Which packages are affected
- What type of change: `patch` (bug fix), `minor` (new feature), `major` (breaking change)
- A short description that ends up in the CHANGELOG

This creates a small Markdown file under `.changeset/`. Commit it with your PR.

PRs without a changeset file will not contribute to the next release. This is intentional — dependency bumps, CI changes, and purely internal refactors do not need one.

### 2. The Version PR

The [Changesets GitHub Action](https://github.com/changesets/action) runs on every merge to `main`. If there are pending changeset files it opens (or updates) a **"chore: version packages"** pull request that:

- Bumps the version in every `packages/*/package.json`
- Collapses all pending changeset files into `CHANGELOG.md` entries
- Deletes the consumed `.changeset/*.md` files

Review this PR, then merge it when you are ready to release.

### 3. Publishing

When the version PR is merged, the Changesets action runs again on `main`. This time there are no pending changesets, so instead of opening a PR it publishes every package to NPM `yarn changeset:publish`.

Each package is published with `--provenance`, which links the npm artifact to the specific GitHub Actions run that built it (verifiable via `npm audit signatures`).

A GitHub Release is created automatically by the action for each published package.

---

## Required secrets

The following secrets must be configured in the repository settings:

| Secret | Purpose |
|---|---|
| `NPM_TOKEN` | Authenticates `yarn changeset:publish` against the npm registry. Must have publish access to the `@elastic` scope. |
| `GITHUB_TOKEN` | Automatically provided by GitHub Actions. Used to open the version PR and create GitHub Releases. No manual setup needed. |

`NPM_TOKEN` is passed to Yarn v4 via `YARN_NPM_AUTH_TOKEN` in the release workflow — Yarn v4 reads this environment variable as the npm registry auth token without any `.yarnrc.yml` changes.

---

## Manual release trigger

The release workflow can also be triggered manually from the **Actions** tab -> **Release** -> **Run workflow**. This is useful to retry a failed publish step without waiting for a new merge to `main`.

---

## Prerelease channels

To publish a prerelease (e.g. `1.2.3-beta.4`):

```bash
# Enter prerelease mode on a dedicated branch
git checkout -b beta
yarn changeset pre enter beta

# Add changesets and merge PRs as usual.
# Each `yarn changeset:version` run produces beta.1, beta.2, etc.

# Exit prerelease mode when ready to do a stable release
yarn changeset pre exit
```

While in prerelease mode, `changeset:version` produces pre-versioned bumps. Exiting prerelease mode produces the final stable version on the next version PR merge.

---

## Local dry-run

To check what would be published without actually publishing:

```bash
yarn changeset status              # lists pending changesets and projected version bump
yarn changeset publish --dry-run   # shows what npm publish commands would run
```
