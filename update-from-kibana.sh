#!/usr/bin/env bash
#
# Imports ES|QL source code from the Kibana repository into this repo,
# preserving the full Git commit history for the imported files.
#
# Prerequisites:
#   - git-filter-repo: brew install git-filter-repo
#
# Usage:
#   ./update-from-kibana.sh [--branch <name>] [--kibana-ref <ref>]
#
# Options:
#   --branch      Branch name to create for the import (default: import-kibana-history)
#   --kibana-ref  Kibana branch or tag to clone (default: main)
#
# The script will:
#   1. Clone Kibana (single-branch) into a temp directory
#   2. Filter the repo to keep only the ES|QL source paths
#   3. Remap them to src/ in this repo
#   4. Merge the filtered history into a new branch
#   5. Resolve conflicts by accepting the Kibana version
#   6. Clean up

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"
CLONE_DIR="$(mktemp -d)"
BRANCH_NAME="import-kibana-history"
KIBANA_REF="main"
KIBANA_URL="https://github.com/elastic/kibana.git"
REMOTE_NAME="kibana-filtered"

KIBANA_PREFIX="src/platform/packages/shared/kbn-esql-language/src/"

PATHS=(
  "${KIBANA_PREFIX}ast/"
  "${KIBANA_PREFIX}composer/"
  "${KIBANA_PREFIX}debug/"
  "${KIBANA_PREFIX}embedded_languages/"
  "${KIBANA_PREFIX}parser/"
  "${KIBANA_PREFIX}pretty_print/"
  "${KIBANA_PREFIX}types.ts"
)

usage() {
  sed -n '2,/^$/s/^#//p' "$0"
  exit 1
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --branch)      BRANCH_NAME="$2"; shift 2 ;;
    --kibana-ref)  KIBANA_REF="$2";  shift 2 ;;
    -h|--help)     usage ;;
    *)             echo "Unknown option: $1"; usage ;;
  esac
done

cleanup() {
  echo "Cleaning up..."
#   cd "$REPO_ROOT"
#   git remote remove "$REMOTE_NAME" 2>/dev/null || true
#   rm -rf "$CLONE_DIR"
  echo "Done."
}
trap cleanup EXIT

command -v git-filter-repo >/dev/null 2>&1 || {
  echo "Error: git-filter-repo is not installed."
  echo "Install it with: brew install git-filter-repo"
  exit 1
}

# ── Step 1: Clone Kibana ────────────────────────────────────────────
echo "==> Cloning Kibana ($KIBANA_REF) into $CLONE_DIR ..."
echo "    This will take several minutes for a full history clone."
git clone --single-branch --branch "$KIBANA_REF" "$KIBANA_URL" "$CLONE_DIR"

# ── Step 2: Filter to keep only ES|QL paths ─────────────────────────
echo "==> Filtering repository to keep only ES|QL source paths..."
PATH_ARGS=()
for p in "${PATHS[@]}"; do
  PATH_ARGS+=(--path "$p")
done

cd "$CLONE_DIR"
git filter-repo \
  "${PATH_ARGS[@]}" \
  --path-rename "${KIBANA_PREFIX}:src/"

echo "==> Removing .md files from history..."
git filter-repo \
  --invert-paths \
  --path-glob '*.md'

echo "==> Filtered repo: $(git rev-list --count HEAD) commits preserved."

# ── Step 3: Create branch and merge ─────────────────────────────────
cd "$REPO_ROOT"

echo "==> Creating branch '$BRANCH_NAME'..."
git checkout -b "$BRANCH_NAME" 2>/dev/null || git checkout "$BRANCH_NAME"

echo "==> Adding filtered Kibana clone as remote..."
git remote add "$REMOTE_NAME" "$CLONE_DIR"
git fetch "$REMOTE_NAME"

echo "==> Merging Kibana history (--allow-unrelated-histories)..."
if ! git merge "$REMOTE_NAME/$KIBANA_REF" --allow-unrelated-histories --no-commit; then
  echo "==> Conflicts detected — resolving all by accepting the Kibana version..."
  git diff --name-only --diff-filter=U | while IFS= read -r file; do
    git checkout --theirs -- "$file"
    git add "$file"
  done
fi

echo "==> Committing merge..."
git commit -m "$(cat <<'COMMIT_MSG'
Import ES|QL code history from Kibana

Merge filtered history from the following Kibana paths:
- src/platform/packages/shared/kbn-esql-language/src/ast
- src/platform/packages/shared/kbn-esql-language/src/composer
- src/platform/packages/shared/kbn-esql-language/src/debug
- src/platform/packages/shared/kbn-esql-language/src/embedded_languages
- src/platform/packages/shared/kbn-esql-language/src/parser
- src/platform/packages/shared/kbn-esql-language/src/pretty_print
- src/platform/packages/shared/kbn-esql-language/src/types.ts

All conflicts resolved by accepting the Kibana version.
COMMIT_MSG
)"

echo ""
echo "=== Import complete ==="
echo "Branch: $BRANCH_NAME"
echo "Commits in history: $(git rev-list --count HEAD)"
echo ""
echo "Next steps:"
echo "  1. Verify the import: git log --oneline --graph -20"
echo "  2. Check file history: git log --follow src/ast/builder/builder.ts"
echo "  3. Push and create PR: git push -u origin $BRANCH_NAME"
