import { useState } from 'react';
import { CATEGORY_COLORS } from '../api';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarView({ stats, year, month, onDayClick, selectedDate, dayEntries }) {
  const [localSelected, setLocalSelected] = useState(null);
  const selected = selectedDate ?? localSelected;

  if (!stats?.calendar) return null;

  const firstDay = new Date(year, month - 1, 1).getDay();
  const days = stats.calendar;

  const handleClick = (date) => {
    setLocalSelected(date);
    onDayClick?.(date);
  };

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
        Calendar
      </h2>

      <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs text-slate-500">
        {WEEKDAYS.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {days.map((day) => (
          <button
            key={day.date}
            type="button"
            onClick={() => !day.isFuture && handleClick(day.date)}
            disabled={day.isFuture}
            className={`aspect-square rounded-lg text-xs font-medium transition-all ${
              day.isFuture
                ? 'cursor-default text-slate-600'
                : day.productive
                  ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                  : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
            } ${selected === day.date ? 'ring-2 ring-emerald-400' : ''}`}
          >
            {day.day}
          </button>
        ))}
      </div>

      <div className="mt-3 flex gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-emerald-500/30" /> Productive
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-red-500/20" /> Missed
        </span>
      </div>

      {selected && dayEntries && (
        <div className="mt-4 border-t border-[var(--color-border)] pt-4">
          <p className="mb-2 text-xs font-medium text-slate-400">{selected}</p>
          {dayEntries.length === 0 ? (
            <p className="text-sm text-slate-500">No activities logged.</p>
          ) : (
            <ul className="space-y-2">
              {dayEntries.map((e) => (
                <li
                  key={e.id}
                  className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-3)] p-3"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded border px-1.5 py-0.5 text-[10px] font-medium ${CATEGORY_COLORS[e.category]}`}
                    >
                      {e.category}
                    </span>
                    <span className="text-sm font-medium">{e.title}</span>
                    <span className="ml-auto text-xs text-slate-500">{e.time_spent_minutes}m</span>
                  </div>
                  {e.notes && <p className="mt-1 text-xs text-slate-400">{e.notes}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
