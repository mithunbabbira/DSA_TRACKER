export default function Leaderboard({ data }) {
  if (!data?.leaderboard) return null;

  const { leaderboard, leader } = data;

  const rows = [
    { key: 'productiveDays', label: 'Productive Days' },
    { key: 'totalHours', label: 'Study Hours' },
    { key: 'currentStreak', label: 'Current Streak' },
    { key: 'longestStreak', label: 'Longest Streak' },
    { key: 'dsaCount', label: 'DSA Count' },
    { key: 'lldCount', label: 'LLD Count' },
    { key: 'hldCount', label: 'HLD Count' },
  ];

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
          Leaderboard
        </h2>
        {leader && (
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
            {leader} is leading
          </span>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] text-left text-slate-500">
              <th className="pb-2 pr-4 font-medium">Metric</th>
              {leaderboard.map((u) => (
                <th
                  key={u.name}
                  className={`pb-2 px-4 font-medium ${u.name === leader ? 'text-emerald-400' : ''}`}
                >
                  {u.name}
                  {u.name === leader && ' 👑'}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(({ key, label }) => {
              const values = leaderboard.map((u) => u[key]);
              const max = Math.max(...values);
              return (
                <tr key={key} className="border-b border-[var(--color-border)]/50">
                  <td className="py-2.5 pr-4 text-slate-400">{label}</td>
                  {leaderboard.map((u) => (
                    <td
                      key={u.name}
                      className={`py-2.5 px-4 font-mono ${
                        u[key] === max && max > 0 ? 'font-semibold text-emerald-400' : ''
                      }`}
                    >
                      {u[key]}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
