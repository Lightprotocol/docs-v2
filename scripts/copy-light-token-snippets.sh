#!/bin/bash

# Script to copy TypeScript code from examples-light-token to docs/snippets/code-snippets/light-token
# Wraps each file in typescript markdown code blocks

EXAMPLES="/home/tilo/Workspace/examples-light-token/typescript-client"
SNIPPETS_DIR="/home/tilo/Workspace/docs/snippets/code-snippets/light-token"

# Recipes to process (matching directory names)
RECIPES=("create-mint" "create-ata" "mint-to" "transfer-interface" "load-ata" "wrap" "unwrap")

# Function to wrap TypeScript code in markdown
wrap_typescript() {
    local input_file="$1"
    local output_file="$2"
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

echo ""
echo "Done! Created snippets in: $SNIPPETS_DIR"
echo ""
echo "Files created:"
find "$SNIPPETS_DIR" -name "*.mdx" -type f | sort
