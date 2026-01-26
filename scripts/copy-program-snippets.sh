#!/bin/bash

# Script to copy program code from example repos to docs snippets
# Creates CodeGroup MDX files with lib.rs/instruction.rs and test.rs combined

SNIPPETS_DIR="/home/tilo/Workspace/docs/snippets/code-snippets/light-token"

# =============================================================================
# NATIVE PROGRAMS
# =============================================================================

NATIVE_EXAMPLES_DIR="/home/tilo/Workspace/examples-light-token-native/program-examples/native-rust"

# Recipes to process (output-name:source_name:test_name)
# test_name is optional, defaults to source_name if not provided
NATIVE_RECIPES=(
    "create-mint:create_mint"
    "mint-to:mint_to"
    "mint-to-checked:mint_to_checked"
    "create-ata:create_ata"
    "create-token-account:create_token_account"
    "close-token-account:close"
    "transfer-interface:transfer_interface:transfer"
    "transfer-checked:transfer_checked"
    "approve:approve"
    "revoke:revoke"
    "burn:burn"
    "freeze:freeze"
    "thaw:thaw"
)

echo "=== Processing Native program files ==="
echo ""

for mapping in "${NATIVE_RECIPES[@]}"; do
    # Parse the mapping (output:source:test)
    IFS=':' read -r output_name source_name test_name <<< "$mapping"
    # Default test_name to source_name if not provided
    test_name="${test_name:-$source_name}"

    echo "Processing: $output_name (source: $source_name, test: $test_name)"

    output_dir="$SNIPPETS_DIR/$output_name/native-program"
    mkdir -p "$output_dir"

    instruction_file="$NATIVE_EXAMPLES_DIR/program/src/instructions/$source_name.rs"
    test_file="$NATIVE_EXAMPLES_DIR/program/tests/$test_name.rs"

    # Check source files exist
    if [ ! -f "$instruction_file" ]; then
        echo "  WARNING: Not found - $instruction_file"
        continue
    fi

    if [ ! -f "$test_file" ]; then
        echo "  WARNING: Not found - $test_file"
        continue
    fi

    # Create CodeGroup MDX with both files
    output_file="$output_dir/full-example.mdx"

    {
        echo '<CodeGroup>'
        echo '```rust instruction.rs'
        cat "$instruction_file"
        echo '```'
        echo ''
        echo '```rust test.rs'
        cat "$test_file"
        echo '```'
        echo '</CodeGroup>'
    } > "$output_file"

    echo "  Created: $output_file"
done

# =============================================================================
# ANCHOR PROGRAMS
# =============================================================================

ANCHOR_EXAMPLES_DIR="/home/tilo/Workspace/examples-light-token/program-examples/anchor/programs-sdk"

# Anchor recipes (output-name:anchor-dir-name)
# Some have different directory names (e.g., close-token-account uses 'close' dir)
ANCHOR_RECIPES=(
    "create-mint:create-mint"
    "mint-to:mint-to"
    "create-ata:create-ata"
    "create-token-account:create-token-account"
    "close-token-account:close"
    "transfer-interface:transfer-interface"
    "approve:approve"
    "revoke:revoke"
    "burn:burn"
    "freeze:freeze"
    "thaw:thaw"
    "transfer-checked:transfer-checked"
)

echo ""
echo "=== Processing Anchor program files ==="
echo ""

for mapping in "${ANCHOR_RECIPES[@]}"; do
    IFS=':' read -r output_name anchor_dir <<< "$mapping"

    echo "Processing: $output_name (dir: $anchor_dir)"

    output_dir="$SNIPPETS_DIR/$output_name/anchor-program"
    mkdir -p "$output_dir"

    lib_file="$ANCHOR_EXAMPLES_DIR/$anchor_dir/src/lib.rs"
    test_file="$ANCHOR_EXAMPLES_DIR/$anchor_dir/tests/test.rs"

    # Check lib file exists (required)
    if [ ! -f "$lib_file" ]; then
        echo "  WARNING: Not found - $lib_file"
        continue
    fi

    # Create CodeGroup MDX
    output_file="$output_dir/full-example.mdx"

    if [ -f "$test_file" ]; then
        # Both lib.rs and test.rs
        {
            echo '<CodeGroup>'
            echo '```rust lib.rs'
            cat "$lib_file"
            echo '```'
            echo ''
            echo '```rust test.rs'
            cat "$test_file"
            echo '```'
            echo '</CodeGroup>'
        } > "$output_file"
    else
        # Only lib.rs (no test file)
        {
            echo '```rust lib.rs'
            cat "$lib_file"
            echo '```'
        } > "$output_file"
        echo "  Note: No test file found, using lib.rs only"
    fi

    echo "  Created: $output_file"
done

# =============================================================================
# ANCHOR MACROS
# =============================================================================

ANCHOR_MACROS_DIR="/home/tilo/Workspace/examples-light-token/program-examples/anchor/macro-basics"

ANCHOR_MACRO_RECIPES=(
    "create-mint:create-mint-macro"
    "create-ata:create-ata-macro"
    "create-token-account:create-token-account-macro"
)

echo ""
echo "=== Processing Anchor Macro program files ==="
echo ""

for mapping in "${ANCHOR_MACRO_RECIPES[@]}"; do
    IFS=':' read -r output_name macro_dir <<< "$mapping"

    echo "Processing: $output_name (dir: $macro_dir)"

    output_dir="$SNIPPETS_DIR/$output_name/anchor-macro"
    mkdir -p "$output_dir"

    lib_file="$ANCHOR_MACROS_DIR/$macro_dir/src/lib.rs"
    test_file="$ANCHOR_MACROS_DIR/$macro_dir/tests/test.rs"

    if [ ! -f "$lib_file" ]; then
        echo "  WARNING: Not found - $lib_file"
        continue
    fi

    output_file="$output_dir/full-example.mdx"

    if [ -f "$test_file" ]; then
        {
            echo '<CodeGroup>'
            echo '```rust lib.rs'
            cat "$lib_file"
            echo '```'
            echo ''
            echo '```rust test.rs'
            cat "$test_file"
            echo '```'
            echo '</CodeGroup>'
        } > "$output_file"
    else
        {
            echo '```rust lib.rs'
            cat "$lib_file"
            echo '```'
        } > "$output_file"
    fi

    echo "  Created: $output_file"
done

echo ""
echo "Done! Created program snippets in: $SNIPPETS_DIR"
echo ""
echo "Files created:"
find "$SNIPPETS_DIR" -path "*-program/*.mdx" -type f | sort
find "$SNIPPETS_DIR" -path "*-macro/*.mdx" -type f | sort
