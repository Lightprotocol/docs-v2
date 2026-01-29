# Airdrop

Distribute compressed tokens to multiple recipients using TypeScript client.

## Quick Decision

| Scale | Approach |
|-------|----------|
| <10,000 recipients | Single transaction - see [Simple Airdrop](#simple-airdrop-10000-recipients) |
| 10,000+ recipients | Batched with retry - see [Batched Airdrop](#batched-airdrop-10000-recipients) |
| No-code | [Airship by Helius](https://airship.helius.dev/) (up to 200k) |

## Core Pattern

```typescript
import { CompressedTokenProgram, getTokenPoolInfos, selectTokenPoolInfo } from "@lightprotocol/compressed-token";
import { bn, createRpc, selectStateTreeInfo, buildAndSignTx, sendAndConfirmTx } from "@lightprotocol/stateless.js";
import { ComputeBudgetProgram } from "@solana/web3.js";

const rpc = createRpc(RPC_ENDPOINT);

// 1. Get infrastructure
const treeInfo = selectStateTreeInfo(await rpc.getStateTreeInfos());
const tokenPoolInfo = selectTokenPoolInfo(await getTokenPoolInfos(rpc, mint));

// 2. Build compress instruction (SPL -> compressed to multiple recipients)
const ix = await CompressedTokenProgram.compress({
  payer: payer.publicKey,
  owner: payer.publicKey,
  source: sourceAta.address,           // SPL ATA holding tokens
  toAddress: recipients,                // PublicKey[]
  amount: recipients.map(() => bn(amount)),
  mint,
  tokenPoolInfo,
  outputStateTreeInfo: treeInfo,
});

// 3. Send with compute budget (120k CU per recipient)
const instructions = [
  ComputeBudgetProgram.setComputeUnitLimit({ units: 120_000 * recipients.length }),
  ix,
];
const { blockhash } = await rpc.getLatestBlockhash();
const tx = buildAndSignTx(instructions, payer, blockhash, []);
await sendAndConfirmTx(rpc, tx);
```

## Setup: Create Mint

```typescript
import { createMint } from "@lightprotocol/compressed-token";
import { getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";

const { mint } = await createMint(rpc, payer, payer.publicKey, 9);
const ata = await getOrCreateAssociatedTokenAccount(rpc, payer, mint, payer.publicKey);
await mintTo(rpc, payer, mint, ata.address, payer.publicKey, 100_000_000_000);
```

## Compute Units

| Recipients/instruction | CU |
|----------------------|-----|
| 1 | 120,000 |
| 5 | 170,000 |
| Batched tx | 500,000 |

## Lookup Tables

Reduce transaction size:

| Network | Address |
|---------|---------|
| Mainnet | `9NYFyEqPkyXUhkerbGHXUXkvb4qpzeEdHuGpgbgpH1NJ` |
| Devnet | `qAJZMgnQJ8G6vA3WRcjD9Jan1wtKkaCFWLWskxJrR5V` |

## Simple Airdrop (<10,000 recipients)

Single transaction approach for small distributions.

```typescript
import {
  CompressedTokenProgram,
  getTokenPoolInfos,
  selectTokenPoolInfo,
} from "@lightprotocol/compressed-token";
import {
  bn,
  buildAndSignTx,
  calculateComputeUnitPrice,
  createRpc,
  dedupeSigner,
  selectStateTreeInfo,
  sendAndConfirmTx,
} from "@lightprotocol/stateless.js";
import { ComputeBudgetProgram, Keypair, PublicKey } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token";

const RPC_ENDPOINT = "https://devnet.helius-rpc.com?api-key=YOUR_KEY";
const rpc = createRpc(RPC_ENDPOINT);
const mint = new PublicKey("YOUR_MINT_ADDRESS");

// Define recipients and amounts
const recipients = [
  new PublicKey("..."),
  new PublicKey("..."),
  new PublicKey("..."),
];

const amounts = [
  bn(20_000_000_000), // 20 tokens (9 decimals)
  bn(30_000_000_000), // 30 tokens
  bn(40_000_000_000), // 40 tokens
];

// Get infrastructure
const treeInfo = selectStateTreeInfo(await rpc.getStateTreeInfos());
const tokenPoolInfo = selectTokenPoolInfo(await getTokenPoolInfos(rpc, mint));
const sourceAta = await getOrCreateAssociatedTokenAccount(rpc, payer, mint, payer.publicKey);

// Build transaction
const units = 120_000 * recipients.length;
const instructions = [
  ComputeBudgetProgram.setComputeUnitLimit({ units }),
  ComputeBudgetProgram.setComputeUnitPrice({
    microLamports: calculateComputeUnitPrice(20_000, units),
  }),
  await CompressedTokenProgram.compress({
    payer: payer.publicKey,
    owner: payer.publicKey,
    source: sourceAta.address,
    toAddress: recipients,
    amount: amounts,
    mint,
    tokenPoolInfo,
    outputStateTreeInfo: treeInfo,
  }),
];

// Use lookup table to reduce tx size
const lut = new PublicKey("9NYFyEqPkyXUhkerbGHXUXkvb4qpzeEdHuGpgbgpH1NJ"); // mainnet
// const lut = new PublicKey("qAJZMgnQJ8G6vA3WRcjD9Jan1wtKkaCFWLWskxJrR5V"); // devnet
const lookupTable = (await rpc.getAddressLookupTable(lut)).value!;

const { blockhash } = await rpc.getLatestBlockhash();
const tx = buildAndSignTx(
  instructions,
  payer,
  blockhash,
  dedupeSigner(payer, []),
  [lookupTable]
);
const txId = await sendAndConfirmTx(rpc, tx);
console.log(`Airdrop complete: ${txId}`);
```

### Verify Distribution

```typescript
for (const recipient of recipients) {
  const accounts = await rpc.getCompressedTokenAccountsByOwner(recipient, { mint });
  const balance = accounts.items.reduce((sum, acc) => sum + Number(acc.parsed.amount), 0);
  console.log(`${recipient}: ${balance / 1e9} tokens`);
}
```

## Batched Airdrop (10,000+ recipients)

For large-scale distributions with retry logic and blockhash management.

### Create Instruction Batches

```typescript
import {
  CompressedTokenProgram,
  TokenPoolInfo,
  selectTokenPoolInfo,
} from "@lightprotocol/compressed-token";
import {
  bn,
  selectStateTreeInfo,
  StateTreeInfo,
} from "@lightprotocol/stateless.js";
import {
  ComputeBudgetProgram,
  TransactionInstruction,
  PublicKey,
} from "@solana/web3.js";

interface CreateAirdropParams {
  amount: number | bigint;
  recipients: PublicKey[];
  payer: PublicKey;
  sourceTokenAccount: PublicKey;
  mint: PublicKey;
  stateTreeInfos: StateTreeInfo[];
  tokenPoolInfos: TokenPoolInfo[];
  maxRecipientsPerInstruction?: number;   // default: 5
  maxInstructionsPerTransaction?: number; // default: 3
  computeUnitLimit?: number;              // default: 500_000
  computeUnitPrice?: number;
}

export async function createAirdropInstructions({
  amount,
  recipients,
  payer,
  sourceTokenAccount,
  mint,
  stateTreeInfos,
  tokenPoolInfos,
  maxRecipientsPerInstruction = 5,
  maxInstructionsPerTransaction = 3,
  computeUnitLimit = 500_000,
  computeUnitPrice,
}: CreateAirdropParams): Promise<TransactionInstruction[][]> {
  const batches: TransactionInstruction[][] = [];
  const amountBn = bn(amount.toString());

  for (
    let i = 0;
    i < recipients.length;
    i += maxRecipientsPerInstruction * maxInstructionsPerTransaction
  ) {
    const instructions: TransactionInstruction[] = [];

    instructions.push(
      ComputeBudgetProgram.setComputeUnitLimit({ units: computeUnitLimit })
    );
    if (computeUnitPrice) {
      instructions.push(
        ComputeBudgetProgram.setComputeUnitPrice({ microLamports: computeUnitPrice })
      );
    }

    const treeInfo = selectStateTreeInfo(stateTreeInfos);
    const tokenPoolInfo = selectTokenPoolInfo(tokenPoolInfos);

    for (let j = 0; j < maxInstructionsPerTransaction; j++) {
      const startIdx = i + j * maxRecipientsPerInstruction;
      const recipientBatch = recipients.slice(
        startIdx,
        startIdx + maxRecipientsPerInstruction
      );

      if (recipientBatch.length === 0) break;

      instructions.push(
        await CompressedTokenProgram.compress({
          payer,
          owner: payer,
          source: sourceTokenAccount,
          toAddress: recipientBatch,
          amount: recipientBatch.map(() => amountBn),
          mint,
          tokenPoolInfo,
          outputStateTreeInfo: treeInfo,
        })
      );
    }

    if (instructions.length > (computeUnitPrice ? 2 : 1)) {
      batches.push(instructions);
    }
  }

  return batches;
}
```

### Background Blockhash Updater

```typescript
import { Rpc } from "@lightprotocol/stateless.js";

export let currentBlockhash: string;

export async function updateBlockhash(
  connection: Rpc,
  signal: AbortSignal
): Promise<void> {
  const { blockhash } = await connection.getLatestBlockhash();
  currentBlockhash = blockhash;

  (function updateInBackground() {
    if (signal.aborted) return;
    const timeoutId = setTimeout(async () => {
      if (signal.aborted) return;
      try {
        const { blockhash } = await connection.getLatestBlockhash();
        currentBlockhash = blockhash;
      } catch (error) {
        console.error("Failed to update blockhash:", error);
      }
      updateInBackground();
    }, 30_000);

    signal.addEventListener("abort", () => clearTimeout(timeoutId));
  })();
}
```

### Sign and Send with Retry

```typescript
import { Rpc, sendAndConfirmTx } from "@lightprotocol/stateless.js";
import {
  Keypair,
  PublicKey,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { currentBlockhash, updateBlockhash } from "./update-blockhash";

export enum BatchResultType {
  Success = "success",
  Error = "error",
}

export type BatchResult =
  | { type: BatchResultType.Success; index: number; signature: string }
  | { type: BatchResultType.Error; index: number; error: string };

export async function* signAndSendAirdropBatches(
  batches: TransactionInstruction[][],
  payer: Keypair,
  connection: Rpc,
  maxRetries = 3
): AsyncGenerator<BatchResult> {
  const abortController = new AbortController();
  await updateBlockhash(connection, abortController.signal);

  // Lookup table for your network
  const lookupTableAddress = new PublicKey(
    "9NYFyEqPkyXUhkerbGHXUXkvb4qpzeEdHuGpgbgpH1NJ" // mainnet
    // "qAJZMgnQJ8G6vA3WRcjD9Jan1wtKkaCFWLWskxJrR5V" // devnet
  );
  const lookupTableAccount = (
    await connection.getAddressLookupTable(lookupTableAddress)
  ).value!;

  const statusMap = new Array(batches.length).fill(0); // 0 = pending

  while (statusMap.includes(0)) {
    const sends = statusMap.map(async (status, index) => {
      if (status !== 0) return;

      let retries = 0;
      while (retries < maxRetries && statusMap[index] === 0) {
        if (!currentBlockhash) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          continue;
        }

        try {
          const tx = new VersionedTransaction(
            new TransactionMessage({
              payerKey: payer.publicKey,
              recentBlockhash: currentBlockhash,
              instructions: batches[index],
            }).compileToV0Message([lookupTableAccount])
          );
          tx.sign([payer]);

          const confirmedSig = await sendAndConfirmTx(connection, tx, {
            skipPreflight: true,
            commitment: "confirmed",
          });

          if (confirmedSig) {
            statusMap[index] = 1;
            return { type: BatchResultType.Success, index, signature: confirmedSig };
          }
        } catch (e) {
          retries++;
          if (retries >= maxRetries) {
            statusMap[index] = `err: ${(e as Error).message}`;
            return { type: BatchResultType.Error, index, error: (e as Error).message };
          }
        }
      }
    });

    const results = await Promise.all(sends);
    for (const result of results) {
      if (result) yield result as BatchResult;
    }
  }

  abortController.abort();
}
```

## Advanced: Claim-Based

For vesting, clawback, or user-initiated claims:

| Implementation | Features |
|---------------|----------|
| [Merkle Distributor](https://github.com/Lightprotocol/distributor) | Linear vesting, partial claims, clawback, REST API |
| [Simple Claim](https://github.com/Lightprotocol/program-examples/tree/main/airdrop-implementations/simple-claim) | Cliff vesting at slot X |

## Resources

- **Docs**: [Airdrop Guide](https://www.zkcompression.com/compressed-tokens/advanced-guides/airdrop)
- **Docs**: [Claim Implementations](https://www.zkcompression.com/compressed-tokens/advanced-guides/airdrop#claim-reference-implementations)
- **Code**: [example-token-distribution](https://github.com/Lightprotocol/examples-zk-compression/tree/main/example-token-distribution)
- **Tool**: [Airship by Helius](https://airship.helius.dev/)
