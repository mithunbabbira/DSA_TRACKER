import { Card } from './ui';

export default function Badges({ badges }) {
  if (!badges) return null;

  return (
    <Card title="Achievements">
      <div className="flex flex-wrap gap-2">
        {badges.map((b) => (
          <div
            key={b.id}
            className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-semibold transition-transform hover:scale-105 ${
              b.earned
                ? 'border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-800 shadow-sm'
                : 'border-slate-200 bg-slate-50 text-slate-400'
            }`}
          >
            <span className="text-base">{b.earned ? '🏆' : '🔒'}</span>
            {b.name}
          </div>
        ))}
      </div>
    </Card>
  );
}
