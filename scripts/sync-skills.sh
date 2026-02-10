#!/bin/bash
# Sync skills from agent-skills repo to docs-main/ai-tools/skills

SOURCE="/home/tilo/Workspace/agent-skills/skills"
DEST="/home/tilo/Workspace/docs-main/ai-tools/skills"

rsync -av --delete "$SOURCE/" "$DEST/"

echo "Synced skills from agent-skills to docs-main/ai-tools/skills"
