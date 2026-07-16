#!/usr/bin/env bash
# Sync ES|QL and PromQL grammars plus ES|QL language definitions from a local
# elasticsearch checkout and regenerate the TypeScript artifacts. For local
# verification of the latest grammars/definitions — no cloning, no PRs.
#
# Usage:
#   .buildkite/scripts/grammar_sync_local.sh [path-to-elasticsearch]
#   (default: ../elasticsearch next to this repo)
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
ELASTICSEARCH_DIR="${1:-$REPO_DIR/../elasticsearch}"
ELASTICSEARCH_DIR="$(cd "$ELASTICSEARCH_DIR" && pwd)"

if [ ! -d "$ELASTICSEARCH_DIR/x-pack/plugin/esql/src/main/antlr" ]; then
  echo "No elasticsearch antlr grammars found at: $ELASTICSEARCH_DIR" >&2
  echo "Usage: $0 [path-to-elasticsearch]" >&2
  exit 1
fi

source "$REPO_DIR/.buildkite/scripts/grammar_sync_lib.sh"

echo "--- Syncing grammars and definitions from $ELASTICSEARCH_DIR"
synchronize_all

echo "--- Rebuilding ANTLR TypeScript artifacts"
cd "$REPO_DIR"
export ANTLR4_TOOLS_ANTLR_VERSION="${ANTLR4_TOOLS_ANTLR_VERSION:-4.13.2}"
yarn build:antlr4

echo "--- Generating ES|QL definition modules"
yarn workspace @elastic/esql-definitions generate

echo "--- Done. Changes:"
# git status (not diff --stat) so a first-time definitions sync shows up too
git -C "$REPO_DIR" status --short -- \
  packages/esql-grammar/src/ \
  packages/esql-promql-grammar/src/ \
  packages/esql-definitions/elasticsearch/ \
  packages/esql-definitions/src/generated/
