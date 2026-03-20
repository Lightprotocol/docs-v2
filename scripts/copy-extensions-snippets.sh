#!/bin/bash

# Script to copy TypeScript extension examples to docs snippets.
# Source: examples-light-token-main/extensions
# Output: snippets/code-snippets/light-token/extensions/{name}/action.mdx

EXAMPLES="/home/tilo/Workspace/examples-light-token-main/extensions"
SNIPPETS_DIR="/home/tilo/Workspace/docs-main/snippets/code-snippets/light-token/extensions"

# Mapping of source-filename:output-dir
EXTENSIONS=(
    "close-mint:close-mint"
    "confidential-transfer:confidential-transfer"
    "default-account-state:default-account-state"
    "interest-bearing-tokens:interest-bearing"
    "metadata-and-metadata-pointer:metadata-pointer"
    "pausable-mint:pausable"
    "permanent-delegate:permanent-delegate"
    "token-groups-and-members:token-groups"
    "transfer-fees:transfer-fees"
    "transfer-hook:transfer-hook"
)

# Function to wrap TypeScript code in markdown
wrap_typescript() {
    local input_file="$1"
    local output_file="$2"
    mkdir -p "$(dirname "$output_file")"
    echo '```typescript' > "$output_file"
    cat "$input_file" >> "$output_file"
    echo '```' >> "$output_file"
    echo "Created: $output_file"
}

echo "=== Processing extension snippets ==="
echo ""

for mapping in "${EXTENSIONS[@]}"; do
    source_name="${mapping%%:*}"
    output_name="${mapping##*:}"

    src="$EXAMPLES/$source_name.ts"
    if [ -f "$src" ]; then
        wrap_typescript "$src" "$SNIPPETS_DIR/$output_name/action.mdx"
    else
        echo "  WARNING: Not found - $src"
    fi
done

echo ""
echo "Done! Created snippets in: $SNIPPETS_DIR"
echo ""
echo "Files created:"
find "$SNIPPETS_DIR" -name "*.mdx" -type f | sort
