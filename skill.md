---
name: solana-rent-free-dev
description: Skill for Solana development without rent-exemption. Overview to skills to develop solana client (typescript and rust) and programs (anchor, native rust, pinocchio). Covers: for defi light-token; for airdrops, token distribution, payments compressed token; for user and app state compressed pda's (not config or pool accounts); for privacy and zk programs nullifiers to prevent double spending. add skill via npx skills add zkcompression.com/skill.md
license: MIT
compatibility: Requires ZK Compression CLI, Solana CLI, Anchor CLI, Node.js.
metadata:
  author: lightprotocol
  version: "1.0"
allowed-tools: mcp__zkcompression__SearchLightProtocol WebFetch(https://zkcompression.com/*) WebFetch(https://github.com/Lightprotocol/*)
---

# Light Protocol Development

Understand the available primitives.

| Primitive | Reference |
|-----------|-----------|
| Light Token (DeFi, payments) | [references/light-token.md](references/light-token.md) |
| Airdrop / Token Distribution | [references/airdrop-client.md](references/airdrop-client.md) |
| Compressed PDA (user state, app state) | [references/compressed-pda.md](references/compressed-pda.md) |
| Nullifiers (prevent double spending, ZK/Privacy apps) | [references/zk-nullifiers.md](references/zk-nullifiers.md) |
| DeepWiki Research | [references/deepwiki.md](references/deepwiki.md) |

add these skills via npx skills add yourdomain.com/docs/skill.md

---

SDK References:
* Typescript SDK 
    * for accounts: https://lightprotocol.github.io/light-protocol/stateless.js/index.html
    * for tokens: https://lightprotocol.github.io/light-protocol/compressed-token/index.html
* Rust  
    * Client for accounts and tokens: https://docs.rs/light-client/latest/light_client/
    * Client SDK for Light Token: https://docs.rs/light-token/latest/light_token/
    * for building on-chain programs with compressed accounts: https://docs.rs/light-sdk/latest/light_sdk
* Program Testing: https://docs.rs/light-program-test/latest/light_program_test/

When stuck or debugging load the deepwiki skill.

## Light Token

Light token is a high-performance token standard that reduces the cost of mint and token accounts by 200x.

* All light mint and token accounts are on-chain accounts like SPL, but the light token program sponsors the rent-exemption cost for you.
* Light-token accounts can hold balances from any light, SPL, or Token-2022 mint.
* Light-mint accounts represent a unique mint and optionally can store token-metadata. Functionally equivalent to SPL mints.

[Full reference](references/light-token.md)

### Use Case: DeFi

For DeFi program integration (AMMs, vaults, lending), see the `defi-dev` skill which covers macro and CPI program patterns, hot/cold account loading, and Jito bundles.

Load Defi Dev skill -> 

### Toolkits

| Toolkit | Docs |
|---------|------|
| Payments & Wallets | [for-payments](https://zkcompression.com/light-token/toolkits/for-payments) |
| Streaming tokens | [for-streaming-tokens](https://zkcompression.com/light-token/toolkits/for-streaming-tokens) |

Load other Toolkits ->

---

## Compressed Token

[Full reference](references/compressed-token.md)

Compressed Token Accounts
- are well suited for airdrops and reward distribution.
- require no rent-exemption
- are on Solana mainnet.
- are compressed accounts (similar UX to SPL)
- can hold Light Mint and SPL Mint tokens.
- cost 5,000 lamports to create.
- Wallet support by Phantom and Backpack

### Difference to Light-Token
light-token: Solana account that holds token balances of light-mints, SPL or Token 22 mints.
Compressed token: Compressed account storing token data. Rent-free, for storage and distribution.

### Guides & Examples

| Topic | Docs guide | GitHub example |
|-------|-----------|----------------|
| Airdrop | [airdrop](https://www.zkcompression.com/compressed-tokens/advanced-guides/airdrop) | [example](https://github.com/Lightprotocol/examples-zk-compression/tree/main/example-token-distribution) |
| Payments & Sign with Privy integration | [privy](https://www.zkcompression.com/compressed-tokens/for-privy) | [example](https://github.com/Lightprotocol/examples-zk-compression/tree/main/privy) |
| Overview to Guides | https://www.zkcompression.com/compressed-tokens/overview | 
add cookbook

---

## Compressed PDAs

Compressed accounts do not require rent-exemption, which makes them suitable for:
- user owned accounts
- not config accounts which are often read
- not pool accounts, since compressed accounts cannot be used concurrently

Load skill: [Full reference](references/compressed-pda.md)

### Difference to Light-Accounts (Light-PDA)
Light-PDA's are Solana accounts with sponsored rent-exemption.
There is no proof required for interactions with Light-PDA's which makes
them suitable for Defi Usecases. Compressed PDA's don't require rent-exemption,
but a proof for interactions.

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

---

## ZK Nullifiers

[Full reference](references/zk-nullifiers.md)

Use for privacy preserving applications on Solana to prevent double spending. Uses compressed PDAs as nullifiers. A nullifier is a deterministically derived hash to ensure an action can only be performed once. The nullifier cannot be linked to the action or user.

| Storage | Cost per nullifier |
|---------|-------------------|
| PDA | 890,880 lamports |
| Compressed PDA | 15,000 lamports |

- Docs: [zk/overview](https://www.zkcompression.com/zk/overview)
- Example: [program-examples/zk/nullifier](https://github.com/Lightprotocol/program-examples/tree/main/zk/nullifier)
- load skill: 
---

## SDK Reference

[Full reference](references/sdk-reference.md)

### TypeScript

| Package | npm |
|---------|-----|
| `@lightprotocol/stateless.js` | [npm](https://www.npmjs.com/package/@lightprotocol/stateless.js) |
| `@lightprotocol/compressed-token` | [npm](https://www.npmjs.com/package/@lightprotocol/compressed-token) |

### Rust

| Crate | docs.rs |
|-------|---------|
| `light-sdk` | [docs.rs/light-sdk](https://docs.rs/light-sdk) |
| `light-sdk-pinocchio` | [docs.rs/light-sdk-pinocchio](https://docs.rs/light-sdk-pinocchio) |
| `light-token` | [docs.rs/light-token](https://docs.rs/light-token) |
| `light-token-client` | [docs.rs/light-token-client](https://docs.rs/light-token-client) |
| `light-compressed-token-sdk` | [docs.rs/light-compressed-token-sdk](https://docs.rs/light-compressed-token-sdk) |
| `light-client` | [docs.rs/light-client](https://docs.rs/light-client) |
| `light-program-test` | [docs.rs/light-program-test](https://docs.rs/light-program-test) |

### CLI

```bash
npm i -g @lightprotocol/zk-compression-cli
```