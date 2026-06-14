import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

export default function WeeklyChart({ data }) {
  if (!data?.length) {
    return (
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-400">
          Weekly Progress
        </h2>
        <p className="text-sm text-slate-500">No data for this month yet.</p>
      </div>
    );
  }

  const chartData = data.map((w) => ({
    ...w,
    hours: Math.round((w.minutes / 60) * 10) / 10,
  }));

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
        Weekly Progress
      </h2>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a3042" />
          <XAxis dataKey="week" tick={{ fill: '#94a3b8', fontSize: 11 }} />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#161922',
              border: '1px solid #2a3042',
              borderRadius: 8,
              fontSize: 12,
            }}
          />
          <Bar dataKey="hours" fill="#22c55e" name="Hours" radius={[4, 4, 0, 0]} />
          <Bar dataKey="days" fill="#3b82f6" name="Productive Days" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
