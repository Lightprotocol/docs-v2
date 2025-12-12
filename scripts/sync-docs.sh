#!/bin/bash
set -e

# Environment variables for local testing
# LIGHT_PROTOCOL_PATH: Path to light-protocol repo (default: "light-protocol")
# DRY_RUN: If "true", show diff instead of writing files (default: "false")
LIGHT_PROTOCOL_PATH="${LIGHT_PROTOCOL_PATH:-light-protocol}"
DRY_RUN="${DRY_RUN:-false}"

if [[ "$DRY_RUN" == "true" ]]; then
  echo "🔍 DRY RUN MODE - no files will be modified"
  echo "   Using LIGHT_PROTOCOL_PATH: $LIGHT_PROTOCOL_PATH"
  echo ""
fi

# Mapping of source files to docs files
declare -A FILE_MAP=(
  ["create_cmint.rs"]="compressed-token-program/cmint/create-cmint.mdx"
  ["mint_to_ctoken.rs"]="compressed-token-program/cmint/mint-ctokens.mdx"
  ["create_token_account.rs"]="compressed-token-program/ctoken/create-ctoken.mdx"
  ["create_ata.rs"]="compressed-token-program/ctoken/create-cata.mdx"
  ["close.rs"]="compressed-token-program/ctoken/close-ctoken-account.mdx"
  ["transfer_interface.rs"]="compressed-token-program/ctoken/transfer-interface.mdx"
)

SOURCE_DIR="$LIGHT_PROTOCOL_PATH/sdk-tests/sdk-ctoken-test/src"

for filename in "${!FILE_MAP[@]}"; do
  docs_file="${FILE_MAP[$filename]}"
  source_file="$SOURCE_DIR/$filename"

  if [[ -f "$source_file" && -f "$docs_file" ]]; then
    echo "Syncing $filename → $docs_file"

    # Read the source code
    source_code=$(cat "$source_file")

    # Use awk to replace content between ```rust expandable and ``` after "# Full Code Example"
    awk -v new_code="$source_code" '
      /^# Full Code Example/ { in_section = 1 }
      in_section && /^```rust expandable/ {
        print
        print new_code
        # Skip until closing ```
        while ((getline line) > 0) {
          if (line ~ /^```$/) {
            print line
            in_section = 0
            break
          }
        }
        next
      }
      { print }
    ' "$docs_file" > "$docs_file.tmp"

    if [[ "$DRY_RUN" == "true" ]]; then
      echo "--- Changes for $docs_file ---"
      diff "$docs_file" "$docs_file.tmp" || true
      rm "$docs_file.tmp"
      echo ""
    else
      mv "$docs_file.tmp" "$docs_file"
      echo "✓ Updated $docs_file"
    fi
  else
    if [[ ! -f "$source_file" ]]; then
      echo "⚠ Source file not found: $source_file"
    fi
    if [[ ! -f "$docs_file" ]]; then
      echo "⚠ Docs file not found: $docs_file"
    fi
  fi
done

echo "Done syncing handler code to docs"
