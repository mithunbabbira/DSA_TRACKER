import { useState } from 'react';
import { Badge, Button, Card } from './ui';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarView({ stats, year, month, onDayClick, selectedDate, dayEntries, onDeleteEntry }) {
  const [localSelected, setLocalSelected] = useState(null);
  const selected = selectedDate ?? localSelected;

  if (!stats?.calendar) return null;

  const firstDay = new Date(year, month - 1, 1).getDay();
  const days = stats.calendar;
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const handleClick = (date) => {
    setLocalSelected(date);
    onDayClick?.(date);
  };

  return (
    <Card title="Calendar">
      <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase text-slate-400">
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
            className={`relative aspect-square rounded-xl text-xs font-semibold transition-all ${
              day.isFuture
                ? 'cursor-default text-slate-300'
                : day.productive
                  ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 hover:shadow-sm'
                  : 'bg-red-50 text-red-400 hover:bg-red-100'
            } ${selected === day.date ? 'ring-2 ring-emerald-500 ring-offset-1' : ''} ${
              day.date === todayStr ? 'ring-1 ring-blue-400' : ''
            }`}
          >
            {day.day}
            {day.productive && (
              <span className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-emerald-500" />
            )}
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-md bg-emerald-100 ring-1 ring-emerald-200" /> Productive
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-md bg-red-50 ring-1 ring-red-100" /> Missed
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-md ring-1 ring-blue-400" /> Today
        </span>
      </div>

      {selected && dayEntries && (
        <div className="mt-4 border-t border-slate-100 pt-4 animate-fade-in">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">{selected}</p>
          {dayEntries.length === 0 ? (
            <p className="text-sm text-slate-500">No activities logged.</p>
          ) : (
            <ul className="space-y-2">
              {dayEntries.map((e) => (
                <li key={e.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <div className="flex items-center gap-2">
                    <Badge category={e.category} />
                    <span className="flex-1 text-sm font-medium text-slate-700">{e.title}</span>
                    <span className="text-xs text-slate-500">{e.time_spent_minutes}m</span>
                    <Button variant="danger" className="!px-2 !py-1 text-xs" onClick={() => onDeleteEntry?.(e.id)}>
                      ×
                    </Button>
                  </div>
                  {e.notes && <p className="mt-1 text-xs text-slate-500">{e.notes}</p>}
                  {e.problem_link && (
                    <a href={e.problem_link} target="_blank" rel="noreferrer" className="mt-1 block text-xs text-blue-600 hover:underline">
                      View problem →
                    </a>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </Card>
  );
}
