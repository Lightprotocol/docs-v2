# Payments

The light-token API matches SPL-token. Your users receive the same stablecoin, stored more efficiently.

| Creation cost     | SPL                 | light-token          |
| :---------------- | :------------------ | :------------------- |
| **Token Account** | ~2,000,000 lamports | ~**11,000** lamports |

## API comparison

| Operation | SPL | light-token |
|-----------|-----|-------------|
| Get/Create ATA | `getOrCreateAssociatedTokenAccount()` | `getOrCreateAtaInterface()` |
| Derive ATA | `getAssociatedTokenAddress()` | `getAssociatedTokenAddressInterface()` |
| Transfer | `transferChecked()` | `transferInterface()` |
| Get balance | `getAccount()` | `getAtaInterface()` |
| Tx history | `getSignaturesForAddress()` | `rpc.getSignaturesForOwnerInterface()` |
| Wrap from SPL | N/A | `wrap()` |
| Unwrap to SPL | N/A | `unwrap()` |

Full code examples: [payments-and-wallets](https://github.com/Lightprotocol/examples-light-token/tree/main/toolkits/payments-and-wallets)

## Setup

```bash
npm install @lightprotocol/compressed-token @lightprotocol/stateless.js @solana/web3.js @solana/spl-token
```

```typescript
import { createRpc } from "@lightprotocol/stateless.js";

import {
  getOrCreateAtaInterface,
  getAtaInterface,
  getAssociatedTokenAddressInterface,
  transferInterface,
  wrap,
  unwrap,
} from "@lightprotocol/compressed-token/unified";

const rpc = createRpc(RPC_ENDPOINT);
```

## Receive payments

### Instruction

```typescript
import { Transaction } from "@solana/web3.js";
import {
  createAssociatedTokenAccountInterfaceIdempotentInstruction,
  createLoadAtaInstructions,
  getAssociatedTokenAddressInterface,
} from "@lightprotocol/compressed-token/unified";
import { LIGHT_TOKEN_PROGRAM_ID } from "@lightprotocol/stateless.js";

const ata = getAssociatedTokenAddressInterface(mint, recipient);

const tx = new Transaction().add(
  createAssociatedTokenAccountInterfaceIdempotentInstruction(
    payer.publicKey,
    ata,
    recipient,
    mint,
    LIGHT_TOKEN_PROGRAM_ID
  ),
  ...(await createLoadAtaInstructions(
    rpc,
    ata,
    recipient,
    mint,
    payer.publicKey
  ))
);
```

### Action helper

```typescript
import { getOrCreateAtaInterface } from "@lightprotocol/compressed-token/unified";

const ata = await getOrCreateAtaInterface(rpc, payer, mint, recipient);
// Share ata.parsed.address with sender

console.log(ata.parsed.amount);
```

## Send payments

### Instruction

```typescript
import { Transaction } from "@solana/web3.js";
import {
  createLoadAtaInstructions,
  createTransferInterfaceInstruction,
  getAssociatedTokenAddressInterface,
} from "@lightprotocol/compressed-token/unified";

const sourceAta = getAssociatedTokenAddressInterface(mint, owner.publicKey);
const destinationAta = getAssociatedTokenAddressInterface(mint, recipient);

const tx = new Transaction().add(
  ...(await createLoadAtaInstructions(
    rpc,
    sourceAta,
    owner.publicKey,
    mint,
    payer.publicKey
  )),
  createTransferInterfaceInstruction(
    sourceAta,
    destinationAta,
    owner.publicKey,
    amount
  )
);
```

With idempotent ATA creation for recipient:

```typescript
import { Transaction } from "@solana/web3.js";
import {
  createAssociatedTokenAccountInterfaceIdempotentInstruction,
  createLoadAtaInstructions,
  createTransferInterfaceInstruction,
  getAssociatedTokenAddressInterface,
} from "@lightprotocol/compressed-token/unified";
import { LIGHT_TOKEN_PROGRAM_ID } from "@lightprotocol/stateless.js";

const sourceAta = getAssociatedTokenAddressInterface(mint, owner.publicKey);
const destinationAta = getAssociatedTokenAddressInterface(mint, recipient);

const tx = new Transaction().add(
  createAssociatedTokenAccountInterfaceIdempotentInstruction(
    payer.publicKey,
    destinationAta,
    recipient,
    mint,
    LIGHT_TOKEN_PROGRAM_ID
  ),
  ...(await createLoadAtaInstructions(
    rpc,
    sourceAta,
    owner.publicKey,
    mint,
    payer.publicKey
  )),
  createTransferInterfaceInstruction(
    sourceAta,
    destinationAta,
    owner.publicKey,
    amount
  )
);
```

### Action helper

```typescript
import {
  getAssociatedTokenAddressInterface,
  transferInterface,
} from "@lightprotocol/compressed-token/unified";

const sourceAta = getAssociatedTokenAddressInterface(mint, owner.publicKey);
const destinationAta = getAssociatedTokenAddressInterface(mint, recipient);

await transferInterface(
  rpc,
  payer,
  sourceAta,
  mint,
  destinationAta,
  owner,
  amount
);
```

## Show balance

```typescript
import {
  getAssociatedTokenAddressInterface,
  getAtaInterface,
} from "@lightprotocol/compressed-token/unified";

const ata = getAssociatedTokenAddressInterface(mint, owner);
const account = await getAtaInterface(rpc, ata, owner, mint);

console.log(account.parsed.amount);
```

## Transaction history

```typescript
const result = await rpc.getSignaturesForOwnerInterface(owner);

console.log(result.signatures); // All signatures
```

Use `getSignaturesForAddressInterface(address)` for address-specific rather than owner-wide history.

## Wrap from SPL

### Instruction

```typescript
import { Transaction } from "@solana/web3.js";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import {
  createWrapInstruction,
  getAssociatedTokenAddressInterface,
} from "@lightprotocol/compressed-token/unified";
import { getSplInterfaceInfos } from "@lightprotocol/compressed-token";

const splAta = getAssociatedTokenAddressSync(mint, owner.publicKey);
const tokenAta = getAssociatedTokenAddressInterface(mint, owner.publicKey);

const splInterfaceInfos = await getSplInterfaceInfos(rpc, mint);
const splInterfaceInfo = splInterfaceInfos.find((i) => i.isInitialized);

const tx = new Transaction().add(
  createWrapInstruction(
    splAta,
    tokenAta,
    owner.publicKey,
    mint,
    amount,
    splInterfaceInfo,
    decimals
  )
);
```

### Action helper

```typescript
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import {
  wrap,
  getAssociatedTokenAddressInterface,
} from "@lightprotocol/compressed-token/unified";

const splAta = getAssociatedTokenAddressSync(mint, owner.publicKey);
const tokenAta = getAssociatedTokenAddressInterface(mint, owner.publicKey);

await wrap(rpc, payer, splAta, tokenAta, owner, mint, amount);
```

## Unwrap to SPL

### Instruction

```typescript
import { Transaction } from "@solana/web3.js";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import {
  createLoadAtaInstructions,
  createUnwrapInstruction,
  getAssociatedTokenAddressInterface,
} from "@lightprotocol/compressed-token/unified";
import { getSplInterfaceInfos } from "@lightprotocol/compressed-token";

const tokenAta = getAssociatedTokenAddressInterface(mint, owner.publicKey);
const splAta = getAssociatedTokenAddressSync(mint, owner.publicKey);

const splInterfaceInfos = await getSplInterfaceInfos(rpc, mint);
const splInterfaceInfo = splInterfaceInfos.find((i) => i.isInitialized);

const tx = new Transaction().add(
  ...(await createLoadAtaInstructions(
    rpc,
    tokenAta,
    owner.publicKey,
    mint,
    payer.publicKey
  )),
  createUnwrapInstruction(
    tokenAta,
    splAta,
    owner.publicKey,
    mint,
    amount,
    splInterfaceInfo,
    decimals
  )
);
```

### Action helper

```typescript
import { getAssociatedTokenAddressSync } from "@solana/spl-token";

const splAta = getAssociatedTokenAddressSync(mint, owner.publicKey);

await unwrap(rpc, payer, splAta, owner, mint, amount);
```

## Source

- [Payments docs](https://zkcompression.com/light-token/toolkits/for-payments)
- [GitHub examples](https://github.com/Lightprotocol/examples-light-token/tree/main/toolkits/payments-and-wallets)