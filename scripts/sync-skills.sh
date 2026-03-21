#!/bin/bash
# Sync skills from agent-skills repo to docs-main/ai-tools/skills

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SOURCE="${AGENT_SKILLS_ROOT:?Set AGENT_SKILLS_ROOT to agent-skills repo root}/skills"
DEST="$SCRIPT_DIR/../ai-tools/skills"

rsync -av --delete "$SOURCE/" "$DEST/"

echo "Synced skills from agent-skills to docs-main/ai-tools/skills"
