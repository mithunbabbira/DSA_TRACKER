import { Card } from './ui';

export default function TodayBanner({ todayStatus, userName, onLogClick }) {
  if (!todayStatus) return null;

  const { loggedToday, entryCount, minutesToday, currentStreak } = todayStatus;

  return (
    <div
      className={`animate-fade-in rounded-2xl border p-4 shadow-sm ${
        loggedToday
          ? 'border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50'
          : 'border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50'
      }`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-800">
            {loggedToday ? `Great work, ${userName}! 🎉` : `${userName}, log today to keep your streak!`}
          </p>
          <p className="mt-1 text-sm text-slate-600">
            {loggedToday
              ? `${entryCount} session${entryCount > 1 ? 's' : ''} · ${minutesToday} min today · ${currentStreak}-day streak`
              : currentStreak > 0
                ? `Your ${currentStreak}-day streak is at risk — log something before midnight`
                : 'No streak yet — start one today!'}
          </p>
        </div>
        {!loggedToday && (
          <button
            type="button"
            onClick={onLogClick}
            className="shrink-0 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500"
          >
            Log Now
          </button>
        )}
      </div>
    </div>
  );
}
