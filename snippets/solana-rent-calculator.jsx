export const SolanaRentCalculator = () => {
  const [dataLen, setDataLen] = useState(165);

  const ACCOUNT_STORAGE_OVERHEAD = 128;
  const LAMPORTS_PER_BYTE = 6960;

  const minimumBalance = (ACCOUNT_STORAGE_OVERHEAD + dataLen) * LAMPORTS_PER_BYTE;
  const solAmount = minimumBalance / 1_000_000_000;

  return (
    <div className="p-5 rounded-3xl not-prose mt-4 bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-lg">
      <div className="space-y-5">
        {/* Slider */}
        <div className="px-3">
          <label className="block text-sm text-zinc-700 dark:text-white/80">
            <span className="flex justify-between mb-2">
              <span>Account Data Length</span>
              <span className="font-mono font-medium">{dataLen} bytes</span>
            </span>
            <input
              type="range"
              min="0"
              max="1000"
              value={dataLen}
              onChange={(e) => setDataLen(Number.parseInt(e.target.value))}
              className="w-full h-1.5 bg-white/30 dark:bg-white/20 rounded-full appearance-none cursor-pointer backdrop-blur-sm"
            />
            <span className="text-xs text-zinc-500 dark:text-white/50 mt-1 block">Total size: {ACCOUNT_STORAGE_OVERHEAD + dataLen} bytes (incl. 128 byte overhead)</span>
          </label>
        </div>

        {/* Result Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 bg-white/20 dark:bg-white/5 backdrop-blur-md rounded-2xl text-center border border-white/30 dark:border-white/10 shadow-sm">
            <div className="text-xs text-zinc-500 dark:text-white/50 mb-1 uppercase tracking-wide">Rent-Exempt Balance</div>
            <div className="text-xl font-mono font-semibold text-zinc-900 dark:text-white">
              {minimumBalance.toLocaleString()}
            </div>
            <div className="text-xs text-zinc-400 dark:text-white/40">lamports</div>
          </div>

          <div className="p-4 bg-white/20 dark:bg-white/5 backdrop-blur-md rounded-2xl text-center border border-white/30 dark:border-white/10 shadow-sm">
            <div className="text-xs text-zinc-500 dark:text-white/50 mb-1 uppercase tracking-wide">SOL Amount</div>
            <div className="text-xl font-mono font-semibold text-zinc-900 dark:text-white">
              {solAmount.toFixed(6)}
            </div>
            <div className="text-xs text-zinc-400 dark:text-white/40">SOL</div>
          </div>
        </div>

        {/* Formula reference */}
        <div className="text-xs font-mono text-zinc-500 dark:text-white/40 pt-3 border-t border-white/20 dark:border-white/10">
          minimum_balance = (ACCOUNT_STORAGE_OVERHEAD + data_len) × lamports_per_byte<br/>
          minimum_balance = ({ACCOUNT_STORAGE_OVERHEAD} + {dataLen}) × {LAMPORTS_PER_BYTE.toLocaleString()} = {minimumBalance.toLocaleString()} lamports
        </div>
      </div>
    </div>
  );
};
