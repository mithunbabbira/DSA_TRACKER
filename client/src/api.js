const API = '/api';

export async function fetchUsers() {
  const res = await fetch(`${API}/users`);
  return res.json();
}

export async function fetchSettings() {
  const res = await fetch(`${API}/settings`);
  return res.json();
}

export async function updateSettings(data) {
  const res = await fetch(`${API}/settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function fetchStats(userId, year, month) {
  const res = await fetch(`${API}/stats/${userId}?year=${year}&month=${month}`);
  return res.json();
}

export async function fetchLeaderboard(year, month) {
  const res = await fetch(`${API}/leaderboard?year=${year}&month=${month}`);
  return res.json();
}

export async function fetchChallenge(year, month) {
  const res = await fetch(`${API}/challenge?year=${year}&month=${month}`);
  return res.json();
}

export async function fetchWeekly(userId, year, month) {
  const res = await fetch(`${API}/weekly/${userId}?year=${year}&month=${month}`);
  return res.json();
}

export async function fetchHeatmap(userId) {
  const res = await fetch(`${API}/heatmap/${userId}`);
  return res.json();
}

export async function fetchBadges(userId) {
  const res = await fetch(`${API}/badges/${userId}`);
  return res.json();
}

export async function fetchFeed(limit = 30) {
  const res = await fetch(`${API}/feed?limit=${limit}`);
  return res.json();
}

export async function fetchDayEntries(userId, date) {
  const res = await fetch(`${API}/day/${userId}/${date}`);
  return res.json();
}

export async function createEntry(entry) {
  const res = await fetch(`${API}/entries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  });
  if (!res.ok) throw new Error('Failed to create entry');
  return res.json();
}

export async function deleteEntry(id) {
  await fetch(`${API}/entries/${id}`, { method: 'DELETE' });
}

export function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const CATEGORY_COLORS = {
  DSA: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
  LLD: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
  HLD: 'text-purple-400 bg-purple-400/10 border-purple-400/30',
};
