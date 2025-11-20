# Plan-First Pattern

Show understanding and create a plan before executing any task. This gives users visibility and prevents incorrect assumptions.

## Core Principle

**Output first, execute second.**

Claude should:
1. State its understanding of the request
2. Show the plan it will follow
3. Ask for clarification if needed
4. THEN proceed with execution

## Pattern Structure

```markdown
### Step 1: [Analyze/Understand/Plan] [Subject]

#### First, output your understanding and plan:
- [What you identified about the scope]
- [What you'll do/query/create]
- [Refined version of the request]

#### Then assess if clarification is needed:
[Specific questions if request is vague]

[Repository mapping / domain-specific guidance]

#### [Action] checklist:
- [Specific requirement 1]
- [Specific requirement 2]
- [Specific requirement 3]
```

## Why This Works

From Anthropic: "Claude performs best when it has a clear target to iterate against"

**Benefits:** User sees interpretation before execution, enables early correction, prevents wasted tool calls, separates planning from execution.

## Integration with Mandatory Pattern

Plan-first is **part of** the mandatory execution pattern:

```markdown
## MANDATORY: Before ANY task execution

#### First, output your understanding and plan:
[Plan-first pattern goes here]

#### Then assess if clarification is needed:
[Clarification questions]
```

Relationship:
- Mandatory pattern = overall structure
- Plan-first = specific implementation of "output understanding"

## Anti-Patterns

❌ **Jumping straight to execution:**
```markdown
### Step 1: Query DeepWiki
Call `mcp__deepwiki__ask_question(...)`
```

✅ **Plan first:**
```markdown
### Step 1: Analyze and Create Plan

#### First, output your understanding:
- Repository: Lightprotocol/light-protocol (ZK Compression question)
- Query: "How does ValidityProof verification work?"

#### Then assess if clarification needed:
[questions if vague]

### Step 2: Query DeepWiki
Call `mcp__deepwiki__ask_question(...)`
```

❌ **Vague planning:**
```markdown
I'll search for information about the topic.
```

✅ **Specific planning:**
```markdown
I'll query three sources:
1. DeepWiki for implementation details
2. Public docs for conceptual overview
3. GitHub for code examples
Refined query: "How does CompressedAccountMeta structure validation work in state compression?"
```

## Validation Checklist

Good plan-first output includes:
- [ ] Clear statement of understanding
- [ ] Specific steps to follow
- [ ] Refined/clarified version of request
- [ ] Targeted clarification questions (if needed)
- [ ] Domain-specific guidance/mapping

## Notes

- Particularly critical for MCP commands (prevent wasted API calls)
- Short plans for simple tasks, detailed plans for complex ones
- Always output the plan as TEXT, not as tool calls or comments

---

## Example

See `examples/ask-deepwiki-plan-first.md` for a complete implementation.