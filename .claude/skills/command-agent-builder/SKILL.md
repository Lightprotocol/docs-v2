---
name: command-agent-builder
description: Building Claude Code commands and agents following Anthropic best practices. Use PROACTIVELY when user wants to create or optimize commands, agents, or workflows. Validates $ARGUMENTS usage, removes meta-instructions, ensures plan-first patterns, and enforces technical precision.
---

# Command & Agent Builder

Create and optimize Claude Code commands and agents following Anthropic's official best practices.

## When to Use This Skill

Use PROACTIVELY when:
- User wants to create a new command or agent
- User asks to optimize or validate existing commands
- User mentions "slash command", "custom command", or "agent"
- Creating workflows that need best practice validation

## Quick Navigation

- **Patterns**: [mandatory-execution.md](patterns/mandatory-execution.md), [plan-first.md](patterns/plan-first.md), [freedom-levels.md](patterns/freedom-levels.md)
- **Templates**: [basic-command.md](templates/basic-command.md), [mcp-command.md](templates/mcp-command.md), [research-command.md](templates/research-command.md), [agent-template.md](templates/agent-template.md)
- **Validation**: [checklist.md](validation/checklist.md), [examples.md](validation/examples.md)

---

## Creation Workflow

### Step 1: Understand the Request

Output your understanding:
- What type of artifact (command vs agent)?
- What is its purpose (single responsibility)?
- What complexity level (basic, MCP, research, agent)?

### Step 2: Gather Context Interactively

Ask these questions to gather complete context:

**1. Type Selection:**
```
What are you creating?
1. Basic command (single purpose, no external tools)
2. MCP-enabled command (queries external services)
3. Research command (multi-step information gathering)
4. Sub-agent (autonomous specialized task handler)
```

**2. Core Details:**
- **Primary purpose**: What does it do? (single, clear responsibility)
- **Trigger conditions**: When should it be used/activated?
- **Arguments needed**: Does it need user input? (→ $ARGUMENTS + argument-hint)
- **WHY context**: Why is this approach/precision/pattern important?

**3. Behavior Configuration:**
- **Clarification questions**: Does it need to ask for more details? (→ plan-first pattern)
- **Tools required**: What tools does it need? (→ allowed-tools with least privilege)
- **Freedom level**: How prescriptive should instructions be?
  - Low: Exact sequences (migrations, security ops)
  - Medium: Structured flexibility (code generation, templates)
  - High: Exploratory (research, debugging)

**4. Scope:**
- **Project** (.claude/commands/ or .claude/agents/): Shared with team via git
- **User** (~/.claude/commands/ or ~/.claude/agents/): Personal only

### Step 3: Select Template and Generate

Based on type selection, use appropriate template:

1. **Basic command** → [templates/basic-command.md](templates/basic-command.md)
2. **MCP command** → [templates/mcp-command.md](templates/mcp-command.md)
3. **Research command** → [templates/research-command.md](templates/research-command.md)
4. **Sub-agent** → [templates/agent-template.md](templates/agent-template.md)

Fill in:
- ✅ YAML frontmatter (description with WHAT + WHEN)
- ✅ $ARGUMENTS placeholder (if needs input)
- ✅ WHY context (explain importance)
- ✅ MANDATORY execution pattern from [patterns/mandatory-execution.md](patterns/mandatory-execution.md)
- ✅ Plan-first pattern from [patterns/plan-first.md](patterns/plan-first.md) (if needs clarification)
- ✅ Tool permissions (allowed-tools with least privilege)
- ✅ Validation steps

### Step 4: Validate Against Checklist

Run through [validation/checklist.md](validation/checklist.md):

**Structure:**
- [ ] YAML frontmatter present (name, description)
- [ ] Description includes WHAT + WHEN
- [ ] Uses $ARGUMENTS (not "your question" or placeholders)
- [ ] No meta-instructions ("When invoked...", "read this file...")
- [ ] Includes WHY context
- [ ] MANDATORY pattern present

