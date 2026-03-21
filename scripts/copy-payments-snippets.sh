#!/bin/bash

# Script to copy TypeScript code from examples-light-token payments to docs snippets.
# Wraps each file in typescript markdown code blocks.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
EXAMPLES="${EXAMPLES_LIGHT_TOKEN:?Set EXAMPLES_LIGHT_TOKEN to examples-light-token repo root}/toolkits/payments"
SNIPPETS_DIR="$SCRIPT_DIR/../snippets/code-snippets/payments"

# Function to wrap TypeScript code in markdown
wrap_typescript() {
    local input_file="$1"
    local output_file="$2"
    mkdir -p "$(dirname "$output_file")"
    echo '```typescript' > "$output_file"
    cat "$input_file" >> "$output_file"
    echo '```' >> "$output_file"
    echo "Created: $output_file"
}

# Send examples
echo "Processing: send/"
for file in basic-send-action basic-send-instruction batch-send payment-with-memo sign-all-transactions; do
    src="$EXAMPLES/send/$file.ts"
    if [ -f "$src" ]; then
        wrap_typescript "$src" "$SNIPPETS_DIR/send/$file.mdx"
    else
        echo "  WARNING: Not found - $src"
    fi
done

# Receive examples
echo "Processing: receive/"
src="$EXAMPLES/receive/receive.ts"
if [ -f "$src" ]; then
    wrap_typescript "$src" "$SNIPPETS_DIR/receive/receive.mdx"
else
    echo "  WARNING: Not found - $src"
fi

# Verify examples
echo "Processing: verify/"
for file in get-balance get-history verify-address; do
    src="$EXAMPLES/verify/$file.ts"
    if [ -f "$src" ]; then
        wrap_typescript "$src" "$SNIPPETS_DIR/verify/$file.mdx"
    else
        echo "  WARNING: Not found - $src"
    fi
done

# Spend permissions examples
echo "Processing: spend-permissions/"
for file in delegate-approve delegate-revoke delegate-check delegate-full-flow; do
    src="$EXAMPLES/spend-permissions/$file.ts"
    if [ -f "$src" ]; then
        wrap_typescript "$src" "$SNIPPETS_DIR/spend-permissions/$file.mdx"
    else
        echo "  WARNING: Not found - $src"
    fi
done

# Interop examples
echo "Processing: interop/"
for file in wrap unwrap register-spl-mint; do
    src="$EXAMPLES/interop/$file.ts"
    if [ -f "$src" ]; then
        wrap_typescript "$src" "$SNIPPETS_DIR/interop/$file.mdx"
    else
        echo "  WARNING: Not found - $src"
    fi
done

echo ""
echo "Done! Created snippets in: $SNIPPETS_DIR"
echo ""
echo "Files created:"
find "$SNIPPETS_DIR" -name "*.mdx" -type f | sort