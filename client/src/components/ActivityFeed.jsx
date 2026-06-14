import { useMemo, useState } from 'react';
import { Badge, Button, Card, Select } from './ui';
import { USER_COLORS } from '../api';

export default function ActivityFeed({ feed, users, onDelete, onEdit }) {
  const [filterUser, setFilterUser] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return feed.filter((e) => {
      if (filterUser !== 'all' && e.user_name !== filterUser) return false;
      if (filterCategory !== 'all' && e.category !== filterCategory) return false;
      if (search && !e.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [feed, filterUser, filterCategory, search]);

  return (
    <Card title="Activity Feed">
      <div className="mb-3 flex flex-wrap gap-2">
        <input
          type="search"
          placeholder="Search…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-xl border border-slate-200 px-3 py-1.5 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
        />
        <Select value={filterUser} onChange={(e) => setFilterUser(e.target.value)} className="py-1.5">
          <option value="all">All users</option>
          {users.map((u) => (
            <option key={u.id} value={u.name}>{u.name}</option>
          ))}
        </Select>
        <Select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="py-1.5">
          <option value="all">All types</option>
          <option value="DSA">DSA</option>
          <option value="LLD">LLD</option>
          <option value="HLD">HLD</option>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-500">No activities match your filters.</p>
      ) : (
        <ul className="max-h-96 space-y-2 overflow-y-auto">
          {filtered.map((e) => (
            <li
              key={e.id}
              className="group flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 transition-colors hover:border-slate-200 hover:bg-white"
            >
              <span className={`shrink-0 rounded-lg border px-2 py-0.5 text-[10px] font-semibold ${USER_COLORS[e.user_name] || 'bg-slate-100 text-slate-600'}`}>
                {e.user_name}
              </span>
              <Badge category={e.category} />
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-700">{e.title}</span>
              <span className="hidden shrink-0 text-xs text-slate-400 sm:inline">{e.date}</span>
              <span className="shrink-0 rounded-lg bg-white px-2 py-0.5 font-mono text-xs text-slate-600 ring-1 ring-slate-200">
                {e.time_spent_minutes}m
              </span>
              <div className="flex shrink-0 gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
                <Button variant="ghost" className="!px-2 !py-1 text-xs" onClick={() => onEdit?.(e)}>
                  Edit
                </Button>
                <Button variant="danger" className="!px-2 !py-1 text-xs" onClick={() => onDelete?.(e.id)}>
                  Del
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
