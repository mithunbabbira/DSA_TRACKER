import { useState } from 'react';
import { updateSettings } from '../api';
import { Button, Card, Input } from './ui';

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
    <Card title="Challenge Rules">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="mb-2 text-xs font-medium text-emerald-600 hover:text-emerald-700"
      >
        {open ? 'Hide settings' : 'Configure rules →'}
      </button>

      {open && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-medium text-slate-500">Monthly target (days)</span>
              <Input
                type="number"
                min="1"
                max="31"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="mt-1 w-full"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-slate-500">Penalty (₹)</span>
              <Input
                type="number"
                min="0"
                value={penalty}
                onChange={(e) => setPenalty(e.target.value)}
                className="mt-1 w-full"
              />
            </label>
          </div>

          <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
            <p className="mb-1 font-semibold text-slate-700">Penalty rules</p>
            <ul className="list-inside list-disc space-y-0.5">
              <li>One fails → loser pays ₹{penalty}</li>
              <li>Both fail → each contributes ₹{penalty}</li>
              <li>Both pass → no penalty</li>
            </ul>
          </div>

          <Button variant="primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save Settings'}
          </Button>
        </div>
      )}
    </Card>
  );
}
