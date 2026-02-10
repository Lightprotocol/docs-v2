---
name: migration-program
description: Migrate Solana program to Light Protocol compressed accounts. Use when converting Anchor or native programs to use compressed state. Triggers on migration requests, compression integration, or Light Protocol adoption.
allowed-tools: Bash(git:*), Bash(cargo:*), Bash(anchor:*), Bash(light:*), Read, Edit, Glob, Grep, Write, Task, WebFetch, WebSearch, mcp__deepwiki__ask_question, mcp__claude-code-docs__SearchClaudeCodeDocs
---

# Solana Program Migration to Light Protocol

Migrate Solana programs to use compressed accounts.

**Goal:** Produce a working POC that builds and passes tests.

### Client-Program Interaction Flow
```text
 ├─ Client
 │  ├─ Get ValidityProof from RPC.
 │  ├─ pack accounts with PackedAccounts into PackedAddressTreeInfo and PackedStateTreeInfo.
 │  ├─ pack CompressedAccountMeta.
 │  ├─ Build Instruction from PackedAccounts and CompressedAccountMetas.
 │  └─ Send transaction.
 │
 └─ Custom Program
    ├─ CpiAccounts parse accounts consistent with PackedAccounts.
    ├─ LightAccount instantiates from CompressedAccountMeta.
    │
    └─ Light System Program CPI
       ├─ Verify ValidityProof.
       ├─ Update State Merkle tree.
       ├─ Update Address Merkle tree.
       └─ Complete atomic state transition.
```

## Reference Repos

```
/home/tilo/Workspace/program-examples/
├── create-and-update/     # Basic create + update pattern
├── close-account/         # Close, burn, reinit patterns
├── token-escrow/          # Token + compressed account patterns
├── airdrop-implementations/distributor/  # Merkle + compressed
└── zk/                    # ZK proof patterns

/home/tilo/Workspace/examples-zk-compression/
/home/tilo/Workspace/example-token-distribution/
/home/tilo/Workspace/example-nodejs-client/
```

## Workflow

1. **Clarify intent**
   - Recommend plan mode, if it's not activated
   - Use `AskUserQuestion` to resolve blind spots
   - All questions must be resolved before execution
2. **Identify references and skills**
   - Match task to [reference repos](#reference-repos) below
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

## Phase 1: Index Source Repo

Clone and analyze the target repository.

```bash
git clone {repo_url}
```

### 1.1 Detect Build System

| Indicator | Build System |
|-----------|--------------|
| `Anchor.toml` | Anchor program |
| `Cargo.toml` with `solana-program` | Native program |

### 1.2 Detect Test Framework

| Indicator | Framework |
|-----------|-----------|
| `#[tokio::test]` | program-test or litesvm |
| `bankrun` | bankrun |
| `anchor test` | Anchor test |
| `light_program_test` | Already using Light (skip migration) |

### 1.3 Check Solana Version

```bash
grep solana Cargo.toml
```

### 1.4 Index All Accounts

Find all `#[account]` structs in the program.

## Phase 2: Classify Accounts

| Classification | Action | Reason |
|----------------|--------|--------|
| User-owned | **MIGRATE** | Per-user state, best candidates |
| Config | **SKIP** | Read frequently, write rarely |
| Pool | **SKIP** | Concurrent access not supported |
| Global state | **SKIP** | Single instance, no benefit |

## Phase 3: Index Reference Repos

Find matching patterns before writing code:

```bash
grep -r "LightAccount::new_init" /home/tilo/Workspace/program-examples/
grep -r "LightAccount::new_mut" /home/tilo/Workspace/program-examples/
grep -r "LightAccount::new_close" /home/tilo/Workspace/program-examples/
```

Read matching files to understand patterns.

## Phase 4: Migration

### 4.1 Transform Account Structs

| Pattern | Source | Use for |
|---------|--------|---------|
| Simple data | create-and-update | Basic CRUD |
| Close/reopen | close-account | Closeable accounts |
| Token flows | token-escrow, distributor | Token integration |

### 4.2 Transform Instructions

| Original | Compressed | Reference |
|----------|------------|-----------|
| Create PDA | `LightAccount::new_init()` | create-and-update |
| Update | `LightAccount::new_mut()` | create-and-update |
| Close | `LightAccount::new_close()` | close-account |
| Burn | `LightAccount::new_burn()` | close-account |
| Reinit | `LightAccount::new_empty()` | close-account |

### 4.3 Update Dependencies

```toml
[dependencies]
anchor-lang = "0.31"
light-sdk = { version = "0.14", features = ["anchor"] }
light-sdk-types = "0.5"

[dev-dependencies]
light-program-test = "0.14"
light-client = "0.14"
```

### 4.4 Update Tests

Migrate to `light_program_test`.

## Phase 5: Build and Test Loop

### Required Commands

**Anchor programs:**
```bash
anchor build
anchor test
```

**Native programs:**
```bash
cargo build-sbf
cargo test-sbf
```

### Forbidden Shortcuts

- Do NOT use `cargo build` (must use `cargo build-sbf`)
- Do NOT use `cargo test` (must use `cargo test-sbf`)
- Do NOT skip SBF compilation
- Tests MUST run against real BPF bytecode

### Failure Recovery

On failure, spawn debugger agent with error context.

**Loop rules:**
1. Each debugger gets fresh context + previous debug reports
2. Each attempt tries something DIFFERENT
3. **NEVER GIVE UP** - keep spawning until fixed
4. Max 5 attempts per error

Do NOT proceed until all tests pass.

## Phase 6: Cleanup

Run only after tests pass:

```bash
rm -rf target/
```

## DeepWiki Fallback

If no matching pattern in reference repos:

```
mcp__deepwiki__ask_question("Lightprotocol/light-protocol", "How to {operation}?")
```
