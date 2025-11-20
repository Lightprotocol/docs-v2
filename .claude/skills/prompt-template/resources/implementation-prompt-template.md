# Implementation Prompt Template

Use this template to generate structured prompts for any SDK, library, or feature implementation.

## Base Template Structure

```markdown
# IMPLEMENT [FEATURE NAME IN CAPS]

## TASK OVERVIEW
[One clear sentence describing what needs to be implemented]

## MY APPLICATION CONTEXT
**Tech Stack:**
- Framework: [User's framework]
- Language: [Language + version]
- Service architecture: [How user organizes code]
- Environment management: [How user handles config/env vars]
- Error handling: [User's error handling approach]

## TECHNICAL REQUIREMENTS

**Installation:**
```bash
[Exact install commands from docs with versions]
```

**Import:**
```[language]
[Exact import statements from documentation]
```

**Configuration Options:**
[Bullet list of all config options with types from docs]

**Complete Initialization Example:**
```[language]
[Full working initialization code from official documentation]
```

## IMPLEMENTATION REQUEST

Create [specific deliverable] that:
1. Follows my application's service patterns
2. Handles environment configuration properly (dev/staging/prod)
3. Includes comprehensive error handling matching my patterns
4. Provides clean interface for other parts of my app
5. Includes proper TypeScript types (if applicable)
6. [Any additional specific requirements based on the feature]

Show me the complete implementation with file structure and code.

## DOCUMENTATION REFERENCES
- Primary documentation: [URL to specific page, not homepage]
- Source code directory: [URL to GitHub folder/file where this is implemented]
- API reference: [URL if applicable]
- GitHub repository: [URL if applicable]
- Example implementations: [URLs if applicable]
```

---

## Example 1: SDK Client Setup (Grid)

```markdown
# IMPLEMENT GRID ACCOUNTS CLIENT SETUP

## TASK OVERVIEW
Set up Grid SDK client initialization in my application following my existing patterns.

## MY APPLICATION CONTEXT
**Tech Stack:**
- Framework: Next.js 14
- Language: TypeScript 5.2
- Service architecture: /services folder with singleton pattern
- Environment management: .env.local with Zod validation
- Error handling: Custom error classes with structured logging

## TECHNICAL REQUIREMENTS

**Installation:**
```bash
npm install @sqds/grid
```

**Import:**
```typescript
import { GridClient } from '@sqds/grid';
```

**Configuration Options:**
- environment: 'sandbox' | 'production'
- apiKey: string (from Grid dashboard at https://grid.squads.xyz/dashboard)
- baseUrl: string (optional, defaults to "https://grid.squads.xyz")

**Complete Initialization Example:**
```typescript
const gridClient = new GridClient({
  environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
  apiKey: process.env.GRID_API_KEY!,
  baseUrl: "https://grid.squads.xyz",
});
```

## IMPLEMENTATION REQUEST

Create a Grid client service that:
1. Follows my application's singleton service pattern
2. Handles environment configuration with Zod validation
3. Includes comprehensive error handling with custom GridError class
4. Provides clean interface for other parts of my app
5. Includes proper TypeScript types and JSDoc comments

Show me the complete implementation with file structure and code.

## DOCUMENTATION REFERENCES
- Grid SDK Documentation: https://www.npmjs.com/package/@sqds/grid
- Source code directory: https://github.com/Squads-Protocol/grid-sdk/tree/main/src
- API Dashboard: https://grid.squads.xyz/dashboard
```

---

## Example 2: ZK Compression Client (TypeScript)

```markdown
# IMPLEMENT ZK COMPRESSION CLIENT SETUP

## TASK OVERVIEW
Set up Light Protocol SDK client for compressed account operations in my Solana application.

## MY APPLICATION CONTEXT
**Tech Stack:**
- Framework: React Native with Expo
- Language: TypeScript 5.0
- Service architecture: Context providers with hooks
- Environment management: Expo SecureStore for keys, env vars for endpoints
- Error handling: React Error Boundaries with Sentry logging

## TECHNICAL REQUIREMENTS

**Installation:**
```bash
npm install @lightprotocol/stateless.js@0.22.1-alpha.1 \
            @lightprotocol/compressed-token@0.22.1-alpha.1 \
            @solana/web3.js
