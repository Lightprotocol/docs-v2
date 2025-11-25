---
description: Improves ZK Compression documentation by replacing vague statements with precise technical details verified against light-protocol codebase. Use when documentation lacks function names, data types, or specific mechanisms.
argument-hint: <section-or-file>
allowed-tools: [Read, Edit, Glob, Grep, mcp__deepwiki__read_wiki_structure, mcp__deepwiki__read_wiki_contents, mcp__deepwiki__ask_question]
---

# /improve

Improve: $ARGUMENTS

**WHY:** Developers need exact function names, data types, and mechanisms—not vague verbs like "handles" or "uses". Precision prevents implementation confusion.

## MANDATORY: Before ANY task execution

### First, output your understanding and plan

- State which section/file you'll improve
- Identify specific vague statements (quote them)
- List technical questions for DeepWiki (HOW? WHERE? WHAT function?)

### Then assess if clarification is needed

- Which specific section if multiple exist?
- Focus on all vague statements or specific areas?
- Preserve structure or reorganize?

## Step 1: Read Context and Identify Vague Statements

Read the full documentation file to understand page flow and audience.

**Flag vague statements using `/home/tilo/.claude/context/terminology-reference.md` rules:**

- Vague verbs: "handles", "manages", "processes", "uses" → needs HOW
- Missing function names: "calculates offsets" → WHICH function?
- Unclear data flow: "passes data" → WHERE? (instruction data vs accounts)
- Missing types: "offset value" → WHAT type? (u8, u16?)

**For each vague statement, document:**

```text
"[exact quote]" → Missing: [function name / data type / mechanism]
```

## Step 2: Query DeepWiki for Missing Details

For each flagged statement, query `Lightprotocol/light-protocol`:

**Query pattern:**

- Browse: `mcp__deepwiki__read_wiki_structure("Lightprotocol/light-protocol")`
- Read: `mcp__deepwiki__read_wiki_contents("Lightprotocol/light-protocol")`
- Ask: `mcp__deepwiki__ask_question("Lightprotocol/light-protocol", "[precise question]")`

**Questions to ask:**

- "Which function [performs operation]? What is its signature?"
- "What data type is [field/parameter]?"
- "Where is [value] passed—instruction data or accounts array?"
- "How does the on-chain program [mechanism]? What steps occur?"

## Step 3: Rewrite with Precision

Apply precision rules (reference `/home/tilo/.claude/context/terminology-reference.md`):

**AVOID:** "handles", "manages", "processes", "operations", "enables"

**USE:** Exact function names (`PackedAccounts.to_account_metas()`), data types ((u8)), specific operations ("verifies proof against state root")

**For each vague statement:**

Original: `"[quote]"`

Improved: `"[rewrite with function names, data types, and mechanism]"`

Changes:

- Added: `function_name()`, data type ([type])
- Replaced: "[vague verb]" → "[specific operation]"
- Clarified: [WHERE/HOW detail]

## Step 4: Apply Edits and Validate

Use Edit tool to replace statements. Preserve structure and formatting.

**Post-edit validation:**

- [ ] All vague verbs replaced with specific operations
- [ ] Function names and data types included
- [ ] Mechanisms explain HOW, not just WHAT
- [ ] Data flow clarified (WHERE)

---

## Example: Pre Accounts Accordion Improvement

**BEFORE (vague):**
> "Pre accounts are added at the beginning. The on-chain program uses offsets to locate accounts."

**Issues:** "are added" (WHAT are they?), "uses offsets" (HOW? WHERE received?), missing function/types

**DeepWiki queries:**

- "How does the on-chain program receive system_accounts_start_offset?"
- "Which function calculates these offsets?"

**Answers:** Offsets in instruction data as u8, calculated by `PackedAccounts.to_account_metas()`, used via `ctx.remaining_accounts.split_at()`

**AFTER (precise):**

> "Pre accounts are your program-specific accounts (signers, PDAs for CPIs) added at known positions.
>
> The on-chain program receives offsets in the instruction data to locate Light System accounts and tree accounts:
>
> - `system_accounts_start_offset` (u8) - where Light System accounts begin
> - `packed_accounts_start_offset` (u8) - where tree accounts begin
>
> `PackedAccounts.to_account_metas()` calculates these offsets client-side."