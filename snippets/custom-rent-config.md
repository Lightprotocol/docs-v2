
<Accordion title="Custom Rent Config & Interactive Cost Calculator">
<Info>
We recommend to use default values, but you can customize the rent config based on the expected account activity.
</Info>

1. Set the hours to determine the amount of prepaid rent
2. Set the lamports per write a transaction payer will pay for top ups

```rust
CompressibleParamsInfos{
      compressible_config,
      rent_sponsor,
      system_program,
      pre_pay_num_epochs: 35,
      lamports_per_write: Some(788),
      compress_to_account_pubkey: None,
      token_account_version: TokenDataVersion::ShaFlat,
  }
```

<CompressibleRentCalculator />
</Accordion>