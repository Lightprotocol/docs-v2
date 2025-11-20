# Validation Checklist

Use this checklist to validate commands and agents against Anthropic's best practices.

## Structure Validation

### Frontmatter (YAML)

- [ ] **Frontmatter present** with `---` delimiters
- [ ] **description field** present and non-empty
- [ ] **Description includes WHAT** - What the command/agent does
- [ ] **Description includes WHEN** - When to use it / triggering conditions
- [ ] **description under 1024 characters**
- [ ] **argument-hint present** if command uses $ARGUMENTS
- [ ] **argument-hint format** is `<param-name>` not `[param]` or `{param}`
- [ ] **allowed-tools specified** if using MCP or specific tools
- [ ] **allowed-tools follows least privilege** - only necessary tools

**For agents only:**
- [ ] **name field present** (lowercase, hyphens, max 64 chars)
- [ ] **name follows gerund form** (verb-ing) if applicable
- [ ] **name does not contain** "anthropic" or "claude"

### File Structure

- [ ] **Header present** with # /command-name or # Agent: Name
- [ ] **WHY context included** - Explains importance/rationale
- [ ] **MANDATORY pattern present** - Before ANY task execution section
- [ ] **Steps clearly numbered** - ### Step 1, ### Step 2, etc.
- [ ] **Notes section** at end (if applicable)
- [ ] **File under 500 lines** for SKILL.md (templates can be longer)

## Content Validation

### Arguments and Placeholders

- [ ] **Uses $ARGUMENTS** not placeholder text
- [ ] **No "your question"** or similar placeholders
- [ ] **No "the files"** or similar vague references
- [ ] **$ARGUMENTS placed correctly** - where user input should go
- [ ] **Argument referenced in command** if argument-hint present

### Instructions Quality

- [ ] **No meta-instructions** - No "When invoked..." or "read this file..."
- [ ] **Direct instructions** - No "The code should be..." passive voice
- [ ] **Active verbs** throughout - "Run", "Execute", "Create", not "is run", "should be"
- [ ] **Explicit and clear** - No ambiguous instructions
- [ ] **Specific actions** - "Run `npm test`" not "test the code"
- [ ] **Stage-gating present** - Plan before execute, validate before finalize

### MANDATORY Pattern

- [ ] **Plan-first section** - "First, output your understanding and plan"
- [ ] **Clarification section** - "Then assess if clarification is needed"
- [ ] **Refinement checklist** - Domain-specific requirements
- [ ] **Plan asks for understanding** - Not just "create plan"
- [ ] **Clarification questions relevant** to domain
- [ ] **Checklist items specific** not generic

### Technical Precision

- [ ] **Avoids vague verbs** - No "handles", "manages", "processes", "enables", "provides"
- [ ] **Uses specific verbs** - "verifies", "nullifies", "appends", "executes"
- [ ] **Avoids abstract terms** - No "operations", "management", "coordination"
- [ ] **Uses concrete terms** - Specific functions, types, methods
- [ ] **No marketing language** - No "powerful", "seamless", "easy", "simply"
- [ ] **Uses exact names** - CompressedAccountMeta not "account metadata"

### Code and Formatting

- [ ] **Inline code uses backticks** - `code` not ```code```
- [ ] **No triple backticks in nested markdown** - Breaks outer code block
- [ ] **Code blocks properly formatted** - When appropriate
- [ ] **Commands are runnable** - Actual syntax, not pseudocode (unless intentional)
- [ ] **File paths are accurate** - If referencing specific files

## Tool Configuration

### Tool Permissions

- [ ] **allowed-tools follows glob pattern** - `mcp__service__*` for all tools
- [ ] **allowed-tools is specific** - Lists only needed tools
- [ ] **Least privilege applied** - Not granted unnecessary tools
- [ ] **Tool usage explained** - Why each tool is needed

### Tool Usage in Commands

- [ ] **Tools used correctly** - Proper syntax for each tool
- [ ] **MCP calls formatted properly** - With backticks in lists
- [ ] **Tool calls include $ARGUMENTS** - Where user input should go
- [ ] **Error handling for tool failures** - What to do if tool fails

## Workflow Validation

### Step Structure

- [ ] **Step 1 includes planning** - For complex commands
- [ ] **Steps are ordered logically** - Natural progression
- [ ] **Each step has clear action** - Not vague goals
- [ ] **Decision points have criteria** - When to choose option A vs B
- [ ] **Validation steps included** - Check before finalizing

### Examples (For Agents)

- [ ] **At least 2 examples** provided
- [ ] **Examples show input/output** - What agent receives and produces
- [ ] **Examples demonstrate key scenarios** - Common use cases
- [ ] **Examples show decision-making** - Not just happy path

