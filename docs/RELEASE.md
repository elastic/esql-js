# Release Process

This repo uses [Changesets](https://github.com/changesets/changesets) for versioning and publishing.

All packages in this monorepo are released together under a **single, shared version number** (fixed versioning). A change to any package bumps the version of every package.

---

## How it works

### 1. Adding a changeset to a PR

Any PR that introduces a user-visible change must include a changeset file. Run this from the repo root before opening your PR:

```bash
pnpm changeset
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

When the version PR is merged, the Changesets action runs again on `main`. This time there are no pending changesets, so instead of opening a PR it publishes every package to NPM via `pnpm changeset:publish`.

The `changeset:publish` script delegates to `pnpm -r publish --access public --provenance --no-git-checks`, then runs `changeset tag`. `pnpm -r publish` publishes in topological order, rewrites `workspace:^` ranges to real versions, and skips any package whose version is already in the registry, so re-running a failed release is safe. The Changesets action decides whether a publish happened by scanning the publish command's stdout for `New tag: <pkg>@<version>` lines — `pnpm publish` does not print them, so without `changeset tag` the action reports `published: false` and silently skips tagging and releases.

The `--provenance` flag attaches [npm provenance](https://docs.npmjs.com/generating-provenance-statements) — linking the npm artifact to the specific GitHub Actions run that built it (verifiable via `npm audit signatures`). This requires `id-token: write` on the release job, which is already set. pnpm does not read `publishConfig.provenance` from `package.json`, so the flag must stay on the command line. Provenance can only be generated on a supported CI provider, so `pnpm changeset:publish` fails when run locally — see [Local dry-run](#local-dry-run).

### 4. The GitHub Release

The action's built-in releases are per package, so with every package sharing one version they would produce 11 releases and 11 tags per release — and no `v<version>` tag at all. `createGithubReleases` is therefore set to `false`, and the release job's last step creates a single release with `gh release create --generate-notes`.

### 5. The VS Code extension

The ES|QL VS Code extension (`packages/esql-vscode`, published as [`Elastic.highlight-esql`](https://marketplace.visualstudio.com/items?itemName=Elastic.highlight-esql)) shares the version of the other packages, but it is `private`, so `pnpm -r publish` skips it. Instead, whenever the release job publishes to npm, the **Publish VS Code extension** job packages the extension at that version and:

- publishes it to the VS Code Marketplace,
- publishes it to [Open VSX](https://open-vsx.org/extension/Elastic/highlight-esql), which VSCodium, Cursor, and other VS Code forks install from,
- attaches the `.vsix` to the `v<version>` GitHub Release.

Each of these skips a version that is already there, and a failure in one does not stop the others. To retry, use **Re-run failed jobs** on the same workflow run. A new manual run won't publish the extension: it finds npm up to date, reports nothing published, and skips the job.

Prerelease versions are not published, because the Marketplace and Open VSX accept only `major.minor.patch` versions.

---

## Required secrets

The following secrets must be configured in the repository settings:

| Secret | Purpose |
|---|---|
| `NPM_TOKEN` | Authenticates `pnpm changeset:publish` against the npm registry. Must have publish access to the `@elastic` scope. |
| `GITHUB_TOKEN` | Automatically provided by GitHub Actions. Used to open the version PR and create GitHub Releases. No manual setup needed. |
| `VSCE_PAT` | Publishes the VS Code extension to the VS Code Marketplace. An Azure DevOps PAT of a member of the `Elastic` Marketplace publisher, with organization **All accessible organizations** and scope **Marketplace (Manage)**. |
| `OVSX_PAT` | Publishes the VS Code extension to Open VSX. An access token of a member of the `Elastic` Open VSX namespace. |

`NPM_TOKEN` is passed to the Changesets action, which writes it into `~/.npmrc` before publishing; pnpm reads the registry auth token from there.

`VSCE_PAT` stops working on **December 1, 2026**, when Azure DevOps retires global PATs; Marketplace publishing does not accept organization-scoped PATs. Before then, switch the **Publish to VS Code Marketplace** step to one of:

- **Trusted publishing:** `vsce publish --oidc`, with `id-token: write` on the job and a trust policy for this workflow registered on the Marketplace. It needs no secret. `vsce` already supports it, but as of October 2026 the Marketplace does not ([microsoft/vscode-vsce#1275](https://github.com/microsoft/vscode-vsce/issues/1275)).
- **Microsoft Entra ID:** sign in with [`azure/login`](https://github.com/Azure/login) over OIDC as a managed identity that is a member of the `Elastic` publisher, then run `vsce publish --azure-credential`. See [Publishing Extensions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension).

---

## Manual release trigger

The release workflow can also be triggered manually from the **Actions** tab -> **Release** -> **Run workflow**. This is useful to retry a failed publish step without waiting for a new merge to `main`. It does not retry the VS Code extension; see [The VS Code extension](#5-the-vs-code-extension).

---

## Prerelease channels

To publish a prerelease (e.g. `1.2.3-beta.4`):

```bash
# Enter prerelease mode on a dedicated branch
git checkout -b beta
pnpm changeset pre enter beta

# Add changesets and merge PRs as usual.
# Each `pnpm changeset:version` run produces beta.1, beta.2, etc.

# Exit prerelease mode when ready to do a stable release
pnpm changeset pre exit
```

While in prerelease mode, `changeset:version` produces pre-versioned bumps. Exiting prerelease mode produces the final stable version on the next version PR merge.

---

## Local dry-run

To check what would be published without actually publishing:

```bash
pnpm changeset status                                    # lists pending changesets and projected version bump
pnpm -r publish --access public --no-git-checks --dry-run  # shows which packages would be published
```

To do a full local publish without touching npm, run a local registry such as [Verdaccio](https://verdaccio.org/) (with no uplink for `@elastic/*`, so versions already on npm don't hide yours) and point pnpm at it:

```bash
npx verdaccio                       # in another terminal, listens on http://localhost:4873
npm adduser --registry http://localhost:4873
pnpm build
pnpm -r publish --access public --no-git-checks --registry http://localhost:4873
```

To preview the GitHub Release notes without creating anything:

```bash
gh api repos/elastic/esql-js/releases/generate-notes \
  -f tag_name=v4.18.0 -f previous_tag_name=v4.17.0 --jq .body
```
