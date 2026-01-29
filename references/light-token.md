# Light Token

## Light Token SDK

The base library to use Light Token Accounts, Light Mints, and compressed token accounts.

### Light Token Accounts
- are on Solana devnet.
- are Solana accounts.
- can hold tokens of Light, SPL and Token 2022 mints.
- cost 17,288 lamports to create with 24 hours rent.
- are rentfree:
    - rent exemption is sponsored by the token program.
    - rent is 388 lamports per rent epoch (1.5 hours).
    - once the account's lamports balance is insufficient, it is auto-compressed to a compressed token account.
    - the accounts state is cryptographically preserved on the Solana ledger.
    - compressed tokens can be decompressed to a Light Token account.
    - configurable lamports per write (eg transfer) keep the Light Token account perpetually funded when used. So you don't have to worry about funding rent.
    - users load a compressed account into a light account in-flight when using the account again.

### Light Mints
- are on Solana devnet.
- are Compressed accounts.
- cost 15,000 lamports to create.
- support `TokenMetadata`.
- have the same rent-config as light token accounts

## CPI Operations

For full program examples, see the [Light Token Examples](https://github.com/Lightprotocol/examples-light-token).

| Operation | Docs guide | GitHub example |
|-----------|-----------|----------------|
| `CreateAssociatedAccountCpi` | [create-ata](https://zkcompression.com/light-token/cookbook/create-ata) | [example](https://github.com/Lightprotocol/examples-light-token/tree/main/program-examples/anchor/basic-instructions/create-ata) |
| `CreateTokenAccountCpi` | [create-token-account](https://zkcompression.com/light-token/cookbook/create-token-account) | [example](https://github.com/Lightprotocol/examples-light-token/tree/main/program-examples/anchor/basic-instructions/create-token-account) |
| `CreateMintCpi` | [create-mint](https://zkcompression.com/light-token/cookbook/create-mint) | [example](https://github.com/Lightprotocol/examples-light-token/tree/main/program-examples/anchor/basic-instructions/create-mint) |
| `MintToCpi` | [mint-to](https://zkcompression.com/light-token/cookbook/mint-to) | [example](https://github.com/Lightprotocol/examples-light-token/tree/main/program-examples/anchor/basic-instructions/mint-to) |
| `MintToCheckedCpi` | [mint-to](https://zkcompression.com/light-token/cookbook/mint-to) | [example](https://github.com/Lightprotocol/examples-light-token/tree/main/program-examples/anchor/basic-instructions/mint-to-checked) |
| `BurnCpi` | [burn](https://zkcompression.com/light-token/cookbook/burn) | [example](https://github.com/Lightprotocol/examples-light-token/tree/main/program-examples/anchor/basic-instructions/burn) |
| `TransferCheckedCpi` | [transfer-checked](https://zkcompression.com/light-token/cookbook/transfer-checked) | [example](https://github.com/Lightprotocol/examples-light-token/tree/main/program-examples/anchor/basic-instructions/transfer-checked) |
| `TransferInterfaceCpi` | [transfer-interface](https://zkcompression.com/light-token/cookbook/transfer-interface) | [example](https://github.com/Lightprotocol/examples-light-token/tree/main/program-examples/anchor/basic-instructions/transfer-interface) |
| `ApproveCpi` | [approve-revoke](https://zkcompression.com/light-token/cookbook/approve-revoke) | [example](https://github.com/Lightprotocol/examples-light-token/tree/main/program-examples/anchor/basic-instructions/approve) |
| `RevokeCpi` | [approve-revoke](https://zkcompression.com/light-token/cookbook/approve-revoke) | [example](https://github.com/Lightprotocol/examples-light-token/tree/main/program-examples/anchor/basic-instructions/revoke) |
| `FreezeCpi` | [freeze-thaw](https://zkcompression.com/light-token/cookbook/freeze-thaw) | [example](https://github.com/Lightprotocol/examples-light-token/tree/main/program-examples/anchor/basic-instructions/freeze) |
| `ThawCpi` | [freeze-thaw](https://zkcompression.com/light-token/cookbook/freeze-thaw) | [example](https://github.com/Lightprotocol/examples-light-token/tree/main/program-examples/anchor/basic-instructions/thaw) |
| `CloseAccountCpi` | [close-token-account](https://zkcompression.com/light-token/cookbook/close-token-account) | [example](https://github.com/Lightprotocol/examples-light-token/tree/main/program-examples/anchor/basic-instructions/close-token-account) |

### Common Operations

| Operation | Instruction Builder | CPI Builder |
|-----------|----------------|-------------|
| Create Associated Token Account | `CreateAssociatedTokenAccount` | `CreateAssociatedAccountCpi` |
| Create Token Account | `CreateTokenAccount` | `CreateTokenAccountCpi` |
| Transfer | `Transfer` | `TransferCpi` |
| Transfer Interface (auto-detect) | `TransferInterface` | `TransferInterfaceCpi` |
| Close Token account | `CloseAccount` | `CloseAccountCpi` |
| Create Mint | `CreateMint` | `CreateMintCpi` |
| MintTo | `MintTo` | `MintToCpi` |

### Features

1. `anchor` - Derives AnchorSerialize, AnchorDeserialize instead of BorshSerialize, BorshDeserialize.
2. `compressible` - utility functions for compressible sdk macros.

## TypeScript Client

Rust client for light-token. Each action builds, signs, and sends the transaction.

| Action | Description |
|--------|-------------|
| `CreateMint` | Create a light-token mint with metadata |
| `CreateAta` | Create an associated light-token account |
| `MintTo` | Mint tokens to a light-token account |
| `Transfer` | Transfer light-tokens between accounts |
| `TransferChecked` | Transfer with decimal validation |
| `TransferInterface` | Transfer between light-token, T22, and SPL accounts |
| `Approve` | Approve a delegate |
| `Revoke` | Revoke a delegate |
| `Wrap` | Wrap SPL/T22 to light-token |
| `Unwrap` | Unwrap light-token to SPL/T22 |

### TypeScript Examples

- **create-mint** - Create a light-token mint
  - [Action](typescript-client/actions/create-mint.ts) | [Instruction](typescript-client/instructions/create-mint.ts)
- **create-ata** - Create an associated light-token account
  - [Action](typescript-client/actions/create-ata.ts) | [Instruction](typescript-client/instructions/create-ata.ts)
- **load-ata** - Load token accounts from light-token, compressed tokens, SPL/T22 to one unified balance.
  - [Action](typescript-client/actions/load-ata.ts) | [Instruction](typescript-client/instructions/load-ata.ts)
- **mint-to** - Mint tokens to a light-account
  - [Action](typescript-client/actions/mint-to.ts) | [Instruction](typescript-client/instructions/mint-to.ts)
- **transfer-interface** - Transfer between light-token, T22, and SPL accounts
  - [Action](typescript-client/actions/transfer-interface.ts) | [Instruction](typescript-client/instructions/transfer-interface.ts)
- **wrap** - Wrap SPL/T22 to light-token
  - [Action](typescript-client/actions/wrap.ts)
- **unwrap** - Unwrap light-token to SPL/T22
  - [Action](typescript-client/actions/unwrap.ts)

## Toolkits

| Toolkit | Docs |
|---------|------|
| Payments & wallets | [for-payments](https://zkcompression.com/light-token/toolkits/for-payments) |
| Wallets | [for-wallets](https://zkcompression.com/light-token/toolkits/for-wallets) |
| Streaming tokens | [for-streaming-tokens](https://zkcompression.com/light-token/toolkits/for-streaming-tokens) |
| Streaming mints | [for-streaming-mints](https://zkcompression.com/light-token/toolkits/for-streaming-mints) |

## SDKs

- Rust on-chain: [`light-token`](https://docs.rs/light-token) ([crates.io](https://crates.io/crates/light-token))
- Rust client: [`light-token-client`](https://docs.rs/light-token-client) ([crates.io](https://crates.io/crates/light-token-client))
- GitHub examples: [examples-light-token](https://github.com/Lightprotocol/examples-light-token)

## Disclaimer
This library is not audited and in a beta state. Use at your own risk and expect breaking changes.
