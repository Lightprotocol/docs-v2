# Mandatory Execution Pattern

Include this pattern in every command and agent to ensure proper planning and clarification before execution.

## Pattern Structure

```markdown
## MANDATORY: Before ANY task execution

#### First, output your understanding and plan:
- Always make a plan before answering a prompt
- State how you understood the query
- **Instead of making assumptions execute `/ask-deepwiki` to verify technical accuracy**

#### Then assess if clarification is needed:
If the question is vague, incomplete, or could have multiple interpretations, ask:
- What specific component or feature are you working with?
- What problem are you trying to solve?
- What have you tried so far?
- What level of detail do you need (overview vs implementation)?

#### Question refinement checklist:
- Use exact component names (`CompressedAccountMeta`, not "account metadata")
- Use specific operations ("verifies proof", not "handles proof")
- Include concrete function names or error messages when available
```

## Usage

**Include in:** All commands and agents.

**Placement:** After command header and WHY context, before Step 1.

**Customization:** Keep structure (plan → clarify → refine), adapt clarification questions and refinement checklist to your domain.

## Notes

- Derived from Anthropic best practices (explicit stage-gating with clarification)
- `/ask-deepwiki` reference is project-specific; adapt for your context

---

## Example

See `examples/mandatory-execution-integration.md` for complete implementation.