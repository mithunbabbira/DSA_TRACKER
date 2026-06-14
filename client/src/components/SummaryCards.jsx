import { Card } from './ui';

function StatCard({ label, value, sub, icon, color = 'emerald' }) {
  const colors = {
    emerald: 'from-emerald-500 to-teal-600',
    blue: 'from-blue-500 to-indigo-600',
    amber: 'from-amber-500 to-orange-500',
    purple: 'from-purple-500 to-violet-600',
    rose: 'from-rose-500 to-pink-600',
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{label}</p>
        {icon && (
          <span className={`flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br ${colors[color]} text-sm text-white shadow-sm`}>
            {icon}
          </span>
        )}
      </div>
      <p className="mt-2 text-2xl font-bold text-slate-800">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-slate-500">{sub}</p>}
    </div>
  );
}

export default function SummaryCards({ stats, settings }) {
  if (!stats || !settings) return null;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      <StatCard
        label="Productive Days"
        value={`${stats.productiveDays}/${settings.monthly_target_days}`}
        sub={`${stats.remainingDays} days to go`}
        icon="📅"
        color="emerald"
      />
      <StatCard
        label="Current Streak"
        value={`${stats.currentStreak}d`}
        sub={stats.currentStreak > 0 ? 'Keep it up!' : 'Start today'}
        icon="🔥"
        color="amber"
      />
      <StatCard
        label="Longest Streak"
        value={`${stats.longestStreak}d`}
        sub="Personal best"
        icon="🏆"
        color="purple"
      />
      <StatCard
        label="Total Hours"
        value={stats.totalHours}
        sub={`${stats.totalMinutes} minutes`}
        icon="⏱"
        color="blue"
      />
      <StatCard
        label="Target Progress"
        value={`${stats.targetProgress}%`}
        sub={stats.passed ? 'Target met!' : `${settings.monthly_target_days - stats.productiveDays} more needed`}
        icon="🎯"
        color="rose"
      />
    </div>
  );
}

export function ProgressRing({ stats, settings }) {
  if (!stats || !settings) return null;
  const pct = stats.targetProgress;
  const r = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  return (
    <Card title="Monthly Goal" className="flex flex-col items-center py-6">
      <div className="relative">
        <svg width="140" height="140" className="-rotate-90">
          <circle cx="70" cy="70" r={r} fill="none" stroke="#e2e8f0" strokeWidth="10" />
          <circle
            cx="70"
            cy="70"
            r={r}
            fill="none"
            stroke={stats.passed ? '#059669' : '#2563eb'}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-slate-800">{pct}%</span>
          <span className="text-xs text-slate-500">{stats.productiveDays}/{settings.monthly_target_days} days</span>
        </div>
      </div>
      <p className="mt-3 text-center text-sm text-slate-600">
        {stats.passed
          ? '🎉 Monthly target achieved!'
          : `${stats.remainingDays} productive days remaining`}
      </p>
    </Card>
  );
}
