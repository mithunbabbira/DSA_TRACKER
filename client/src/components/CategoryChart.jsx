import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card } from './ui';

const COLORS = { DSA: '#059669', LLD: '#2563eb', HLD: '#7c3aed' };
const DIFF_COLORS = { Easy: '#22c55e', Medium: '#f59e0b', Hard: '#ef4444' };

export default function CategoryChart({ breakdown }) {
  if (!breakdown) return null;

  const catData = breakdown.categories.map((c) => ({
    name: c.category,
    value: c.count,
    minutes: c.minutes,
  }));

  const diffData = breakdown.difficulties.map((d) => ({
    name: d.difficulty,
    value: d.count,
  }));

  if (catData.length === 0) {
    return (
      <Card title="Study Breakdown">
        <p className="text-sm text-slate-500">Log sessions to see category breakdown.</p>
      </Card>
    );
  }

  return (
    <Card title="Study Breakdown">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-medium text-slate-500">By Category</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={catData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3}>
                {catData.map((entry) => (
                  <Cell key={entry.name} fill={COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {diffData.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-medium text-slate-500">DSA Difficulty</p>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={diffData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3}>
                  {diffData.map((entry) => (
                    <Cell key={entry.name} fill={DIFF_COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </Card>
  );
}
