# Compressed Account Operations - Terminology Reference

**Source:** how-to-create, update, close, reinitialize, burn compressed accounts

---

| Term | Precise Definition | Source | Avoid |
|------|-------------------|---------|-------|
| **Account Hash** | 32-byte identifier calculated from account data, owner, address, and tree position for locating account in state tree. Recalculated and changes on every write to the account. | All operations | "account identifier", "account reference" |
| **Address** | 32-byte persistent identifier for compressed account, derived from seeds and stored in address tree for PDA-like behavior. Does not change across state transitions. | Create (derived), Update/Close/Reinit/Burn (referenced) | "account address", "persistent identifier" |
| **Address Seed** | 32-byte value returned by `derive_address()` for passing to Light System Program to insert address into address tree. Required parameter for `with_new_addresses()`. | Create | "seed for address", "address derivation input" |
| **Address Tree** | Binary Merkle tree storing addresses for compressed accounts. Address derived from same seeds and program ID produces different address in different tree. Ensures address uniqueness within tree scope. | Create | "address storage", "uniqueness tree" |
| **anchor_lang** | Rust crate for Solana program development with automatic instruction deserialization and account validation. | "Anchor framework", "Anchor library" |
| **AnchorSerialize / AnchorDeserialize** | Traits for serializing account structs in Anchor programs. Applied via `#[derive()]` attribute. | "Anchor serialization", "serialization traits" |
| **borsh** | Binary serialization crate for native Rust programs. Smaller serialized size than bincode. | "serialization library", "Borsh framework" |
| **BorshSerialize / BorshDeserialize** | Traits for serializing account structs in native Rust programs. Applied via `#[derive()]` attribute. | "Borsh serialization", "serialization traits" |
| **b"authority"** | Seed bytes used to derive CPI signer PDA from program ID. Light System Program verifies CPI signer uses this seed. | "authority seed", "CPI seed" |
| **Burn** | Instruction that nullifies existing account hash in state tree and creates no output state. Account cannot be reinitialized after burn. | "permanent close operation", "account destruction" |
| **Close** | Instruction that nullifies existing account hash and creates new hash with zero discriminator and empty data. Account can be reinitialized after close. | "close operation", "account closure" |
| **Clone, Debug, Default** | Standard Rust traits required on compressed account struct for `LightAccount` wrapper. `Default` required for `new_empty()`. | "standard traits", "required traits" |
| **CompressedAccountMeta** | Account tree position metadata for instructions that create new account state (update, close, reinit). Contains `tree_info: PackedStateTreeInfo`, `address: [u8; 32]`, and `output_state_tree_index: u8` field. | Update, Close, Reinitialize | "account metadata", "compressed account data" |
| **CompressedAccountMetaBurn** | Account tree position metadata for permanent burn instructions. Contains `tree_info: PackedStateTreeInfo` and `address: [u8; 32]` but no `output_state_tree_index` field since account is permanently destroyed. | Burn | "burn metadata", "account metadata for burn" |
| **CPI (Cross-Program Invocation)** | Call from your program to Light System Program with signed PDA and accounts for state transitions. Executes atomically within same transaction. | All operations | "program call", "cross-program operation" |
| **CPI Authority PDA** | PDA with seed `b"authority"` derived from your program ID for signing all CPIs to Light System Program. Verified by Light System Program during CPI. | All operations | "CPI signer", "authority PDA" |
| **CpiAccounts** | Struct parsing signer and remaining_accounts into accounts array for Light System Program CPI. Created with `CpiAccounts::new()`. | "CPI accounts wrapper", "accounts for CPI" |
| **CpiSigner** | Struct containing PDA pubkey and bump for signing CPIs. Derived at compile time with `derive_light_cpi_signer!` macro. | "CPI signer struct", "signer configuration" |
| **Create** | Instruction that proves address doesn't exist in address tree, inserts address, and appends new account hash to state tree. | "create operation", "account initialization" |
| **ctx.accounts.signer** | Anchor account struct field containing transaction signer. Accessed in Anchor instructions via `Context` parameter. | "signer account", "transaction signer" |
| **ctx.remaining_accounts** | Anchor field containing slice of additional accounts: system accounts and packed tree accounts. Passed to `CpiAccounts::new()`. | "remaining accounts", "additional accounts" |
| **declare_id!** | Anchor macro defining program's unique public key. Generates `ID` constant and `id()` function. | "program ID macro", "ID declaration" |
| **derive_address()** | Function that derives address from custom_seeds, address_tree_pubkey, and program_id. Returns `(address, address_seed)` tuple. | "address derivation", "generates address" |
| **derive_light_cpi_signer!** | Macro that derives CPI signer PDA at compile time from program ID string. Creates `CpiSigner` constant. | "CPI signer macro", "derives CPI signer" |
| **Discriminator** | 8-byte unique type ID for compressed account struct. Stored in separate field, not first 8 bytes of data like Anchor accounts. | "type ID", "account discriminator" |
| **entrypoint!** | Macro defining entry point for native Rust programs. Routes to `process_instruction(program_id, accounts, instruction_data)`. | "program entry point", "entrypoint macro" |
| **getCompressedAccount()** | RPC method fetching current compressed account by address or hash. Returns account data, tree position, and metadata. | "fetch account", "get account data" |
| **getValidityProof()** | RPC method generating proof that account hash exists in state tree or address doesn't exist in address tree. Returns `ValidityProof` struct. | "get proof", "generate proof" |
| **get_tree_pubkey()** | Method on `PackedAddressTreeInfo` and `PackedStateTreeInfo` that unpacks u8 index to retrieve actual tree account pubkey from `CpiAccounts`. | "retrieve tree pubkey", "unpack tree pubkey" |
| **into_new_address_params_packed()** | Method on `PackedAddressTreeInfo` converting tree info and address_seed into `NewAddressParamsPacked` for CPI. | "create address params", "convert to params" |
| **invoke()** | Final method in CPI builder chain that executes CPI to Light System Program with parsed accounts. Returns `Result<()>`. | "execute CPI", "call program" |
| **LightAccount<T>** | Wrapper type for compressed account struct. Similar to Anchor's `Account<T>` but for compressed accounts. | "account wrapper", "compressed account wrapper" |
| **LightAccount::new_burn()** | Creates `LightAccount` that hashes current account data as input and creates no output state. Account permanently destroyed. | "burn wrapper", "permanent destruction wrapper" |
| **LightAccount::new_close()** | Creates `LightAccount` that hashes current account data as input and creates output with zero discriminator and empty data. | "close wrapper", "closure wrapper" |
| **LightAccount::new_empty()** | Creates `LightAccount` that reconstructs closed account hash (zero values) as input and creates output with default-initialized values. | "reinit wrapper", "empty account wrapper" |
| **LightAccount::new_init()** | Creates `LightAccount` with no input hash and output containing initial account data at specified address and output state tree. | "init wrapper", "initialization wrapper" |
| **LightAccount::new_mut()** | Creates `LightAccount` that hashes current account data as input and allows modifying output state. Returns mutable reference. | "update wrapper", "mutation wrapper" |
| **LightDiscriminator** | Trait deriving 8-byte type ID from struct name. Applied via `#[derive(LightDiscriminator)]` on compressed account struct. | "discriminator trait", "type ID trait" |
| **light-sdk** | Rust crate providing macros, CPI interface, and account wrappers for compressed accounts. Core dependency for compressed account programs. | "Light SDK", "compression SDK" |
| **LightSystemProgramCpi** | Builder struct for constructing CPI instruction to Light System Program. Created with `new_cpi()`, configured with `with_*()` methods. | "CPI builder", "instruction builder" |
| **Light System Program** | Program verifying validity proofs, checking account ownership, and invoking Account Compression Program to update trees. Program ID: SySTEM1eSU2p4BGQfQpimFEWWSC1XDFeun3Nqzz3rT7 | "Light System", "system program" |
| **Account Compression Program** | Program writing to state and address tree accounts. Invoked by Light System Program, never directly by client or user program. Program ID: compr6CUsB5m2jS4Y3831ztGSTnDpnKJTKS95d64XVq | "compression program", "tree program" |
| **Noop Program** | Program logging compressed account state to Solana ledger for indexers to parse (v1 only). Program ID: noopb9bkMVfRPU8AsbpTUg8AQkHtKwMYZiFUjNRtMmV | "logging program", "noop" |
| **System Program** | Solana program for lamport transfers between accounts. Program ID: 11111111111111111111111111111111 | "Solana System Program", "native program" |
| **msg!** | Macro writing string to program logs visible in transaction response. Used for debugging. | "log macro", "logging" |
| **new_cpi()** | Static method on `LightSystemProgramCpi` initializing CPI instruction with `CpiSigner` and `ValidityProof`. First call in builder chain. | "create CPI", "initialize CPI" |
| **Nullification** | Marks existing account hash as spent in state tree by setting leaf to nullified state. Prevents double spending. | "nullify operation", "account invalidation" |
| **output_state_tree_index** | u8 index pointing to state tree account in packed accounts array. Specifies which state tree stores new account hash. | "output tree index", "state tree index" |
| **PackedAccounts** | Client-side pattern to pack account pubkeys into an accounts array to pass u8 indices instead of 32-byte pubkeys in instruction data. Reduces transaction size. | "packed accounts pattern", "account packing" |
| **PackedAddressTreeInfo** | Struct with `address_merkle_tree_pubkey_index: u8` pointing to address tree account in packed accounts array. | "address tree info", "packed address tree" |
| **PackedStateTreeInfo** | Struct with `state_merkle_tree_pubkey_index: u8` pointing to state tree account in packed accounts array. | "state tree info", "packed state tree" |
| **process_instruction** | Entry point function for native Rust programs. Receives `program_id: &Pubkey`, `accounts: &[AccountInfo]`, `instruction_data: &[u8]`. | "instruction processor", "entry function" |
| **#[program]** | Anchor attribute marking module as program implementation. Contains instruction handler functions. | "program module", "program attribute" |
| **Pubkey** | 32-byte Solana public key type from `solana_program` crate. Used for addresses, program IDs, and tree accounts. | "public key", "address type" |
| **Registered Program PDA** | PDA controlling which programs can invoke Account Compression Program. Derived from Light System Program. | "registration PDA", "access control PDA" |
| **Reinitialize** | Instruction that proves closed account hash exists in state tree, nullifies it, and creates new hash with default values at same address. | "reinit operation", "reopening account" |
| **remaining_accounts** | Slice of accounts after signer in native Rust programs. Contains system accounts (8 accounts) followed by packed tree accounts. | "additional accounts", "extra accounts" |
| **#[repr(u8)]** | Rust attribute specifying enum uses u8 as discriminant. Used for `InstructionType` enum in native programs. | "enum representation", "u8 enum" |
| **signer** | First account in accounts array that signs transaction and pays fees. Extracted with `accounts.first()` in native programs. | "fee payer", "transaction signer" |
| **Signer<'info>** | Anchor account type ensuring account signed transaction. Applied via `#[account(mut)]` attribute on signer field. | "Anchor signer", "signer account type" |
| **split_first()** | Rust slice method separating first element from rest. Used to extract signer from remaining accounts in native programs. | "split accounts", "extract signer" |
| **State Root** | Root hash of state tree, cryptographic commitment to all account hashes in tree. Included in validity proof and verified on-chain. | "tree root", "Merkle root" |
| **State Tree** | Binary Merkle tree storing compressed account hashes. Multiple state trees can exist; they are fungible. | "account tree", "hash tree" |
| **try_from_slice** | Borsh method deserializing bytes into typed struct. Returns `Result<T, std::io::Error>`. | "deserialize", "parse bytes" |
| **Update** | Instruction that proves account hash exists in state tree, nullifies old hash, and appends new hash with updated data. Uses UTXO pattern. | "update operation", "account modification" |
| **UTXO Pattern** | Pattern where update instruction consumes existing account hash and produces new hash with different data. Prevents in-place mutation. | "update pattern", "consume-produce pattern" |
| **ValidityProof** | Struct with proof that address doesn't exist in address tree (for create) or account hash exists in state tree (for update/close/reinit/burn). Constant 128 bytes. | "proof struct", "zero-knowledge proof" |
| **with_light_account()** | Method on `LightSystemProgramCpi` adding `LightAccount` wrapper to CPI instruction. Second call in builder chain after `new_cpi()`. | "add account", "set account data" |
| **with_new_addresses()** | Method on `LightSystemProgramCpi` adding address parameters for inserting addresses into address tree. Only used in create instructions. | "add addresses", "set new addresses" |
| **Zero Discriminator** | Discriminator set to `[0u8; 8]` in closed account. Indicates account has no type and is closed. | "null discriminator", "closed state discriminator" |
| **Zero Values** | Account with zero discriminator and empty data vector. Created by close instruction, consumed by reinitialize instruction. | "empty account", "closed account state" |

