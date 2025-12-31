import { CodeRunner, type CodeTab } from "@/components/code-runner";
import { highlightCode } from "@/lib/highlighter";

const actionCode = `const rpc = createRpc();
const payer = Keypair.generate();

// Airdrop SOL to payer
const sig = await rpc.requestAirdrop(payer.publicKey, 10e9);
await rpc.confirmTransaction(sig);

// Create mint with token metadata
const { mint, transactionSignature } = await createMintInterface(
  rpc,
  payer,
  payer,      // mintAuthority
  null,       // freezeAuthority
  9,          // decimals
  undefined,
  undefined,
  undefined,
  createTokenMetadata(
    "Example Token",
    "EXT",
    "https://example.com/metadata.json"
  )
);

console.log("Mint:", mint.toBase58());
console.log("Tx:", transactionSignature);`;

const instructionCode = `const COMPRESSED_MINT_SEED = Buffer.from("compressed_mint");

function findMintAddress(mintSigner: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [COMPRESSED_MINT_SEED, mintSigner.toBuffer()],
    CTOKEN_PROGRAM_ID
  );
}

const rpc = createRpc();
const payer = Keypair.generate();

// Airdrop SOL
const sig = await rpc.requestAirdrop(payer.publicKey, 10e9);
await rpc.confirmTransaction(sig);

const mintSigner = Keypair.generate();
const addressTreeInfo = getBatchAddressTreeInfo();
const stateTreeInfo = selectStateTreeInfo(await rpc.getStateTreeInfos());
const [mintPda] = findMintAddress(mintSigner.publicKey);

// Get validity proof
const validityProof = await rpc.getValidityProofV2(
  [],
  [{ address: mintPda.toBytes(), treeInfo: addressTreeInfo }],
  DerivationMode.compressible
);

// Create mint instruction
const ix = createMintInstruction(
  mintSigner.publicKey,
  9,
  payer.publicKey,
  null,
  payer.publicKey,
  validityProof,
  addressTreeInfo,
  stateTreeInfo,
  createTokenMetadata(
    "Example Token",
    "EXT", 
    "https://example.com/metadata.json"
  )
);

// Build and send transaction
const { blockhash } = await rpc.getLatestBlockhash();
const tx = buildAndSignTx(
  [ComputeBudgetProgram.setComputeUnitLimit({ units: 500_000 }), ix],
  payer,
  blockhash,
  [mintSigner]
);
const signature = await sendAndConfirmTx(rpc, tx, { skipPreflight: true });

console.log("Mint:", mintPda.toBase58());
console.log("Tx:", signature);`;

export default async function CreateMintEmbed() {
  const [actionHtml, instructionHtml] = await Promise.all([
    highlightCode(actionCode),
    highlightCode(instructionCode),
  ]);

  const tabs: CodeTab[] = [
    { title: "Action", code: actionCode, highlightedHtml: actionHtml, language: "ts" },
    { title: "Instruction", code: instructionCode, highlightedHtml: instructionHtml, language: "ts" },
  ];

  return (
    <main className="w-full h-screen p-0 m-0">
      <CodeRunner tabs={tabs} className="h-full" />
    </main>
  );
}
