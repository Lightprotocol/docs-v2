#!/bin/bash

# Script to copy Rust client code from examples-light-token-rust-client to docs snippets
# Creates action.mdx and instruction.mdx files wrapped in rust code blocks

EXAMPLES_DIR="/home/tilo/Workspace/examples-light-token/rust-client"
SNIPPETS_DIR="/home/tilo/Workspace/docs/snippets/code-snippets/light-token"

# Full recipes (action + instruction in same directory)
FULL_RECIPES=("create-mint" "mint-to" "transfer-interface" "transfer-checked")

# Full recipes with name mapping (target-dir:source-filename)
FULL_RECIPES_MAPPED=(
    "create-ata:create_associated_token_account"
)

# Action-only recipes (action file only)
ACTION_ONLY=("wrap" "unwrap")

# Instruction-only recipes with name mapping (target:source)
# Format: "output-dir:source-filename"
INSTRUCTION_ONLY=(
    "burn:burn"
    "close-token-account:close"
    "create-token-account:create_token_account"
)

# Function to wrap Rust code in markdown
wrap_rust() {
    local input_file="$1"
    local output_file="$2"
    echo '```rust' > "$output_file"
    cat "$input_file" >> "$output_file"
    echo '```' >> "$output_file"
    echo "Created: $output_file"
}

# Convert kebab-case to snake_case
kebab_to_snake() {
    echo "$1" | tr '-' '_'
}

echo "=== Processing Rust client files ==="
echo ""

# Process full recipes (action + instruction)
echo "--- Full recipes (action + instruction) ---"
for recipe in "${FULL_RECIPES[@]}"; do
    rust_name=$(kebab_to_snake "$recipe")
    echo "Processing: $recipe (source: $rust_name.rs)"

    output_dir="$SNIPPETS_DIR/$recipe/rust-client"
    mkdir -p "$output_dir"

    # Action file
    action_file="$EXAMPLES_DIR/actions/$rust_name.rs"
    if [ -f "$action_file" ]; then
        wrap_rust "$action_file" "$output_dir/action.mdx"
    else
        echo "  WARNING: Not found - $action_file"
    fi

    # Instruction file
    instruction_file="$EXAMPLES_DIR/instructions/$rust_name.rs"
    if [ -f "$instruction_file" ]; then
        wrap_rust "$instruction_file" "$output_dir/instruction.mdx"
    else
        echo "  WARNING: Not found - $instruction_file"
    fi
done

echo ""
echo "--- Full recipes (mapped names) ---"
for mapping in "${FULL_RECIPES_MAPPED[@]}"; do
    output_name="${mapping%%:*}"
    source_name="${mapping##*:}"
    echo "Processing: $output_name (source: $source_name.rs)"

    output_dir="$SNIPPETS_DIR/$output_name/rust-client"
    mkdir -p "$output_dir"

    action_file="$EXAMPLES_DIR/actions/$source_name.rs"
    if [ -f "$action_file" ]; then
        wrap_rust "$action_file" "$output_dir/action.mdx"
    else
        echo "  WARNING: Not found - $action_file"
    fi

    instruction_file="$EXAMPLES_DIR/instructions/$source_name.rs"
    if [ -f "$instruction_file" ]; then
        wrap_rust "$instruction_file" "$output_dir/instruction.mdx"
    else
        echo "  WARNING: Not found - $instruction_file"
    fi
done

echo ""
echo "--- Action-only recipes ---"
for recipe in "${ACTION_ONLY[@]}"; do
    rust_name=$(kebab_to_snake "$recipe")
    echo "Processing: $recipe (source: $rust_name.rs)"

    output_dir="$SNIPPETS_DIR/$recipe/rust-client"
    mkdir -p "$output_dir"

    # Action file only
    action_file="$EXAMPLES_DIR/actions/$rust_name.rs"
    if [ -f "$action_file" ]; then
        wrap_rust "$action_file" "$output_dir/action.mdx"
    else
        echo "  WARNING: Not found - $action_file"
    fi
done

echo ""
echo "--- Instruction-only recipes ---"
for mapping in "${INSTRUCTION_ONLY[@]}"; do
    output_name="${mapping%%:*}"
    source_name="${mapping##*:}"
    echo "Processing: $output_name (source: $source_name.rs)"

    output_dir="$SNIPPETS_DIR/$output_name/rust-client"
    mkdir -p "$output_dir"

    # Instruction file only
    instruction_file="$EXAMPLES_DIR/instructions/$source_name.rs"
    if [ -f "$instruction_file" ]; then
        wrap_rust "$instruction_file" "$output_dir/instruction.mdx"
    else
        echo "  WARNING: Not found - $instruction_file"
    fi
done

echo ""
echo "--- Freeze/Thaw recipes ---"
output_dir="$SNIPPETS_DIR/freeze-thaw/rust-client"
mkdir -p "$output_dir"

freeze_file="$EXAMPLES_DIR/instructions/freeze.rs"
if [ -f "$freeze_file" ]; then
    wrap_rust "$freeze_file" "$output_dir/freeze-instruction.mdx"
else
    echo "  WARNING: Not found - $freeze_file"
fi

thaw_file="$EXAMPLES_DIR/instructions/thaw.rs"
if [ -f "$thaw_file" ]; then
    wrap_rust "$thaw_file" "$output_dir/thaw-instruction.mdx"
else
    echo "  WARNING: Not found - $thaw_file"
fi

echo ""
echo "--- Approve/Revoke recipes ---"
output_dir="$SNIPPETS_DIR/approve-revoke/rust-client"
mkdir -p "$output_dir"

# Approve action
approve_action="$EXAMPLES_DIR/actions/approve.rs"
if [ -f "$approve_action" ]; then
    wrap_rust "$approve_action" "$output_dir/approve-action.mdx"
else
    echo "  WARNING: Not found - $approve_action"
fi

# Approve instruction
approve_instruction="$EXAMPLES_DIR/instructions/approve.rs"
if [ -f "$approve_instruction" ]; then
    wrap_rust "$approve_instruction" "$output_dir/approve-instruction.mdx"
else
    echo "  WARNING: Not found - $approve_instruction"
fi

# Revoke action
revoke_action="$EXAMPLES_DIR/actions/revoke.rs"
if [ -f "$revoke_action" ]; then
    wrap_rust "$revoke_action" "$output_dir/revoke-action.mdx"
else
    echo "  WARNING: Not found - $revoke_action"
fi

# Revoke instruction
revoke_instruction="$EXAMPLES_DIR/instructions/revoke.rs"
if [ -f "$revoke_instruction" ]; then
    wrap_rust "$revoke_instruction" "$output_dir/revoke-instruction.mdx"
else
    echo "  WARNING: Not found - $revoke_instruction"
fi

echo ""
echo "Done! Created Rust snippets in: $SNIPPETS_DIR"
echo ""
echo "Files created:"
find "$SNIPPETS_DIR" -path "*/rust-client/*.mdx" -type f | sort
