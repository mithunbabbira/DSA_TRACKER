import { useState, useEffect } from 'react';
import { updateEntry } from '../api';
import { Button, Input, Select } from './ui';

export default function EditEntryModal({ entry, onClose, onSave }) {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (entry) {
      setForm({
        title: entry.title,
        category: entry.category,
        date: entry.date,
        time_spent_minutes: entry.time_spent_minutes,
        notes: entry.notes || '',
        platform: entry.platform || 'LeetCode',
        difficulty: entry.difficulty || 'Medium',
        problem_link: entry.problem_link || '',
        reference_link: entry.reference_link || '',
      });
    }
  }, [entry]);

  if (!entry) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateEntry(entry.id, form);
      onSave?.();
      onClose();
    } catch {
      alert('Failed to update');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-4 sm:items-center" onClick={onClose}>
      <div
        className="w-full max-w-md animate-slide-in rounded-2xl bg-white p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-slate-800">Edit Entry</h3>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <div className="grid grid-cols-2 gap-2">
            <Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              <option value="DSA">DSA</option>
              <option value="LLD">LLD</option>
              <option value="HLD">HLD</option>
            </Select>
            <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </div>
          <Input
            type="number"
            value={form.time_spent_minutes}
            onChange={(e) => setForm({ ...form, time_spent_minutes: parseInt(e.target.value, 10) })}
          />
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            rows={2}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            placeholder="Notes"
          />
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
            <button type="submit" className="flex-1 rounded-xl bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50" disabled={loading}>
              {loading ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
