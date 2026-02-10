#!/bin/bash
# Sync AI prompts from ai-tools to docs snippets (flattened)

SOURCE="/home/tilo/Workspace/ai-tools/prompts"
DEST="/home/tilo/Workspace/docs/snippets/ai-prompts"

# Copy all MDX files, flattening directory structure
find "$SOURCE" -name "*.mdx" -exec cp {} "$DEST/" \;

echo "Synced $(find "$SOURCE" -name "*.mdx" | wc -l) prompts to $DEST"
