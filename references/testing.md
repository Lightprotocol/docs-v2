# Light Protocol Testing

## Routing

| Task | Section |
|------|---------|
| Start local validator | [Local Testing](#local-testing-with-light-test-validator) |
| Test on devnet | [Devnet Testing](#devnet-testing) |
| Rust program tests | [light-program-test](#rust-program-tests-with-light-program-test) |

## Program Addresses

These addresses are identical on devnet and mainnet.

| Program | Address |
|---------|---------|
| Light System | `SySTEM1eSU2p4BGQfQpimFEWWSC1XDFeun3Nqzz3rT7` |
| Compressed Token | `cTokenmWW8bLPjZEBAUgYy3zKxQZW6VKi7bqNFEVv3m` |
| Account Compression | `compr6CUsB5m2jS4Y3831ztGSTnDpnKJTKS95d64XVq` |
| Light Registry | `Lighton6oQpVkeewmo2mcPTQQp7kYHr4fWpAgJyEmDX` |

## Local Testing with light-test-validator

Local development environment running Solana test validator with Light Protocol programs, Photon indexer, and ZK prover.

### Quick Start

```bash
# Start all services
light test-validator

# Stop
light test-validator --stop
```

### Services & Ports

| Service | Port | Endpoint |
|---------|------|----------|
| Solana RPC | 8899 | `http://127.0.0.1:8899` |
| Solana WebSocket | 8900 | `ws://127.0.0.1:8900` |
| Photon Indexer | 8784 | `http://127.0.0.1:8784` |
| Light Prover | 3001 | `http://127.0.0.1:3001` |

### Command Flags

| Flag | Default | Description |
|------|---------|-------------|
| `--skip-indexer` | false | Run without Photon indexer |
| `--skip-prover` | false | Run without Light Prover |
| `--skip-system-accounts` | false | Skip pre-initialized accounts |
| `--devnet` | false | Clone programs from devnet |
| `--mainnet` | false | Clone programs from mainnet |
| `--sbf-program <ID> <PATH>` | - | Load additional program |
| `--skip-reset` | false | Keep existing ledger |
| `--verbose` | false | Enable verbose logging |

### Deployed Programs

| Program | Address |
|---------|---------|
| SPL Noop | `noopb9bkMVfRPU8AsbpTUg8AQkHtKwMYZiFUjNRtMmV` |
| Light System | `SySTEM1eSU2p4BGQfQpimFEWWSC1XDFeun3Nqzz3rT7` |
| Compressed Token | `cTokenmWW8bLPjZEBAUgYy3zKxQZW6VKi7bqNFEVv3m` |
| Account Compression | `compr6CUsB5m2jS4Y3831ztGSTnDpnKJTKS95d64XVq` |
| Light Registry | `Lighton6oQpVkeewmo2mcPTQQp7kYHr4fWpAgJyEmDX` |

### TypeScript Test Integration

```typescript
import { getTestRpc, newAccountWithLamports } from '@lightprotocol/stateless.js/test-helpers';
import { WasmFactory } from '@lightprotocol/hasher.rs';

const lightWasm = await WasmFactory.getInstance();
const rpc = await getTestRpc(lightWasm);
const payer = await newAccountWithLamports(rpc, 1e9, 256);
```

Run tests:

```bash
cd js/stateless.js
pnpm test-validator && pnpm test:e2e:all
```

### Troubleshooting

Validator fails to start:

```bash
lsof -i :8899              # Check port
light test-validator --stop # Stop existing
rm -rf test-ledger/        # Reset ledger
```

Photon version mismatch:

```bash
cargo install --git https://github.com/lightprotocol/photon.git \
  --rev ac7df6c388db847b7693a7a1cb766a7c9d7809b5 --locked --force
```

### File Locations

| Component | Location |
|-----------|----------|
| Program binaries | `~/.config/light/bin/` |
| Prover binary | `~/.config/light/bin/prover-{platform}-{arch}` |
| Proving keys | `~/.config/light/proving-keys/` |
| Test ledger | `./test-ledger/` |

## Devnet Testing

### Quick Start

```typescript
import { createRpc } from "@lightprotocol/stateless.js";

const connection = createRpc(
  "https://devnet.helius-rpc.com?api-key=<api_key>",
  "https://devnet.helius-rpc.com?api-key=<api_key>",
  "https://devnet.helius-rpc.com?api-key=<api_key>"
);
```

### Endpoints

| Service   | URL                                              |
|-----------|--------------------------------------------------|
| RPC       | `https://devnet.helius-rpc.com?api-key=<api_key>` |
| WebSocket | `wss://devnet.helius-rpc.com?api-key=<api_key>`   |
| Indexer   | `https://devnet.helius-rpc.com?api-key=<api_key>` |
| Prover    | `https://prover.helius.dev`                       |

### Client Setup

```typescript
import { Rpc, createRpc } from "@lightprotocol/stateless.js";

const HELIUS_API_KEY = process.env.HELIUS_API_KEY;

const RPC_ENDPOINT = `https://devnet.helius-rpc.com?api-key=${HELIUS_API_KEY}`;
const COMPRESSION_ENDPOINT = RPC_ENDPOINT;
const PROVER_ENDPOINT = "https://prover.helius.dev";

const connection: Rpc = createRpc(RPC_ENDPOINT, COMPRESSION_ENDPOINT, PROVER_ENDPOINT);

// Fetch state trees at runtime
const { stateTrees } = await connection.getCachedActiveStateTreeInfo();
const outputStateTree = stateTrees[0].tree;
```

### Key Considerations

- **Helius or Triton required**: The photon indexer implementation is maintained by Helius. You can also use Triton. Currently these RPC's provide compression endpoints
- **Runtime tree fetch**: Always fetch active state trees at runtime via `getCachedActiveStateTreeInfo()`
- **Same programs**: Program addresses are identical on devnet and mainnet
- **Devnet-specific trees**: State tree lookup tables differ from mainnet

### Devnet Addresses

| Lookup Table                    | Address                                        |
|---------------------------------|------------------------------------------------|
| State Tree Lookup Table         | `DmRueT3LMJdGj3TEprqKtfwMxyNUHDnKrQua4xrqtbmG` |
| Address Tree Lookup Table       | `G4HqCAWPJ1E3JmYX1V2RZvNMuzF6gcFdbwT8FccWX6ru` |

Usage notes:

- Always fetch state trees dynamically using `getCachedActiveStateTreeInfo()`
- Do not hardcode tree addresses; they rotate as trees fill up
- Lookup table addresses are stable and can be referenced directly

## Rust Program Tests with light-program-test

A fast local test environment for Solana programs using compressed accounts and tokens.

**Use `light-program-test` when:**
- You need fast test execution
- You write unit/integration tests for your program or client code

**Use `solana-test-validator` when:**
- You need RPC methods or external tools that are incompatible with LiteSVM
- Testing against real validator behavior

### Prerequisites

1. **ZK Compression CLI**: Required to start the prover server and download Light Protocol programs

   ```bash
   npm i -g @lightprotocol/zk-compression-cli
   ```

   If programs are missing after CLI installation, run `light test-validator` once to download them

2. **Build programs**: Run `cargo test-sbf` to build program binaries and set the required
   environment variables for locating program artifacts

### Debugging

Set `RUST_BACKTRACE=1` to show detailed transaction information including accounts and parsed instructions:

```bash
RUST_BACKTRACE=1 cargo test-sbf -- --nocapture
```

## Pre-initialized Accounts

The test validator loads 39 pre-initialized accounts from the CLI's `accounts/` directory.

### State Trees (V1)

| Type | Address |
|------|---------|
| Merkle tree 1 | `smt1NamzXdq4AMqS2fS2F1i5KTYPZRhoHgWx38d8WsT` |
| Nullifier queue 1 | `nfq1NvQDJ2GEgnS8zt9prAe8rjjpAW1zFkrvZoBR148` |
| CPI context 1 | `cpi1uHzrEhBG733DoEJNgHCyRS3XmmyVNZx5fonubE4` |
| Merkle tree 2 | `smt2rJAFdyJJupwMKAqTNAJwvjhmiZ4JYGZmbVRw1Ho` |
| Nullifier queue 2 | `nfq2hgS7NYemXsFaFUCe3EMXSDSfnZnAe27jC6aPP1X` |
| CPI context 2 | `cpi2cdhkH5roePvcudTgUL8ppEBfTay1desGh8G8QxK` |

### Batched State Trees (V2)

Five batched state tree triplets (bmt/oq/cpi):

| Set | BMT | OQ | CPI |
|-----|-----|-----|-----|
| 1 | `bmt1LryLZUMmF7ZtqESaw7wifBXLfXHQYoE4GAmrahU` | `oq1na8gojfdUhsfCpyjNt6h4JaDWtHf1yQj4koBWfto` | `cpi15BoVPKgEPw5o8wc2T816GE7b378nMXnhH3Xbq4y` |
| 2 | `bmt2UxoBxB9xWev4BkLvkGdapsz6sZGkzViPNph7VFi` | `oq2UkeMsJLfXt2QHzim242SUi3nvjJs8Pn7Eac9H9vg` | `cpi2yGapXUR3As5SjnHBAVvmApNiLsbeZpF3euWnW6B` |
| 3 | `bmt3ccLd4bqSVZVeCJnH1F6C8jNygAhaDfxDwePyyGb` | `oq3AxjekBWgo64gpauB6QtuZNesuv19xrhaC1ZM1THQ` | `cpi3mbwMpSX8FAGMZVP85AwxqCaQMfEk9Em1v8QK9Rf` |
| 4 | `bmt4d3p1a4YQgk9PeZv5s4DBUmbF5NxqYpk9HGjQsd8` | `oq4ypwvVGzCUMoiKKHWh4S1SgZJ9vCvKpcz6RT6A8dq` | `cpi4yyPDc4bCgHAnsenunGA8Y77j3XEDyjgfyCKgcoc` |
| 5 | `bmt5yU97jC88YXTuSukYHa8Z5Bi2ZDUtmzfkDTA2mG2` | `oq5oh5ZR3yGomuQgFduNDzjtGvVWfDRGLuDVjv9a96P` | `cpi5ZTjdgYpZ1Xr7B1cMLLUE81oTtJbNNAyKary2nV6` |

### Address Trees

| Type | Address |
|------|---------|
| Address Merkle tree (V1) | `amt1Ayt45jfbdw5YSo7iz6WZxUmnZsQTYXy82hVwyC2` |
| Address queue (V1) | `aq1S9z4reTSQAdgWHGD2zDaS39sjGrAxbR31vxJ2F4F` |
| Batch address tree (V2) | `amt2kaJA14v3urZbZvnc5v2np8jqvc4Z8zDep5wbtzx` |

### Protocol PDAs

| Type | Address |
|------|---------|
| Governance authority | `CuEtcKkkbTn6qy2qxqDswq5U2ADsqoipYDAYfRvxPjcp` |
| Config counter | `8gH9tmziWsS8Wc4fnoN5ax3jsSumNYoRDuSBvmH2GMH8` |
| Registered program PDA | `35hkDgaAKwMCaxRz2ocSZ6NaUrtKkyNqU6c4RV3tYJRh` |
| Registered registry program PDA | `DumMsyvkaGJG4QnQ1BhTgvoRMXsgGxfpKDUCr22Xqu4w` |
| Group PDA | `24rt4RgeyjUCWGS2eF7L7gyNMuz6JWdqYpAvb1KRoHxs` |
