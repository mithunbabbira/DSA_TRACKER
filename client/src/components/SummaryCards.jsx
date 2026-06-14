function StatCard({ label, value, sub, accent }) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4">
      <p className="text-xs uppercase tracking-wider text-slate-500">{label}</p>
      <p className={`mt-1 text-2xl font-semibold ${accent ? 'text-emerald-400' : ''}`}>{value}</p>
      {sub && <p className="mt-0.5 text-xs text-slate-500">{sub}</p>}
    </div>
  );
}

export default function SummaryCards({ stats, settings }) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      <StatCard
        label="Productive Days"
        value={`${stats.productiveDays}/${settings.monthly_target_days}`}
        sub={`${stats.remainingDays} remaining`}
        accent
      />
      <StatCard label="Current Streak" value={`${stats.currentStreak}d`} accent />
      <StatCard label="Longest Streak" value={`${stats.longestStreak}d`} />
      <StatCard label="Total Hours" value={stats.totalHours} />
      <StatCard
        label="Target Progress"
        value={`${stats.targetProgress}%`}
        sub={stats.passed ? 'Target met!' : 'Keep going'}
        accent={stats.passed}
      />
    </div>
  );
}
