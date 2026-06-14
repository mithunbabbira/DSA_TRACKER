const TABS = [
  { id: 'overview', label: 'Overview', icon: '📊' },
  { id: 'log', label: 'Log', icon: '✏️' },
  { id: 'activity', label: 'Activity', icon: '📋' },
  { id: 'stats', label: 'Stats', icon: '📈' },
];

export default function MobileNav({ active, onChange }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 px-2 py-2 shadow-lg backdrop-blur-sm lg:hidden">
      <div className="mx-auto flex max-w-lg justify-around">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`flex flex-col items-center rounded-xl px-3 py-1.5 text-[10px] font-semibold transition-colors ${
              active === tab.id ? 'text-emerald-600' : 'text-slate-400'
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
