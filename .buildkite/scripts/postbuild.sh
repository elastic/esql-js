#!/usr/bin/env bash
set -euo pipefail

# Get the grammar type from the first argument (esql or promql)
GRAMMAR_TYPE="${1:-esql}"

# In-place sed that works with both GNU (Linux/CI) and BSD (macOS) sed.
sedi () {
  if sed --version >/dev/null 2>&1; then
    sed -i "$@"
  else
    sed -i '' "$@"
  fi
}

# Function to add @ts-nocheck to a file
add_ts_nocheck() {
  local file=$1
  if [ -f "$file" ]; then
    echo "Adding @ts-nocheck to $file"
    echo -e "// @ts-nocheck\n$(cat "$file")" > "$file"
  else
    echo "$file not found!"
  fi
}

# The ANTLR @header block is emitted verbatim into generated files. Java class imports
# inside it are invalid TypeScript — swap them for their JS module equivalents.
swap_java_imports() {
  local file=$1
  if [ -f "$file" ]; then
    sedi -e "s|^import org\.elasticsearch\.xpack\.esql\.action\.EsqlCapabilities;|import { EsqlCapabilities } from './esql_capabilities.js';|" "$file"
  fi
}

if [ "$GRAMMAR_TYPE" == "esql" ]; then
  # Add @ts-nocheck to the parser file
  add_ts_nocheck src/esql_parser.ts

  # Add @ts-nocheck to the lexer file
  add_ts_nocheck src/esql_lexer.ts

  # Rename the parser listener file if it exists
  if [ -f src/esql_parserListener.ts ]; then
    echo "Renaming src/esql_parserListener.ts to src/esql_parser_listener.ts"
    mv src/esql_parserListener.ts src/esql_parser_listener.ts
  else
    echo "src/esql_parserListener.ts not found!"
  fi

  # Swap Java class imports (from @header blocks) with their JS module equivalents
  swap_java_imports src/esql_lexer.ts
  swap_java_imports src/esql_parser.ts
  swap_java_imports src/esql_parser_listener.ts
elif [ "$GRAMMAR_TYPE" == "promql" ]; then
  # Add @ts-nocheck to the parser file
  add_ts_nocheck src/promql_parser.ts

  # Add @ts-nocheck to the lexer file
  add_ts_nocheck src/promql_lexer.ts

  # Rename the parser listener file if it exists
  if [ -f src/promql_parserListener.ts ]; then
    echo "Renaming src/promql_parserListener.ts to src/promql_parser_listener.ts"
    mv src/promql_parserListener.ts src/promql_parser_listener.ts
  else
    echo "src/promql_parserListener.ts not found!"
  fi
else
  echo "Unknown grammar type: $GRAMMAR_TYPE"
  echo "Usage: $0 [esql|promql]"
  exit 1
fi
