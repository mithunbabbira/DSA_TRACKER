import { useState } from 'react';
import { updateSettings } from '../api';

export default function SettingsPanel({ settings, onUpdate }) {
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState(settings?.monthly_target_days ?? 25);
  const [penalty, setPenalty] = useState(settings?.penalty_amount ?? 1000);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await updateSettings({
        monthly_target_days: parseInt(target, 10),
        penalty_amount: parseInt(penalty, 10),
      });
      onUpdate?.(updated);
      setOpen(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-sm font-semibold uppercase tracking-wider text-slate-400"
      >
        Challenge Rules
        <span>{open ? '−' : '+'}</span>
      </button>

      {open && (
        <div className="mt-4 space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs text-slate-500">Monthly target (productive days)</span>
              <input
                type="number"
                min="1"
                max="31"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-3)] px-3 py-2 text-sm outline-none"
              />
            </label>
            <label className="block">
              <span className="text-xs text-slate-500">Penalty amount (₹)</span>
              <input
                type="number"
                min="0"
                value={penalty}
                onChange={(e) => setPenalty(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-3)] px-3 py-2 text-sm outline-none"
              />
            </label>
          </div>

          <div className="rounded-lg bg-[var(--color-surface-3)] p-3 text-xs text-slate-400">
            <p className="mb-1 font-medium text-slate-300">Penalty rules:</p>
            <ul className="list-inside list-disc space-y-0.5">
              <li>Fail vs pass → loser pays ₹{penalty}</li>
              <li>Both fail → each contributes ₹{penalty} to pool</li>
              <li>Both pass → no penalty</li>
            </ul>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-[var(--color-surface-3)] px-4 py-2 text-sm font-medium hover:bg-[var(--color-border)]"
          >
            {saving ? 'Saving…' : 'Save Settings'}
          </button>
        </div>
      )}
    </div>
  );
}
