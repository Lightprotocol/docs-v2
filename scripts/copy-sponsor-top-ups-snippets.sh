#!/bin/bash

# Script to copy sponsor-rent-top-ups example code to docs snippets.
# Source: examples-light-token/toolkits/sponsor-rent-top-ups/{typescript,rust}
# Output: snippets/code-snippets/light-token/sponsor-rent-top-ups/{ts,rust}-instruction.mdx

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SRC="${EXAMPLES_LIGHT_TOKEN:?Set EXAMPLES_LIGHT_TOKEN to examples-light-token repo root}/toolkits/sponsor-rent-top-ups"
SNIPPETS_DIR="$SCRIPT_DIR/../snippets/code-snippets/light-token/sponsor-rent-top-ups"

mkdir -p "$SNIPPETS_DIR"

# --- TypeScript snippet ---
TS_OUT="$SNIPPETS_DIR/ts-instruction.mdx"

cat > "$TS_OUT" <<'HEADER'
```typescript title="sponsor-top-ups.ts"
HEADER
cat "$SRC/typescript/sponsor-top-ups.ts" >> "$TS_OUT"
echo '```' >> "$TS_OUT"

# Expandable setup
cat >> "$TS_OUT" <<'EXPAND_OPEN'

<Expandable title="Expandable example: setup.ts">

```typescript title="setup.ts"
EXPAND_OPEN
cat "$SRC/typescript/setup.ts" >> "$TS_OUT"
cat >> "$TS_OUT" <<'EXPAND_CLOSE'
```

</Expandable>
EXPAND_CLOSE

echo "Created: $TS_OUT"

# --- Rust snippet ---
RUST_OUT="$SNIPPETS_DIR/rust-instruction.mdx"

cat > "$RUST_OUT" <<'HEADER'
```rust title="sponsor-top-ups.rs"
HEADER
cat "$SRC/rust/sponsor-top-ups.rs" >> "$RUST_OUT"
echo '```' >> "$RUST_OUT"

# Expandable setup
cat >> "$RUST_OUT" <<'EXPAND_OPEN'

<Expandable title="Expandable example: setup.rs">

```rust title="setup.rs"
EXPAND_OPEN
cat "$SRC/rust/setup.rs" >> "$RUST_OUT"
cat >> "$RUST_OUT" <<'EXPAND_CLOSE'
```

</Expandable>
EXPAND_CLOSE

echo "Created: $RUST_OUT"

echo ""
echo "Done! Created snippets in: $SNIPPETS_DIR"
echo ""
echo "Files created:"
find "$SNIPPETS_DIR" -name "*.mdx" -type f | sort
