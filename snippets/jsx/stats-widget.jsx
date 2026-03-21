export const StatsWidget = () => {
  const API_URL = "http://localhost:3004/api/metrics";
  const REFRESH_MS = 30000;
  const MONO = "ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, monospace";

  const formatNumber = (value, digits = 2) =>
    new Intl.NumberFormat("en-US", {
      maximumFractionDigits: digits,
    }).format(value);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchMetrics() {
      try {
        const res = await fetch(API_URL, {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!res.ok) throw new Error("fetch failed");
        const json = await res.json();
        setData(json);
        setError(false);
      } catch (err) {
        if (err.name === "AbortError") return;
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchMetrics();
    const interval = setInterval(fetchMetrics, REFRESH_MS);
    return () => {
      controller.abort();
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 my-8">
        <div className="border-l border-zinc-200 dark:border-zinc-700 pl-5 py-6">
          <div className="h-9 w-24 bg-zinc-100 dark:bg-white/10 rounded animate-pulse mb-3" />
          <div className="h-4 w-40 bg-zinc-100 dark:bg-white/10 rounded animate-pulse" />
        </div>
        <div className="border-l border-zinc-200 dark:border-zinc-700 pl-5 py-6">
          <div className="h-9 w-36 bg-zinc-100 dark:bg-white/10 rounded animate-pulse mb-3" />
          <div className="h-4 w-44 bg-zinc-100 dark:bg-white/10 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !data) return null;

  const tps = data.tpsAverages?.tps1h ?? 0;
  const txCount = data.totals?.txCountWindow ?? 0;

  return (
    <div className="grid grid-cols-2 my-8">
      <div className="border-l border-zinc-200 dark:border-zinc-700 pl-5 py-6">
        <div
          className="text-3xl md:text-4xl font-semibold text-zinc-900 dark:text-white mb-2"
          style={{ fontFamily: MONO, fontVariantNumeric: "tabular-nums", display: "block" }}
        >
          {formatNumber(tps, 2)}
        </div>
        <div className="text-sm text-zinc-500 dark:text-zinc-400" style={{ display: "block" }}>
          Transactions per Second
        </div>
      </div>
      <div className="border-l border-zinc-200 dark:border-zinc-700 pl-5 py-6">
        <div
          className="text-3xl md:text-4xl font-semibold text-zinc-900 dark:text-white mb-2"
          style={{ fontFamily: MONO, fontVariantNumeric: "tabular-nums", display: "block" }}
        >
          {formatNumber(txCount, 0)}
        </div>
        <div className="text-sm text-zinc-500 dark:text-zinc-400" style={{ display: "block" }}>
          Transactions last 24 hours
        </div>
      </div>
    </div>
  );
};
