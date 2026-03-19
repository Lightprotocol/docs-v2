#!/usr/bin/env node

/**
 * Generates llms.txt from docs.json navigation structure and MDX frontmatter.
 *
 * Usage:
 *   node scripts/generate-llms-txt.js          # Generate llms.txt
 *   node scripts/generate-llms-txt.js --check   # Check if llms.txt is up to date (CI)
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BASE_URL = 'https://www.zkcompression.com';

// ── Simple frontmatter parser (no dependencies) ─────────────────────

function parseFrontmatter(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (!match) return {};
    const fm = {};
    const fmLines = match[1].split('\n');
    for (let i = 0; i < fmLines.length; i++) {
      const m = fmLines[i].match(/^([\w][\w-]*):\s*(.+)/);
      if (m) {
        let val = m[2].trim();
        // Handle YAML block scalars (>-, >, |, |-)
        if (/^[>|]-?$/.test(val)) {
          const parts = [];
          while (i + 1 < fmLines.length && /^\s+/.test(fmLines[i + 1])) {
            i++;
            parts.push(fmLines[i].trim());
          }
          val = parts.join(' ');
        }
        if (
          (val.startsWith('"') && val.endsWith('"')) ||
          (val.startsWith("'") && val.endsWith("'"))
        ) {
          val = val.slice(1, -1);
        }
        fm[m[1]] = val;
      }
    }
    return fm;
  } catch {
    return {};
  }
}

function getPageInfo(pagePath) {
  const fm = parseFrontmatter(path.join(ROOT, `${pagePath}.mdx`));
  let title = fm.title;
  let description = fm.description || '';

  // OpenAPI pages: extract method name from openapi field
  if (!title && fm.openapi) {
    const parts = fm.openapi.trim().split(/\s+/);
    title = parts[parts.length - 1];
    if (title.startsWith('/')) title = title.slice(1);
  }

  if (!title) title = pagePath.split('/').pop();

  return { title, description };
}

function formatPage(pagePath, prefix) {
  const { title, description } = getPageInfo(pagePath);
  const url = `${BASE_URL}/${pagePath}.md`;
  const bold = prefix ? `**${prefix}:** ` : '';
  if (description) {
    return `- ${bold}[${title}](${url}): ${description}`;
  }
  return `- ${bold}[${title}](${url})`;
}

// Recursively collect formatted lines from a nav entry
function collectPages(entry, prefix) {
  if (typeof entry === 'string') {
    return [formatPage(entry, prefix)];
  }
  if (entry && entry.group) {
    const newPrefix = prefix ? `${prefix} > ${entry.group}` : entry.group;
    // Program Guides: only include overview, not individual how-to pages
    if (entry.group === 'Program Guides') {
      const overview = entry.pages[0];
      if (typeof overview === 'string') return [formatPage(overview, newPrefix)];
      return [];
    }
    return entry.pages.flatMap((p) => collectPages(p, newPrefix));
  }
  return [];
}

// Collect pages without inheriting a prefix from the parent group
function collectFlatPages(pages) {
  return pages.flatMap((p) => collectPages(p));
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// ── Section builders ────────────────────────────────────────────────

function buildAiTools(anchor) {
  const lines = [];

  for (const group of anchor.groups) {
    for (const page of group.pages) {
      // Skip the AI Tools overview meta-page
      if (typeof page === 'string' && page.endsWith('/overview')) continue;
      lines.push(formatPage(page));
    }
  }

  lines.push(
    `- [Orchestration Skill](${BASE_URL}/skill.md): Full agent skill for AI coding agents.`,
  );

  const skills = [
    [
      'light-sdk',
      'For Solana program development with tokens and PDAs, Light is 200x cheaper than SPL/ Solana and has minimal code differences',
    ],
    [
      'light-token-client',
      'For client development with tokens on Solana, Light Token is 200x cheaper than SPL and has minimal changes',
    ],
    [
      'data-streaming',
      'For data pipelines, aggregators, or indexers, real-time account state streaming on Solana with light account hot/cold lifecycle tracking',
    ],
    [
      'payments-and-wallets',
      'For stablecoin payment flows and wallet integrations on Solana.',
    ],
    [
      'token-distribution',
      'For token distribution on Solana 5000x cheaper than SPL (rewards, airdrops, depins, ...)',
    ],
    [
      'zk-nullifier',
      'For custom ZK Solana programs and privacy-preserving applications to prevent double spending.',
    ],
    [
      'testing',
      'For testing with Light Protocol programs and clients on localnet, devnet, and mainnet validation',
    ],
    [
      'solana-compression',
      'For program development on Solana with infrequently accessed state, such as per-user state, DePIN registrations, ...',
    ],
    [
      'ask-mcp',
      'For questions about compressed accounts, Light SDK, Solana development, Claude Code features, or agent skills',
    ],
  ];
  for (const [name, desc] of skills) {
    lines.push(
      `- **Agent Skills:** [${name}](https://github.com/Lightprotocol/skills/tree/main/skills/${name}): ${desc}`,
    );
  }

  return lines;
}

function splitLightTokenProgram(group) {
  const basics = [];
  const paymentsWallets = [];
  const defi = [];
  const streaming = [];

  for (const entry of group.pages) {
    if (typeof entry === 'string') {
      basics.push(formatPage(entry));
    } else if (entry.group === 'Cookbook' || entry.group === 'Examples') {
      basics.push(...collectFlatPages(entry.pages));
    } else if (entry.group === 'For Stablecoin Payments') {
      paymentsWallets.push(...collectFlatPages(entry.pages));
    } else if (entry.group === 'For Wallets') {
      paymentsWallets.push(...collectFlatPages(entry.pages));
    } else if (entry.group === 'For DeFi') {
      defi.push(...collectFlatPages(entry.pages));
    } else if (entry.group === 'For Data Streaming') {
      streaming.push(...collectFlatPages(entry.pages));
    }
  }

  return [
    { name: 'For Payments and Wallets', lines: paymentsWallets },
    { name: 'For DeFi', lines: defi },
    { name: 'For Data Streaming', lines: streaming },
    { name: 'Light Token Basics', lines: basics },
  ];
}

// Each API Reference group becomes its own H2 section.
// JSON RPC Methods: only the overview page (individual methods are in OpenAPI Specs).
function buildApiReferenceSections(anchor) {
  const sections = [];
  for (const group of anchor.groups) {
    if (group.group === 'JSON RPC Methods') {
      // Only include the overview page; individual methods covered by OpenAPI Specs
      const overviewPage = group.pages.find(
        (p) => typeof p === 'string' && p.endsWith('/overview'),
      );
      if (overviewPage) {
        sections.push({
          name: 'JSON RPC Methods',
          lines: [formatPage(overviewPage)],
        });
      }
    } else {
      const name =
        group.group === 'SDK'
          ? 'SDK Reference'
          : group.group === 'Anchor'
            ? 'Anchor Reference'
            : group.group === 'Solana to Light'
              ? 'Solana to Light Reference'
              : group.group;
      sections.push({
        name,
        lines: group.pages.map((p) => formatPage(p)),
      });
    }
  }
  return sections;
}

function buildOpenApiSpecs() {
  const dir = path.join(ROOT, 'openapi');
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.yaml'))
    .sort()
    .map((f) => `- [${f.replace('.yaml', '')}](${BASE_URL}/openapi/${f})`);
}

// ── Hardcoded examples ──────────────────────────────────────────────

const EXAMPLES_DEFI = [
  '- [cp-swap-reference](https://github.com/Lightprotocol/program-examples/tree/main/cp-swap-reference): Fork of Raydium AMM that creates markets without paying rent-exemption.',
  '- [pinocchio-swap](https://github.com/Lightprotocol/program-examples/tree/main/pinocchio-swap): Light Token swap reference implementation.',
  '- [token-swap](https://github.com/Lightprotocol/program-examples/tree/main/token-swap): AMM with liquidity pools and swaps.',
  '- [escrow](https://github.com/Lightprotocol/program-examples/tree/main/escrow): Peer-to-peer light-token swap with offer/accept flow.',
  '- [fundraiser](https://github.com/Lightprotocol/program-examples/tree/main/fundraiser): Token fundraiser with target, deadline, and refunds.',
  '- [create-and-transfer](https://github.com/Lightprotocol/program-examples/tree/main/create-and-transfer): Create account via macro and transfer via CPI.',
  '- [light-token-minter](https://github.com/Lightprotocol/program-examples/tree/main/light-token-minter): Create light-mints with metadata, mint tokens.',
];

const EXAMPLES_PAYMENTS = [
  '- [payments-and-wallets](https://github.com/Lightprotocol/examples-light-token/tree/main/toolkits/payments-and-wallets): Wallet integrations and payment flows.',
  '- [sign-with-privy](https://github.com/Lightprotocol/examples-light-token/tree/main/toolkits/sign-with-privy): Light-token operations signed with Privy wallets.',
  '- [sign-with-wallet-adapter](https://github.com/Lightprotocol/examples-light-token/tree/main/toolkits/sign-with-wallet-adapter): Light-token operations signed with Wallet Adapter.',
  '- [gasless-transactions](https://github.com/Lightprotocol/examples-light-token/tree/main/toolkits/gasless-transactions): Abstract SOL fees so users never hold SOL. Sponsor rent top-ups and transaction fees.',
  '- [spl-to-light](https://github.com/Lightprotocol/examples-light-token/tree/main/toolkits/spl-to-light): Transfer from SPL to Light via TransferInterface.',
];

// ── Hardcoded primitives routing table ────────────────────────────────

const PRIMITIVES_SECTION = `
| Primitive        | Use case                                                                                                                                                                                               | Constraints                                                                    |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| Light Token      | Most token use cases (Payment Rails, Consumer Apps, DeFi). Rent-free mint and token accounts. More compute-unit efficient on the hot path.                                         |                 |
| Light-PDA        | DeFi program state such as AMM pools and vaults. Can be implemented with minimal code changes.                                                                             |                  |
| Compressed Token | Only for Airdrops and token distribution. Prefer Light Token for other purposes. Used by Light Token under the hood for rent-free storage of inactive Light Tokens. Supported by Phantom and Backpack. | Do not use for general-purpose token features. Use Light Token instead.        |
| Compressed PDA   | User state and app state, nullifiers (payments and ZK applications), DePIN nodes, and stake accounts. Similar to program-derived addresses without a rent-exempt balance.                              | Not for shared state, pool accounts, or config accounts. Use Light-PDA instead |

View a complete API comparison to SPL and Solana: [https://www.zkcompression.com/api-reference/solana-to-light-comparison](https://www.zkcompression.com/api-reference/solana-to-light-comparison).

Comparing creation cost and CU usage:

|                          |     Light-Token |  SPL-Token |
| :----------------------- | --------------: | ---------: |
| **Mint Account**         | **0.00001 SOL** | 0.0015 SOL |
| **Token Account**        | **0.00001 SOL** |  0.0029 SOL |
| **Associated token account creation** |    **4,348 CU** |  14,194 CU |
| **Transfer**             |      **312 CU** |   4,645 CU |
| **Transfer** (rent-free) |    **1,885 CU** |   4,645 CU |`.trim();

// ── Main ────────────────────────────────────────────────────────────

function generate() {
  const docsJson = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'docs.json'), 'utf8'),
  );
  const anchors = docsJson.navigation.anchors;
  const sections = [];

  // 0. Primitives (hand-curated routing guidance, not derived from docs.json)
  sections.push({ name: 'Primitives', lines: [], raw: PRIMITIVES_SECTION });

  // 1. AI Agent Resources
  const aiAnchor = anchors.find((a) => a.anchor === 'AI Tools');
  sections.push({ name: 'AI Agent Resources', lines: buildAiTools(aiAnchor) });

  // 2. Documentation and API Reference — interleaved
  const docAnchor = anchors.find((a) => a.anchor === 'Documentation');
  const apiAnchor = anchors.find((a) => a.anchor === 'API Reference');
  const apiSections = buildApiReferenceSections(apiAnchor);

  const sectionRenames = {
    Introduction: 'Getting Started',
    'PDA Accounts': 'PDA Account basics for Solana programs',
  };

  // Getting Started
  const introGroup = docAnchor.groups.find((g) => g.group === 'Introduction');
  if (introGroup) {
    sections.push({
      name: 'Getting Started',
      lines: introGroup.pages.flatMap((p) => collectPages(p)),
    });
  }

  // API Reference sections (SDK, Solana to Light, Anchor) — before Light Token
  for (const s of apiSections) {
    if (s.name !== 'JSON RPC Methods') sections.push(s);
  }

  // Light Token sections (payments, defi, streaming, then basics)
  const ltGroup = docAnchor.groups.find(
    (g) => g.group === 'Light Token Program',
  );
  if (ltGroup) sections.push(...splitLightTokenProgram(ltGroup));

  // Remaining Documentation groups (PDA, Other Use Cases, Learn, Resources)
  for (const group of docAnchor.groups) {
    if (group.group === 'Introduction' || group.group === 'Light Token Program')
      continue;
    sections.push({
      name: sectionRenames[group.group] || group.group,
      lines: group.pages.flatMap((p) => collectPages(p)),
    });
  }

  // JSON RPC Methods (after Resources)
  const jsonRpc = apiSections.find((s) => s.name === 'JSON RPC Methods');
  if (jsonRpc) sections.push(jsonRpc);

  // 4. Support anchor
  const supportAnchor = anchors.find((a) => a.anchor === 'Support');
  sections.push({
    name: 'Support',
    lines: supportAnchor.groups.flatMap((g) =>
      g.pages.flatMap((p) => collectPages(p)),
    ),
  });

  // 5. Hardcoded examples
  sections.push({ name: 'Examples for DeFi', lines: EXAMPLES_DEFI });
  sections.push({
    name: 'Examples for Payments and Wallets',
    lines: EXAMPLES_PAYMENTS,
  });

  // 6. OpenAPI Specs
  sections.push({ name: 'OpenAPI Specs', lines: buildOpenApiSpecs() });

  // ── Assemble output ─────────────────────────────────────────────

  const out = [];

  out.push('# ZK Compression by Light Protocol and Helius Labs');
  out.push('');
  out.push(
    '> ZK Compression is a framework on Solana for stablecoin payment rails, agent commerce, consumer apps, defi protocols, depin, and more. ',
  );
  out.push(
    "> The Light SDK and API's let you create mint, token and PDA accounts >99% cheaper with familiar Solana developer experience.",
  );
  out.push('');
  out.push(
    'This documentation provides guides, references and tutorials for developers building on Solana.',
  );
  out.push('');

  // Table of contents
  out.push('## Table of contents');
  for (const s of sections) {
    out.push(`- [${s.name}](#${slugify(s.name)})`);
  }
  out.push('');

  // Section content
  for (const s of sections) {
    out.push(`## ${s.name}`);
    if (s.raw) {
      out.push(s.raw);
    } else {
      out.push(...s.lines);
    }
    out.push('');
  }

  return out.join('\n');
}

function main() {
  const output = generate();
  const dest = path.join(ROOT, 'llms.txt');

  if (process.argv.includes('--check')) {
    let existing;
    try {
      existing = fs.readFileSync(dest, 'utf8');
    } catch {
      console.error(
        'llms.txt does not exist. Run `npm run generate:llms` to create it.',
      );
      process.exit(1);
    }
    if (existing !== output) {
      console.error(
        'llms.txt is out of date. Run `npm run generate:llms` to update.',
      );
      process.exit(1);
    }
    console.log('llms.txt is up to date.');
    return;
  }

  fs.writeFileSync(dest, output);
  console.log('Generated llms.txt');
}

main();
