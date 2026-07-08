#!/usr/bin/env bash
# Shared grammar-copy functions, used by:
#   - esql_grammar_sync.sh    (CI job: clones elasticsearch, opens a PR)
#   - grammar_sync_local.sh   (local runner: uses an existing elasticsearch checkout)
#
# Callers must set before calling the functions:
#   REPO_DIR          — root of this esql-js repo
#   ELASTICSEARCH_DIR — root of an elasticsearch checkout

# In-place sed that works with both GNU (Linux/CI) and BSD (macOS) sed.
sedi () {
  if sed --version >/dev/null 2>&1; then
    sed -i "$@"
  else
    sed -i '' "$@"
  fi
}

antlr_source_dir () {
  echo "$ELASTICSEARCH_DIR/x-pack/plugin/esql/src/main/antlr"
}

prepend_generated_header () {
  local file="$1"
  local temp_file
  temp_file=$(mktemp)
  printf "// DO NOT MODIFY THIS FILE BY HAND. IT IS MANAGED BY A CI JOB.\n\n%s" "$(cat "$file")" > "$temp_file"
  mv "$temp_file" "$file"
}

synchronize_lexer_grammar () {
  local source_file="$(antlr_source_dir)/EsqlBaseLexer.g4"
  local source_lib_dir="$(antlr_source_dir)/lexer"
  local destination_file="$REPO_DIR/packages/esql-grammar/src/esql_lexer.g4"
  local destination_lib_parent_dir="$REPO_DIR/packages/esql-grammar/src"
  local destination_lib_dir="$destination_lib_parent_dir/lexer"

  echo "Copying base lexer file..."
  cp "$source_file" "$destination_file"
  echo "Copying lexer lib files..."
  rm -rf "$destination_lib_dir"
  cp -r "$source_lib_dir" "$destination_lib_parent_dir"

  prepend_generated_header "$destination_file"

  # Replace the line containing "lexer grammar" with "lexer grammar esql_lexer;"
  sedi -e 's/lexer grammar.*$/lexer grammar esql_lexer;/' "$destination_file"

  # Replace the line containing "superClass" with "superClass=lexer_config;"
  sedi -e 's/superClass.*$/superClass=lexer_config;/' "$destination_file"

  echo "Lexer file copied and modified successfully."
}

synchronize_parser_grammar () {
  local source_file="$(antlr_source_dir)/EsqlBaseParser.g4"
  local source_lib_dir="$(antlr_source_dir)/parser"
  local destination_file="$REPO_DIR/packages/esql-grammar/src/esql_parser.g4"
  local destination_lib_parent_dir="$REPO_DIR/packages/esql-grammar/src"
  local destination_lib_dir="$destination_lib_parent_dir/parser"

  echo "Copying base parser file..."
  cp "$source_file" "$destination_file"
  echo "Copying parser lib files..."
  rm -rf "$destination_lib_dir"
  cp -r "$source_lib_dir" "$destination_lib_parent_dir"

  prepend_generated_header "$destination_file"

  # Replace the line containing "parser grammar" with "parser grammar esql_parser;"
  sedi -e 's/parser grammar.*$/parser grammar esql_parser;/' "$destination_file"

  # Replace tokenVocab=EsqlBaseLexer; with tokenVocab=esql_lexer;
  sedi -e 's/tokenVocab=EsqlBaseLexer;/tokenVocab=esql_lexer;/' "$destination_file"

  # Replace the line containing "superClass" with "superClass=parser_config;"
  sedi -e 's/superClass.*$/superClass=parser_config;/' "$destination_file"

  echo "Parser file copied and modified successfully."
}

synchronize_promql_lexer_grammar () {
  local source_file="$(antlr_source_dir)/PromqlBaseLexer.g4"
  local destination_file="$REPO_DIR/packages/esql-promql-grammar/src/promql_lexer.g4"

  echo "Copying PromQL base lexer file..."
  cp "$source_file" "$destination_file"

  prepend_generated_header "$destination_file"

  # Replace the line containing "lexer grammar" with "lexer grammar promql_lexer;"
  sedi -e 's/lexer grammar.*$/lexer grammar promql_lexer;/' "$destination_file"

  # Replace the line containing "superClass" with "superClass=lexer_config;"
  sedi -e 's/superClass.*$/superClass=lexer_config;/' "$destination_file"

  echo "PromQL lexer file copied and modified successfully."
}

synchronize_promql_parser_grammar () {
  local source_file="$(antlr_source_dir)/PromqlBaseParser.g4"
  local destination_file="$REPO_DIR/packages/esql-promql-grammar/src/promql_parser.g4"

  echo "Copying PromQL base parser file..."
  cp "$source_file" "$destination_file"

  prepend_generated_header "$destination_file"

  # Replace the line containing "parser grammar" with "parser grammar promql_parser;"
  sedi -e 's/parser grammar.*$/parser grammar promql_parser;/' "$destination_file"

  # Replace tokenVocab=PromqlBaseLexer; with tokenVocab=promql_lexer;
  sedi -e 's/tokenVocab=PromqlBaseLexer;/tokenVocab=promql_lexer;/' "$destination_file"

  # Replace the line containing "superClass" with "superClass=parser_config;"
  sedi -e 's/superClass.*$/superClass=parser_config;/' "$destination_file"

  echo "PromQL parser file copied and modified successfully."
}

synchronize_promql_config () {
  # The generated promql lexer/parser extend lexer_config/parser_config.
  # Keep copies in sync with packages/esql-grammar/src/.
  cp "$REPO_DIR/packages/esql-grammar/src/lexer_config.js" "$REPO_DIR/packages/esql-promql-grammar/src/lexer_config.js"
  cp "$REPO_DIR/packages/esql-grammar/src/parser_config.js" "$REPO_DIR/packages/esql-promql-grammar/src/parser_config.js"
  echo "PromQL config files synced."
}

synchronize_all_grammars () {
  synchronize_lexer_grammar
  synchronize_parser_grammar
  synchronize_promql_lexer_grammar
  synchronize_promql_parser_grammar
  synchronize_promql_config
}
