---
name: research-deepwiki
description: Query Light Protocol and related repositories via DeepWiki MCP. Use when answering questions about compressed accounts, Light SDK, Solana development, Claude Code features, or agent skills. Triggers on technical questions requiring repository context.
---

# DeepWiki Research

Query repositories via DeepWiki MCP to answer technical questions with precise, source-backed answers.

## Execution Steps

### 1. Initialize Context: Understand Current Repository

### 2. Identify Question Scope

Determine the domain:
- Programs, client SDKs, architecture, implementation details
- Specific components (LightAccount, ValidityProof, CPI, etc.)

### 3. Fetch Repository Context

Select the appropriate repository based on question scope:

**Light Protocol (compressed accounts, state trees, ZK compression, Light SDK)**
```
mcp__deepwiki__read_wiki_structure("Lightprotocol/light-protocol")
mcp__deepwiki__read_wiki_contents("Lightprotocol/light-protocol")
mcp__deepwiki__ask_question("Lightprotocol/light-protocol", "your question")
```

**Solana Development (programs, accounts, general Solana)**
```
mcp__deepwiki__read_wiki_structure("blueshift-gg/blueshift-dashboard")
mcp__deepwiki__read_wiki_contents("blueshift-gg/blueshift-dashboard")
mcp__deepwiki__ask_question("blueshift-gg/blueshift-dashboard", "your question")
```

**Claude Code (CLI features, commands, configuration)**
```
mcp__deepwiki__read_wiki_structure("anthropics/claude-code")
mcp__deepwiki__read_wiki_contents("anthropics/claude-code")
mcp__deepwiki__ask_question("anthropics/claude-code", "your question")
```

**Agent Skills (skills, subagents, patterns)**
```
mcp__deepwiki__read_wiki_structure("anthropics/skills")
mcp__deepwiki__read_wiki_contents("anthropics/skills")
mcp__deepwiki__ask_question("anthropics/skills", "your question")
```

### 4. Apply Precision Rules

**AVOID:**
- Vague verbs: "handles", "manages", "processes", "enables", "provides"
- Abstract nouns: "operations", "management", "coordination"
- -ing endings when a precise verb exists
- Marketing language: "comprehensive", "rich", "seamless"

**USE:**
- Exact function/method names
- Concrete data structures
- Specific operations: "sets discriminator", "creates hash", "nullifies account"
- File:line references

### 5. Format Response

Structure answers with:
- Technical precision
- Code examples with inline comments
- Source references (file paths, line numbers)

## Example Output

**Question:** What do you include in instruction data for compressed account creation?

**Answer:**

---

## Compressed Account Creation Instruction Data

Instruction data contains three components for proof verification and tree coordination.

**Components:**

```rust
pub struct InstructionData {
    proof: ValidityProof,
    address_tree_info: PackedAddressTreeInfo,
    output_state_tree_index: u8,
    // + custom account data
}
```

**1. Non-inclusion proof**
- `ValidityProof` proves the derived address does not exist in the specified address tree
- Client generates via `getValidityProof()` RPC call

**2. Tree location parameters**
- `PackedAddressTreeInfo`: Specifies which address tree registers the address (u8 index, not pubkey)
- `output_state_tree_index`: Specifies which state tree stores the compressed account hash

**3. Custom account data**
- Program-specific fields (e.g., `message: String`, user data)

**Execution flow:**

1. Address tree proves uniqueness, stores address
2. State tree stores account hash
3. ValidityProof cryptographically guarantees address is unused

**Why separate trees:**

Compressed accounts require client-generated cryptographic proof that address doesn't exist (unlike regular Solana where runtime checks PDA existence). Address trees enforce uniqueness; state trees store account hashes.

**Packed structs** use `u8` indices to reference accounts in `remaining_accounts`, reducing transaction size.