**Instructions:**
- [ ] Direct, explicit instructions (not passive)
- [ ] Active verbs throughout
- [ ] Proper code formatting (backticks for inline, avoid triple backticks in nested markdown)
- [ ] Technical precision (specific verbs, exact names)

**Tool Configuration:**
- [ ] allowed-tools specified (if using tools)
- [ ] Least privilege principle applied

**Agent-Specific:**
- [ ] Single clear responsibility
- [ ] Proactive activation language ("Use PROACTIVELY when...")
- [ ] Detailed system prompt with examples

### Step 5: Output and Provide Usage

Generate the complete file content and provide:
1. **File path**: Where to save it
2. **Complete content**: Ready to copy-paste
3. **Example usage**: How to invoke it
4. **Testing notes**: Multi-model testing reminder (Haiku, Sonnet, Opus)

---

## Optimization Workflow

For existing commands/agents:

### Step 1: Read Current Content

Use Read tool to get current file content.

### Step 2: Validate Against Checklist

Run through [validation/checklist.md](validation/checklist.md) and identify issues.

### Step 3: Provide Specific Improvements

For each issue found, provide:
- **What's wrong**: Specific line or pattern
- **Why it matters**: Impact on Claude's behavior
- **How to fix**: Exact replacement using Edit tool
- **Example**: Good vs bad from [validation/examples.md](validation/examples.md)

### Step 4: Apply Fixes

Use Edit tool to apply improvements systematically.

---

## Key Best Practices Reference

**From Anthropic Documentation:**

1. **$ARGUMENTS for parameters** - Never use placeholder text like "your question"
2. **No meta-instructions** - Don't explain what the command file is
3. **WHY context first** - Explain why the approach matters
4. **Plan-first for complex tasks** - Output understanding before executing
5. **Least privilege tools** - Only grant necessary tool access
6. **Single responsibility** - Clear, narrow purpose per command/agent
7. **Proactive activation** - Use "PROACTIVELY" in descriptions
8. **Under 500 lines** - Keep SKILL.md concise, separate details

**Common Anti-Patterns to Avoid:**

❌ `"your question"` → ✅ `$ARGUMENTS`
❌ `When invoked: 1. read this file...` → ✅ Direct instructions
❌ Vague: "handles", "manages", "processes" → ✅ Specific: "verifies proof", "nullifies hash"
❌ No WHY context → ✅ "Precision is critical because..."
❌ All tools allowed → ✅ allowed-tools: mcp__specific__*

---

## Examples from This Project

**Good Example:** `/ask-deepwiki` command
- Uses $ARGUMENTS for question
- Includes WHY context (precision matters)
- Plan-first pattern (output understanding)
- Specific tool permissions (mcp__deepwiki__*)
- Technical precision rules

**Patterns Used:**
- MANDATORY execution pattern
- Plan-first approach
- Clarification questions
- Freedom level: Medium (structured but flexible)

---

## Progressive Disclosure

This SKILL.md provides overview and workflow. For detailed guidance:

- **[patterns/mandatory-execution.md](patterns/mandatory-execution.md)** - Full MANDATORY pattern to include
- **[patterns/plan-first.md](patterns/plan-first.md)** - Plan-first approach details
- **[patterns/freedom-levels.md](patterns/freedom-levels.md)** - Instruction prescriptiveness guidance
- **[templates/*.md](templates/)** - Ready-to-use templates
- **[validation/checklist.md](validation/checklist.md)** - Complete validation checklist
- **[validation/examples.md](validation/examples.md)** - Good vs bad examples
---

## Notes

- Commands are Markdown files that become prompts
- Agents are specialized subagents with tool access
- Store project-level in .claude/ (shared via git)
- Store personal in ~/.claude/ (user-only)
- Iterate based on actual usage, not assumptions