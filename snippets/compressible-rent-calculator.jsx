export const CompressibleRentCalculator = () => {
  const [numEpochs, setNumEpochs] = useState(2);
  const [lamportsPerWrite, setLamportsPerWrite] = useState(766);

  const DATA_LEN = 260;
  const BASE_RENT = 128;
  const LAMPORTS_PER_BYTE_PER_EPOCH = 1;

  const rentPerEpoch = BASE_RENT + (DATA_LEN * LAMPORTS_PER_BYTE_PER_EPOCH);
  const totalPrepaidRent = rentPerEpoch * numEpochs;
  const MINUTES_PER_EPOCH = 42;
  const totalMinutes = numEpochs * MINUTES_PER_EPOCH;
  const timeDisplay = totalMinutes >= 60
    ? `${(totalMinutes / 60).toFixed(1)}h`
    : `${totalMinutes} min`;

  const handleEpochsChange = (value) => {
    const num = Math.max(2, Math.min(1000, Number.parseInt(value) || 2));
    setNumEpochs(num);
  };

  const handleLamportsChange = (value) => {
    const num = Math.max(0, Math.min(100000, Number.parseInt(value) || 0));
    setLamportsPerWrite(num);
  };

  return (
    <div className="p-5 rounded-3xl not-prose mt-4 dark:bg-white/5 backdrop-blur-xl border border-black/[0.04] dark:border-white/10 shadow-lg">
      <div className="space-y-5">
        {/* Sliders */}
        <div className="space-y-4 px-3">
          <div className="block text-sm text-zinc-700 dark:text-white/80">
            <span className="flex justify-between items-center mb-2">
              <span>Prepaid Epochs</span>
              <input
                type="number"
                min="2"
                max="1000"
                value={numEpochs}
                onChange={(e) => handleEpochsChange(e.target.value)}
                className="w-20 px-2 py-1 text-right font-mono font-medium bg-black/[0.015] dark:bg-white/10 border border-black/[0.04] dark:border-white/20 rounded-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </span>
            <input
              type="range"
              min="2"
              max="100"
              value={Math.min(numEpochs, 100)}
              onChange={(e) => setNumEpochs(Number.parseInt(e.target.value))}
              className="w-full h-1.5 bg-black/[0.03] dark:bg-white/20 rounded-full appearance-none cursor-pointer backdrop-blur-sm"
            />
            <span className="text-xs text-zinc-500 dark:text-white/50 mt-1 block">≈ {timeDisplay}</span>
          </div>

          <div className="block text-sm text-zinc-700 dark:text-white/80">
            <span className="flex justify-between items-center mb-2">
              <span>Lamports per Write</span>
              <input
                type="number"
                min="0"
                max="100000"
                value={lamportsPerWrite}
                onChange={(e) => handleLamportsChange(e.target.value)}
                className="w-24 px-2 py-1 text-right font-mono font-medium bg-black/[0.015] dark:bg-white/10 border border-black/[0.04] dark:border-white/20 rounded-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </span>
            <input
              type="range"
              min="0"
              max="10000"
              step="100"
              value={Math.min(lamportsPerWrite, 10000)}
              onChange={(e) => setLamportsPerWrite(Number.parseInt(e.target.value))}
              className="w-full h-1.5 bg-black/[0.03] dark:bg-white/20 rounded-full appearance-none cursor-pointer backdrop-blur-sm"
            />
          </div>
        </div>

        {/* Result Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-4 bg-black/[0.015] dark:bg-white/5 backdrop-blur-md rounded-2xl text-center border border-black/[0.04] dark:border-white/10 shadow-sm">
            <div className="text-xs text-zinc-500 dark:text-white/50 mb-1 uppercase tracking-wide">Rent per Epoch</div>
            <div className="text-xl font-mono font-semibold text-zinc-900 dark:text-white">
              {rentPerEpoch.toLocaleString()}
            </div>
            <div className="text-xs text-zinc-400 dark:text-white/40">lamports</div>
          </div>

          <div className="p-4 bg-black/[0.015] dark:bg-white/5 backdrop-blur-md rounded-2xl text-center border border-black/[0.04] dark:border-white/10 shadow-sm">
            <div className="text-xs text-zinc-500 dark:text-white/50 mb-1 uppercase tracking-wide">Total Prepaid</div>
            <div className="text-xl font-mono font-semibold text-zinc-900 dark:text-white">
              {totalPrepaidRent.toLocaleString()}
            </div>
            <div className="text-xs text-zinc-400 dark:text-white/40">lamports</div>
          </div>

          <div className="p-4 bg-black/[0.015] dark:bg-white/5 backdrop-blur-md rounded-2xl text-center border border-black/[0.04] dark:border-white/10 shadow-sm">
            <div className="text-xs text-zinc-500 dark:text-white/50 mb-1 uppercase tracking-wide">Top-up Amount</div>
            <div className="text-xl font-mono font-semibold text-zinc-900 dark:text-white">
              {lamportsPerWrite.toLocaleString()}
            </div>
            <div className="text-xs text-zinc-400 dark:text-white/40">lamports</div>
            <div className="text-xs text-zinc-500 dark:text-white/50 mt-1">≈ {(lamportsPerWrite / rentPerEpoch).toFixed(1)} epochs</div>
          </div>
        </div>

        {/* Formula reference */}
        <div className="text-xs font-mono text-zinc-500 dark:text-white/40 pt-3 border-t border-black/[0.04] dark:border-white/10">
          rent_per_epoch = base_rent + (data_len * lamports_per_byte_per_epoch)<br/>

          For 260-byte cToken account:
          rent_per_epoch = {BASE_RENT} + ({DATA_LEN} × {LAMPORTS_PER_BYTE_PER_EPOCH}) = {rentPerEpoch} lamports
        </div>
      </div>
    </div>
  );
};
