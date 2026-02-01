#!/bin/bash

# Script to copy TypeScript code from examples-light-token to docs/snippets/code-snippets/light-token
# Wraps each file in typescript markdown code blocks

EXAMPLES="/home/tilo/Workspace/examples-light-token/cookbook"
SNIPPETS_DIR="/home/tilo/Workspace/docs/snippets/code-snippets/light-token"

# Recipes to process (matching directory names)
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

# Indexing toolkit snippets
INDEXING_DIR="/home/tilo/Workspace/examples-light-token/toolkits/indexing-tokens"
echo "Processing: indexing-tokens toolkit"

for variant in "warm-up-action" "warm-up-instruction"; do
    src="$INDEXING_DIR/$variant.ts"
    if [ -f "$src" ]; then
        wrap_typescript "$src" "$SNIPPETS_DIR/warm-up/$variant.mdx"
    else
        echo "  WARNING: Not found - $src"
    fi
done

echo ""
echo "Done! Created snippets in: $SNIPPETS_DIR"
echo ""
echo "Files created:"
find "$SNIPPETS_DIR" -name "*.mdx" -type f | sort
