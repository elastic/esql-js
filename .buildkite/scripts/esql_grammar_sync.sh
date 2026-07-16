#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
WORK_DIR="$(dirname "$REPO_DIR")"
ELASTICSEARCH_DIR="$WORK_DIR/elasticsearch"

if [[ -z "${VAULT_GITHUB_TOKEN:-}" ]]; then
  echo "VAULT_GITHUB_TOKEN is not set."
  exit 1
fi
export GH_TOKEN="$VAULT_GITHUB_TOKEN"

source "$REPO_DIR/.buildkite/scripts/grammar_sync_lib.sh"

report_main_step () {
  echo "--- $1"
}

main () {
  cd "$WORK_DIR"

  report_main_step "Cloning Elasticsearch"

  rm -rf elasticsearch
  git clone https://github.com/elastic/elasticsearch --depth 1

  cd "$REPO_DIR"

  report_main_step "Synchronizing ES|QL lexer grammar..."
  synchronize_lexer_grammar

  report_main_step "Synchronizing ES|QL parser grammar..."
  synchronize_parser_grammar

  report_main_step "Synchronizing PromQL lexer grammar..."
  synchronize_promql_lexer_grammar

  report_main_step "Synchronizing PromQL parser grammar..."
  synchronize_promql_parser_grammar

  report_main_step "Syncing PromQL config files..."
  synchronize_promql_config

  report_main_step "Synchronizing ES|QL definitions..."
  synchronize_esql_definitions

  # Check for differences in synced files (untracked files in elasticsearch/
  # do not show up in `git diff`, hence the additional `git status` check)
  set +e
  git diff --exit-code --quiet \
    packages/esql-grammar/src/esql_lexer.g4 \
    packages/esql-grammar/src/esql_parser.g4 \
    packages/esql-grammar/src/lexer/ \
    packages/esql-grammar/src/parser/ \
    packages/esql-promql-grammar/src/promql_lexer.g4 \
    packages/esql-promql-grammar/src/promql_parser.g4 \
    packages/esql-definitions/elasticsearch/ \
    && [ -z "$(git status --porcelain -- packages/esql-definitions/elasticsearch/)" ]
  if [ $? -eq 0 ]; then
    echo "No differences found. Our work is done here."
    exit
  fi
  set -e

  report_main_step "Differences found. Checking for an existing pull request."

  MACHINE_USERNAME="Grammar Sync Bot"
  git config --global user.name "$MACHINE_USERNAME"
  git config --global user.email 'elasticmachine@users.noreply.github.com'

  PR_TITLE='chore: [ES|QL] Update grammars and definitions'
  PR_BODY='This PR updates the ES|QL grammars (lexer and parser), PromQL grammars, and ES|QL language definitions to match the latest version in Elasticsearch.'

  # Check if a PR already exists
  pr_search_result=$(gh pr list --search "$PR_TITLE" --state open --author "$MACHINE_USERNAME" --limit 1 --json title -q ".[].title")

  if [ "$pr_search_result" == "$PR_TITLE" ]; then
    echo "PR already exists. Exiting."
    exit
  fi

  echo "No existing PR found. Proceeding."

  report_main_step "Building ANTLR artifacts."

  yarn install --immutable

  # Note: We run the per-language build commands directly instead of `yarn build:antlr4`
  # to skip the `antlr4:deps` step which uses `brew` (macOS only). CI has antlr installed.
  # Each of these still runs its postbuild step (@ts-nocheck + listener rename) inline.
  # Pin the ANTLR version to avoid the broken Sonatype Central version-lookup API
  # in antlr4-tools (https://github.com/antlr/antlr4-tools/issues/18).
  export ANTLR4_TOOLS_ANTLR_VERSION="4.13.2"

  yarn build:antlr4:esql
  yarn build:antlr4:promql

  report_main_step "Generating ES|QL definition modules."

  yarn workspace @elastic/esql-definitions generate

  # Create branch and commit
  BRANCH_NAME="esql_grammar_sync_$(date +%s)"
  git checkout -b "$BRANCH_NAME"

  git add \
    packages/esql-grammar/src/ \
    packages/esql-promql-grammar/src/ \
    packages/esql-definitions/elasticsearch/ \
    packages/esql-definitions/src/generated/
  git commit -m "feat: Update ES|QL grammars and definitions"

  report_main_step "Changes committed. Creating pull request."

  git push origin "$BRANCH_NAME"

  gh pr create --title "$PR_TITLE" --body "$PR_BODY" --base main --head "$BRANCH_NAME"
}

main
