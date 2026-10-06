#!/usr/bin/env bash
# Installs the pnpm version pinned in the root package.json `packageManager`
# field and puts it on PATH. Installed explicitly rather than via Corepack,
# which is no longer bundled with Node.js starting from v25.
#
# Must be sourced (`source .buildkite/scripts/setup_pnpm.sh`) so that the PATH
# change reaches the calling shell. The install goes to a per-user prefix
# because the agents' global npm prefix is not writable.

_setup_pnpm () {
  local repo_dir version prefix
  repo_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
  version="$(node -p "require('$repo_dir/package.json').packageManager.replace(/^pnpm@/, '').split('+')[0]")"
  prefix="${HOME}/.local/pnpm-${version}"

  if [ ! -x "$prefix/bin/pnpm" ]; then
    echo "Installing pnpm@$version into $prefix"
    npm install --global --prefix "$prefix" "pnpm@$version"
  fi

  export PATH="$prefix/bin:$PATH"
  pnpm --version
}

_setup_pnpm
unset -f _setup_pnpm
