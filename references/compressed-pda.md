# Compressed PDAs

The base library to use Compressed Accounts in Solana on-chain Rust and Anchor programs.
Compressed accounts do not require rent-exemption, which makes them suitable for:
- user owned accounts
- not config accounts which are often read
- not pool accounts, since compressed accounts cannot be used concurrently

Compressed Accounts store state as account hashes in State Merkle trees.
and unique addresses in Address Merkle trees.
Validity proofs (zero-knowledge proofs) verify that compressed account
state exists and new addresses do not exist yet.

- No rent exemption payment required.
- Constant 128-byte validity proof per transaction for one or multiple compressed accounts and addresses.
- Compressed account data is sent as instruction data when accessed.
- State and address trees are managed by the protocol.

For full program examples, see the [Program Examples](https://github.com/Lightprotocol/program-examples).
For detailed documentation, visit [zkcompression.com](https://www.zkcompression.com/).
For pinocchio solana program development see [`light-sdk-pinocchio`](https://docs.rs/light-sdk-pinocchio).
For rust client development see [`light-client`](https://docs.rs/light-client).
For rust program testing see [`light-program-test`](https://docs.rs/light-program-test).
For local test validator with light system programs see [Light CLI](https://www.npmjs.com/package/@lightprotocol/zk-compression-cli).

### Difference to Light-Accounts (Light-PDA)
Light-PDA's are Solana accounts with sponsored rent-exemption.
There is no proof required for interactions with Light-PDA's which makes
them suitable for Defi Usecases. Compressed PDA's don't require rent-exemption,
but a proof for interactions.

## Using Compressed Accounts in Solana Programs

1. [`Instruction`](https://docs.rs/light-sdk/latest/light_sdk/instruction/)
    - `CompressedAccountMeta` - Compressed account metadata structs for instruction data.
    - `PackedAccounts` - Abstraction to prepare accounts offchain for instructions with compressed accounts.
    - `ValidityProof` - Proves that new addresses don't exist yet, and compressed account state exists.
2. Compressed Account in Program
    - [`LightAccount`](https://docs.rs/light-sdk/latest/light_sdk/account/) - Compressed account abstraction similar to anchor Account.
    - [`derive_address`](https://docs.rs/light-sdk/latest/light_sdk/address/) - Create a compressed account address.
    - `LightDiscriminator` - DeriveMacro to derive a compressed account discriminator.
3. [`Cpi`](https://docs.rs/light-sdk/latest/light_sdk/cpi/)
    - `CpiAccounts` - Prepare accounts to cpi the light system program.
    - `LightSystemProgramCpi` - Prepare instruction data to cpi the light system program.
    - [`InvokeLightSystemProgram::invoke`](https://docs.rs/light-sdk/latest/light_sdk/cpi/) - Invoke the light system program via cpi.

## Client Program Interaction Flow

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

## Features

1. `anchor` - Derives AnchorSerialize, AnchorDeserialize instead of BorshSerialize, BorshDeserialize.

2. `v2`
    - available on devnet, localnet, and light-program-test.
    - Support for optimized v2 light system program instructions.

3. `cpi-context` - Enables CPI context operations for batched compressed account operations.
   - available on devnet, localnet, and light-program-test.
   - Enables the use of one validity proof across multiple cpis from different programs in one instruction.
   - For example spending compressed tokens (owned by the ctoken program) and updating a compressed pda (owned by a custom program)
     with one validity proof.
   - An instruction should not use more than one validity proof.
   - Requires the v2 feature.

## Example: Create a Compressed Account

```rust
use anchor_lang::{prelude::*, Discriminator};
use light_sdk::{
    account::LightAccount,
    address::v1::derive_address,
    cpi::{v1::LightSystemProgramCpi, CpiAccounts, InvokeLightSystemProgram, LightCpiInstruction},
    derive_light_cpi_signer,
    instruction::{account_meta::CompressedAccountMeta, PackedAddressTreeInfo},
    CpiSigner, LightDiscriminator, LightHasher, ValidityProof,
};

declare_id!("2tzfijPBGbrR5PboyFUFKzfEoLTwdDSHUjANCw929wyt");

pub const LIGHT_CPI_SIGNER: CpiSigner =
    derive_light_cpi_signer!("2tzfijPBGbrR5PboyFUFKzfEoLTwdDSHUjANCw929wyt");

#[program]
pub mod counter {

    use super::*;

    pub fn create_compressed_account<'info>(
        ctx: Context<'_, '_, '_, 'info, CreateCompressedAccount<'info>>,
        proof: ValidityProof,
        address_tree_info: PackedAddressTreeInfo,
        output_tree_index: u8,
    ) -> Result<()> {
        let light_cpi_accounts = CpiAccounts::new(
            ctx.accounts.fee_payer.as_ref(),
            ctx.remaining_accounts,
            crate::LIGHT_CPI_SIGNER,
        )?;

        let (address, address_seed) = derive_address(
            &[b"counter", ctx.accounts.fee_payer.key().as_ref()],
            &address_tree_info.get_tree_pubkey(&light_cpi_accounts)?,
            &crate::ID,
        );

        let mut new_account = LightAccount::<'_, CounterAccount>::new_init(
            &crate::ID,
            Some(address),
            output_tree_index,
        );

        new_account.counter = 0;

        let light_cpi = LightSystemProgramCpi::new(light_cpi_accounts, vec![proof])?;
        let instruction_data = LightCpiInstruction {
            inputs: Vec::new(),
            outputs: vec![new_account.to_account_info()?],
            address_tree_infos: vec![address_tree_info.into()],
            address_seeds: vec![address_seed],
        };
        light_cpi.invoke(instruction_data)?;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateCompressedAccount<'info> {
    #[account(mut)]
    pub fee_payer: Signer<'info>,
}

#[derive(Debug, LightDiscriminator, LightHasher)]
pub struct CounterAccount {
    #[hash]
    pub counter: u64,
}
```

## Guides

| Guide | Docs |
|-------|------|
| Create compressed accounts | [create](https://www.zkcompression.com/compressed-pdas/guides/how-to-create-compressed-accounts) |
| Update compressed accounts | [update](https://www.zkcompression.com/compressed-pdas/guides/how-to-update-compressed-accounts) |
| Close compressed accounts | [close](https://www.zkcompression.com/compressed-pdas/guides/how-to-close-compressed-accounts) |
| Reinitialize accounts | [reinit](https://www.zkcompression.com/compressed-pdas/guides/how-to-reinitialize-compressed-accounts) |
| Burn accounts | [burn](https://www.zkcompression.com/compressed-pdas/guides/how-to-burn-compressed-accounts) |
| Client guide (TS + Rust) | [client](https://www.zkcompression.com/client-library/client-guide) |
| Program examples | [examples](https://www.zkcompression.com/compressed-pdas/program-examples) |

## SDKs

- Rust on-chain (Anchor): [`light-sdk`](https://docs.rs/light-sdk) ([crates.io](https://crates.io/crates/light-sdk))
- Rust on-chain (Pinocchio): [`light-sdk-pinocchio`](https://docs.rs/light-sdk-pinocchio) ([crates.io](https://crates.io/crates/light-sdk-pinocchio))
- Rust client: [`light-client`](https://docs.rs/light-client) ([crates.io](https://crates.io/crates/light-client))
- Rust testing: [`light-program-test`](https://docs.rs/light-program-test) ([crates.io](https://crates.io/crates/light-program-test))
- TypeScript: [`@lightprotocol/stateless.js`](https://www.npmjs.com/package/@lightprotocol/stateless.js)
- GitHub examples: [program-examples](https://github.com/Lightprotocol/program-examples)