---

## SDK Method Signatures

| Method | Signature | Returns | Description |
|--------|-----------|---------|-------------|
| **CpiAccounts::new** | `(signer: &AccountInfo, remaining: &[AccountInfo], cpi_signer: CpiSigner)` | `CpiAccounts` | Parse accounts array into system accounts and tree accounts for Light System Program CPI |
| **LightAccount::<T>::new_init** | `(program_id: &Pubkey, address: Option<[u8; 32]>, output_state_tree_index: u8)` | `LightAccount<T>` | Create wrapper with no input hash and output containing initial values |
| **LightAccount::<T>::new_mut** | `(program_id: &Pubkey, account_meta: &CompressedAccountMeta, current_data: T)` | `Result<LightAccount<T>>` | Create wrapper hashing current_data as input and allowing output modification |
| **LightAccount::<T>::new_close** | `(program_id: &Pubkey, account_meta: &CompressedAccountMeta, current_data: T)` | `Result<LightAccount<T>>` | Create wrapper hashing current_data as input and output with zero discriminator and empty data |
| **LightAccount::<T>::new_empty** | `(program_id: &Pubkey, account_meta: &CompressedAccountMeta)` | `Result<LightAccount<T>>` | Create wrapper reconstructing closed hash as input and output with default values |
| **LightAccount::<T>::new_burn** | `(program_id: &Pubkey, account_meta: &CompressedAccountMetaBurn, current_data: T)` | `Result<LightAccount<T>>` | Create wrapper hashing current_data as input and no output state |
| **LightSystemProgramCpi::new_cpi** | `(cpi_signer: CpiSigner, proof: ValidityProof)` | `LightSystemProgramCpi` | Initialize CPI builder with signer and proof |
| **derive_address** | `(custom_seeds: &[&[u8]], address_tree_pubkey: &Pubkey, program_id: &Pubkey)` | `([u8; 32], [u8; 32])` | Derive address from seeds and tree, return (address, address_seed) |

