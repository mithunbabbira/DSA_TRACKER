import { Card } from './ui';

export default function Leaderboard({ data }) {
  if (!data?.leaderboard) return null;

  const { leaderboard, leader } = data;

  const rows = [
    { key: 'productiveDays', label: 'Productive Days', icon: '📅' },
    { key: 'totalHours', label: 'Study Hours', icon: '⏱' },
    { key: 'currentStreak', label: 'Current Streak', icon: '🔥' },
    { key: 'longestStreak', label: 'Longest Streak', icon: '🏆' },
    { key: 'dsaCount', label: 'DSA', icon: '💻' },
    { key: 'lldCount', label: 'LLD', icon: '🏗' },
    { key: 'hldCount', label: 'HLD', icon: '🌐' },
  ];

  return (
    <Card
      title="Leaderboard"
      action={
        leader && (
          <span className="rounded-full bg-gradient-to-r from-amber-100 to-yellow-100 px-3 py-1 text-xs font-semibold text-amber-700">
            👑 {leader} leads
          </span>
        )
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left">
              <th className="pb-3 pr-4 text-xs font-medium uppercase tracking-wider text-slate-400">Metric</th>
              {leaderboard.map((u) => (
                <th
                  key={u.name}
                  className={`pb-3 px-4 text-sm font-semibold ${
                    u.name === leader ? 'text-emerald-600' : 'text-slate-700'
                  }`}
                >
                  {u.name}
                  {u.name === leader && ' 👑'}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(({ key, label, icon }) => {
              const values = leaderboard.map((u) => u[key]);
              const max = Math.max(...values);
              return (
                <tr key={key} className="border-b border-slate-50 hover:bg-slate-50/80">
                  <td className="py-3 pr-4 text-slate-500">
                    <span className="mr-1.5">{icon}</span>
                    {label}
                  </td>
                  {leaderboard.map((u) => (
                    <td
                      key={u.name}
                      className={`py-3 px-4 font-mono ${
                        u[key] === max && max > 0
                          ? 'rounded-lg bg-emerald-50 font-bold text-emerald-700'
                          : 'text-slate-700'
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
    </Card>
  );
}
