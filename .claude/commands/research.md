# Research Command Template

Use this template for multi-step information gathering and analysis tasks.

## Template

```markdown
---
description: [WHAT research it conducts] AND [WHEN to use it for research tasks]
argument-hint: <research-topic>
allowed-tools: [tools needed for research - Read, Grep, WebFetch, WebSearch, MCP tools]
---

# /command-name

Research: $ARGUMENTS

[WHY: Explain why systematic research matters for this domain]

## MANDATORY: Before ANY task execution

#### First, output your understanding and plan:
- Always make a plan before answering a prompt
- State how you understood the research question
- Identify research scope and boundaries
- Show refined research question with specific focus areas
- List sources you'll explore

#### Then assess if clarification is needed:
If the question is vague, incomplete, or could have multiple interpretations, ask:
- What specific aspects should be prioritized?
- What is the intended use of this research?
- What depth of detail is needed (overview vs deep dive)?
- Are there time constraints?
- What existing knowledge should this build on?

#### Research refinement checklist:
- Define clear scope boundaries (what's in/out)
- Identify specific questions to answer
- List authoritative sources to consult
- Determine success criteria

### Step 1: Scope and Plan Research

**Define scope:**
- Main question: [restatement of refined question]
- Sub-questions: [list specific questions to answer]
- Boundaries: [what's included/excluded]
- Sources: [where to look]

**Research strategy:**
1. [First source/approach]
2. [Second source/approach]
3. [Third source/approach]

### Step 2: Gather Information

**From [Source Type 1]:**
- [What to search/read]
- [What information to extract]

**From [Source Type 2]:**
- [What to query/fetch]
- [What information to extract]

**From [Source Type 3]:**
- [What to analyze/check]
- [What information to extract]

**As you research:**
- Follow promising leads
- Adjust approach based on findings
- Note conflicting information
- Prioritize authoritative sources
- Document sources for all findings

### Step 3: Synthesize and Analyze

**Synthesis:**
- Combine findings from multiple sources
- Identify patterns and themes
- Resolve conflicts or note discrepancies
- Draw connections between concepts

**Analysis:**
- Answer the main question
- Address each sub-question
- Assess confidence level
- Identify knowledge gaps

### Step 4: Format Findings

Structure the research output:

1. **Summary** - Key findings in 2-3 sentences

2. **Detailed Findings** - Organized by topic/question
   - [Finding 1] ([Source])
   - [Finding 2] ([Source])
   - [Finding 3] ([Source])

3. **[Domain-Specific Sections]**
   - Examples / Implementations
   - Best practices
   - Common pitfalls

4. **Sources** - All references consulted
   - [Source 1 with URL/path]
   - [Source 2 with URL/path]

5. **Gaps and Follow-ups** - What remains unclear
   - [Question/gap 1]
   - [Question/gap 2]

## Validation

Before presenting findings:
- [ ] Main question answered
- [ ] All sub-questions addressed
- [ ] Multiple sources consulted
- [ ] Sources documented
- [ ] Conflicts resolved or noted
- [ ] Confidence level assessed

## Notes

- [Research methodology notes]
- [Domain-specific considerations]
- [Where to find additional information]
```

---

## Creating Effective Research Commands

### Before Writing (Evaluation-Driven)

1. **Test without the command first** - What does Claude miss?
2. **Identify 3 test scenarios** - Common, edge case, error case
3. **Write minimal instructions** - Address only the gaps

### Research-Specific Setup

**Define research domain and sources:**
- What topics will this command research?
- What sources are authoritative?
- What tools are needed? (Read, Grep, WebFetch, WebSearch, MCP tools)

**Structure research methodology:**
- Logical flow (broad → specific, concept → implementation)
- Source hierarchy (official docs > implementation > discussions)
- Conflict resolution strategy

### Anti-Patterns to Avoid

❌ **Single-source research:**
```markdown
# Bad: Step 1: Search Google, Step 2: Use first result
# Good: Step 1: Official docs, Step 2: Source code, Step 3: Discussions, Step 4: Synthesize
```

❌ **Unstructured exploration:**
```markdown
# Bad: "Look around and see what you find"
# Good: "1. Official docs for concepts, 2. Source code for verification, 3. Examples for patterns"
```

❌ **No source attribution:**
```markdown
# Bad: "The system works by..."
# Good: "The system works by... (source: docs.example.com/api, src/core/system.ts:42)"
```

### Testing Your Research Command

**Cross-model testing:**
- Test with Haiku (needs more explicit guidance)
- Test with Sonnet (balanced)
- Test with Opus (handles ambiguity better)

**Scenario testing:**
- Well-documented topics (should find easily)
- Obscure topics (should identify gaps)
- Complex topics (should synthesize well)

### Storage

- **Project commands**: `.claude/commands/` (check into version control)
- **Personal commands**: `~/.claude/commands/` (user-specific)

---

## Complete Example

See `examples/research-zk-compression.md` for a fully implemented research command following this template.
