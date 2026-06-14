export default function ChallengeResult({ challenge }) {
  if (!challenge) return null;

  const { outcome, results, settings, status } = challenge;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">
        Monthly Challenge
      </h2>

      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        {results?.map((r) => (
          <div
            key={r.name}
            className={`rounded-xl border p-4 ${
              r.passed
                ? 'border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50'
                : 'border-red-200 bg-gradient-to-br from-red-50 to-orange-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800">{r.name}</span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                  r.passed ? 'bg-emerald-200 text-emerald-800' : 'bg-red-200 text-red-800'
                }`}
              >
                {r.passed ? 'PASS' : 'BEHIND'}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-600">
              {r.productiveDays}/{settings.monthly_target_days} productive days · {r.totalHours}h
            </p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/80">
              <div
                className={`h-full rounded-full transition-all ${r.passed ? 'bg-emerald-500' : 'bg-gradient-to-r from-red-400 to-orange-400'}`}
                style={{ width: `${Math.min(100, r.targetProgress)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">
          {status === 'in_progress' ? 'Current Standing' : status === 'upcoming' ? 'Status' : 'Final Outcome'}
        </p>
        <p className="mt-1 text-sm font-medium text-amber-900">{outcome}</p>
      </div>
    </div>
  );
}
