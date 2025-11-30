export const CompressibleRentCalculator = () => {
  const [hours, setHours] = useState(2);
  const [lamportsPerWrite, setLamportsPerWrite] = useState(766);

  const DATA_LEN = 260;
  const BASE_RENT = 128;
  const LAMPORTS_PER_BYTE_PER_EPOCH = 1;
  const MINUTES_PER_EPOCH = 42;

  const numEpochs = Math.ceil((hours * 60) / MINUTES_PER_EPOCH);
  const rentPerEpoch = BASE_RENT + (DATA_LEN * LAMPORTS_PER_BYTE_PER_EPOCH);
  const totalPrepaidRent = rentPerEpoch * numEpochs;

  const handleHoursChange = (value) => {
    const num = Math.max(1, Math.min(168, Number.parseInt(value) || 2));
    setHours(num);
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
              <span>Prepaid Epochs in Hours</span>
              <span className="flex items-center gap-1">
                <input
                  type="number"
                  min="1"
                  max="168"
                  value={hours}
                  onChange={(e) => handleHoursChange(e.target.value)}
                  className="w-16 px-2 py-1 text-right font-mono font-medium bg-black/[0.015] dark:bg-white/10 border border-black/[0.04] dark:border-white/20 rounded-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
                <span className="text-xs text-zinc-500 dark:text-white/50">hours</span>
              </span>
            </span>
            <input
              type="range"
              min="1"
              max="48"
              value={Math.min(hours, 48)}
              onChange={(e) => setHours(Number.parseInt(e.target.value))}
              className="w-full h-1.5 bg-black/[0.03] dark:bg-white/20 rounded-full appearance-none cursor-pointer backdrop-blur-sm"
            />
            <span className="text-xs text-zinc-500 dark:text-white/50 mt-1 block">≈ {((hours * 60) / MINUTES_PER_EPOCH).toFixed(1)} epochs</span>

            {/* Preset buttons */}
            <div className="flex gap-2 mt-3">
              {[2, 4, 6, 12, 24].map((h) => (
                <button
                  key={h}
                  onClick={() => setHours(h)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border backdrop-blur-sm transition-all ${
                    hours === h
                      ? 'bg-blue-500/20 border-blue-500/50 text-blue-600 dark:text-blue-400'
                      : 'bg-black/[0.015] border-black/[0.04] text-zinc-600 dark:text-white/70 hover:bg-black/[0.03]'
                  }`}
                >
                  {h}h
                </button>
              ))}
            </div>
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
            <div className="text-xs text-zinc-500 dark:text-white/50 mt-1">≈ {((hours * 60) / MINUTES_PER_EPOCH).toFixed(1)} epochs / {hours}h</div>
          </div>

          <div className="p-4 bg-black/[0.015] dark:bg-white/5 backdrop-blur-md rounded-2xl text-center border border-black/[0.04] dark:border-white/10 shadow-sm">
            <div className="text-xs text-zinc-500 dark:text-white/50 mb-1 uppercase tracking-wide">Top-up Amount</div>
            <div className="text-xl font-mono font-semibold text-zinc-900 dark:text-white">
              {lamportsPerWrite.toLocaleString()}
            </div>
            <div className="text-xs text-zinc-400 dark:text-white/40">lamports</div>
            <div className="text-xs text-zinc-500 dark:text-white/50 mt-1">≈ {(lamportsPerWrite / rentPerEpoch).toFixed(1)} epochs / {((lamportsPerWrite / rentPerEpoch) * MINUTES_PER_EPOCH / 60).toFixed(1)}h</div>
          </div>
        </div>

        {/* Formula reference */}
        <div className="text-xs font-mono text-zinc-500 dark:text-white/40 pt-3 border-t border-black/[0.04] dark:border-white/10">
          rent_per_epoch = base_rent + (data_len × lamports_per_byte_per_epoch)<br/><br/>
          For 260-byte cToken account:<br/>
          rent_per_epoch = {BASE_RENT} + ({DATA_LEN} × {LAMPORTS_PER_BYTE_PER_EPOCH}) = {rentPerEpoch} lamports
        </div>
      </div>
    </div>
  );
};
