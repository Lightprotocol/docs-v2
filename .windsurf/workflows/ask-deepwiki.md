---
description: Query the Deep Wiki MCP server
auto_execution_mode: 3
---

---
argument-hint: "`<ask deep wiki>`"
description: Research and prepare to discuss a specific topic
allowed-tools: WebSearch, WebFetch, read, edit, glob, grep, mcp__deepwiki__read_wiki_structure, mcp__deepwiki__read_wiki_contents, mcp__deepwiki__ask_question
---

**THIS IS AN EXECUTABLE WORKFLOW, NOT SIMPLE DOCUMENTATION - READ END TO END**

Query the Light Protocol repository via DeepWiki MCP with precise technical answers.

**MANDATORY STEPS BEFORE EXECUTION:**
1. Read this complete file
2. Read Global CLAUDE.md
3. Read terminology reference for precision rules

**VERIFICATION CHECKLIST:**
- [ ] Have you completed all mandatory steps above?
- [ ] Are you familiar with precision rules (avoid vague verbs)?
- [ ] Will you provide file:line references?

**Navigation**: Global README | Commands | Global CLAUDE.md

## Command Process

When invoked, perform these steps:

1. **Identify Question Scope**
   - Determine if question is about programs, client SDKs, architecture, or implementation details
   - Note any specific components mentioned (e.g., LightAccount, ValidityProof, CPI)

2. **Fetch Repository Context**
   **a for Compression**
   - Browse structure: `mcp__deepwiki__read_wiki_structure("Lightprotocol/light-protocol")`
   - Read sections: `mcp__deepwiki__read_wiki_contents("Lightprotocol/light-protocol")`
   - Ask question: `mcp__deepwiki__ask_question("Lightprotocol/light-protocol", "your question")`


   **b for Solana Questions**
   - Browse structure: `mcp__deepwiki__read_wiki_structure("blueshift-gg/blueshift-dashboard")`
   - Read sections: `mcp__deepwiki__read_wiki_contents("blueshift-gg/blueshift-dashboard")`
   - Ask question: `mcp__deepwiki__ask_question("blueshift-gg/blueshift-dashboard", "your question")`

3. **Apply Precision Rules**

read `cat /home/tilo/.claude/context/terminology-reference.md`

**AVOID:**
- Vague verbs: "handles", "manages", "processes", "enables", "provides"
- Abstract: "operations", "management", "coordination"
- -ing endings when precise verb exists

**USE:**
- Exact function/method names
- Concrete data structures
- Specific operations: "sets discriminator", "creates hash"
- File:line references

4. **Format Response**
   - Use technical precision
   - Include code examples with inline comments
   - Provide source references where applicable
   - Follow example output format below

## Example Output Format

**User Question:**
> Conceptually, what do you have to include in the instruction data for compressed account creation on program side?

**Precise Answer:**

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
- Client generates this proof via `getValidityProof()` RPC call

**2. Tree location parameters**
- `PackedAddressTreeInfo`: Specifies which address tree registers the address (uses index, not full pubkey)
- `output_state_tree_index`: Specifies which state tree stores the compressed account hash

**3. Custom account data**
- Program-specific data fields (e.g., `message: String`, user data)

**What happens:**

1. **Address registration** → Address tree proves uniqueness, stores address
2. **Account data storage** → State tree stores account hash
3. **Proof verification** → ValidityProof cryptographically guarantees address is unused

**Why separate trees:**

Unlike regular Solana accounts where runtime checks PDA existence, compressed accounts require client-generated cryptographic proof that address doesn't exist. Address trees enforce uniqueness, state trees store account hashes.

**Packed structs** use `u8` indices instead of full pubkeys to reference accounts in `remaining_accounts`, reducing transaction size.