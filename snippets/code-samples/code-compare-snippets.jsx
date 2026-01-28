// Code snippets for CodeCompare components.
// Using array.join('\n') is formatter-proof - each line is explicit.

// === CREATE MINT ===
export const splCreateMintCode = [
  "// SPL createMint",
  'import { createMint } from "@solana/spl-token";',
  "",
  "const mint = await createMint(",
  "  connection,",
  "  payer,",
  "  mintAuthority,",
  "  freezeAuthority,",
  "  decimals",
  ");",
].join("\n");

export const lightCreateMintCode = [
  "// light-token createMint",
  'import { createMintInterface } from "@lightprotocol/compressed-token";',
  "",
  "const { mint } = await createMintInterface(",
  "  rpc,",
  "  payer,",
  "  mintAuthority,",
  "  freezeAuthority,",
  "  decimals,",
  "  mintKeypair",
  ");",
].join("\n");

// === MINT TO ===
export const splMintToCode = [
  "// SPL mintTo",
  'import { mintTo } from "@solana/spl-token";',
  "",
  "const tx = await mintTo(",
  "  connection,",
  "  payer,",
  "  mint,",
  "  destination,",
  "  mintAuthority,",
  "  amount",
  ");",
].join("\n");

export const lightMintToCode = [
  "// light-token mintTo",
  'import { mintToInterface } from "@lightprotocol/compressed-token";',
  "",
  "const tx = await mintToInterface(",
  "  rpc,",
  "  payer,",
  "  mint,",
  "  destination,",
  "  mintAuthority,",
  "  amount",
  ");",
].join("\n");

// === CREATE ATA ===
export const splCreateAtaCode = [
  "// SPL create ATA",
  'import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token";',
  "",
  "const ata = await getOrCreateAssociatedTokenAccount(",
  "  connection,",
  "  payer,",
  "  mint,",
  "  owner",
  ");",
].join("\n");

export const lightCreateAtaCode = [
  "// light-token create ATA",
  'import { createAtaInterface } from "@lightprotocol/compressed-token";',
  "",
  "const ata = await createAtaInterface(",
  "  rpc,",
  "  payer,",
  "  mint,",
  "  owner",
  ");",
].join("\n");

// === TRANSFER ===
export const splTransferCode = [
  "// SPL transfer",
  'import { transfer } from "@solana/spl-token";',
  "",
  "const tx = await transfer(",
  "  connection,",
  "  payer,",
  "  sourceAta,",
  "  destinationAta,",
  "  owner,",
  "  amount",
  ");",
].join("\n");

export const lightTransferCode = [
  "// light-token transfer",
  'import { transferInterface } from "@lightprotocol/compressed-token";',
  "",
  "const tx = await transferInterface(",
  "  rpc,",
  "  payer,",
  "  sourceAta,",
  "  mint,",
  "  destinationAta,",
  "  owner,",
  "  amount",
  ");",
].join("\n");

// === TRANSFER (RUST) ===
export const splTransferRustCode = [
  "// SPL transfer",
  "use spl_token::instruction::transfer;",
  "",
  "let ix = transfer(",
  "    &spl_token::id(),",
  "    &source,",
  "    &destination,",
  "    &authority,",
  "    &[],",
  "    amount,",
  ")?;",
].join("\n");

export const lightTransferRustCode = [
  "// light-token transfer",
  "use light_token_sdk::token::TransferInterface;",
  "",
  "let ix = TransferInterface {",
  "    source,",
  "    destination,",
  "    amount,",
  "    decimals,",
  "    authority: payer.pubkey(),",
  "    payer: payer.pubkey(),",
  "    spl_interface: None,",
  "    max_top_up: None,",
  "    source_owner: LIGHT_TOKEN_PROGRAM_ID,",
  "    destination_owner: LIGHT_TOKEN_PROGRAM_ID,",
  "}",
  ".instruction()?;",
].join("\n");

// === CREATE ATA (RUST) ===
export const splCreateAtaRustCode = [
  "// SPL create ATA",
  "use spl_associated_token_account::instruction::create_associated_token_account;",
  "",
  "let ix = create_associated_token_account(",
  "    &payer.pubkey(),",
  "    &owner.pubkey(),",
  "    &mint,",
  "    &spl_token::id(),",
  ");",
].join("\n");

export const lightCreateAtaRustCode = [
  "// light-token create ATA",
  "use light_token_sdk::token::CreateAssociatedTokenAccount;",
  "",
  "let ix = CreateAssociatedTokenAccount::new(",
  "    payer.pubkey(),",
  "    owner.pubkey(),",
  "    mint,",
  ")",
  ".instruction()?;",
].join("\n");

