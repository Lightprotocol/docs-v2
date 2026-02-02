// Code snippets for CodeCompare components.
// Using array.join('\n') is formatter-proof - each line is explicit.

// === CREATE MINT ===
export const splCreateMintCode = [
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
  "use light_token::instruction::TransferInterface;",
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
  "use light_token::instruction::CreateAssociatedTokenAccount;",
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
  "use light_token::instruction::CreateMint;",
  "",
  "let ix = CreateMint::new(",
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
  "use light_token::instruction::MintTo;",
  "",
  "let ix = MintTo {",
  "    mint,",
  "    destination,",
  "    amount,",
  "    authority: payer.pubkey(),",
  "    max_top_up: None,",
  "    fee_payer: None,",
  "}",
  ".instruction()?;",
].join("\n");

// === CREATE TOKEN ACCOUNT (RUST) ===
export const splCreateTokenAccountRustCode = [
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
  "use light_token::instruction::CreateTokenAccount;",
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
  "use light_token::instruction::{CloseAccount, LIGHT_TOKEN_PROGRAM_ID};",
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
  "const ix = createAssociatedTokenAccountInstruction(",
  "  payer,",
  "  ata,",
  "  owner,",
  "  mint",
  ");",
].join("\n");

export const blogLightCreateAtaCode = [
  "const ix = CreateAssociatedTokenAccount.new(",
  "  payer,",
  "  account,",
  "  owner,",
  "  mint",
  ");",
].join("\n");

// === BURN (RUST) ===
export const splBurnRustCode = [
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
  "use light_token::instruction::Burn;",
  "",
  "let ix = Burn {",
  "    source,",
  "    mint,",
  "    amount,",
  "    authority: payer.pubkey(),",
  "    max_top_up: None,",
  "    fee_payer: None,",
  "}",
  ".instruction()?;",
].join("\n");

// === FREEZE (RUST) ===
export const splFreezeRustCode = [
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
  "use light_token::instruction::Freeze;",
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
  "use light_token::instruction::Thaw;",
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
  "use light_token::instruction::Approve;",
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
  "use light_token::instruction::Revoke;",
  "",
  "let ix = Revoke {",
  "    token_account: ata,",
  "    owner: payer.pubkey(),",
  "}",
  ".instruction()?;",
].join("\n");

// === APPROVE (TYPESCRIPT) ===
export const splApproveCode = [
  'import { approve } from "@solana/spl-token";',
  "",
  "const tx = await approve(",
  "  connection,",
  "  payer,",
  "  source,",
  "  delegate,",
  "  owner,",
  "  amount",
  ");",
].join("\n");

export const lightApproveCode = [
  'import { approve } from "@lightprotocol/compressed-token";',
  "",
  "const tx = await approve(",
  "  rpc,",
  "  payer,",
  "  mint,",
  "  amount,",
  "  owner,",
  "  delegate",
  ");",
].join("\n");

// === REVOKE (TYPESCRIPT) ===
export const splRevokeCode = [
  'import { revoke } from "@solana/spl-token";',
  "",
  "const tx = await revoke(",
  "  connection,",
  "  payer,",
  "  source,",
  "  owner",
  ");",
].join("\n");

export const lightRevokeCode = [
  'import { revoke } from "@lightprotocol/compressed-token";',
  "",
  "const tx = await revoke(",
  "  rpc,",
  "  payer,",
  "  delegatedAccounts,",
  "  owner",
  ");",
].join("\n");

// === CREATE MINT MACRO (ANCHOR) ===
export const splCreateMintMacroCode = [
  "#[account(",
  "    init,",
  "    payer = fee_payer,",
  "    mint::decimals = 9,",
  "    mint::authority = fee_payer,",
  ")]",
  "pub mint: InterfaceAccount<'info, Mint>,",
].join("\n");

export const lightCreateMintMacroCode = [
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
  "// Metadata requires a separate CPI:",
  "token_metadata_initialize(",
  "    cpi_ctx,",
  "    params.name,",
  "    params.symbol,",
  "    params.uri,",
  ")?;",
].join("\n");

