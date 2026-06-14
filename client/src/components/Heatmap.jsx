export default function Heatmap({ data }) {
  if (!data?.length) {
    return (
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-400">
          Contribution Heatmap
        </h2>
        <p className="text-sm text-slate-500">Start logging to see your heatmap.</p>
      </div>
    );
  }

  const levels = ['#1e2230', '#14532d', '#166534', '#15803d', '#22c55e'];

  const weeks = [];
  let currentWeek = [];
  const sorted = [...data].sort((a, b) => a.date.localeCompare(b.date));

  if (sorted.length > 0) {
    const firstDate = new Date(sorted[0].date + 'T00:00:00');
    for (let i = 0; i < firstDate.getDay(); i++) {
      currentWeek.push(null);
    }
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
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
        Contribution Heatmap
      </h2>
      <div className="overflow-x-auto">
        <div className="inline-flex gap-[3px]">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((item, di) => (
                <div
                  key={`${wi}-${di}`}
                  title={item ? `${item.date}: ${item.count} entries` : ''}
                  className="h-3 w-3 rounded-sm"
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
          <div key={i} className="h-3 w-3 rounded-sm" style={{ backgroundColor: c }} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
