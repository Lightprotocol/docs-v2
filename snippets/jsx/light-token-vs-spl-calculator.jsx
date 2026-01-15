import { useState } from 'react';

export const LightTokenVsSplCalculator = () => {
  const [numAccounts, setNumAccounts] = useState(100000);
  const [showCustomAccounts, setShowCustomAccounts] = useState(false);

  const ACCOUNT_STORAGE_OVERHEAD = 128;
  const LAMPORTS_PER_BYTE = 6960;
  const DATA_LEN = 165; // SPL token account size
  const CTOKEN_DEFAULT_CREATION_COST = 17208; // Default rent config: 6,208 prepaid rent (24h) + 11,000 compression incentive
  const LAMPORTS_PER_SOL = 1_000_000_000;

  const ACCOUNTS_MAX = 1000000;

  const splCost = numAccounts * (ACCOUNT_STORAGE_OVERHEAD + DATA_LEN) * LAMPORTS_PER_BYTE;
  const ctokenCost = numAccounts * CTOKEN_DEFAULT_CREATION_COST;
  const savings = splCost - ctokenCost;
  const savingsPercent = ((savings / splCost) * 100).toFixed(1);

  const handleAccountsChange = (value) => {
    const num = Math.max(1, Math.min(1000000, Number.parseInt(value) || 1));
    setNumAccounts(num);
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

  const accountsPresets = [10000, 100000, 500000];

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
    <div
      className="p-5 rounded-3xl not-prose mt-4 dark:bg-white/5 backdrop-blur-xl border border-black/[0.04] dark:border-white/10 shadow-lg"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <div className="space-y-5">
        {/* Number of Accounts */}
        <div className="space-y-2 px-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-zinc-700 dark:text-white/80">
              Number of Token Accounts
            </span>
            <div className="flex items-center gap-1.5">
              {accountsPresets.map((a) => (
                <button
                  key={a}
                  onClick={() => {
                    setNumAccounts(a);
                    setShowCustomAccounts(false);
                  }}
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg border backdrop-blur-sm transition-all ${
                    numAccounts === a && !showCustomAccounts
                      ? "bg-blue-500/20 border-blue-500/50 text-blue-600 dark:text-blue-400"
                      : "bg-black/[0.015] dark:bg-white/5 border-black/[0.04] dark:border-white/20 text-zinc-600 dark:text-white/70 hover:bg-black/[0.03]"
                  }`}
                >
                  {a.toLocaleString()}
                </button>
              ))}
              {showCustomAccounts ? (
                <input
                  type="number"
                  min="1"
                  max="1000000"
                  value={numAccounts}
                  onChange={(e) => handleAccountsChange(e.target.value)}
                  className="w-24 px-2 py-1 text-right text-xs font-mono font-medium bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/50 rounded-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  autoFocus
                />
              ) : (
                <button
                  onClick={() => setShowCustomAccounts(true)}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg border backdrop-blur-sm transition-all bg-black/[0.015] dark:bg-white/5 border-black/[0.04] dark:border-white/20 text-zinc-600 dark:text-white/70 hover:bg-black/[0.03]"
                >
                  Custom
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center">
            <span className="w-1/3 text-xs text-zinc-500 dark:text-white/50 whitespace-nowrap">
              {numAccounts.toLocaleString()} accounts
            </span>
            <div className="w-2/3 relative">
              <SliderMarkers max={ACCOUNTS_MAX} step={200000} />
              <input
                type="range"
                min="5000"
                max={ACCOUNTS_MAX}
                step="5000"
                value={Math.min(numAccounts, ACCOUNTS_MAX)}
                onChange={(e) => {
                  setNumAccounts(Number.parseInt(e.target.value));
                  setShowCustomAccounts(false);
                }}
                className="relative w-full h-1.5 bg-black/[0.03] dark:bg-white/20 rounded-full appearance-none cursor-pointer backdrop-blur-sm z-10"
              />
            </div>
          </div>
        </div>

        {/* Result Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-4 bg-black/[0.015] dark:bg-white/5 backdrop-blur-md rounded-2xl text-center border border-black/[0.04] dark:border-white/10 shadow-sm">
            <div className="text-xs text-zinc-500 dark:text-white/50 mb-1 uppercase tracking-wide">
              SPL Token
            </div>
            <div className="text-xl font-mono font-semibold text-zinc-900 dark:text-white">
              {formatSOL(splCost)}
            </div>
            <div className="text-xs text-zinc-400 dark:text-white/40">SOL</div>
          </div>

          <div className="p-4 bg-black/[0.015] dark:bg-white/5 backdrop-blur-md rounded-2xl text-center border border-black/[0.04] dark:border-white/10 shadow-sm">
            <div className="text-xs text-zinc-500 dark:text-white/50 mb-1 uppercase tracking-wide">
              Light Token
            </div>
            <div className="text-xl font-mono font-semibold text-zinc-900 dark:text-white">
              {formatSOL(ctokenCost)}
            </div>
            <div className="text-xs text-zinc-400 dark:text-white/40">SOL</div>
          </div>

          <div className="p-4 bg-black/[0.015] dark:bg-white/5 backdrop-blur-md rounded-2xl text-center border border-black/[0.04] dark:border-white/10 shadow-sm">
            <div className="text-xs text-zinc-500 dark:text-white/50 mb-1 uppercase tracking-wide">
              Savings
            </div>
            <div className="text-xl font-mono font-semibold text-zinc-900 dark:text-white">
              {savingsPercent}%
            </div>
            <div className="text-xs text-zinc-400 dark:text-white/40">{formatSOL(savings)} SOL</div>
          </div>
        </div>
      </div>
    </div>
  );
};
