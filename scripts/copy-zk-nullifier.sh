#!/bin/bash

# Script to copy zk-nullifier code from program-examples to docs/snippets

PROGRAM_EXAMPLES="/home/tilo/Workspace/program-examples/zk/zk-nullifier"
SNIPPETS_DIR="/home/tilo/Workspace/docs/snippets/code-snippets/zk/nullifier"

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
if [ -f "$PROGRAM_EXAMPLES/circuits/nullifier.circom" ]; then
    wrap_code "$PROGRAM_EXAMPLES/circuits/nullifier.circom" "$SNIPPETS_DIR/circuit.mdx" "javascript expandable"
fi

# Program
if [ -f "$PROGRAM_EXAMPLES/programs/zk-nullifier/src/lib.rs" ]; then
    wrap_code "$PROGRAM_EXAMPLES/programs/zk-nullifier/src/lib.rs" "$SNIPPETS_DIR/program.mdx" "rust expandable"
fi

# Rust client (unified)
if [ -f "$PROGRAM_EXAMPLES/programs/zk-nullifier/tests/test.rs" ]; then
    wrap_code "$PROGRAM_EXAMPLES/programs/zk-nullifier/tests/test.rs" "$SNIPPETS_DIR/rust-client.mdx" "rust expandable"
fi

# TypeScript client
if [ -f "$PROGRAM_EXAMPLES/ts-tests/nullifier.test.ts" ]; then
    wrap_code "$PROGRAM_EXAMPLES/ts-tests/nullifier.test.ts" "$SNIPPETS_DIR/typescript-client.mdx" "typescript expandable"
fi

echo ""
echo "Done! Created snippets in: $SNIPPETS_DIR"
find "$SNIPPETS_DIR" -name "*.mdx" -type f | sort
