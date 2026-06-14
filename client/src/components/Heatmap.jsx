import { Card } from './ui';

export default function Heatmap({ data }) {
  if (!data?.length) {
    return (
      <Card title="Contribution Heatmap">
        <p className="text-sm text-slate-500">Start logging to build your heatmap.</p>
      </Card>
    );
  }

  const levels = ['#f1f5f9', '#bbf7d0', '#86efac', '#4ade80', '#16a34a'];

  const weeks = [];
  let currentWeek = [];
  const sorted = [...data].sort((a, b) => a.date.localeCompare(b.date));

  if (sorted.length > 0) {
    const firstDate = new Date(sorted[0].date + 'T00:00:00');
    for (let i = 0; i < firstDate.getDay(); i++) currentWeek.push(null);
  }

  for (const item of sorted) {
    currentWeek.push(item);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  if (currentWeek.length) weeks.push(currentWeek);

  return (
    <Card title="Contribution Heatmap">
      <div className="overflow-x-auto pb-1">
        <div className="inline-flex gap-[3px]">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((item, di) => (
                <div
                  key={`${wi}-${di}`}
                  title={item ? `${item.date}: ${item.count} entries, ${item.minutes}m` : ''}
                  className="h-3.5 w-3.5 rounded-sm ring-1 ring-slate-100 transition-transform hover:scale-125"
                  style={{ backgroundColor: item ? levels[item.level] : levels[0] }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-2 flex items-center gap-1 text-[10px] text-slate-500">
        <span>Less</span>
        {levels.slice(1).map((c, i) => (
          <div key={i} className="h-3.5 w-3.5 rounded-sm ring-1 ring-slate-100" style={{ backgroundColor: c }} />
        ))}
        <span>More</span>
      </div>
    </Card>
  );
}
