import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { Card } from './ui';

export default function WeeklyChart({ data }) {
  if (!data?.length) {
    return (
      <Card title="Weekly Progress">
        <p className="text-sm text-slate-500">No data for this month yet.</p>
      </Card>
    );
  }

  const chartData = data.map((w) => ({
    ...w,
    hours: Math.round((w.minutes / 60) * 10) / 10,
  }));

  return (
    <Card title="Weekly Progress">
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="week" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: 12,
              fontSize: 12,
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            }}
          />
          <Bar dataKey="hours" fill="#059669" name="Hours" radius={[6, 6, 0, 0]} />
          <Bar dataKey="days" fill="#3b82f6" name="Productive Days" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
