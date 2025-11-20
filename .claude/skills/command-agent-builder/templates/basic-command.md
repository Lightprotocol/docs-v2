# Basic Command Template

Use this template for simple, single-purpose commands that don't require external tools.

## Template

```markdown
---
description: [WHAT it does] AND [WHEN to use it - be explicit about triggering conditions]
argument-hint: <param>
---

# /command-name

[Task]: $ARGUMENTS

[WHY context: Explain why this approach/precision/pattern matters]

## MANDATORY: Before ANY task execution

#### First, output your understanding and plan:
- Always make a plan before answering a prompt
- State how you understood the query
- [Domain-specific understanding points]

#### Then assess if clarification is needed:
If the question is vague, incomplete, or could have multiple interpretations, ask:
- [Domain-specific question 1]
- [Domain-specific question 2]
- [Domain-specific question 3]
- What level of detail do you need (overview vs implementation)?

#### [Action] refinement checklist:
- [Specific requirement 1]
- [Specific requirement 2]
- [Specific requirement 3]

### Step 1: [Active verb] [What]

[Direct, explicit instructions]

[If needed: provide options or decision points]

### Step 2: [Active verb] [What]

[Direct, explicit instructions]

[If applicable: validation steps]

### Step 3: [Active verb] [What]

[Direct, explicit instructions]

[If applicable: output formatting]

## Validation

Before finalizing:
- [Checkpoint 1]
- [Checkpoint 2]
- [Checkpoint 3]

## Notes

- [Key reminder 1]
- [Key reminder 2]
- [Cross-references to documentation]
```

---

## Creating Effective Commands

### Before Writing (Evaluation-Driven)

1. **Test without the command first** - What does Claude miss?
2. **Identify 3 test scenarios** - Common, edge case, error case
3. **Write minimal instructions** - Address only the gaps

### Appropriate Degrees of Freedom

Commands typically use **medium freedom** - clear steps with flexibility.

**Adjust based on task fragility:**
```bash
# Low freedom (critical operations)
git add . && git commit -m "message" && git push origin main

# Medium freedom (most commands)
Run formatter on $ARGUMENTS:
- JavaScript/TypeScript: prettier --write
- Python: black
- Verify with git diff

# High freedom (exploratory)
Analyze $ARGUMENTS for patterns and suggest improvements
```

### Progressive Disclosure

For complex commands, organize supporting files:
```
.claude/commands/
├── command-name.md          # Main command (<300 lines)
├── scripts/
│   └── validate.sh          # Executable helpers
└── templates/
    └── output-template.txt  # Output formatting
```

Reference with: `bash scripts/validate.sh` or `cat templates/output-template.txt`

### Anti-Patterns to Avoid

**Vague descriptions**
```markdown
# Bad: description: Format code
# Good: description: Format code according to project style guide. Use before commits.
```

**Not using $ARGUMENTS**
```markdown
# Bad: Run formatter on "the files you want to format"
# Good: Run formatter on $ARGUMENTS
```

**Passive instructions**
```markdown
# Bad: The code should be formatted using prettier
# Good: Run `prettier --write $ARGUMENTS`
```

**Missing validation**
```markdown
# Bad: Step 3: Done!
# Good: Step 3: Verify - Check all files formatted, no errors, formatting-only changes
```

**Assuming pre-installed tools**
```markdown
# Bad: Run pytest
# Good: Verify pytest installed (pip install pytest if needed), then run pytest
```

**Windows paths**
```markdown
# Bad: C:\scripts\validate.bat
# Good: scripts/validate.sh
```

### Testing Your Command

**Cross-model testing:**
- Test with Haiku (needs more explicit guidance)
- Test with Sonnet (balanced)
- Test with Opus (handles ambiguity better)

**Scenario testing:**
- Typical arguments
- Edge cases (no files, many files, special characters)
- Invalid arguments
- Error conditions

### Storage

- **Project commands**: `.claude/commands/` (check into version control)
- **Personal commands**: `~/.claude/commands/` (user-specific)

---

## Complete Example

See `examples/format-code.md` for a fully implemented command following this template.
