#!/bin/bash

# Script to copy TypeScript code from wallet adapter React hooks to docs snippets.
# Source: examples-light-token/toolkits/sign-with-wallet-adapter/react/src/hooks
# Output: snippets/code-snippets/wallet-adapter/{operation}/react.mdx

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REACT_SRC="${EXAMPLES_LIGHT_TOKEN:?Set EXAMPLES_LIGHT_TOKEN to examples-light-token repo root}/toolkits/sign-with-wallet-adapter/react/src/hooks"
SNIPPETS_DIR="$SCRIPT_DIR/../snippets/code-snippets/wallet-adapter"

# Operations to process
OPERATIONS=("transfer" "receive" "wrap" "unwrap" "balances" "transaction-history")

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

# Process React operations (hooks)
echo "Processing React hooks..."
wrap_typescript "$REACT_SRC/useTransfer.ts" "$SNIPPETS_DIR/transfer/react.mdx"
wrap_typescript "$REACT_SRC/useReceive.ts" "$SNIPPETS_DIR/receive/react.mdx"
wrap_typescript "$REACT_SRC/useWrap.ts" "$SNIPPETS_DIR/wrap/react.mdx"
wrap_typescript "$REACT_SRC/useUnwrap.ts" "$SNIPPETS_DIR/unwrap/react.mdx"
wrap_typescript "$REACT_SRC/useUnifiedBalance.ts" "$SNIPPETS_DIR/balances/react.mdx"
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
