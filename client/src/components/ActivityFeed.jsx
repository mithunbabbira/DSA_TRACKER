import { CATEGORY_COLORS } from '../api';

export default function ActivityFeed({ feed }) {
  if (!feed?.length) {
    return (
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
          Activity Feed
        </h2>
        <p className="text-sm text-slate-500">No activities yet. Log your first session!</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
        Activity Feed
      </h2>
      <ul className="max-h-80 space-y-2 overflow-y-auto">
        {feed.map((e) => (
          <li
            key={e.id}
            className="flex items-center gap-3 rounded-lg border border-[var(--color-border)]/50 bg-[var(--color-surface-3)] px-3 py-2.5"
          >
            <span className="w-16 shrink-0 text-xs font-medium text-slate-400">{e.user_name}</span>
            <span
              className={`shrink-0 rounded border px-1.5 py-0.5 text-[10px] font-medium ${CATEGORY_COLORS[e.category]}`}
            >
              {e.category}
            </span>
            <span className="min-w-0 flex-1 truncate text-sm">{e.title}</span>
            <span className="shrink-0 text-xs text-slate-500">{e.date}</span>
            <span className="shrink-0 font-mono text-xs text-slate-400">{e.time_spent_minutes}m</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
