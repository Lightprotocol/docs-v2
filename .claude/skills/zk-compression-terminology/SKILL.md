---
name: zk-compression-terminology
description: Precise technical definitions for ZK Compression compressed account operations extracted from official documentation
---

# ZK Compression Terminology Skill

## When to Use

This skill provides precise technical definitions when:
- Writing compressed account documentation
- Validating terminology accuracy in guides
- Checking correct type names (CompressedAccountMeta vs "account metadata")
- Verifying SDK method signatures and parameters
- Understanding exact behavior of Light System Program operations
- Ensuring consistent technical language across documentation

## Core Principle

**Describe exactly what happens. Avoid vague language.**

AVOID:
- Abstract concepts: "operations", "management", "coordination"
- Vague verbs: "handles", "manages", "processes"
- Marketing language: "enables", "provides capability"
- Generic descriptions: "account metadata" instead of "CompressedAccountMeta"
- ZK terminology in user-facing docs: "inclusion proof", "non-inclusion proof" → Instead: "prove the account hash exists", "prove the address doesn't exist"

## What This Skill Contains

### Compressed Account Operations Terminology
`resources/compressed-accounts-terminology.md` (~6-7k tokens)

Complete terminology extracted from 5 official guides:
- how-to-create-compressed-accounts.md
- how-to-update-compressed-accounts.md
- how-to-close-compressed-accounts.md
- how-to-reinitialize-compressed-accounts.md
- how-to-burn-compressed-accounts.md

**Includes:**
- 100+ terms with precise definitions
- SDK method signatures with exact parameters
- System accounts array specification
- Operation state transition table
- Instruction data patterns for all operations
- Required dependencies and traits

## Usage Pattern

### Fast Lookup
Check this SKILL.md for principle and scope. If you need specific term definition, load the terminology table.

### Writing Documentation
Load `compressed-accounts-terminology.md` when writing or editing documentation to ensure:
- Correct type names
- Precise technical descriptions
- Consistent verb usage
- Accurate SDK method calls

### Validation
Use terminology table to verify:
- `CompressedAccountMeta` contains tree_info, address, output_state_tree_index
- `CompressedAccountMetaBurn` omits output_state_tree_index field
- ValidityProof proves "address doesn't exist" (create) or "account hash exists" (update/close/reinit/burn)
- State trees are "fungible" not "interchangeable" or "equivalent"
- Operations nullify hashes, don't "invalidate" or "mark as spent"

## Example Corrections

| Instead of | Write |
|-----------|-------|
| "enables developers to create accounts" | "creates new account hash and inserts address into address tree" |
| "handles account updates" | "nullifies old account hash and appends new hash with updated data" |
| "manages state transitions" | "atomically nullifies input hash and creates output hash" |
| "provides burn functionality" | "nullifies account hash and creates no output state" |
| "account metadata" | "CompressedAccountMeta struct containing tree_info, address, and output_state_tree_index" |
| "proves account exists" (vague) | "proves account hash exists in state tree using 128-byte validity proof" |
| "non-inclusion proof" | "proof that address doesn't exist in address tree" |
| "processes transactions" | "verifies validity proof and invokes Account Compression Program" |

## Term Categories in Table

1. **Core Types**: LightAccount, CompressedAccountMeta, ValidityProof, CpiAccounts
2. **SDK Methods**: new_init(), new_mut(), new_close(), new_empty(), new_burn()
3. **CPI Components**: CpiSigner, derive_light_cpi_signer!, with_light_account()
4. **Tree Structures**: State Tree, Address Tree, PackedStateTreeInfo
5. **Operations**: Create, Update, Close, Reinitialize, Burn
6. **System Accounts**: 8 required accounts for every CPI
7. **Traits & Derives**: LightDiscriminator, BorshSerialize, Clone, Debug, Default
8. **Frameworks**: Anchor (anchor_lang) vs Native Rust (borsh)

## Integration with Documentation

This skill works alongside:
- [GitBook Assistant](/home/tilo/Workspace/.claude/skills/gitbook-assistant/SKILL.md) - For syntax and formatting
- [CLAUDE.md](/home/tilo/.claude/CLAUDE.md) - For writing standards
- [Local CLAUDE.md](../../developer-content/CLAUDE.md) - For project guidelines

## Validation Checklist

When writing documentation, verify:
- [ ] Type names are exact: `CompressedAccountMeta` not "metadata"
- [ ] Methods include parentheses: `new_init()` not "new_init"
- [ ] Proofs describe action: "proves address doesn't exist" not "non-inclusion proof"
- [ ] Verbs are concrete: "nullifies", "appends", "verifies" not "handles", "manages"
- [ ] No marketing language: no "enables", "provides", "powerful"
- [ ] State transitions are explicit: "nullifies old hash, appends new hash"
- [ ] Account types are specific: "LightAccount<T>" not "account wrapper"

## Notes

- Terminology extracted directly from official Light Protocol documentation
- Definitions describe implementation behavior, not abstract concepts
- SDK signatures show exact parameter types and names
- All 8 system accounts listed with pubkeys and descriptions
- Operation state transitions show input/output hashes explicitly
