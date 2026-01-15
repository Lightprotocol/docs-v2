export const Token22ExtensionsTable = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedInstruction, setSelectedInstruction] = useState(null);

  // Instructions data
  const anchorInstructions = [
    "create_token_pool",
    "add_token_pool",
    "mint_to",
    "batch_compress",
    "compress_spl_token_account",
    "transfer",
    "approve",
    "revoke",
    "freeze",
    "thaw",
    "burn",
  ];

  const pinocchioInstructions = [
    "TokenTransfer",
    "CreateAssociatedTokenAccount",
    "CreateAssociatedTokenAccountIdempotent",
    "CreateTokenAccount",
    "CloseTokenAccount",
    "Transfer2",
    "MintAction",
    "Claim",
    "WithdrawFundingPool",
  ];

  const allInstructions = [...anchorInstructions, ...pinocchioInstructions];

  // Extensions with runtime constraints (cannot transfer compressed)
  const runtimeConstraintExtensions = [
    "MintCloseAuthority",
    "TransferFeeConfig",
    "DefaultAccountState",
    "PermanentDelegate",
    "TransferHook",
    "Pausable",
    "ConfidentialTransferMint",
    "ConfidentialTransferFeeConfig",
    "ConfidentialMintBurn",
  ];

  // All 16 allowed extensions
  const extensions = [
    // Metadata extensions (no constraints)
    { name: "MetadataPointer", description: "-", instructions: allInstructions },
    { name: "TokenMetadata", description: "-", instructions: allInstructions },
    // Group extensions (no constraints)
    { name: "InterestBearingConfig", description: "-", instructions: allInstructions },
    { name: "GroupPointer", description: "-", instructions: allInstructions },
    { name: "GroupMemberPointer", description: "-", instructions: allInstructions },
    { name: "TokenGroup", description: "-", instructions: allInstructions },
    { name: "TokenGroupMember", description: "-", instructions: allInstructions },
    // Extensions with runtime constraints
    {
      name: "MintCloseAuthority",
      description: "-",
      instructions: allInstructions.filter(
        (i) => !["transfer", "TokenTransfer", "Transfer2"].includes(i)
      ),
    },
    {
      name: "TransferFeeConfig",
      description: "fees must be zero",
      instructions: allInstructions.filter(
        (i) => !["transfer", "TokenTransfer", "Transfer2"].includes(i)
      ),
    },
    {
      name: "DefaultAccountState",
      description: "any state allowed",
      instructions: allInstructions.filter(
        (i) => !["transfer", "TokenTransfer", "Transfer2"].includes(i)
      ),
    },
    {
      name: "PermanentDelegate",
      description: "-",
      instructions: allInstructions.filter(
        (i) => !["transfer", "TokenTransfer", "Transfer2"].includes(i)
      ),
    },
    {
      name: "TransferHook",
      description: "program_id must be nil",
      instructions: allInstructions.filter(
        (i) => !["transfer", "TokenTransfer", "Transfer2"].includes(i)
      ),
    },
    {
      name: "Pausable",
      description: "-",
      instructions: allInstructions.filter(
        (i) => !["transfer", "TokenTransfer", "Transfer2"].includes(i)
      ),
    },
    {
      name: "ConfidentialTransferMint",
      description: "initialized but not enabled",
      instructions: allInstructions.filter(
        (i) => !["transfer", "TokenTransfer", "Transfer2"].includes(i)
      ),
    },
    {
      name: "ConfidentialTransferFeeConfig",
      description: "fees must be zero",
      instructions: allInstructions.filter(
        (i) => !["transfer", "TokenTransfer", "Transfer2"].includes(i)
      ),
    },
    {
      name: "ConfidentialMintBurn",
      description: "initialized but not enabled",
      instructions: allInstructions.filter(
        (i) => !["transfer", "TokenTransfer", "Transfer2"].includes(i)
      ),
    },
  ];

  const hasRuntimeConstraint = (extName) => {
    return runtimeConstraintExtensions.includes(extName);
  };

  // Filter extensions based on active filter
  const getFilteredExtensions = () => {
    let filtered = extensions;

    if (selectedInstruction) {
      filtered = filtered.filter((ext) => ext.instructions.includes(selectedInstruction));
    }

    return filtered;
  };

  const filteredExtensions = getFilteredExtensions();

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    if (filter === "all") {
      setSelectedInstruction(null);
    }
  };

  const FilterButton = ({ filter, label }) => (
    <button
      onClick={() => handleFilterClick(filter)}
      className={`px-3 py-1.5 text-xs font-medium rounded-lg border backdrop-blur-sm transition-all ${
        activeFilter === filter
          ? "bg-blue-500/20 border-blue-500/50 text-blue-600 dark:text-blue-400"
          : "bg-black/[0.015] dark:bg-white/5 border-black/[0.04] dark:border-white/20 text-zinc-600 dark:text-white/70 hover:bg-black/[0.03] dark:hover:bg-white/10"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="not-prose mt-4" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="space-y-4">
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 px-1">
          <FilterButton filter="all" label="Show all" />

          {/* Instruction Dropdown */}
          <div className="relative">
            <select
              value={selectedInstruction || ""}
              onChange={(e) => {
                setSelectedInstruction(e.target.value || null);
                setActiveFilter("instruction");
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border backdrop-blur-sm transition-all appearance-none pr-8 cursor-pointer ${
                activeFilter === "instruction"
                  ? "bg-blue-500/20 border-blue-500/50 text-blue-600 dark:text-blue-400"
                  : "bg-black/[0.015] dark:bg-white/5 border-black/[0.04] dark:border-white/20 text-zinc-600 dark:text-white/70 hover:bg-black/[0.03] dark:hover:bg-white/10"
              }`}
            >
              <option value="">Filter by Instruction</option>
              <optgroup label="Anchor">
                {anchorInstructions.map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Pinocchio">
                {pinocchioInstructions.map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </optgroup>
            </select>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400 dark:text-white/40">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M3 5L6 8L9 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="px-1 text-xs text-zinc-500 dark:text-white/50">
          Showing {filteredExtensions.length} of {extensions.length} extensions
        </div>

        {/* Table */}
        <table style={{ fontSize: "0.85em" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>Extension Name</th>
              <th style={{ textAlign: "left" }}>Description</th>
              <th style={{ textAlign: "center" }}>Light Token</th>
              <th style={{ textAlign: "center" }}>Compressed Token</th>
            </tr>
          </thead>
          <tbody>
            {filteredExtensions.map((ext) => (
              <tr key={ext.name}>
                <td style={{ textAlign: "left" }}>{ext.name}</td>
                <td style={{ textAlign: "left" }}>{ext.description}</td>
                <td style={{ textAlign: "center" }}>✓</td>
                <td style={{ textAlign: "center" }}>
                  {hasRuntimeConstraint(ext.name) ? "-" : "✓"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