export const lightCreateMintMetadataMacroCode = [
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

// === CREATE ATA MACRO (ANCHOR) ===
export const splCreateAtaMacroCode = [
  "#[account(",
  "    init_if_needed,",
  "    payer = fee_payer,",
  "    associated_token::mint = mint,",
  "    associated_token::authority = owner,",
  ")]",
  "pub ata: Account<'info, TokenAccount>,",
].join("\n");

export const lightCreateAtaMacroCode = [
  "#[light_account(init,",
  "    associated_token::authority = ata_owner,",
  "    associated_token::mint = ata_mint,",
  "    associated_token::bump = params.ata_bump",
  ")]",
  "pub ata: UncheckedAccount<'info>,",
].join("\n");

// === CREATE TOKEN ACCOUNT MACRO (ANCHOR) ===
export const splCreateTokenAccountMacroCode = [
  "#[account(",
  "    init,",
  "    payer = fee_payer,",
  "    token::mint = mint,",
  "    token::authority = authority,",
  ")]",
  "pub vault: Account<'info, TokenAccount>,",
].join("\n");

export const lightCreateTokenAccountMacroCode = [
  "#[account(",
  "    mut,",
  "    seeds = [VAULT_SEED, mint.key().as_ref()],",
  "    bump,",
  ")]",
  "#[light_account(init,",
  "    token::authority = [VAULT_SEED, self.mint.key()],",
  "    token::mint = mint,",
  "    token::owner = vault_authority,",
  "    token::bump = params.vault_bump",
  ")]",
  "pub vault: UncheckedAccount<'info>,",
].join("\n");

// === CREATE ATA CPI (RUST) ===
export const splCreateAtaCpiCode = [
  "use spl_associated_token_account::instruction::create_associated_token_account;",
  "",
  "let ix = create_associated_token_account(",
  "    &payer.pubkey(),",
  "    &owner.pubkey(),",
  "    &mint,",
  "    &spl_token::id(),",
  ");",
  "",
  "invoke(&ix, &[payer, owner, mint])?;",
].join("\n");

export const lightCreateAtaCpiCode = [
  "use light_token::instruction::CreateAssociatedAccountCpi;",
  "",
  "CreateAssociatedAccountCpi {",
  "    payer: payer.clone(),",
  "    owner: owner.clone(),",
  "    mint: mint.clone(),",
  "    ata: associated_token_account.clone(),",
  "    bump,",
  "}",
  ".rent_free(",
  "    compressible_config.clone(),",
  "    rent_sponsor.clone(),",
  "    system_program.clone(),",
  ")",
  ".invoke()?",
].join("\n");

// === CREATE TOKEN ACCOUNT CPI (RUST) ===
export const splCreateTokenAccountCpiCode = [
  "use spl_token::instruction::initialize_account;",
  "",
  "let ix = initialize_account(",
  "    &spl_token::id(),",
  "    &account,",
  "    &mint,",
  "    &owner,",
  ")?;",
  "",
  "invoke(&ix, &[account, mint, owner])?;",
].join("\n");

export const lightCreateTokenAccountCpiCode = [
  "use light_token::instruction::CreateTokenAccountCpi;",
  "",
  "CreateTokenAccountCpi {",
  "    payer: payer.clone(),",
  "    account: account.clone(),",
  "    mint: mint.clone(),",
  "    owner,",
  "}",
  ".rent_free(",
  "    compressible_config.clone(),",
  "    rent_sponsor.clone(),",
  "    system_program.clone(),",
  "    token_program.key,",
  ")",
  ".invoke()?",
].join("\n");

// === CREATE MINT CPI (RUST) ===
export const splCreateMintCpiCode = [
  "use spl_token::instruction::initialize_mint;",
  "",
  "let ix = initialize_mint(",
  "    &spl_token::id(),",
  "    &mint.pubkey(),",
  "    &mint_authority,",
  "    Some(&freeze_authority),",
  "    decimals,",
  ")?;",
  "",
  "invoke(&ix, &[mint, rent_sysvar])?;",
].join("\n");

export const lightCreateMintCpiCode = [
  "use light_token::instruction::CreateMintCpi;",
  "",
  "CreateMintCpi::new(",
  "    mint_seed.clone(),",
  "    authority.clone(),",
  "    payer.clone(),",
  "    address_tree.clone(),",
  "    output_queue.clone(),",
  "    compressible_config.clone(),",
  "    mint.clone(),",
  "    rent_sponsor.clone(),",
  "    system_accounts,",
  "    params,",
  ")",
  ".invoke()?",
].join("\n");

// === CREATE MINT WITH METADATA CPI (RUST) ===
export const splCreateMintMetadataCpiCode = [
  "use spl_token_2022::instruction::initialize_mint;",
  "use spl_token_metadata_interface::instruction::initialize as init_metadata;",
  "",
  "let ix_mint = initialize_mint(",
  "    &spl_token_2022::id(),",
  "    &mint.pubkey(),",
  "    &mint_authority,",
  "    Some(&freeze_authority),",
  "    decimals,",
  ")?;",
  "invoke(&ix_mint, &[mint.clone(), rent_sysvar.clone()])?;",
  "",
  "let ix_meta = init_metadata(",
  "    &spl_token_2022::id(),",
  "    &mint.pubkey(),",
  "    &update_authority,",
  "    &mint.pubkey(),",
  "    &mint_authority,",
  "    name, symbol, uri,",
  ")?;",
  "invoke(&ix_meta, &[mint, update_auth])?;",
].join("\n");

export const lightCreateMintMetadataCpiCode = [
  "use light_token::instruction::CreateMintCpi;",
  "",
  "let extensions = Some(vec![",
  "    ExtensionInstructionData::TokenMetadata(",
  "        TokenMetadataInstructionData {",
  "            update_authority: Some(authority.key.to_bytes().into()),",
  '            name: b"Example Token".to_vec(),',
  '            symbol: b"EXT".to_vec(),',
  '            uri: b"https://example.com/metadata.json".to_vec(),',
  "            additional_metadata: None,",
  "        },",
  "    ),",
  "]);",
  "",
  "CreateMintCpi::new(",
  "    mint_seed.clone(),",
  "    authority.clone(),",
  "    payer.clone(),",
  "    address_tree.clone(),",
  "    output_queue.clone(),",
  "    compressible_config.clone(),",
  "    mint.clone(),",
  "    rent_sponsor.clone(),",
  "    system_accounts,",
  "    params, // includes extensions",
  ")",
  ".invoke()?",
].join("\n");
