#!/bin/bash

# Script to copy TypeScript code from Privy examples to docs/snippets/code-snippets/privy
# Wraps each file in typescript markdown code blocks

NODEJS_SRC="/home/tilo/Workspace/examples-zk-compression/privy/nodejs-privy-compressed/src"
REACT_SRC="/home/tilo/Workspace/examples-zk-compression/privy/react-privy-compressed/src/hooks"
SNIPPETS_DIR="/home/tilo/Workspace/docs/snippets/code-snippets/privy"

# Operations to process
OPERATIONS=("transfer" "compress" "decompress" "balances" "transaction-history")

# Function to wrap TypeScript code in markdown
wrap_typescript() {
    local input_file="$1"
    local output_file="$2"
    echo '```typescript' > "$output_file"
    cat "$input_file" >> "$output_file"
    echo '```' >> "$output_file"
    echo "Created: $output_file"
}

# Create snippet directories
for operation in "${OPERATIONS[@]}"; do
    mkdir -p "$SNIPPETS_DIR/$operation"
done

# Process Node.js operations
echo "Processing Node.js operations..."
wrap_typescript "$NODEJS_SRC/transfer.ts" "$SNIPPETS_DIR/transfer/nodejs.mdx"
wrap_typescript "$NODEJS_SRC/compress.ts" "$SNIPPETS_DIR/compress/nodejs.mdx"
wrap_typescript "$NODEJS_SRC/decompress.ts" "$SNIPPETS_DIR/decompress/nodejs.mdx"
wrap_typescript "$NODEJS_SRC/balances.ts" "$SNIPPETS_DIR/balances/nodejs.mdx"
wrap_typescript "$NODEJS_SRC/get-transaction-history.ts" "$SNIPPETS_DIR/transaction-history/nodejs.mdx"

# Process React operations (hooks)
echo ""
echo "Processing React operations..."
wrap_typescript "$REACT_SRC/useTransfer.ts" "$SNIPPETS_DIR/transfer/react.mdx"
wrap_typescript "$REACT_SRC/useCompress.ts" "$SNIPPETS_DIR/compress/react.mdx"
wrap_typescript "$REACT_SRC/useDecompress.ts" "$SNIPPETS_DIR/decompress/react.mdx"
wrap_typescript "$REACT_SRC/useCompressedBalances.ts" "$SNIPPETS_DIR/balances/react.mdx"
wrap_typescript "$REACT_SRC/useTransactionHistory.ts" "$SNIPPETS_DIR/transaction-history/react.mdx"

echo ""
echo "Done! Created snippets in: $SNIPPETS_DIR"
echo ""
echo "Files created:"
find "$SNIPPETS_DIR" -name "*.mdx" -type f | sort
