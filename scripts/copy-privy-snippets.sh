#!/bin/bash

# Script to copy TypeScript code from Light Token Privy examples to docs snippets.
# Source: examples-light-token/privy/{nodejs,react}
# Output: snippets/code-snippets/privy/{operation}/{nodejs,react}.mdx

NODEJS_SRC="/home/tilo/Workspace/examples-light-token/privy/nodejs/src"
REACT_SRC="/home/tilo/Workspace/examples-light-token/privy/react/src/hooks"
SNIPPETS_DIR="/home/tilo/Workspace/docs-main-reorder/snippets/code-snippets/privy"

# Operations to process
OPERATIONS=("transfer" "wrap" "unwrap" "balances" "transaction-history")

# Wrap TypeScript code in markdown code block, stripping "// --- main ---" runner section
wrap_typescript() {
    local input_file="$1"
    local output_file="$2"
    echo '```typescript' > "$output_file"
    sed '/^\/\/ --- main ---$/,$d' "$input_file" >> "$output_file"
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
wrap_typescript "$NODEJS_SRC/wrap.ts" "$SNIPPETS_DIR/wrap/nodejs.mdx"
wrap_typescript "$NODEJS_SRC/unwrap.ts" "$SNIPPETS_DIR/unwrap/nodejs.mdx"
wrap_typescript "$NODEJS_SRC/balances.ts" "$SNIPPETS_DIR/balances/nodejs.mdx"
wrap_typescript "$NODEJS_SRC/get-transaction-history.ts" "$SNIPPETS_DIR/transaction-history/nodejs.mdx"

# Process React operations (hooks)
echo ""
echo "Processing React operations..."
wrap_typescript "$REACT_SRC/useTransfer.ts" "$SNIPPETS_DIR/transfer/react.mdx"
wrap_typescript "$REACT_SRC/useWrap.ts" "$SNIPPETS_DIR/wrap/react.mdx"
wrap_typescript "$REACT_SRC/useUnwrap.ts" "$SNIPPETS_DIR/unwrap/react.mdx"
wrap_typescript "$REACT_SRC/useLightTokenBalances.ts" "$SNIPPETS_DIR/balances/react.mdx"
wrap_typescript "$REACT_SRC/useTransactionHistory.ts" "$SNIPPETS_DIR/transaction-history/react.mdx"

# Copy shared React helper
echo ""
echo "Processing shared helpers..."
mkdir -p "$SNIPPETS_DIR/helpers"
wrap_typescript "$REACT_SRC/signAndSendBatches.ts" "$SNIPPETS_DIR/helpers/sign-and-send-batches.mdx"

echo ""
echo "Done! Created snippets in: $SNIPPETS_DIR"
echo ""
echo "Files created:"
find "$SNIPPETS_DIR" -name "*.mdx" -type f | sort
