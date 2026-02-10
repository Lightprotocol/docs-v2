# Solana Development Skills using Light Protocol

AI agent skills for rent-free Solana development — light token and mint accounts, compressed PDA, tokens, PDAs, and ZK compression.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Agent Skills](https://img.shields.io/badge/Agent%20Skills-Compatible-green.svg)](https://agentskills.io)

## Installation

These skills work with any AI agent. We recommend [Claude Code](https://claude.ai/code) with Opus models for best results.

### Claude Code

Add the marketplace:

```
/plugin marketplace add lightprotocol/ai-tools
```

Install skills:

```
/plugin install solana-airdrop
/plugin install light-testing
/plugin install make-program-rent-free
```

### Cursor

1. Open Settings (**Cmd+Shift+J** / **Ctrl+Shift+J**)
2. Navigate to **Rules & Commands** → **Project Rules** → **Add Rule** → **Remote Rule (GitHub)**
3. Enter: `https://github.com/lightprotocol/ai-tools.git`

Skills are auto-discovered based on context. Ask about compressed tokens, ZK nullifiers, or program migration and the agent uses the relevant skill automatically.

### Any Agent

```
npx skills add lightprotocol/ai-tools
```

## Available skills

### Tokens

| Skill | Description |
| ----- | ----------- |
| [solana-airdrop](skills/solana-airdrop/) | Distribute SPL tokens at 5000x lower cost for airdrops, DePINs, and token distribution |

### Programs

| Skill | Description |
| ----- | ----------- |
| [make-program-rent-free](skills/make-program-rent-free/) | Migrate Solana programs to Light Protocol compressed accounts |
| [pda](skills/pda/) | Compressed PDA patterns and LightAccount operations |

### Testing

| Skill | Description |
| ----- | ----------- |
| [light-testing](skills/light-testing/) | Test Light Protocol programs and clients on localnet, devnet, and mainnet |

### Security

| Skill | Description |
| ----- | ----------- |
| [zk-nullifier](skills/zk-nullifier/) | Privacy-preserving applications with ZK nullifiers to prevent double spending |

### Research

| Skill | Description |
| ----- | ----------- |
| [research-deepwiki](skills/research-deepwiki/) | Query Light Protocol repository via DeepWiki MCP for errors and implementation questions |

### Reference

| Skill | Description |
| ----- | ----------- |
| [error-codes](skills/error-codes/) | ZK Compression error code reference (6000-16034) with hex lookup |

## Resources

- [Light Protocol documentation](https://www.zkcompression.com/)
- [Light Protocol GitHub](https://github.com/lightprotocol/light-protocol)
- [ZK Compression examples](https://github.com/lightprotocol/program-examples)

## Contributing

1. Fork the repository
2. Copy an existing skill directory as a starting point: `cp -r skills/solana-airdrop/ skills/your-skill-name/`
3. Write a `SKILL.md` with frontmatter (`name`, `description`) and instructions
4. Add your skill to `.claude-plugin/marketplace.json`
5. Submit a pull request

## License

[MIT](LICENSE)

## Acknowledgments

Built on [Anthropic's Skills](https://github.com/anthropics/skills) and the [Agent Skills Specification](https://agentskills.io).

---

<p align="center">
  Built by <a href="https://github.com/Lightprotocol">Light Protocol</a> for the Solana ecosystem
</p>
