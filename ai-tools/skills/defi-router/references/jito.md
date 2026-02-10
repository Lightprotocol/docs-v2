# Jito Bundles

If load + swap exceed Solana's 1232-byte tx limit, send as a Jito bundle. The SDK deduplicates many account keys over the wire, so instructions that appear large in isolation will be incremental when combined with swap/deposit instructions.

See [Router Integration — Jito](./overview.md#what-if-load--swap-exceed-solanas-tx-size-limit) for the full code example and tip account list.