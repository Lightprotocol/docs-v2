# LightProgramInterface Trait

Each rent-free program SDK exposes this trait so routers can detect which accounts an instruction reads/writes and build load specs for cold ones.

```rust
pub trait LightProgramInterface {
    type Variant: Pack<AccountMeta> + Clone + Debug;
    type Instruction;

    fn program_id() -> Pubkey;
    fn instruction_accounts(&self, ix: &Self::Instruction) -> Vec<Pubkey>;
    fn load_specs(
        &self,
        cold_accounts: &[AccountInterface],
    ) -> Result<Vec<AccountSpec<Self::Variant>>, Box<dyn Error>>;
}
```

- `instruction_accounts` -- returns the pubkeys the instruction reads/writes.
- `load_specs` -- given cold `AccountInterface`s (with `ColdContext`), returns the `AccountSpec`s that `create_load_instructions` needs to bring them back on-chain.

For framework-specific implementation examples (Anchor, Pinocchio), see the `defi-program` skill's `client-sdk.md`.
