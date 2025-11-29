export const BreakEvenCalculator = () => {
  const [dataLen, setDataLen] = useState(100);
  const [numAccounts, setNumAccounts] = useState(1000);
  const [numWrites, setNumWrites] = useState(10);
  const [priorityFeeRate, setPriorityFeeRate] = useState(1000);
  const [showPrioritySlider, setShowPrioritySlider] = useState(false);

  const ACCOUNT_STORAGE_OVERHEAD = 128;
  const LAMPORTS_PER_BYTE = 6960;
  const BASE_COST_PER_WRITE = 10300;
  const COMPRESSED_CU_PER_WRITE = 300000;
  const LAMPORTS_PER_SOL = 1_000_000_000;

  const priorityFeePerWrite = Math.floor((COMPRESSED_CU_PER_WRITE * priorityFeeRate) / 1_000_000);
  const costPerWrite = BASE_COST_PER_WRITE + priorityFeePerWrite;

  const solanaCostPerAccount = (ACCOUNT_STORAGE_OVERHEAD + dataLen) * LAMPORTS_PER_BYTE;
  const solanaCost = numAccounts * solanaCostPerAccount;
  const compressedCostPerAccount = costPerWrite * (1 + numWrites);
  const compressedCost = numAccounts * compressedCostPerAccount;
  const breakEvenWrites = Math.floor((solanaCostPerAccount / costPerWrite) - 1);
  const useCompressed = numWrites < breakEvenWrites;

  const handleDataLenChange = (value) => {
    const num = Math.max(0, Math.min(10000, Number.parseInt(value) || 0));
    setDataLen(num);
  };

  const handleAccountsChange = (value) => {
    const num = Math.max(1, Math.min(1000000, Number.parseInt(value) || 1));
    setNumAccounts(num);
  };

  const handleWritesChange = (value) => {
    const num = Math.max(0, Math.min(10000, Number.parseInt(value) || 0));
    setNumWrites(num);
  };

  const handlePriorityFeeChange = (value) => {
    const num = Math.max(0, Math.min(100000, Number.parseInt(value) || 0));
    setPriorityFeeRate(num);
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
              <span>Account Size</span>
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
              max="550"
              value={Math.min(dataLen, 550)}
              onChange={(e) => setDataLen(Number.parseInt(e.target.value))}
              className="w-full h-1.5 bg-black/[0.03] dark:bg-white/20 rounded-full appearance-none cursor-pointer backdrop-blur-sm"
            />
          </div>

          {/* Preset buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setDataLen(100)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border backdrop-blur-sm transition-all ${
                dataLen === 100
                  ? 'bg-blue-500/20 border-blue-500/50 text-blue-600 dark:text-blue-400'
                  : 'bg-black/[0.015] border-black/[0.04] text-zinc-600 dark:text-white/70 hover:bg-black/[0.03]'
              }`}
            >
              100 bytes
            </button>
            <button
              onClick={() => setDataLen(250)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border backdrop-blur-sm transition-all ${
                dataLen === 250
                  ? 'bg-blue-500/20 border-blue-500/50 text-blue-600 dark:text-blue-400'
                  : 'bg-black/[0.015] border-black/[0.04] text-zinc-600 dark:text-white/70 hover:bg-black/[0.03]'
              }`}
            >
              250 bytes
            </button>
            <button
              onClick={() => setDataLen(500)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border backdrop-blur-sm transition-all ${
                dataLen === 500
                  ? 'bg-blue-500/20 border-blue-500/50 text-blue-600 dark:text-blue-400'
                  : 'bg-black/[0.015] border-black/[0.04] text-zinc-600 dark:text-white/70 hover:bg-black/[0.03]'
              }`}
            >
              500 bytes
            </button>
          </div>

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
              min="100"
              max="100000"
              step="100"
              value={Math.min(numAccounts, 100000)}
              onChange={(e) => setNumAccounts(Number.parseInt(e.target.value))}
              className="w-full h-1.5 bg-black/[0.03] dark:bg-white/20 rounded-full appearance-none cursor-pointer backdrop-blur-sm"
            />
          </div>

          <div className="block text-sm text-zinc-700 dark:text-white/80">
            <span className="flex justify-between items-center mb-2">
              <span>Expected Writes (per account)</span>
              <input
                type="number"
                min="0"
                max="10000"
                value={numWrites}
                onChange={(e) => handleWritesChange(e.target.value)}
                className="w-20 px-2 py-1 text-right font-mono font-medium bg-black/[0.015] dark:bg-white/10 border border-black/[0.04] dark:border-white/20 rounded-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </span>
            <input
              type="range"
              min="0"
              max="500"
              value={Math.min(numWrites, 500)}
              onChange={(e) => setNumWrites(Number.parseInt(e.target.value))}
              className="w-full h-1.5 bg-black/[0.03] dark:bg-white/20 rounded-full appearance-none cursor-pointer backdrop-blur-sm"
            />
          </div>

          <div className="block text-sm text-zinc-700 dark:text-white/80">
            <span className="flex justify-between items-center mb-2">
              <span>Priority Fee</span>
              <span className="text-xs text-zinc-500 dark:text-white/50">
                +{priorityFeePerWrite.toLocaleString()} lamports/write
              </span>
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPriorityFeeRate(100)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border backdrop-blur-sm transition-all ${
                  priorityFeeRate === 100
                    ? 'bg-blue-500/20 border-blue-500/50 text-blue-600 dark:text-blue-400'
                    : 'bg-black/[0.015] border-black/[0.04] text-zinc-600 dark:text-white/70 hover:bg-black/[0.03]'
                }`}
              >
                Low
              </button>
              <button
                onClick={() => setPriorityFeeRate(1000)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border backdrop-blur-sm transition-all ${
                  priorityFeeRate === 1000
                    ? 'bg-blue-500/20 border-blue-500/50 text-blue-600 dark:text-blue-400'
                    : 'bg-black/[0.015] border-black/[0.04] text-zinc-600 dark:text-white/70 hover:bg-black/[0.03]'
                }`}
              >
                Normal
              </button>
              <button
                onClick={() => setPriorityFeeRate(5000)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border backdrop-blur-sm transition-all ${
                  priorityFeeRate === 5000
                    ? 'bg-blue-500/20 border-blue-500/50 text-blue-600 dark:text-blue-400'
                    : 'bg-black/[0.015] border-black/[0.04] text-zinc-600 dark:text-white/70 hover:bg-black/[0.03]'
                }`}
              >
                High
              </button>
              <button
                onClick={() => setShowPrioritySlider(!showPrioritySlider)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border backdrop-blur-sm transition-all bg-black/[0.015] border-black/[0.04] text-zinc-600 dark:text-white/70 hover:bg-black/[0.03]"
              >
                {showPrioritySlider ? 'Hide' : 'Custom'}
              </button>
            </div>
            {showPrioritySlider && (
              <div className="mt-3 space-y-2">
                <div className="flex justify-between items-center">
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="100"
                    value={Math.min(priorityFeeRate, 10000)}
                    onChange={(e) => setPriorityFeeRate(Number.parseInt(e.target.value))}
                    className="flex-1 h-1.5 bg-black/[0.03] dark:bg-white/20 rounded-full appearance-none cursor-pointer backdrop-blur-sm"
                  />
                  <span className="flex items-center gap-1 ml-3">
                    <input
                      type="number"
                      min="0"
                      max="100000"
                      value={priorityFeeRate}
                      onChange={(e) => handlePriorityFeeChange(e.target.value)}
                      className="w-20 px-2 py-1 text-right font-mono font-medium bg-black/[0.015] dark:bg-white/10 border border-black/[0.04] dark:border-white/20 rounded-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                    <span className="text-xs text-zinc-500 dark:text-white/50">μL/CU</span>
                  </span>
                </div>
                <span className="text-xs text-zinc-500 dark:text-white/50 block">
                  {COMPRESSED_CU_PER_WRITE.toLocaleString()} CU × {priorityFeeRate.toLocaleString()} μL/CU
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="text-sm font-medium text-zinc-700 dark:text-white/80 px-3">Results</div>
        <div className="grid grid-cols-4 gap-3">
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

          <div className="p-4 bg-black/[0.015] dark:bg-white/5 backdrop-blur-md rounded-2xl text-center border border-black/[0.04] dark:border-white/10 shadow-sm">
            <div className="text-xs text-zinc-500 dark:text-white/50 mb-1 uppercase tracking-wide">Break-even</div>
            <div className="text-xl font-mono font-semibold text-zinc-900 dark:text-white">
              {breakEvenWrites.toLocaleString()}
            </div>
            <div className="text-xs text-zinc-400 dark:text-white/40">writes</div>
          </div>

          <div className="p-4 bg-black/[0.015] dark:bg-white/5 backdrop-blur-md rounded-2xl text-center border border-black/[0.04] dark:border-white/10 shadow-sm">
            <div className="text-xs text-zinc-500 dark:text-white/50 mb-1 uppercase tracking-wide">Recommendation</div>
            <div className="text-lg font-semibold text-zinc-900 dark:text-white">
              {useCompressed ? 'Use Compressed' : 'Use Solana'}
            </div>
          </div>
        </div>

        {/* Formula reference */}
        <div className="text-xs font-mono text-zinc-500 dark:text-white/40 pt-3 border-t border-black/[0.04] dark:border-white/10">
          Solana: ({ACCOUNT_STORAGE_OVERHEAD} + {dataLen}) × {LAMPORTS_PER_BYTE.toLocaleString()} = {solanaCostPerAccount.toLocaleString()} lamports/account<br/>
          Compressed: ({BASE_COST_PER_WRITE.toLocaleString()} + {priorityFeePerWrite.toLocaleString()}) × (1 + {numWrites}) = {compressedCostPerAccount.toLocaleString()} lamports/account<br/>
          Cost per write: {BASE_COST_PER_WRITE.toLocaleString()} base + {priorityFeePerWrite.toLocaleString()} priority ({COMPRESSED_CU_PER_WRITE.toLocaleString()} CU) = {costPerWrite.toLocaleString()} lamports
        </div>
      </div>
    </div>
  );
};
