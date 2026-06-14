import { useState } from 'react';
import { createEntry, todayStr } from '../api';

const CATEGORIES = ['DSA', 'LLD', 'HLD'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
const PLATFORMS = ['LeetCode', 'Codeforces', 'GeeksforGeeks', 'HackerRank', 'Other'];

export default function EntryForm({ userId, onSuccess }) {
  const [category, setCategory] = useState('DSA');
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [timeSpent, setTimeSpent] = useState('30');
  const [date, setDate] = useState(todayStr());
  const [platform, setPlatform] = useState('LeetCode');
  const [difficulty, setDifficulty] = useState('Medium');
  const [problemLink, setProblemLink] = useState('');
  const [referenceLink, setReferenceLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      const entry = {
        user_id: userId,
        date,
        category,
        title: title.trim(),
        notes: notes.trim(),
        time_spent_minutes: parseInt(timeSpent, 10) || 0,
      };

      if (category === 'DSA') {
        entry.platform = platform;
        entry.difficulty = difficulty;
        entry.problem_link = problemLink.trim() || null;
      } else {
        entry.reference_link = referenceLink.trim() || null;
      }

      await createEntry(entry);
      setTitle('');
      setNotes('');
      setProblemLink('');
      setReferenceLink('');
      onSuccess?.();
    } catch {
      alert('Failed to log entry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-emerald-500/20 bg-[var(--color-surface-2)] p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
          Quick Log
        </h2>
        <span className="text-xs text-slate-500">&lt; 10 sec</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                category === c
                  ? 'bg-emerald-500 text-black'
                  : 'bg-[var(--color-surface-3)] text-slate-400 hover:text-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <input
            type="text"
            placeholder={category === 'DSA' ? 'Problem name' : 'Topic / system designed'}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-3)] px-3 py-2 text-sm outline-none focus:border-emerald-500"
            required
          />
          <div className="flex gap-2">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-3)] px-3 py-2 text-sm outline-none focus:border-emerald-500"
            />
            <input
              type="number"
              min="1"
              placeholder="min"
              value={timeSpent}
              onChange={(e) => setTimeSpent(e.target.value)}
              className="w-20 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-3)] px-3 py-2 text-sm outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {category === 'DSA' && (
          <div className="grid gap-2 sm:grid-cols-3">
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-3)] px-3 py-2 text-sm outline-none"
            >
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-3)] px-3 py-2 text-sm outline-none"
            >
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <input
              type="url"
              placeholder="Problem link (optional)"
              value={problemLink}
              onChange={(e) => setProblemLink(e.target.value)}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-3)] px-3 py-2 text-sm outline-none sm:col-span-1"
            />
          </div>
        )}

        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-slate-500 hover:text-slate-300"
        >
          {expanded ? '− Hide details' : '+ Notes & links'}
        </button>

        {expanded && (
          <div className="space-y-2">
            <textarea
              placeholder="Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-3)] px-3 py-2 text-sm outline-none focus:border-emerald-500"
            />
            {category !== 'DSA' && (
              <input
                type="url"
                placeholder="Reference link (optional)"
                value={referenceLink}
                onChange={(e) => setReferenceLink(e.target.value)}
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-3)] px-3 py-2 text-sm outline-none"
              />
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !title.trim()}
          className="w-full rounded-lg bg-emerald-500 py-2.5 text-sm font-semibold text-black transition-opacity hover:bg-emerald-400 disabled:opacity-50"
        >
          {loading ? 'Saving…' : 'Log Session'}
        </button>
      </form>
    </div>
  );
}
