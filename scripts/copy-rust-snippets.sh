#!/bin/bash

# Script to copy Rust client code from examples-light-token to docs/snippets/code-snippets/light-token
# Wraps each file in rust markdown code blocks

EXAMPLES_DIR="/home/tilo/Workspace/examples-light-token/rust-client/tests"
SNIPPETS_DIR="/home/tilo/Workspace/docs/snippets/code-snippets/light-token"

# Mapping: source file -> target directory/output-name
# Format: "target-dir:output-name" (output-name without .mdx extension)
declare -A FILE_MAP=(
    ["create_ata.rs"]="create-ata:full"
    ["create_token_account.rs"]="create-token-account:full"
    ["create_mint.rs"]="create-mint:full"
    ["mint_to.rs"]="mint-to:full"
    ["close.rs"]="close-token-account:full"
    ["transfer.rs"]="transfer-interface:full"
    ["burn.rs"]="burn:full"
    ["approve.rs"]="approve-revoke:approve-full"
    ["revoke.rs"]="approve-revoke:revoke-full"
    ["freeze.rs"]="freeze-thaw:freeze-full"
    ["thaw.rs"]="freeze-thaw:thaw-full"
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

# Process each mapped file
for source_file in "${!FILE_MAP[@]}"; do
    mapping="${FILE_MAP[$source_file]}"
    target_dir="${mapping%%:*}"
    output_name="${mapping##*:}"
    echo "Processing: $source_file -> $target_dir/$output_name.mdx"

    input_file="$EXAMPLES_DIR/$source_file"
    output_dir="$SNIPPETS_DIR/$target_dir/rust-client"

    if [ -f "$input_file" ]; then
        mkdir -p "$output_dir"
        wrap_rust "$input_file" "$output_dir/$output_name.mdx"
    else
        echo "  WARNING: Not found - $input_file"
    fi
done

echo ""
echo "Done! Created Rust snippets in: $SNIPPETS_DIR"
echo ""
echo "Files created:"
find "$SNIPPETS_DIR" -path "*/rust-client/*.mdx" -type f | sort