```

**Import:**
```typescript
import { Rpc, createRpc } from '@lightprotocol/stateless.js';
```

**Configuration Options:**
- RPC_ENDPOINT: string (Helius or custom RPC)
- COMPRESSION_RPC_ENDPOINT: string (separate compression endpoint or same as RPC)
- Commitment level: 'confirmed' | 'finalized'

**Complete Initialization Example:**
```typescript
const RPC_ENDPOINT = process.env.RPC_ENDPOINT || 'https://devnet.helius-rpc.com?api-key=YOUR_KEY';
const COMPRESSION_RPC_ENDPOINT = process.env.COMPRESSION_RPC_ENDPOINT || RPC_ENDPOINT;

const rpc: Rpc = createRpc(RPC_ENDPOINT, COMPRESSION_RPC_ENDPOINT);
```

## IMPLEMENTATION REQUEST

Create a ZK Compression client provider that:
1. Follows React Context pattern with custom hook
2. Handles environment configuration for devnet/mainnet switching
3. Provides clean RPC interface for compressed account operations
4. Includes proper TypeScript types for all RPC methods
5. Handles connection errors with React Error Boundary integration
6. Supports reconnection logic for mobile network interruptions

Show me the complete implementation with file structure and code.

## DOCUMENTATION REFERENCES
- Client Library Guide: https://www.zkcompression.com/compressed-pdas/client-library
- Source code directory: https://github.com/Lightprotocol/light-protocol/tree/main/js/stateless.js/src
- TypeScript SDK API: https://lightprotocol.github.io/light-protocol/stateless.js/index.html
- GitHub Examples: https://github.com/Lightprotocol/program-examples
- Complete Documentation: https://www.zkcompression.com/llms-full.txt
```

---

## Example 3: API Integration (REST Client)

```markdown
# IMPLEMENT STRIPE PAYMENT CLIENT

## TASK OVERVIEW
Set up Stripe SDK client for payment processing in my e-commerce backend.

## MY APPLICATION CONTEXT
**Tech Stack:**
- Framework: Express.js with TypeScript
- Language: TypeScript 5.1
- Service architecture: Layered architecture (controllers/services/repositories)
- Environment management: dotenv with @types/node for env vars
- Error handling: Custom AppError class with express-async-errors

## TECHNICAL REQUIREMENTS

**Installation:**
```bash
npm install stripe @types/stripe
```

**Import:**
```typescript
import Stripe from 'stripe';
```

**Configuration Options:**
- apiKey: string (secret key from Stripe dashboard)
- apiVersion: '2023-10-16' (Stripe API version)
- typescript: true (enables TypeScript support)
- timeout: number (optional, request timeout in ms)
- maxNetworkRetries: number (optional, default 0)

**Complete Initialization Example:**
```typescript
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
});
```

## IMPLEMENTATION REQUEST

Create a Stripe payment service that:
1. Follows layered architecture with service class
2. Handles environment configuration with validation
3. Includes comprehensive error handling for Stripe errors
4. Provides clean interface for payment operations (create intent, confirm, refund)
5. Includes proper TypeScript types and JSDoc comments
6. Implements webhook signature verification
7. Includes retry logic for network failures

Show me the complete implementation with file structure and code.

## DOCUMENTATION REFERENCES
- Stripe Node.js SDK: https://stripe.com/docs/api
- Source code directory: https://github.com/stripe/stripe-node/tree/master/src
- TypeScript Integration: https://github.com/stripe/stripe-node#usage-with-typescript
- Webhook Guide: https://stripe.com/docs/webhooks
```

---

## Template Selection Guide

**Use SDK Client Setup template for:**
- Client library initialization
- Service/API wrappers
- SDK configuration

**Use API Integration template for:**
- REST API clients
- GraphQL clients
- Third-party service integrations

**Use Feature Implementation template for:**
- New application features
- Component development
- Business logic implementation

**Use Migration template for:**
- Library upgrades
- Framework migrations
- Refactoring tasks
