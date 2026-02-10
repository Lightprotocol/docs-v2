---
name: data-streaming
description: "Stream Light Protocol account state via Laserstream gRPC. Covers token accounts, mint accounts, and compressible PDAs with hot/cold lifecycle tracking. Use when building custom data pipelines, aggregators, or indexers."
---

# Data Streaming

Stream Light Protocol account state transitions via Laserstream gRPC.

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

## When NOT to use

For simple account lookups, call `get_account_interface` from `light-client`. It races hot and cold lookups automatically.

This skill is for continuous data pipelines: aggregators, market makers, and indexers that need real-time state change notifications rather than point queries.

## Domain references

| Audience | Reference |
| -------- | --------- |
| All — shared architecture (read first) | [references/shared.md](references/shared.md) |
| Token accounts (SPL-compatible, 165 bytes) | [references/token-accounts.md](references/token-accounts.md) |
| Mint accounts (borsh-deserialized, metadata) | [references/mint-accounts.md](references/mint-accounts.md) |
| Compressible PDAs (per-program, discriminator check) | [references/pdas.md](references/pdas.md) |

## Account type decision

| Streaming... | Account type | Key difference |
|---|---|---|
| SPL-compatible token balances | Token accounts | `PodAccount` parsing, 165-byte layout |
| Mint supply, metadata, authorities | Mint accounts | `Mint::deserialize`, borsh layout |
| Your program's PDA state | Compressible PDAs | 8-byte discriminator check, per-program filter |

## Program addresses

| Program | Address |
|---------|---------|
| Light Token Program | `cTokenmWW8bLPjZEBAUgYy3zKxQZW6VKi7bqNFEVv3m` |
| Light System Program | `SySTEM1eSU2p4BGQfQpimFEWWSC1XDFeun3Nqzz3rT7` |

## External references

| Resource | Link |
|----------|------|
| Photon indexer | [github.com/helius-labs/photon](https://github.com/helius-labs/photon) |