// === CREATE MINT (RUST) ===
export const splCreateMintRustCode = [
  "// SPL create mint",
  "use spl_token::instruction::initialize_mint;",
  "",
  "let ix = initialize_mint(",
  "    &spl_token::id(),",
  "    &mint.pubkey(),",
  "    &mint_authority,",
  "    Some(&freeze_authority),",
  "    decimals,",
  ")?;",
].join("\n");

export const lightCreateMintRustCode = [
  "// light-token create mint",
  "use light_token_sdk::token::CreateMint;",
  "",
  "let ix = CreateMint::new(",
  "    // includes decimals, mint_authority, freeze_authority, extensions, rent config",
  "    params,",
  "    mint_seed.pubkey(),",
  "    payer.pubkey(),",
  "    address_tree.tree,", 
  "    output_queue,", 
  ")",
  ".instruction()?;",
].join("\n");

// === MINT TO (RUST) ===
export const splMintToRustCode = [
  "// SPL mint to",
  "use spl_token::instruction::mint_to;",
  "",
  "let ix = mint_to(",
  "    &spl_token::id(),",
  "    &mint,",
  "    &destination,",
  "    &mint_authority,",
  "    &[],",
  "    amount,",
  ")?;",
].join("\n");

export const lightMintToRustCode = [
  "// light-token mint to",
  "use light_token_sdk::token::MintTo;",
  "",
  "let ix = MintTo {",
  "    mint,",
  "    destination,",
  "    amount,",
  "    authority: payer.pubkey(),",
  "    max_top_up: None,",
  "}",
  ".instruction()?;",
].join("\n");

// === CREATE TOKEN ACCOUNT (RUST) ===
export const splCreateTokenAccountRustCode = [
  "// SPL create token account",
  "use spl_token::instruction::initialize_account;",
  "",
  "let ix = initialize_account(",
  "    &spl_token::id(),",
  "    &account,",
  "    &mint,",
  "    &owner,",
  ")?;",
].join("\n");

export const lightCreateTokenAccountRustCode = [
  "// light-token create token account",
  "use light_token_sdk::token::CreateTokenAccount;",
  "",
  "let ix = CreateTokenAccount::new(",
  "    payer.pubkey(),",
  "    account.pubkey(),",
  "    mint,",
  "    owner,",
  ")",
  ".instruction()?;",
].join("\n");

// === CLOSE TOKEN ACCOUNT (RUST) ===
export const splCloseAccountRustCode = [
  "// SPL close account",
  "use spl_token::instruction::close_account;",
  "",
  "let ix = close_account(",
  "    &spl_token::id(),",
  "    &account,",
  "    &destination,",
  "    &owner,",
  "    &[],",
  ")?;",
].join("\n");

export const lightCloseAccountRustCode = [
  "// light-token close account",
  "use light_token_sdk::token::{CloseAccount, LIGHT_TOKEN_PROGRAM_ID};",
  "",
  "let ix = CloseAccount::new(",
  "    LIGHT_TOKEN_PROGRAM_ID,",
  "    account,",
  "    destination,",
  "    owner,",
  ")",
  ".instruction()?;",
].join("\n");

// === BLOG - CREATE ATA (different comments) ===
export const blogSplCreateAtaCode = [
  "// Create SPL token account",
  "const ix = createAssociatedTokenAccountInstruction(",
  "  payer,",
  "  ata,",
  "  owner,",
  "  mint",
  ");",
].join("\n");

export const blogLightCreateAtaCode = [
  "// Create light-token account",
  "const ix = CreateAssociatedTokenAccount.new(",
  "  payer,",
  "  account,",
  "  owner,",
  "  mint",
  ");",
].join("\n");

// === BURN (RUST) ===
export const splBurnRustCode = [
  "// SPL burn",
  "use spl_token::instruction::burn;",
  "",
  "let ix = burn(",
  "    &spl_token::id(),",
  "    &source,",
  "    &mint,",
  "    &authority,",
  "    &[],",
  "    amount,",
  ")?;",
].join("\n");

export const lightBurnRustCode = [
  "// light-token burn",
  "use light_token_sdk::token::Burn;",
  "",
  "let ix = Burn {",
  "    source,",
  "    mint,",
  "    amount,",
  "    authority: payer.pubkey(),",
  "    max_top_up: None,",
  "}",
  ".instruction()?;",
].join("\n");

// === FREEZE (RUST) ===
export const splFreezeRustCode = [
  "// SPL freeze",
  "use spl_token::instruction::freeze_account;",
  "",
  "let ix = freeze_account(",
  "    &spl_token::id(),",
  "    &account,",
  "    &mint,",
  "    &freeze_authority,",
  "    &[],",
  ")?;",
].join("\n");

