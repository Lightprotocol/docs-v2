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

## Program Examples

For full program examples, see the [Light Token Examples](https://github.com/Lightprotocol/examples-light-token).

### Instructions

The instructions use pure CPI calls which you can combine with existing and / or light macros.
For existing programs, you can replace spl_token with light_token instructions as you need. The API is a superset of SPL-token so switching is straightforward.

|  | Description |
|---------|-------------|
| [approve](https://github.com/Lightprotocol/examples-light-token/blob/main/programs/anchor/basic-instructions/approve/src/lib.rs) | Approve delegate via CPI |
| [burn](https://github.com/Lightprotocol/examples-light-token/blob/main/programs/anchor/basic-instructions/burn/src/lib.rs) | Burn tokens via CPI |
| [close](https://github.com/Lightprotocol/examples-light-token/blob/main/programs/anchor/basic-instructions/close/src/lib.rs) | Close token account via CPI |
| [create-associated-token-account](https://github.com/Lightprotocol/examples-light-token/blob/main/programs/anchor/basic-instructions/create-ata/src/lib.rs) | Create associated light-token account via CPI |
| [create-mint](https://github.com/Lightprotocol/examples-light-token/blob/main/programs/anchor/basic-instructions/create-mint/src/lib.rs) | Create light-token mint via CPI |
| [create-token-account](https://github.com/Lightprotocol/examples-light-token/blob/main/programs/anchor/basic-instructions/create-token-account/src/lib.rs) | Create light-token account via CPI |
| [freeze](https://github.com/Lightprotocol/examples-light-token/blob/main/programs/anchor/basic-instructions/freeze/src/lib.rs) | Freeze token account via CPI |
| [mint-to](https://github.com/Lightprotocol/examples-light-token/blob/main/programs/anchor/basic-instructions/mint-to/src/lib.rs) | Mint tokens via CPI |
| [revoke](https://github.com/Lightprotocol/examples-light-token/blob/main/programs/anchor/basic-instructions/revoke/src/lib.rs) | Revoke delegate via CPI |
| [thaw](https://github.com/Lightprotocol/examples-light-token/blob/main/programs/anchor/basic-instructions/thaw/src/lib.rs) | Thaw token account via CPI |
| [transfer-checked](https://github.com/Lightprotocol/examples-light-token/blob/main/programs/anchor/basic-instructions/transfer-checked/src/lib.rs) | Transfer with mint validation via CPI |
| [transfer-interface](https://github.com/Lightprotocol/examples-light-token/blob/main/programs/anchor/basic-instructions/transfer-interface/src/lib.rs) | Transfer between light-token, T22, and SPL accounts via CPI |

### Macros

|  | Description |
|---------|-------------|
| [counter](https://github.com/Lightprotocol/examples-light-token/tree/main/programs/anchor/basic-macros/counter) | Create PDA with sponsored rent-exemption |
| [create-associated-token-account](https://github.com/Lightprotocol/examples-light-token/tree/main/programs/anchor/basic-macros/create-ata) | Create associated light-token account |
| [create-mint](https://github.com/Lightprotocol/examples-light-token/tree/main/programs/anchor/basic-macros/create-mint) | Create light-token mint |
| [create-token-account](https://github.com/Lightprotocol/examples-light-token/tree/main/programs/anchor/basic-macros/create-token-account) | Create light-token account |

### Examples

|  | Description |
|---------|-------------|
| [create-and-transfer](https://github.com/Lightprotocol/examples-light-token/tree/main/programs/anchor/create-and-transfer) | Create account via macro and transfer via CPI |

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
  - [Action](https://github.com/Lightprotocol/examples-light-token/blob/main/typescript-client/actions/create-mint.ts) | [Instruction](https://github.com/Lightprotocol/examples-light-token/blob/main/typescript-client/instructions/create-mint.ts)
- **create-ata** - Create an associated light-token account
  - [Action](https://github.com/Lightprotocol/examples-light-token/blob/main/typescript-client/actions/create-ata.ts) | [Instruction](https://github.com/Lightprotocol/examples-light-token/blob/main/typescript-client/instructions/create-ata.ts)
- **load-ata** - Load token accounts from light-token, compressed tokens, SPL/T22 to one unified balance.
  - [Action](https://github.com/Lightprotocol/examples-light-token/blob/main/typescript-client/actions/load-ata.ts) | [Instruction](https://github.com/Lightprotocol/examples-light-token/blob/main/typescript-client/instructions/load-ata.ts)
- **mint-to** - Mint tokens to a light-account
  - [Action](https://github.com/Lightprotocol/examples-light-token/blob/main/typescript-client/actions/mint-to.ts) | [Instruction](https://github.com/Lightprotocol/examples-light-token/blob/main/typescript-client/instructions/mint-to.ts)
- **transfer-interface** - Transfer between light-token, T22, and SPL accounts
  - [Action](https://github.com/Lightprotocol/examples-light-token/blob/main/typescript-client/actions/transfer-interface.ts) | [Instruction](https://github.com/Lightprotocol/examples-light-token/blob/main/typescript-client/instructions/transfer-interface.ts)
- **wrap** - Wrap SPL/T22 to light-token
  - [Action](https://github.com/Lightprotocol/examples-light-token/blob/main/typescript-client/actions/wrap.ts)
- **unwrap** - Unwrap light-token to SPL/T22
  - [Action](https://github.com/Lightprotocol/examples-light-token/blob/main/typescript-client/actions/unwrap.ts)

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
