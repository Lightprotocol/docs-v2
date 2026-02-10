---
name: payments-and-wallets
description: "Build payment flows and wallet integrations with light-token. Covers receive/send/balance/history, sign with privy and wallet adapters, and nullifier-based double-spend prevention."
---

# Payments and wallets

Build payment flows and wallet integrations using light-token on Solana. The light-token API matches SPL-token and extends it to include the light token program.

| Creation cost     | SPL                 | light-token          |
| :---------------- | :------------------ | :------------------- |
| **Token Account** | ~2,000,000 lamports | ~**11,000** lamports |

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

## Domain references

| Task | Reference |
|------|-----------|
| Build payment flows (receive, send, balance, history, wrap/unwrap) | [payments.md](references/payments.md) |
| Build wallet UI (display tokens, transfer, wrap/unwrap) | [wallets.md](references/wallets.md) |
| Sign with Wallet Adapter or Mobile Wallet Adapter | [sign-with-adapter.md](references/sign-with-adapter.md) |
| Sign with Privy (embedded wallet provider) | [sign-with-privy.md](references/sign-with-privy.md) |
| Optional Prevent duplicate actions (double-spend prevention) | [nullifiers.md](references/nullifiers.md) |

## Setup

```bash
npm install @lightprotocol/compressed-token @lightprotocol/stateless.js @solana/web3.js @solana/spl-token
```

```typescript
import { createRpc } from "@lightprotocol/stateless.js";
import {
  getOrCreateAtaInterface,
  getAtaInterface,
  getAssociatedTokenAddressInterface,
  transferInterface,
  wrap,
  unwrap,
} from "@lightprotocol/compressed-token/unified";

const rpc = createRpc(RPC_ENDPOINT);
```

## Resources

- [Payments docs](https://zkcompression.com/light-token/toolkits/for-payments)
- [Wallets docs](https://zkcompression.com/light-token/toolkits/for-wallets)
- [GitHub examples](https://github.com/Lightprotocol/examples-light-token/tree/main/toolkits/payments-and-wallets)
- [Nullifier program](https://github.com/Lightprotocol/nullifier-program/)