# Freedom Levels (Optional Guidance)

How prescriptive should your command instructions be? Match the freedom level to task fragility.

## Core Concept

**Freedom level** = How much flexibility Claude has in execution

- **Low freedom**: Exact sequences, no deviation
- **Medium freedom**: Structured templates with parameters
- **High freedom**: Exploratory approaches

**Source**: Anthropic Agent Skills Best Practices

## The Three Levels

### Low Freedom (Exact Sequences)

**Use when:**
- Database migrations
- Security operations
- Destructive actions (rm, force push)
- Compliance-critical operations
- Multi-step dependencies

**Characteristics:**
- Step-by-step exact commands
- No decision points
- Explicit ordering
- Clear validation checkpoints
- Rollback instructions

**Example: `/commit` command**
```markdown
### Step 2: Execute Commit

Run these commands in exact sequence:

1. Stage changes:
   - `git add [specific files]`

2. Create commit:
   - `git commit -m "$(cat <<'EOF'
   [Commit message]

   Co-Authored-By: Claude <noreply@anthropic.com>
   EOF
   )"`

3. Verify:
   - `git status`

**Do NOT:**
- Skip any step
- Reorder operations
- Use --amend without checking authorship
```

**When to use:**
- Fragile operations that break if done wrong
- Security-sensitive tasks
- Operations requiring exact sequences

### Medium Freedom (Structured Flexibility)

**Use when:**
- Code generation from templates
- Component creation
- Configuration tasks
- Report generation
- Testing workflows

**Characteristics:**
- Template/pattern to follow
- Customization parameters
- Decision points with guidance
- Structured but adaptable

**Example: `/create-component` command**
```markdown
### Step 2: Generate Component

Use this structure and customize as needed:

```typescript
interface [ComponentName]Props {
  // Add props based on requirements
}

export function [ComponentName]({ ...props }: [ComponentName]Props) {
  // Implementation varies by:
  // - State management needs
  // - Event handlers required
  // - Styling approach

  return (
    // JSX structure follows project patterns
  );
}
```

**Customize:**
- Props based on user requirements
- State management (useState, useReducer, store)
- Styling (CSS modules, styled-components, tailwind)
- Event handlers as needed

**Follow project patterns:**
- File naming: PascalCase.tsx
- Export style: named exports
- Testing: create ComponentName.test.tsx
```

**When to use:**
- Preferred pattern exists
- Some variation is acceptable
- Configuration affects behavior
- Multiple valid approaches

### High Freedom (Exploratory)

**Use when:**
- Research tasks
- Debugging unknown issues
- Creative work
- Open-ended analysis
- Learning new codebases

**Characteristics:**
- Goal-oriented instructions
- Multiple approach options
- Iterative refinement
- Exploration encouraged

**Example: `/research` command**
```markdown
### Step 2: Conduct Research

Explore multiple approaches to answer the question:

**Strategies to consider:**
1. Search documentation for official guidance
2. Query code repositories for implementations
3. Check recent issues/discussions for context
4. Review examples and patterns
5. Cross-reference multiple sources

**As you research:**
- Follow promising leads
- Adjust approach based on findings
- Synthesize information from multiple sources
- Note conflicting information
- Prioritize authoritative sources

**Output:**
- Key findings with sources
- Multiple perspectives if relevant
- Confidence level in answer
- Gaps in available information
```

**When to use:**
- No clear single approach
- Exploration needed
- Creative solutions wanted
- Learning objectives

## Choosing the Right Level

### Decision Framework

Ask yourself:

1. **What's the risk of deviation?**
   - High risk → Low freedom
   - Medium risk → Medium freedom
   - Low risk → High freedom

2. **Is there a required sequence?**
   - Yes, strict → Low freedom
   - Yes, flexible → Medium freedom
   - No → High freedom

3. **Are multiple approaches valid?**
   - No, one way only → Low freedom
   - Yes, within patterns → Medium freedom
   - Yes, many ways → High freedom

4. **What's the task fragility?**
   - Breaks easily → Low freedom
   - Adaptable → Medium freedom
   - Resilient → High freedom

### Mixed Approaches

Commands can mix freedom levels across steps:

```markdown
### Step 1: Validate Requirements (Low Freedom)
[Exact validation steps]

### Step 2: Generate Solution (Medium Freedom)
[Template with customization]

### Step 3: Research Edge Cases (High Freedom)
[Exploratory investigation]
```


## Common Mistakes

❌ **Too restrictive for creative tasks:**
```markdown
### Research Architecture Patterns

Step 1: Search for "microservices"
Step 2: Read first result
Step 3: Summarize in 3 sentences
```
This should be high freedom exploration.

❌ **Too loose for critical operations:**
```markdown
### Deploy to Production

Deploy the application using appropriate methods.
```
This should be low freedom with exact steps.

❌ **No guidance for medium tasks:**
```markdown
### Create Component

Make a component.
```
Needs template and customization guidance.

## Notes

- Optional guidance for command creators, not mandatory pattern
- Can mix levels across different steps
- Default to medium freedom if unsure

---

## Examples

See `examples/freedom-levels-implementations.md` for detailed examples of each level.
