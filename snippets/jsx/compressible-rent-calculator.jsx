export const CompressibleRentCalculator = () => {
  const [hours, setHours] = useState(24);
  const [lamportsPerWrite, setLamportsPerWrite] = useState(776);
  const [showCustomHours, setShowCustomHours] = useState(false);
  const [showCustomLamports, setShowCustomLamports] = useState(false);
  const [showFormula, setShowFormula] = useState(false);

  const DATA_LEN = 260;
  const BASE_RENT = 128;
  const LAMPORTS_PER_BYTE_PER_EPOCH = 1;
  const MINUTES_PER_EPOCH = 90;
  const COMPRESSION_INCENTIVE = 11000;
  const LAMPORTS_PER_SOL = 1_000_000_000;

  const HOURS_MAX = 36;
  const LAMPORTS_MAX = 6400;

  const numEpochs = Math.ceil((hours * 60) / MINUTES_PER_EPOCH);
  const rentPerEpoch = BASE_RENT + (DATA_LEN * LAMPORTS_PER_BYTE_PER_EPOCH);
  const totalPrepaidRent = rentPerEpoch * numEpochs;
  const totalCreationCost = totalPrepaidRent + COMPRESSION_INCENTIVE;

  const handleHoursChange = (value) => {
    const num = Math.max(3, Math.min(168, Number.parseInt(value) || 3));
    setHours(num);
  };

  const handleLamportsChange = (value) => {
    const num = Math.max(0, Math.min(100000, Number.parseInt(value) || 0));
    setLamportsPerWrite(num);
  };

  const hoursPresets = [24];
  const lamportsPresets = [776];

  const SliderMarkers = ({ max, step }) => {
    const marks = [];
    for (let i = step; i < max; i += step) {
      const percent = (i / max) * 100;
      marks.push(
        <div
          key={i}
          className="absolute top-1/2 -translate-y-1/2 w-px h-2 bg-zinc-300 dark:bg-white/30"
          style={{ left: `${percent}%` }}
        />
      );
    }
    return <>{marks}</>;
  };

  return (
    <div className="p-5 rounded-3xl not-prose mt-4 dark:bg-white/5 backdrop-blur-xl border border-black/[0.04] dark:border-white/10 shadow-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="space-y-5">
        {/* Prepaid Epochs in Hours */}
        <div className="space-y-2 px-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-zinc-700 dark:text-white/80">Prepaid Epochs in Hours</span>
            <div className="flex items-center gap-1.5">
              {hoursPresets.map((h) => (
                <button
                  key={h}
                  onClick={() => { setHours(h); setShowCustomHours(false); }}
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg border backdrop-blur-sm transition-all ${
                    hours === h && !showCustomHours
                      ? 'bg-blue-500/20 border-blue-500/50 text-blue-600 dark:text-blue-400'
                      : 'bg-black/[0.015] dark:bg-white/5 border-black/[0.04] dark:border-white/20 text-zinc-600 dark:text-white/70 hover:bg-black/[0.03]'
                  }`}
                >
                  {h === 24 ? 'Default' : `${h}h`}
                </button>
              ))}
              {showCustomHours ? (
                <input
                  type="number"
                  min="3"
                  max="168"
                  value={hours}
                  onChange={(e) => handleHoursChange(e.target.value)}
                  className="w-16 px-2 py-1 text-right text-xs font-mono font-medium bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/50 rounded-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  autoFocus
                />
              ) : (
                <button
                  onClick={() => setShowCustomHours(true)}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg border backdrop-blur-sm transition-all bg-black/[0.015] dark:bg-white/5 border-black/[0.04] dark:border-white/20 text-zinc-600 dark:text-white/70 hover:bg-black/[0.03]"
                >
                  Custom
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center">
            <span className="w-1/3 text-xs text-zinc-500 dark:text-white/50 whitespace-nowrap">
              ≈ {((hours * 60) / MINUTES_PER_EPOCH).toFixed(1)} epochs / {hours.toFixed(1)}h
            </span>
            <div className="w-2/3 relative">
              <SliderMarkers max={HOURS_MAX} step={2} />
              <input
                type="range"
                min="3"
                max={HOURS_MAX}
                value={Math.min(hours, HOURS_MAX)}
                onChange={(e) => { setHours(Number.parseInt(e.target.value)); setShowCustomHours(false); }}
                className="relative w-full h-1.5 bg-black/[0.03] dark:bg-white/20 rounded-full appearance-none cursor-pointer backdrop-blur-sm z-10"
              />
            </div>
          </div>
        </div>

        {/* Lamports per Write */}
        <div className="space-y-2 px-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-zinc-700 dark:text-white/80">Lamports per Write</span>
            <div className="flex items-center gap-1.5">
              {lamportsPresets.map((l) => (
                <button
                  key={l}
                  onClick={() => { setLamportsPerWrite(l); setShowCustomLamports(false); }}
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg border backdrop-blur-sm transition-all ${
                    lamportsPerWrite === l && !showCustomLamports
                      ? 'bg-blue-500/20 border-blue-500/50 text-blue-600 dark:text-blue-400'
                      : 'bg-black/[0.015] dark:bg-white/5 border-black/[0.04] dark:border-white/20 text-zinc-600 dark:text-white/70 hover:bg-black/[0.03]'
                  }`}
                >
                  {l === 776 ? 'Default' : l.toLocaleString()}
                </button>
              ))}
              {showCustomLamports ? (
                <input
                  type="number"
                  min="0"
                  max="100000"
                  value={lamportsPerWrite}
                  onChange={(e) => handleLamportsChange(e.target.value)}
                  className="w-20 px-2 py-1 text-right text-xs font-mono font-medium bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/50 rounded-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  autoFocus
                />
              ) : (
                <button
                  onClick={() => setShowCustomLamports(true)}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg border backdrop-blur-sm transition-all bg-black/[0.015] dark:bg-white/5 border-black/[0.04] dark:border-white/20 text-zinc-600 dark:text-white/70 hover:bg-black/[0.03]"
                >
                  Custom
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center">
            <span className="w-1/3 text-xs text-zinc-500 dark:text-white/50 whitespace-nowrap">
              ≈ {(lamportsPerWrite / rentPerEpoch).toFixed(1)} epochs / {((lamportsPerWrite / rentPerEpoch) * MINUTES_PER_EPOCH / 60).toFixed(1)}h
            </span>
            <div className="w-2/3 relative">
              <SliderMarkers max={LAMPORTS_MAX} step={800} />
              <input
                type="range"
                min="0"
                max={LAMPORTS_MAX}
                step="100"
                value={Math.min(lamportsPerWrite, LAMPORTS_MAX)}
                onChange={(e) => { setLamportsPerWrite(Number.parseInt(e.target.value)); setShowCustomLamports(false); }}
                className="relative w-full h-1.5 bg-black/[0.03] dark:bg-white/20 rounded-full appearance-none cursor-pointer backdrop-blur-sm z-10"
              />
            </div>
          </div>
        </div>

        {/* Result Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 bg-black/[0.015] dark:bg-white/5 backdrop-blur-md rounded-2xl text-center border border-black/[0.04] dark:border-white/10 shadow-sm">
            <div className="text-xs text-zinc-500 dark:text-white/50 mb-1 uppercase tracking-wide">Total Creation Cost</div>
            <div className="text-xl font-mono font-semibold text-zinc-900 dark:text-white">
              {totalCreationCost.toLocaleString()}
            </div>
            <div className="text-xs text-zinc-400 dark:text-white/40">lamports</div>
            <div className="text-xs text-zinc-500 dark:text-white/50 mt-1">≈ {(totalCreationCost / LAMPORTS_PER_SOL).toFixed(6)} SOL</div>
          </div>

          <div className="p-4 bg-black/[0.015] dark:bg-white/5 backdrop-blur-md rounded-2xl text-center border border-black/[0.04] dark:border-white/10 shadow-sm">
            <div className="text-xs text-zinc-500 dark:text-white/50 mb-1 uppercase tracking-wide">Top-up Amount</div>
            <div className="text-xl font-mono font-semibold text-zinc-900 dark:text-white">
              {lamportsPerWrite.toLocaleString()}
            </div>
            <div className="text-xs text-zinc-400 dark:text-white/40">lamports</div>
            <div className="text-xs text-zinc-500 dark:text-white/50 mt-1">≈ {(lamportsPerWrite / LAMPORTS_PER_SOL).toFixed(6)} SOL</div>
          </div>
        </div>

        {/* Formula reference - toggleable */}
        <div className="pt-3 border-t border-black/[0.04] dark:border-white/10">
          <button
            onClick={() => setShowFormula(!showFormula)}
            className="flex items-center gap-2 text-xs text-zinc-500 dark:text-white/50 hover:text-zinc-700 dark:hover:text-white/70 transition-colors"
          >
            <span className={`transition-transform ${showFormula ? 'rotate-90' : ''}`}>▶</span>
            Show formula
          </button>
          {showFormula && (
            <div className="text-xs font-mono text-zinc-500 dark:text-white/40 mt-3">
              <div className="text-zinc-600 dark:text-white/60 mb-2">Total cost for {DATA_LEN}-byte c-Token account:</div>
              total_creation_cost = prepaid_rent + compression_incentive<br/><br/>
              rent_per_epoch = base_rent + (data_len × lamports_per_byte_per_epoch)<br/>
              rent_per_epoch = {BASE_RENT} + ({DATA_LEN} × {LAMPORTS_PER_BYTE_PER_EPOCH}) = {rentPerEpoch} lamports<br/>
              compression_incentive = {COMPRESSION_INCENTIVE.toLocaleString()} lamports
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
