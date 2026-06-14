export default function ChallengeResult({ challenge }) {
  if (!challenge) return null;

  const { outcome, results, settings, status } = challenge;

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
        Monthly Challenge
      </h2>

      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        {results?.map((r) => (
          <div
            key={r.name}
            className={`rounded-lg border p-3 ${
              r.passed
                ? 'border-emerald-500/30 bg-emerald-500/5'
                : 'border-red-500/30 bg-red-500/5'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{r.name}</span>
              <span
                className={`text-xs font-medium ${r.passed ? 'text-emerald-400' : 'text-red-400'}`}
              >
                {r.passed ? 'PASS' : 'FAIL'}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              {r.productiveDays}/{settings.monthly_target_days} productive days
            </p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--color-surface-3)]">
              <div
                className={`h-full rounded-full ${r.passed ? 'bg-emerald-500' : 'bg-red-500'}`}
                style={{ width: `${Math.min(100, r.targetProgress)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3">
        <p className="text-xs uppercase tracking-wider text-amber-500/80">
          {status === 'in_progress' ? 'Current Standing' : status === 'upcoming' ? 'Status' : 'Final Outcome'}
        </p>
        <p className="mt-1 text-sm font-medium text-amber-200">{outcome}</p>
      </div>
    </div>
  );
}
