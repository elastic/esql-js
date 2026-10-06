#!/usr/bin/env bash
# Installs the pnpm version pinned in the root package.json `packageManager`
# field. Installed explicitly rather than via Corepack, which is no longer
# bundled with Node.js starting from v25.
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
PNPM_VERSION="$(node -p "require('$REPO_DIR/package.json').packageManager.replace(/^pnpm@/, '').split('+')[0]")"

if [ "$(pnpm --version 2>/dev/null || true)" != "$PNPM_VERSION" ]; then
  echo "Installing pnpm@$PNPM_VERSION"
  npm install --global "pnpm@$PNPM_VERSION"
fi

pnpm --version
