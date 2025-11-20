# MCP Command Template

Use this template for commands that query external services via Model Context Protocol (MCP).

## Template

```markdown
---
description: [WHAT + WHEN - emphasize precision/accuracy if relevant]
argument-hint: <question>
allowed-tools: mcp__service__*
---

# /command-name

Answer: $ARGUMENTS

[WHY: Explain importance of precision/accuracy for this domain]

## MANDATORY: Before ANY task execution

#### First, output your understanding and plan:
- Always make a plan before answering a prompt
- State how you understood the query
- Identify [data source/repository/service] scope
- Show the refined [question/query] you'll use

#### Then assess if clarification is needed:
If the question is vague, incomplete, or could have multiple interpretations, ask:
- What specific [component/feature/topic] are you working with?
- What problem are you trying to solve?
- What have you tried so far?
- What level of detail do you need (overview vs implementation)?

#### [Query] refinement checklist:
- Use exact [terms/names/identifiers] from [domain]
- Use specific [operations/verbs] ([precise action], not [vague action])
- Include concrete [references/examples/context] when available

### Step 1: [Analyze/Determine] [Scope/Source]

**[Source/Repository] mapping:**
- [Option A] → `service/repo-a`
- [Option B] → `service/repo-b`
- [Option C] → `service/repo-c`

Select appropriate source based on query content.

### Step 2: Query [Service Name]

For the appropriate [source], call in sequence:

**For [Source A]:**
- `mcp__service__[tool_1]("param")`
- `mcp__service__[tool_2]("param")`
- `mcp__service__[tool_3]("param", $ARGUMENTS)`

**For [Source B]:**
- `mcp__service__[tool_1]("param")`
- `mcp__service__[tool_2]("param")`
- `mcp__service__[tool_3]("param", $ARGUMENTS)`

**For complex questions:** Query multiple sources as needed.

### Step 3: Format Response with [Domain] Precision

Structure:
1. **Direct answer** - Immediate [domain] explanation
2. **[Domain] details** - Specific implementations, data structures
3. **Code examples** - With inline comments explaining key points
4. **Source references** - [References format] from [service]
5. **Related concepts** - Connections to other [domain concepts] (if relevant)

**Precision Rules:**

AVOID:
- Vague verbs: "handles", "manages", "processes", "enables", "provides"
- Abstract terms: "operations", "management", "coordination"
- Marketing language: "powerful", "seamless", "easy"
- Generic descriptions: [vague example] instead of [precise example]

USE:
- Exact [function/method/API] names: `[example1]()`, `[example2]()`
- Concrete data structures: `[Type1]`, `[Type2]`, `[Type3]`
- Specific operations: "[precise verb 1]", "[precise verb 2]", "[precise verb 3]"
- Precise [field/parameter] names: `[field1]`, `[field2]`, `[field3]`
- [Reference format] from [service] responses

**Cross-reference with:**
- [Documentation URL 1]
- [Documentation URL 2]
- [Source repository URL]

## Notes

- Always include source references from [service] responses
- Provide runnable code examples for implementation questions
- Ask follow-up questions to [service] for clarification when needed
```

---

## Creating Effective MCP Commands

### Before Writing (Evaluation-Driven)

1. **Test without the command first** - What does Claude miss?
2. **Identify 3 test scenarios** - Common, edge case, error case
3. **Write minimal instructions** - Address only the gaps

### MCP-Specific Setup

**Identify the MCP service and tools:**
```markdown
allowed-tools: mcp__service__*  # All tools from service
allowed-tools: mcp__service__tool1, mcp__service__tool2  # Specific tools only
```

**Define source/repository mapping** - What data sources exist and how to choose between them.

**Structure MCP call sequences** - Show call order for each source, include $ARGUMENTS in final query tool.

### MCP Call Formatting

**In nested markdown, use backticks (NOT triple backticks):**

❌ Don't use triple backticks (breaks outer code block):
```markdown
```
mcp__service__call("param")
```
```

✅ Use inline backticks:
```markdown
- `mcp__service__call("param")`
- `mcp__service__call("param", $ARGUMENTS)`
```

**For multiple calls, use bullet points:**
```markdown
**For [scenario]:**
- `tool_1("param")`
- `tool_2("param")`
- `tool_3("param", $ARGUMENTS)`
```

### Anti-Patterns to Avoid

**Vague queries**
```markdown
# Bad: "How does it work?"
# Good: "How does CompressedAccountMeta.new_init() create the account hash?"
```

**Missing precision rules**
```markdown
# Bad: No guidance on terminology
# Good: AVOID "handles proof" → USE "verifies proof against state root"
```

**Not using $ARGUMENTS**
```markdown
# Bad: ask_question("repo", "user question")
# Good: ask_question("repo", $ARGUMENTS)
```

**Triple backticks in nested markdown**
```markdown
# Bad: ```mcp__call()``` (breaks template)
# Good: `mcp__call()` (inline backticks)
```

### Testing Your Command

**Cross-model testing:**
- Test with Haiku (needs more explicit guidance)
- Test with Sonnet (balanced)
- Test with Opus (handles ambiguity better)
- Adjust instructions if Haiku struggles

### Storage

- **Project commands**: `.claude/commands/` (check into version control)
- **Personal commands**: `~/.claude/commands/` (user-specific)
- **Document required MCP server** in project README

---

## Complete Example

See `examples/ask-deepwiki.md` for a fully implemented MCP command following this template.
