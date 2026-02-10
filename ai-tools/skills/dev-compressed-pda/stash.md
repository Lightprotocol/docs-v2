## Compressed PDAs

[Full reference](references/compressed-pda.md)

Compressed accounts do not require rent-exemption, which makes them suitable for:
- user owned accounts
- not config accounts which are often read
- not pool accounts, since compressed accounts cannot be used concurrently

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

### Using Compressed Accounts in Programs

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