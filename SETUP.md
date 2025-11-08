# Mintlify Local Development Setup

Quick guide to run this documentation site locally.

## Prerequisites

- Node.js v19 or higher
- npm or pnpm

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Lightprotocol/docs-v2.git
   cd docs
   ```

2. **Install Mintlify CLI globally**
   ```bash
   npm i -g mint
   ```

## Running Locally

1. **Start the dev server**
   ```bash
   mint dev
   ```

2. **Access the site**
   - Local: http://localhost:3000
   - Network: http://192.168.x.x:3000

The dev server will auto-reload when you edit files.

## Project Structure

```
docs/
├── docs.json           # Configuration
├── ctoken-overview.mdx # C-Token overview page
├── typescript.mdx      # TypeScript examples
├── logo/               # Logo assets
├── favicon.png         # Site favicon
└── mintlify/           # Reference and guides
```

## Making Changes

1. **Edit MDX files** - Changes auto-reload
2. **Update docs.json** - Modify navigation, colors, settings
3. **Add pages** - Create `.mdx` files and add to `docs.json` navigation

## Common Commands

```bash
mint dev              # Start dev server
mint dev --port 3333  # Custom port
mint update           # Update CLI
mint broken-links     # Check for broken links
```
