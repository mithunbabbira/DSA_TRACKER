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

export async function fetchFeed(limit = 50) {
  const res = await fetch(`${API}/feed?limit=${limit}`);
  return res.json();
}

export async function fetchDayEntries(userId, date) {
  const res = await fetch(`${API}/day/${userId}/${date}`);
  return res.json();
}

export async function fetchBreakdown(userId, year, month) {
  const res = await fetch(`${API}/breakdown/${userId}?year=${year}&month=${month}`);
  return res.json();
}

export async function fetchTodayStatus(userId) {
  const res = await fetch(`${API}/today/${userId}`);
  return res.json();
}

export async function fetchLastEntry(userId) {
  const res = await fetch(`${API}/last-entry/${userId}`);
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

export async function updateEntry(id, entry) {
  const res = await fetch(`${API}/entries/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  });
  if (!res.ok) throw new Error('Failed to update entry');
  return res.json();
}

export async function deleteEntry(id) {
  const res = await fetch(`${API}/entries/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete entry');
}

export function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const USER_COLORS = {
  Mithun: 'bg-blue-100 text-blue-700 border-blue-200',
  Devesh: 'bg-orange-100 text-orange-700 border-orange-200',
};

export const TIME_PRESETS = [15, 30, 45, 60, 90, 120];
