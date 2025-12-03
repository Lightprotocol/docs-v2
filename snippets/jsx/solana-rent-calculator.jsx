export const SolanaRentCalculator = () => {
  const [dataLen, setDataLen] = useState(165);

  const ACCOUNT_STORAGE_OVERHEAD = 128;
  const LAMPORTS_PER_BYTE = 6960;

  const minimumBalance = (ACCOUNT_STORAGE_OVERHEAD + dataLen) * LAMPORTS_PER_BYTE;
  const solAmount = minimumBalance / 1_000_000_000;

  const handleDataLenChange = (value) => {
    const num = Math.max(0, Math.min(10000, Number.parseInt(value) || 0));
    setDataLen(num);
  };

  return (
    <div className="p-5 rounded-3xl not-prose mt-4 dark:bg-white/5 backdrop-blur-xl border border-black/[0.04] dark:border-white/10 shadow-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="space-y-5">
        {/* Slider */}
        <div className="px-3">
          <div className="block text-sm text-zinc-700 dark:text-white/80">
            <span className="flex justify-between items-center mb-2">
              <span>Account Data Length</span>
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
            <span className="text-xs text-zinc-500 dark:text-white/50 mt-1 block">Total size: {ACCOUNT_STORAGE_OVERHEAD + dataLen} bytes (incl. 128 byte overhead)</span>
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
              Token Account (165)
            </button>
            <button
              onClick={() => setDataLen(100)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border backdrop-blur-sm transition-all ${
                dataLen === 100
                  ? 'bg-blue-500/20 border-blue-500/50 text-blue-600 dark:text-blue-400'
                  : 'bg-black/[0.015] border-black/[0.04] text-zinc-600 dark:text-white/70 hover:bg-black/[0.03]'
              }`}
            >
              PDA (100)
            </button>
            <button
              onClick={() => setDataLen(82)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border backdrop-blur-sm transition-all ${
                dataLen === 82
                  ? 'bg-blue-500/20 border-blue-500/50 text-blue-600 dark:text-blue-400'
                  : 'bg-black/[0.015] border-black/[0.04] text-zinc-600 dark:text-white/70 hover:bg-black/[0.03]'
              }`}
            >
              Token Mint (82)
            </button>
          </div>
        </div>

        {/* Result Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 bg-black/[0.015] dark:bg-white/5 backdrop-blur-md rounded-2xl text-center border border-black/[0.04] dark:border-white/10 shadow-sm">
            <div className="text-xs text-zinc-500 dark:text-white/50 mb-1 uppercase tracking-wide">Rent-Exempt Balance</div>
            <div className="text-xl font-mono font-semibold text-zinc-900 dark:text-white">
              {minimumBalance.toLocaleString()}
            </div>
            <div className="text-xs text-zinc-400 dark:text-white/40">lamports</div>
          </div>

          <div className="p-4 bg-black/[0.015] dark:bg-white/5 backdrop-blur-md rounded-2xl text-center border border-black/[0.04] dark:border-white/10 shadow-sm">
            <div className="text-xs text-zinc-500 dark:text-white/50 mb-1 uppercase tracking-wide">SOL Amount</div>
            <div className="text-xl font-mono font-semibold text-zinc-900 dark:text-white">
              {solAmount.toFixed(6)}
            </div>
            <div className="text-xs text-zinc-400 dark:text-white/40">SOL</div>
          </div>
        </div>

        {/* Formula reference */}
        <div className="text-xs font-mono text-zinc-500 dark:text-white/40 pt-3 border-t border-black/[0.04] dark:border-white/10">
          minimum_balance = (ACCOUNT_STORAGE_OVERHEAD + data_len) × lamports_per_byte<br/>
          minimum_balance = ({ACCOUNT_STORAGE_OVERHEAD} + {dataLen}) × {LAMPORTS_PER_BYTE.toLocaleString()} = {minimumBalance.toLocaleString()} lamports
        </div>
      </div>
    </div>
  );
};
