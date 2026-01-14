#!/bin/bash

# Script to copy zk-merkle-proof code from program-examples to docs/snippets
# Wraps each file in appropriate markdown code blocks

PROGRAM_EXAMPLES="/home/tilo/Workspace/program-examples/zk/zk-merkle-proof"
SNIPPETS_DIR="/home/tilo/Workspace/docs/snippets/code-snippets/zk/merkle-proof"

mkdir -p "$SNIPPETS_DIR"

wrap_code() {
    local input_file="$1"
    local output_file="$2"
    local lang="$3"
    echo "\`\`\`$lang" > "$output_file"
    cat "$input_file" >> "$output_file"
    echo '```' >> "$output_file"
    echo "Created: $output_file"
}

# Circuit
if [ -f "$PROGRAM_EXAMPLES/circuits/merkle_proof.circom" ]; then
    wrap_code "$PROGRAM_EXAMPLES/circuits/merkle_proof.circom" "$SNIPPETS_DIR/circuit.mdx" "javascript expandable"
fi

# Program
if [ -f "$PROGRAM_EXAMPLES/src/lib.rs" ]; then
    wrap_code "$PROGRAM_EXAMPLES/src/lib.rs" "$SNIPPETS_DIR/program.mdx" "rust expandable"
fi

# Rust client
if [ -f "$PROGRAM_EXAMPLES/tests/test.rs" ]; then
    wrap_code "$PROGRAM_EXAMPLES/tests/test.rs" "$SNIPPETS_DIR/rust-client.mdx" "rust expandable"
fi

# TypeScript client
if [ -f "$PROGRAM_EXAMPLES/ts-tests/merkle-proof.test.ts" ]; then
    wrap_code "$PROGRAM_EXAMPLES/ts-tests/merkle-proof.test.ts" "$SNIPPETS_DIR/typescript-client.mdx" "typescript expandable"
fi

echo ""
echo "Done! Created snippets in: $SNIPPETS_DIR"
find "$SNIPPETS_DIR" -name "*.mdx" -type f | sort
