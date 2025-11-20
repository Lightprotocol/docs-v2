---
name: prompt-template
description: Generate structured implementation prompts for SDK integration, API setup, or feature implementation. Use when user wants to create a prompt for implementing something in their codebase.
---

# Prompt Template Skill

## When to Use

User says:
- "create a prompt for [SDK/feature]"
- "help me write a prompt to implement [X]"
- "I need to integrate [library]"
- Shows you documentation and wants an implementation prompt

## Core Purpose

Transform documentation into structured implementation prompts that:
- Extract exact technical requirements from source
- Gather user's application context
- Generate copy-paste ready prompts for any LLM

## Process

### Step 1: Identify Source Documentation

Ask:
1. What is the official documentation URL?
2. What specific page/section covers this?
3. What is the source code directory URL? (GitHub folder/file)
4. Any GitHub repos with examples?

### Step 2: Read Documentation and Extract

From the source documentation, extract:
- **Installation**: Exact commands with versions
- **Imports**: Exact import statements
- **Configuration**: All options with types
- **Initialization**: Complete working example
- **Key APIs**: Core methods/functions needed

### Step 3: Gather User Context

Ask about their application:
1. **Framework**: React/Next.js/Express/Rust/etc.?
2. **Language**: TypeScript/JavaScript/Rust? Version?
3. **Service organization**: How do they structure clients/services?
4. **Environment management**: .env files, config service, other?
5. **Error handling**: try/catch, error types, logging pattern?
6. **Type system**: TypeScript? Strict mode?

### Step 4: Generate Structured Prompt

Use the template from resources/implementation-prompt-template.md

Fill in:
- Task overview (one sentence)
- User's tech stack context
- Technical requirements extracted from docs
- Specific implementation deliverables
- Documentation references with exact URLs

### Step 5: Validate

Before delivering, check:
- [ ] Source documentation URL included (specific page, not homepage)
- [ ] Source code directory URL included (GitHub folder/file where implemented)
- [ ] Technical requirements from official docs (not assumptions)
- [ ] User context gathered (or questions asked)
- [ ] Installation commands include versions
- [ ] Initialization example is complete working code
- [ ] Deliverables are specific and actionable
- [ ] No assumptions about user's patterns

## Key Principles

1. **Never assume** - Always ask about user's patterns
2. **Extract from source** - Get technical details from official docs, not memory
3. **Be specific** - No vague requests like "set up properly"
4. **Include WHY** - Context about why patterns matter from docs
5. **Link precisely** - Reference exact documentation pages

## Example Templates

Load resources/implementation-prompt-template.md for:
- SDK Client Setup (like Grid, ZK Compression)
- API Integration (REST, GraphQL)
- Feature Implementation (new functionality)
- Migration (library upgrade, framework switch)

## Integration

- Use alongside zk-compression-terminology for ZK Compression specific prompts
- Reference technical precision patterns from CLAUDE.md
- Follow progressive disclosure: only load full template when generating