export const lightFreezeRustCode = [
  "// light-token freeze",
  "use light_token_sdk::token::Freeze;",
  "",
  "let ix = Freeze {",
  "    token_account: ata,",
  "    mint,",
  "    freeze_authority: payer.pubkey(),",
  "}",
  ".instruction()?;",
].join("\n");

// === THAW (RUST) ===
export const splThawRustCode = [
  "// SPL thaw",
  "use spl_token::instruction::thaw_account;",
  "",
  "let ix = thaw_account(",
  "    &spl_token::id(),",
  "    &account,",
  "    &mint,",
  "    &freeze_authority,",
  "    &[],",
  ")?;",
].join("\n");

export const lightThawRustCode = [
  "// light-token thaw",
  "use light_token_sdk::token::Thaw;",
  "",
  "let ix = Thaw {",
  "    token_account: ata,",
  "    mint,",
  "    freeze_authority: payer.pubkey(),",
  "}",
  ".instruction()?;",
].join("\n");

// === APPROVE (RUST) ===
export const splApproveRustCode = [
  "// SPL approve",
  "use spl_token::instruction::approve;",
  "",
  "let ix = approve(",
  "    &spl_token::id(),",
  "    &source,",
  "    &delegate,",
  "    &owner,",
  "    &[],",
  "    amount,",
  ")?;",
].join("\n");

export const lightApproveRustCode = [
  "// light-token approve",
  "use light_token_sdk::token::Approve;",
  "",
  "let ix = Approve {",
  "    token_account: ata,",
  "    delegate: delegate.pubkey(),",
  "    owner: payer.pubkey(),",
  "    amount,",
  "}",
  ".instruction()?;",
].join("\n");

// === REVOKE (RUST) ===
export const splRevokeRustCode = [
  "// SPL revoke",
  "use spl_token::instruction::revoke;",
  "",
  "let ix = revoke(",
  "    &spl_token::id(),",
  "    &source,",
  "    &owner,",
  "    &[],",
  ")?;",
].join("\n");

export const lightRevokeRustCode = [
  "// light-token revoke",
  "use light_token_sdk::token::Revoke;",
  "",
  "let ix = Revoke {",
  "    token_account: ata,",
  "    owner: payer.pubkey(),",
  "}",
  ".instruction()?;",
].join("\n");

// === CREATE MINT MACRO (ANCHOR) ===
export const splCreateMintMacroCode = [
  "// SPL Token (Anchor)",
  "#[account(",
  "    init,",
  "    payer = fee_payer,",
  "    mint::decimals = 9,",
  "    mint::authority = fee_payer,",
  ")]",
  "pub mint: InterfaceAccount<'info, Mint>,",
].join("\n");

export const lightCreateMintMacroCode = [
  "// light-token (Anchor)",
  "#[light_account(init,",
  "    mint::signer = mint_signer,",
  "    mint::authority = fee_payer,",
  "    mint::decimals = 9,",
  "    mint::seeds = &[MINT_SIGNER_SEED, authority.key().as_ref()],",
  "    mint::bump = params.mint_signer_bump",
  ")]",
  "pub mint: UncheckedAccount<'info>,",
].join("\n");

// === CREATE MINT WITH METADATA MACRO (ANCHOR) ===
export const splCreateMintMetadataMacroCode = [
  "// SPL Token-2022 (Anchor)",
  "// Macro — only MetadataPointer is declarative",
  "#[account(",
  "    init,",
  "    payer = fee_payer,",
  "    mint::decimals = 9,",
  "    mint::authority = fee_payer,",
  "    extensions::metadata_pointer::authority = fee_payer,",
  "    extensions::metadata_pointer::metadata_address = mint_account,",
  ")]",
  "pub mint_account: InterfaceAccount<'info, Mint>,",
  "",
  "// Metadata fields require a separate CPI call",
  "// in the instruction handler:",
  "token_metadata_initialize(",
  "    cpi_ctx,",
  "    params.name,",
  "    params.symbol,",
  "    params.uri,",
  ")?;",
].join("\n");

export const lightCreateMintMetadataMacroCode = [
  "// light-token (Anchor)",
  "#[light_account(",
  "    init,",
  "    mint,",
  "    mint_signer = mint_signer,",
  "    authority = fee_payer,",
  "    decimals = 9,",
  "    mint_seeds = &[MINT_SIGNER_SEED, authority.key().as_ref(), &[params.mint_signer_bump]],",
  "    name = params.name.clone(),",
  "    symbol = params.symbol.clone(),",
  "    uri = params.uri.clone(),",
  "    update_authority = authority,",
  "    additional_metadata = params.additional_metadata.clone()",
  ")]",
  "pub mint: UncheckedAccount<'info>,",
].join("\n");
