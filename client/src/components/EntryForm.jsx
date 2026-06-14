import { useEffect, useState } from 'react';
import { createEntry, fetchLastEntry, todayStr, TIME_PRESETS } from '../api';
import { Card, Input, Select } from './ui';

const CATEGORIES = ['DSA', 'LLD', 'HLD'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
const PLATFORMS = ['LeetCode', 'Codeforces', 'GeeksforGeeks', 'HackerRank', 'Other'];

const CAT_STYLES = {
  DSA: 'bg-emerald-600 text-white shadow-emerald-200',
  LLD: 'bg-blue-600 text-white shadow-blue-200',
  HLD: 'bg-purple-600 text-white shadow-purple-200',
};

export default function EntryForm({ userId, onSuccess, onToast, formRef }) {
  const [category, setCategory] = useState('DSA');
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [timeSpent, setTimeSpent] = useState(30);
  const [date, setDate] = useState(todayStr());
  const [platform, setPlatform] = useState('LeetCode');
  const [difficulty, setDifficulty] = useState('Medium');
  const [problemLink, setProblemLink] = useState('');
  const [referenceLink, setReferenceLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setDate(todayStr());
  }, [userId]);

  const buildEntry = (overrides = {}) => ({
    user_id: userId,
    date,
    category,
    title: title.trim(),
    notes: notes.trim(),
    time_spent_minutes: timeSpent,
    ...(category === 'DSA'
      ? { platform, difficulty, problem_link: problemLink.trim() || null }
      : { reference_link: referenceLink.trim() || null }),
    ...overrides,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !userId) return;

    setLoading(true);
    try {
      await createEntry(buildEntry());
      setTitle('');
      setNotes('');
      setProblemLink('');
      setReferenceLink('');
      onToast?.('Session logged successfully!', 'success');
      onSuccess?.();
    } catch {
      onToast?.('Failed to log entry', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRepeatLast = async () => {
    try {
      const last = await fetchLastEntry(userId);
      if (!last) {
        onToast?.('No previous entry to repeat', 'info');
        return;
      }
      setCategory(last.category);
      setTitle(last.title);
      setNotes(last.notes || '');
      setTimeSpent(last.time_spent_minutes);
      setPlatform(last.platform || 'LeetCode');
      setDifficulty(last.difficulty || 'Medium');
      setProblemLink(last.problem_link || '');
      setReferenceLink(last.reference_link || '');
      setDate(todayStr());
      onToast?.('Filled from last entry — edit & submit', 'info');
    } catch {
      onToast?.('Could not load last entry', 'error');
    }
  };

  return (
    <Card title="Quick Log" highlight action={<span className="text-xs text-emerald-600">⚡ under 10 sec</span>}>
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold shadow-sm transition-all ${
                category === c ? CAT_STYLES[c] : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <Input
          type="text"
          placeholder={category === 'DSA' ? 'Problem name *' : 'Topic / system designed *'}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div className="flex flex-wrap gap-1.5">
          {TIME_PRESETS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTimeSpent(t)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                timeSpent === t
                  ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t}m
            </button>
          ))}
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <Input
            type="number"
            min="1"
            value={timeSpent}
            onChange={(e) => setTimeSpent(parseInt(e.target.value, 10) || 0)}
            placeholder="Minutes"
          />
        </div>

        {category === 'DSA' && (
          <div className="grid gap-2 sm:grid-cols-3">
            <Select value={platform} onChange={(e) => setPlatform(e.target.value)}>
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </Select>
            <Select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </Select>
            <Input
              type="url"
              placeholder="Problem link"
              value={problemLink}
              onChange={(e) => setProblemLink(e.target.value)}
            />
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="text-xs font-medium text-slate-500 hover:text-emerald-600"
          >
            {expanded ? '− Hide notes' : '+ Add notes'}
          </button>
          <button
            type="button"
            onClick={handleRepeatLast}
            className="text-xs font-medium text-blue-600 hover:text-blue-700"
          >
            ↻ Repeat last
          </button>
        </div>

        {expanded && (
          <div className="space-y-2">
            <textarea
              placeholder="Notes (approach, learnings…)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            />
            {category !== 'DSA' && (
              <Input
                type="url"
                placeholder="Reference link"
                value={referenceLink}
                onChange={(e) => setReferenceLink(e.target.value)}
              />
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !title.trim()}
          className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3 text-sm font-bold text-white shadow-md transition-all hover:shadow-lg disabled:opacity-50"
        >
          {loading ? 'Saving…' : '✓ Log Session'}
        </button>
      </form>
    </Card>
  );
}
