export default function Badges({ badges }) {
  if (!badges) return null;

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
        Achievements
      </h2>
      <div className="flex flex-wrap gap-2">
        {badges.map((b) => (
          <div
            key={b.id}
            className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium ${
              b.earned
                ? 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                : 'border-[var(--color-border)] bg-[var(--color-surface-3)] text-slate-600'
            }`}
          >
            <span>{b.earned ? '🏆' : '🔒'}</span>
            {b.name}
          </div>
        ))}
      </div>
    </div>
  );
}