---

## System Accounts Array (All Operations)

All CPIs to Light System Program require these 8 accounts in remaining_accounts:

| Index | Account | Pubkey/PDA | Description |
|-------|---------|------------|-------------|
| 0 | Light System Program | SySTEM1eSU2p4BGQfQpimFEWWSC1XDFeun3Nqzz3rT7 | Verifies proof, checks ownership, invokes Account Compression Program |
| 1 | CPI Signer | PDA from your program ID + `b"authority"` | Signs CPI from your program to Light System Program |
| 2 | Registered Program PDA | PDA from Light System Program | Controls which programs invoke Account Compression Program |
| 3 | Noop Program | noopb9bkMVfRPU8AsbpTUg8AQkHtKwMYZiFUjNRtMmV | Logs account state to ledger (v1 only) |
| 4 | Account Compression Authority | HZH7qSLcpAeDqCopVU4e5XkhT9j3JFsQiq8CmruY3aru | Signs CPI from Light System to Account Compression Program |
| 5 | Account Compression Program | compr6CUsB5m2jS4Y3831ztGSTnDpnKJTKS95d64XVq | Writes to state and address tree accounts |
| 6 | Invoking Program | Your program ID | Derives CPI signer and sets owner on created accounts |
| 7 | System Program | 11111111111111111111111111111111 | Transfers lamports for fees |