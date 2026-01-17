#!/bin/bash

# Script to copy program example code from examples-light-token to docs/snippets/code-snippets/light-token
# Wraps each file in rust markdown code blocks

NATIVE_DIR="/home/tilo/Workspace/examples-light-token/program-examples/native/program/src/instructions"
ANCHOR_DIR="/home/tilo/Workspace/examples-light-token/program-examples/anchor/programs"
SNIPPETS_DIR="/home/tilo/Workspace/docs/snippets/code-snippets/light-token"

# Mapping: target-dir -> "native-file:anchor-program-dir"
# For combined operations (approve-revoke, freeze-thaw), use comma-separated native files and anchor dirs
declare -A OPERATION_MAP=(
    ["create-ata"]="create_ata.rs:create-ata"
    ["create-mint"]="create_mint.rs:create-mint"
    ["mint-to"]="mint_to.rs:mint-to"
    ["transfer-interface"]="transfer_interface.rs:transfer-interface"
    ["close-token-account"]="close.rs:close"
    ["burn"]="burn.rs:burn"
    ["approve-revoke"]="approve.rs,revoke.rs:approve,revoke"
    ["freeze-thaw"]="freeze.rs,thaw.rs:freeze,thaw"
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

# Function to combine multiple Rust files into one markdown file
wrap_rust_multi() {
    local output_file="$1"
    shift
    local input_files=("$@")

    echo '```rust' > "$output_file"
    local first=true
    for input_file in "${input_files[@]}"; do
        if [ -f "$input_file" ]; then
            if [ "$first" = true ]; then
                first=false
            else
                echo "" >> "$output_file"
                echo "// ---" >> "$output_file"
                echo "" >> "$output_file"
            fi
            cat "$input_file" >> "$output_file"
        fi
    done
    echo '```' >> "$output_file"
    echo "Created: $output_file"
}

# Process each operation
for target_dir in "${!OPERATION_MAP[@]}"; do
    mapping="${OPERATION_MAP[$target_dir]}"
    native_part="${mapping%%:*}"
    anchor_part="${mapping##*:}"

    echo "Processing: $target_dir"

    output_dir="$SNIPPETS_DIR/$target_dir/program"
    mkdir -p "$output_dir"

    # Handle native files (may be comma-separated for combined operations)
    IFS=',' read -ra native_files <<< "$native_part"
    if [ ${#native_files[@]} -eq 1 ]; then
        # Single file
        native_file="$NATIVE_DIR/${native_files[0]}"
        if [ -f "$native_file" ]; then
            wrap_rust "$native_file" "$output_dir/native.mdx"
        else
            echo "  WARNING: Not found - $native_file"
        fi
    else
        # Multiple files - combine them
        native_paths=()
        for nf in "${native_files[@]}"; do
            native_paths+=("$NATIVE_DIR/$nf")
        done
        wrap_rust_multi "$output_dir/native.mdx" "${native_paths[@]}"
    fi

    # Handle anchor files (may be comma-separated for combined operations)
    IFS=',' read -ra anchor_dirs <<< "$anchor_part"
    if [ ${#anchor_dirs[@]} -eq 1 ]; then
        # Single anchor program
        anchor_file="$ANCHOR_DIR/${anchor_dirs[0]}/src/lib.rs"
        if [ -f "$anchor_file" ]; then
            wrap_rust "$anchor_file" "$output_dir/anchor.mdx"
        else
            echo "  WARNING: Not found - $anchor_file"
        fi
    else
        # Multiple anchor programs - combine them
        anchor_paths=()
        for ad in "${anchor_dirs[@]}"; do
            anchor_paths+=("$ANCHOR_DIR/$ad/src/lib.rs")
        done
        wrap_rust_multi "$output_dir/anchor.mdx" "${anchor_paths[@]}"
    fi
done

echo ""
echo "Done! Created program snippets in: $SNIPPETS_DIR"
echo ""
echo "Files created:"
find "$SNIPPETS_DIR" -path "*/program/*.mdx" -type f | sort
