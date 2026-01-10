#!/bin/bash

# Script to copy code from program-examples to docs/snippets/code-snippets
# Wraps each file in appropriate markdown code blocks

PROGRAM_EXAMPLES="/home/tilo/Workspace/program-examples/basic-operations"
SNIPPETS_DIR="/home/tilo/Workspace/docs/snippets/code-snippets"

# Operations to process
OPERATIONS=("create" "update" "close" "reinit" "burn")

# Create directories
for op in "${OPERATIONS[@]}"; do
    mkdir -p "$SNIPPETS_DIR/$op"
done

# Function to wrap code in markdown (no expandable - causes parsing errors in snippets)
wrap_rust() {
    local input_file="$1"
    local output_file="$2"
    echo '```rust' > "$output_file"
    cat "$input_file" >> "$output_file"
    echo '```' >> "$output_file"
    echo "Created: $output_file"
}

wrap_typescript() {
    local input_file="$1"
    local output_file="$2"
    echo '```typescript' > "$output_file"
    cat "$input_file" >> "$output_file"
    echo '```' >> "$output_file"
    echo "Created: $output_file"
}

# Process each operation
for op in "${OPERATIONS[@]}"; do
    echo "Processing: $op"

    # Anchor program (lib.rs)
    anchor_lib="$PROGRAM_EXAMPLES/anchor/$op/programs/$op/src/lib.rs"
    if [ -f "$anchor_lib" ]; then
        wrap_rust "$anchor_lib" "$SNIPPETS_DIR/$op/anchor-program.mdx"
    else
        echo "  WARNING: Not found - $anchor_lib"
    fi

    # Native program (lib.rs)
    native_lib="$PROGRAM_EXAMPLES/native/programs/$op/src/lib.rs"
    if [ -f "$native_lib" ]; then
        wrap_rust "$native_lib" "$SNIPPETS_DIR/$op/native-program.mdx"
    else
        echo "  WARNING: Not found - $native_lib"
    fi

    # TypeScript test
    ts_test="$PROGRAM_EXAMPLES/anchor/$op/tests/$op.ts"
    if [ -f "$ts_test" ]; then
        wrap_typescript "$ts_test" "$SNIPPETS_DIR/$op/typescript-client.mdx"
    else
        echo "  WARNING: Not found - $ts_test"
    fi

    # Rust test
    rust_test="$PROGRAM_EXAMPLES/anchor/$op/programs/$op/tests/test.rs"
    if [ -f "$rust_test" ]; then
        wrap_rust "$rust_test" "$SNIPPETS_DIR/$op/rust-client.mdx"
    else
        echo "  WARNING: Not found - $rust_test"
    fi
done

echo ""
echo "Done! Created snippets in: $SNIPPETS_DIR"
echo ""
echo "Files created:"
find "$SNIPPETS_DIR" -name "*.mdx" -type f | sort
