# Agent (Sub-Agent) Template

Use this template for creating autonomous sub-agents with specialized responsibilities.

## Template

```markdown
---
name: agent-name
description: [WHAT it does] AND [WHEN to use - include "Use PROACTIVELY when..." for automatic triggering]
allowed-tools: [Least privilege - only tools needed for this specific responsibility]
---

# Agent: [Name]

**Single Responsibility:** [Clear, narrow purpose statement]

[WHY: Explain why this agent exists and why automation/specialization matters]

## MANDATORY: Before ANY task execution

#### First, output your understanding and plan:
- Always make a plan before answering a prompt
- State how you understood the task
- Identify [domain-specific context]
- Show your planned approach with specific steps

#### Then assess if clarification is needed:
If the task is vague, incomplete, or could have multiple interpretations, ask:
- [Domain-specific question 1]
- [Domain-specific question 2]
- [Domain-specific question 3]
- What level of detail/thoroughness is expected?

#### [Task] refinement checklist:
- [Specific requirement 1]
- [Specific requirement 2]
- [Specific requirement 3]

## Workflow

### Step 1: Validate and Understand

**Validate inputs:**
- [What to check before starting]
- [Prerequisites that must be met]
- [Constraints to verify]

**Understand context:**
- [What context to gather]
- [What to analyze]
- [What patterns to identify]

### Step 2: Execute [Primary Task]

[Detailed instructions with specific steps]

[Decision points with clear criteria]

[Examples showing expected behavior]

**As you work:**
- [Guideline 1]
- [Guideline 2]
- [Guideline 3]

### Step 3: Verify and Report

**Verification checklist:**
- [ ] [Quality check 1]
- [ ] [Quality check 2]
- [ ] [Quality check 3]

**Report:**
- What was done
- What worked well
- What issues encountered
- What requires attention

## Examples

### Example 1: [Scenario]

**Input:** [What the agent receives]

**Process:**
1. [Step taken]
2. [Step taken]
3. [Step taken]

**Output:** [What the agent produces]

### Example 2: [Another Scenario]

**Input:** [What the agent receives]

**Process:**
1. [Step taken]
2. [Step taken]
3. [Step taken]

**Output:** [What the agent produces]

## Constraints and Security

**What this agent MUST NOT do:**
- [Constraint 1 - with reason]
- [Constraint 2 - with reason]
- [Constraint 3 - with reason]

**Security considerations:**
- [Security rule 1]
- [Security rule 2]
- [Security rule 3]

**Error handling:**
- If [error condition]: [how to handle]
- If [error condition]: [how to handle]
- If uncertain: Stop and ask user

## Tool Usage

**Allowed tools:** [list from frontmatter]

**Tool usage guidelines:**
- [Tool 1]: Use for [specific purpose]
- [Tool 2]: Use for [specific purpose]
- [Tool 3]: Use when [specific condition]

**Forbidden operations:**
- Do not [dangerous operation] without confirmation
- Do not [destructive action] without backup
- Do not [sensitive operation] without validation

## Notes

- [Important reminder 1]
- [Important reminder 2]
- [Known limitations]
- [When to delegate to user]
```

---

## Creating Effective Agents

### Before Writing (Evaluation-Driven)

1. **Test without the agent first** - What does Claude miss?
2. **Identify 3 test scenarios** - Common, edge case, error case
3. **Write minimal instructions** - Address only the gaps

### Appropriate Degrees of Freedom

Match instruction specificity to task fragility:

**Low Freedom (Exact Scripts)** - Error-prone operations
```bash
#!/bin/bash
npm run build && npm test && git push origin main
```

**Medium Freedom (Pseudocode)** - Preferred patterns with flexibility
```typescript
function generate${ComponentName}() {
  // 1. Create interface | 2. Implement [features] | 3. Add tests
}
```

**High Freedom (Text Instructions)** - Exploratory tasks
```markdown
Investigate [topic] by analyzing codebase, checking docs, proposing solutions
```

### Progressive Disclosure

Keep agent file under 500 lines:
```
.claude/agents/agent-name/
├── agent.md           # Main (<500 lines)
├── scripts/           # Validation (0 tokens until used)
└── examples/          # Extended examples (reference when needed)
```

Reference with: `bash scripts/validate.sh` or `cat examples/scenario-1.md`

**Why:** Files consume 0 tokens until explicitly loaded.

### Anti-Patterns to Avoid

**Assuming pre-installed packages**
```markdown
# Bad: Run pytest
# Good: Verify pytest installed, if not: pip install pytest, then run
```

**Windows paths**
```markdown
# Bad: C:\scripts\validate.bat
# Good: scripts/validate.sh
```

**Deeply nested references**
```markdown
# Bad: See reference.md → see details.md → see examples.md
# Good: See examples/code-review-example.md (one level deep)
```

**Excessive options without defaults**
```markdown
# Bad: Choose format: JSON, YAML, TOML, XML, CSV, or custom
# Good: Output as JSON (override with --format flag if needed)
```

**Vague descriptions**
```markdown
# Bad: description: Helper agent for code tasks
# Good: description: Reviews code for security vulnerabilities. Use PROACTIVELY after authentication/database code is written.
```

### Testing Your Agent

**Cross-model testing:**
- Test with Haiku (needs more explicit guidance)
- Test with Sonnet (balanced)
- Test with Opus (handles ambiguity better)
- Adjust instructions if Haiku struggles

### Agent vs Command

**Use agent when:**
- Task needs autonomous execution
- Multiple steps with decision points
- Should activate automatically
- Needs tool access control

**Use command when:**
- User explicitly invokes
- Needs user input ($ARGUMENTS)
- Simpler workflow
- More user interaction

### Storage

- **Project agents**: `.claude/agents/` (check into version control)
- **Personal agents**: `~/.claude/agents/` (user-specific)

---

## Complete Example

See `examples/code-reviewer.md` for a fully implemented agent following this template.
