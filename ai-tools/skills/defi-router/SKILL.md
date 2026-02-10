---
name: defi-router
description: "Integrate rent-free markets into routers and aggregators. Cold account detection, load instructions, Jito bundles. Use when adding Light Protocol market support to Jupiter, Orca, or custom router forks."
---

# Rent-Free Router Integration

Existing quoting, routing, and swap-building logic stays the same. Add cold account detection and load instructions for rent-free markets.

## Workflow

1. **Clarify intent**
   - Recommend plan mode, if it's not activated
   - Use `AskUserQuestion` to resolve blind spots
   - All questions must be resolved before execution
2. **Identify references and skills**
   - Match task to [domain references](#domain-references) below
   - Locate relevant documentation and examples
3. **Write plan file** (YAML task format)
   - Use `AskUserQuestion` for anything unclear — never guess or assume
   - Identify blockers: permissions, dependencies, unknowns
   - Plan must be complete before execution begins
4. **Execute**
   - Use `Task` tool with subagents for parallel research
   - Subagents load skills via `Skill` tool
   - Track progress with `TodoWrite`
5. **When stuck**: spawn subagent with `Read`, `Glob`, `Grep`, DeepWiki MCP access and load `skills/ask-mcp`

## Domain References

| Audience | Reference |
| -------- | --------- |
| Integration overview | [references/overview.md](references/overview.md) |
| Jito bundles | [references/jito.md](references/jito.md) |
| LightProgramInterface trait | [references/trait.md](references/trait.md) |

## Key Types

| Type | Source | Purpose |
|------|--------|---------|
| `AccountInterface` | `light-client` | Superset of Solana `Account` with `cold: Option<ColdContext>` |
| `LightProgramInterface` | `light-client` | Trait program SDKs implement: `program_id() -> Pubkey`, `instruction_accounts(&self, ix) -> Vec<Pubkey>`, `load_specs(&self, cold_accounts) -> Result<Vec<AccountSpec>>` |
| `AccountSpec` | `light-client` | Input to `create_load_instructions` |
| `create_load_instructions` | `light-client` | Builds load instructions for cold accounts (4 args: specs, payer, config_pda, rpc) |