### Constraints (For Agents)

- [ ] **Constraints section present** - What agent must NOT do
- [ ] **Security considerations listed** - Dangerous operations identified
- [ ] **Error handling defined** - What to do when uncertain
- [ ] **Constraints have rationale** - Why each constraint exists

## Agent-Specific Validation

### Responsibility

- [ ] **Single, clear responsibility** stated
- [ ] **Responsibility is narrow** - Not trying to do everything
- [ ] **Proactive activation language** - "Use PROACTIVELY when..."
- [ ] **Triggering conditions clear** - When to invoke automatically

### Autonomy

- [ ] **Can run without user input** - No mid-execution questions
- [ ] **Decision criteria provided** - For all decision points
- [ ] **Stopping conditions defined** - When to stop and ask user
- [ ] **Error recovery specified** - How to handle failures

### Safety

- [ ] **Destructive operations guarded** - Require confirmation or prevented
- [ ] **No force operations** without explicit user request
- [ ] **Rollback instructions** if applicable
- [ ] **Security boundaries enforced** - No credential access, etc.

## Command Type-Specific

### Basic Commands

- [ ] **Single purpose focus** - Does one thing well
- [ ] **Clear usage example** in notes
- [ ] **Output format specified** - What user should see

### MCP Commands

- [ ] **Source/repository mapping** provided
- [ ] **MCP call sequence** shown for each source
- [ ] **$ARGUMENTS in query tools** - Passed to ask_question or similar
- [ ] **Precision rules included** - Domain-specific terminology
- [ ] **Cross-references provided** - Documentation URLs

### Research Commands

- [ ] **Research scope defined** - Boundaries clear
- [ ] **Multiple sources consulted** - Not single-source
- [ ] **Synthesis step included** - Combine findings
- [ ] **Source attribution required** - All references documented
- [ ] **Gap identification** - Note what's unclear

## Best Practices Adherence

### From Prompt Engineering

- [ ] **Clear and direct** - No subtle hints
- [ ] **Structured with headers** - Easy to navigate
- [ ] **Examples where helpful** - Show don't just tell

### From Claude Code Best Practices

- [ ] **$ARGUMENTS for parameters** - Dynamic input
- [ ] **Extended thinking triggers** - Plan-first approach
- [ ] **Clear targets provided** - Success criteria

### From Sub-Agents Guide

- [ ] **Single responsibility** - Focused purpose
- [ ] **Detailed prompt** - Comprehensive instructions
- [ ] **Least privilege** - Minimal tool access
- [ ] **Proactive if appropriate** - Automatic activation

### From Agent Skills Best Practices

- [ ] **Concise** - No unnecessary words
- [ ] **Progressive disclosure** - Main file navigates to details
- [ ] **Appropriate freedom level** - Matches task fragility
- [ ] **Multi-model consideration** - Works across Haiku/Sonnet/Opus

## Final Checks

### Completeness

- [ ] **All sections present** - Nothing obviously missing
- [ ] **Cross-references work** - Links point to actual files
- [ ] **Examples are complete** - Not TODO or placeholder

### Clarity

- [ ] **Instructions are understandable** - Clear to another person
- [ ] **No ambiguous terms** - Specific throughout
- [ ] **Logical flow** - Natural progression

### Testability

- [ ] **Can be tested** - Possible to verify it works
- [ ] **Success criteria clear** - Know when it's done right
- [ ] **Failure modes identified** - Know what could go wrong

## Severity Levels

### Critical Issues (Must Fix)

- Missing $ARGUMENTS (uses placeholder)
- No description or malformed frontmatter
- Meta-instructions present
- No MANDATORY pattern
- Security vulnerabilities (in agents)
- All tools granted (violates least privilege)

### Important Issues (Should Fix)

- Missing WHY context
- Passive or vague instructions
- No validation steps
- Missing examples (for agents)
- No constraints defined (for agents)
- Poor technical precision

### Minor Issues (Nice to Fix)

- Formatting inconsistencies
- Could use better terminology
- Missing cross-references
- Light on examples
- Could be more concise

## Using This Checklist

**When creating:**
- Use as template guide
- Check off items as you add them
- Refer to validation/examples.md for good patterns

**When validating:**
- Go through each section systematically
- Note all issues found with severity
- Provide specific fixes for each issue
- Reference examples.md for good vs bad patterns

**When optimizing:**
- Focus on critical issues first
- Group related issues together
- Provide concrete edit instructions
- Verify fixes don't break other aspects

## Notes

- Not all items apply to all command types
- Use judgment for context-specific items
- When in doubt, check official Anthropic docs
- Validation examples.md provides concrete good/bad examples
