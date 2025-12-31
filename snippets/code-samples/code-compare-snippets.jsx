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
