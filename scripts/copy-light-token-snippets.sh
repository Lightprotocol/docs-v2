#!/bin/bash

# Script to copy TypeScript code from streaming-tokens to docs/snippets/code-snippets/light-token
# Wraps each file in typescript markdown code blocks

EXAMPLES="/home/tilo/Workspace/streaming-tokens/typescript-client"
SNIPPETS_DIR="/home/tilo/Workspace/docs/snippets/code-snippets/light-token"

# Recipes to process (matching directory and file names)
RECIPES=("create-mint" "create-ata" "mint-to" "transfer-interface" "load-ata" "wrap" "unwrap")

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

# Process each recipe
for recipe in "${RECIPES[@]}"; do
    echo "Processing: $recipe"

    # Action file
    action_file="$EXAMPLES/actions/$recipe.ts"
    if [ -f "$action_file" ]; then
        wrap_typescript "$action_file" "$SNIPPETS_DIR/$recipe/action.mdx"
    else
        echo "  WARNING: Not found - $action_file"
    fi

    # Instruction file
    instruction_file="$EXAMPLES/instructions/$recipe.ts"
    if [ -f "$instruction_file" ]; then
        wrap_typescript "$instruction_file" "$SNIPPETS_DIR/$recipe/instruction.mdx"
    else
        echo "  WARNING: Not found - $instruction_file"
    fi
done

# Approve/revoke: non-standard filenames, action-only
echo "Processing: approve-revoke"

approve_file="$EXAMPLES/actions/delegate-approve.ts"
if [ -f "$approve_file" ]; then
    wrap_typescript "$approve_file" "$SNIPPETS_DIR/approve-revoke/approve-action.mdx"
else
    echo "  WARNING: Not found - $approve_file"
fi

revoke_file="$EXAMPLES/actions/delegate-revoke.ts"
if [ -f "$revoke_file" ]; then
    wrap_typescript "$revoke_file" "$SNIPPETS_DIR/approve-revoke/revoke-action.mdx"
else
    echo "  WARNING: Not found - $revoke_file"
fi

echo ""
echo "Done! Created snippets in: $SNIPPETS_DIR"
echo ""
echo "Files created:"
find "$SNIPPETS_DIR" -name "*.mdx" -type f | sort
