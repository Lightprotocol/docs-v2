---
description: Validates ZK Compression documentation files against Mintlify syntax, code accuracy, and text quality checklists. Use before committing documentation changes.
argument-hint: [file-pattern]
---

# /review

Validate documentation files: $ARGUMENTS (default: `developer-content/zk-compression-docs/**/*.md`)

## MANDATORY: Before ANY task execution

#### First, output your understanding and plan:
- State which files will be validated (based on $ARGUMENTS or default)
- Confirm three validation agents will run in parallel
- Identify validation scope (GitBook syntax, code snippets, text quality)

#### Then assess if clarification is needed:
If unclear, ask:
- Should all warnings block or only critical errors?
- Should validation stop on first error or collect all issues?
- Which severity levels matter (critical/warning/info)?

#### Validation refinement checklist:
- File pattern matches intended scope
- All three checklists from `developer-content/.github/` will be applied
- DeepWiki is available for code verification

### Step 1: Parse Arguments and Generate Timestamp

Determine file pattern to validate:
- If $ARGUMENTS is provided: use it
- If $ARGUMENTS is empty: use default `developer-content/zk-compression-docs/**/*.md`

Generate timestamp for report files:
```bash
TIMESTAMP=$(date +%Y%m%d-%H%M)
```

Display: "Validating files matching: [file-pattern]"
Display: "Reports will be saved to: /home/tilo/Workspace/.claude/tasks/review-$TIMESTAMP-*.md"

### Step 2: Spawn Three Validation Agents in Parallel

Use Task tool three times in a single message with `subagent_type: "general-purpose"`.

**Agent 1: GitBook Syntax Validator**

```
Task(
  subagent_type: "general-purpose",
  description: "GitBook syntax validation",
  prompt: "Execute the validation workflow defined in /home/tilo/Workspace/.claude/agents/gitbook-syntax-validator.md

File pattern to validate: [file-pattern from Step 1]
Working directory: /home/tilo/Workspace/developer-content
Report file: /home/tilo/Workspace/.claude/tasks/review-[TIMESTAMP]-gitbook-syntax.md

Read the agent workflow file and follow ALL steps defined there to validate GitBook syntax and Markdown structure.
Write your complete findings to the report file specified above.
Return the report file path in your final message."
)
```

**Agent 2: Code Snippet Validator**

```
Task(
  subagent_type: "general-purpose",
  description: "Code snippet verification",
  prompt: "Execute the validation workflow defined in /home/tilo/Workspace/.claude/agents/code-snippet-validator.md

File pattern to validate: [file-pattern from Step 1]
Working directory: /home/tilo/Workspace/developer-content
Report file: /home/tilo/Workspace/.claude/tasks/review-[TIMESTAMP]-code-snippets.md

Read the agent workflow file and follow ALL steps defined there to verify code snippets using:
- CLAUDE.md source mappings at developer-content/zk-compression-docs/CLAUDE.md
- DeepWiki queries to Lightprotocol/light-protocol repository
- WebFetch for GitHub source code verification

Write your complete findings to the report file specified above.
Return the report file path in your final message."
)
```

**Agent 3: Developer Text Validator**

```
Task(
  subagent_type: "general-purpose",
  description: "Developer text quality evaluation",
  prompt: "Execute the validation workflow defined in /home/tilo/Workspace/.claude/agents/developer-text-validator.md

File pattern to validate: [file-pattern from Step 1]
Working directory: /home/tilo/Workspace/developer-content
Report file: /home/tilo/Workspace/.claude/tasks/review-[TIMESTAMP]-developer-text.md

Read the agent workflow file and follow ALL steps defined there to evaluate text quality.
Flag implementation details, vague statements, and inaccuracies.

Write your complete findings to the report file specified above.
Return the report file path in your final message."
)
```

### Step 3: Aggregate and Display Results

Wait for all three agents to complete, then display aggregated report:

```
═══════════════════════════════════════
  DOCUMENTATION VALIDATION REPORT
═══════════════════════════════════════

Timestamp: [TIMESTAMP]
Files validated: [file-pattern]

─── GitBook Syntax Validation ─────────
Report: /home/tilo/Workspace/.claude/tasks/review-[TIMESTAMP]-gitbook-syntax.md

[Agent 1 summary of findings]

─── Code Snippet Verification ─────────
Report: /home/tilo/Workspace/.claude/tasks/review-[TIMESTAMP]-code-snippets.md

[Agent 2 summary of findings]

─── Developer Text Quality ────────────
Report: /home/tilo/Workspace/.claude/tasks/review-[TIMESTAMP]-developer-text.md

[Agent 3 summary of findings]

─── Summary ───────────────────────────
Total issues: X (Y critical, Z warnings)

Full reports available at:
  - /home/tilo/Workspace/.claude/tasks/review-[TIMESTAMP]-gitbook-syntax.md
  - /home/tilo/Workspace/.claude/tasks/review-[TIMESTAMP]-code-snippets.md
  - /home/tilo/Workspace/.claude/tasks/review-[TIMESTAMP]-developer-text.md
```

### Step 4: Provide Actionable Next Steps

Analyze severity and provide guidance:

**No issues found:**
```
✓ Documentation ready for commit
  No validation issues detected
```

**Warnings only:**
```
⚠ Review warnings before committing
  [List warning-level issues with file:line references]

  Proceed with commit if warnings are acceptable
```

**Critical errors found:**
```
✗ Fix critical errors before committing

Critical issues that must be resolved:
[List each critical issue with:
  - File and line number
  - Issue description
  - Recommended fix
]
```

## Validation

Before finalizing:
- All three agents completed successfully
- Results are structured with file:line references
- Severity levels are clear (critical, warning, info)
- Actionable fixes are provided

## Notes

- Uses same checklists as CodeRabbit (`.github/*.md`)
- DeepWiki queries `Lightprotocol/light-protocol` for code verification
- Run locally to catch issues before pushing
- Examples:
  - Single file: `/review zk-compression-docs/quickstart.md`
  - Directory: `/review zk-compression-docs/compressed-tokens/**`
