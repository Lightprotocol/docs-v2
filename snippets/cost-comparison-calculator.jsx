export const CostComparisonCalculator = () => {
  const [numAccounts, setNumAccounts] = useState(10000);
  const [dataLen, setDataLen] = useState(165);

  const ACCOUNT_STORAGE_OVERHEAD = 128;
  const LAMPORTS_PER_BYTE = 6960;
  const COMPRESSED_COST_PER_ACCOUNT = 10300;
  const LAMPORTS_PER_SOL = 1_000_000_000;

  const solanaCost = numAccounts * (ACCOUNT_STORAGE_OVERHEAD + dataLen) * LAMPORTS_PER_BYTE;
  const compressedCost = numAccounts * COMPRESSED_COST_PER_ACCOUNT;
  const savings = solanaCost - compressedCost;
  const savingsPercent = ((savings / solanaCost) * 100).toFixed(1);

  const handleAccountsChange = (value) => {
    const num = Math.max(1, Math.min(1000000, Number.parseInt(value) || 1));
    setNumAccounts(num);
  };

  const handleDataLenChange = (value) => {
    const num = Math.max(0, Math.min(10000, Number.parseInt(value) || 0));
    setDataLen(num);
  };

  const formatSOL = (lamports) => {
    const sol = lamports / LAMPORTS_PER_SOL;
    if (sol >= 1000) {
      return sol.toLocaleString(undefined, { maximumFractionDigits: 2 });
    } else if (sol >= 1) {
      return sol.toFixed(4);
    }
    return sol.toFixed(6);
  };

  return (
    <div className="p-5 rounded-3xl not-prose mt-4 dark:bg-white/5 backdrop-blur-xl border border-black/[0.04] dark:border-white/10 shadow-lg">
      <div className="space-y-5">
        {/* Inputs */}
        <div className="space-y-4 px-3">
          <div className="block text-sm text-zinc-700 dark:text-white/80">
            <span className="flex justify-between items-center mb-2">
              <span>Number of Accounts</span>
              <input
                type="number"
                min="1"
                max="1000000"
                value={numAccounts}
                onChange={(e) => handleAccountsChange(e.target.value)}
                className="w-28 px-2 py-1 text-right font-mono font-medium bg-black/[0.015] dark:bg-white/10 border border-black/[0.04] dark:border-white/20 rounded-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </span>
            <input
              type="range"
              min="5000"
              max="500000"
              step="5000"
              value={Math.min(numAccounts, 500000)}
              onChange={(e) => setNumAccounts(Number.parseInt(e.target.value))}
              className="w-full h-1.5 bg-black/[0.03] dark:bg-white/20 rounded-full appearance-none cursor-pointer backdrop-blur-sm"
            />
          </div>

          <div className="block text-sm text-zinc-700 dark:text-white/80">
            <span className="flex justify-between items-center mb-2">
              <span>Data Length per Account</span>
              <span className="flex items-center gap-1">
                <input
                  type="number"
                  min="0"
                  max="10000"
                  value={dataLen}
                  onChange={(e) => handleDataLenChange(e.target.value)}
                  className="w-20 px-2 py-1 text-right font-mono font-medium bg-black/[0.015] dark:bg-white/10 border border-black/[0.04] dark:border-white/20 rounded-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
                <span className="text-xs text-zinc-500 dark:text-white/50">bytes</span>
              </span>
            </span>
            <input
              type="range"
              min="0"
              max="1000"
              value={Math.min(dataLen, 1000)}
              onChange={(e) => setDataLen(Number.parseInt(e.target.value))}
              className="w-full h-1.5 bg-black/[0.03] dark:bg-white/20 rounded-full appearance-none cursor-pointer backdrop-blur-sm"
            />
          </div>

          {/* Preset buttons */}
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => setDataLen(165)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border backdrop-blur-sm transition-all ${
                dataLen === 165
                  ? 'bg-blue-500/20 border-blue-500/50 text-blue-600 dark:text-blue-400'
                  : 'bg-black/[0.015] border-black/[0.04] text-zinc-600 dark:text-white/70 hover:bg-black/[0.03]'
              }`}
            >
              Token Account
            </button>
            <button
              onClick={() => setDataLen(100)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border backdrop-blur-sm transition-all ${
                dataLen === 100
                  ? 'bg-blue-500/20 border-blue-500/50 text-blue-600 dark:text-blue-400'
                  : 'bg-black/[0.015] border-black/[0.04] text-zinc-600 dark:text-white/70 hover:bg-black/[0.03]'
              }`}
            >
              PDA Account
            </button>
            <button
              onClick={() => setDataLen(82)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border backdrop-blur-sm transition-all ${
                dataLen === 82
                  ? 'bg-blue-500/20 border-blue-500/50 text-blue-600 dark:text-blue-400'
                  : 'bg-black/[0.015] border-black/[0.04] text-zinc-600 dark:text-white/70 hover:bg-black/[0.03]'
              }`}
            >
              Token Mint
            </button>
          </div>
        </div>

        {/* Result Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-4 bg-black/[0.015] dark:bg-white/5 backdrop-blur-md rounded-2xl text-center border border-black/[0.04] dark:border-white/10 shadow-sm">
            <div className="text-xs text-zinc-500 dark:text-white/50 mb-1 uppercase tracking-wide">Solana Cost</div>
            <div className="text-xl font-mono font-semibold text-zinc-900 dark:text-white">
              {formatSOL(solanaCost)}
            </div>
            <div className="text-xs text-zinc-400 dark:text-white/40">SOL</div>
          </div>

          <div className="p-4 bg-black/[0.015] dark:bg-white/5 backdrop-blur-md rounded-2xl text-center border border-black/[0.04] dark:border-white/10 shadow-sm">
            <div className="text-xs text-zinc-500 dark:text-white/50 mb-1 uppercase tracking-wide">Compressed Cost</div>
            <div className="text-xl font-mono font-semibold text-zinc-900 dark:text-white">
              {formatSOL(compressedCost)}
            </div>
            <div className="text-xs text-zinc-400 dark:text-white/40">SOL</div>
          </div>

          <div className="p-4 bg-green-500/10 dark:bg-green-500/10 backdrop-blur-md rounded-2xl text-center border border-green-500/30 dark:border-green-500/20 shadow-sm">
            <div className="text-xs text-green-600 dark:text-green-400 mb-1 uppercase tracking-wide">Savings</div>
            <div className="text-xl font-mono font-semibold text-green-600 dark:text-green-400">
              {savingsPercent}%
            </div>
            <div className="text-xs text-green-600/70 dark:text-green-400/70">{formatSOL(savings)} SOL</div>
          </div>
        </div>

        {/* Formula reference */}
        <div className="text-xs font-mono text-zinc-500 dark:text-white/40 pt-3 border-t border-black/[0.04] dark:border-white/10">
          Solana: {numAccounts.toLocaleString()} × ({ACCOUNT_STORAGE_OVERHEAD} + {dataLen}) × {LAMPORTS_PER_BYTE.toLocaleString()} = {solanaCost.toLocaleString()} lamports<br/>
          Compressed: {numAccounts.toLocaleString()} × {COMPRESSED_COST_PER_ACCOUNT.toLocaleString()} = {compressedCost.toLocaleString()} lamports
        </div>
      </div>
    </div>
  );
};
