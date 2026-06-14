import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './db.js';
import {
  getSettings,
  updateSettings,
  getUserStats,
  getChallengeResult,
  getWeeklyProgress,
  getHeatmapData,
  getBadges,
  getEntriesForDate,
  getActivityFeed,
  getCategoryBreakdown,
  getTodayStatus,
  getLastEntry,
} from './stats.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/users', (_req, res) => {
  const users = db.prepare('SELECT id, name FROM users ORDER BY id').all();
  res.json(users);
});

app.get('/api/settings', (_req, res) => {
  res.json(getSettings());
});

app.put('/api/settings', (req, res) => {
  res.json(updateSettings(req.body));
});

app.get('/api/entries', (req, res) => {
  const { userId, date, year, month } = req.query;
  let query = `SELECT e.*, u.name as user_name FROM entries e JOIN users u ON u.id = e.user_id WHERE 1=1`;
  const params = [];

  if (userId) {
    query += ' AND e.user_id = ?';
    params.push(userId);
  }
  if (date) {
    query += ' AND e.date = ?';
    params.push(date);
  }
  if (year && month) {
    query += ' AND e.date LIKE ?';
    params.push(`${year}-${String(month).padStart(2, '0')}%`);
  }

  query += ' ORDER BY e.date DESC, e.created_at DESC';
  res.json(db.prepare(query).all(...params));
});

app.post('/api/entries', (req, res) => {
  const {
    user_id,
    date,
    category,
    title,
    notes = '',
    time_spent_minutes = 0,
    platform,
    difficulty,
    problem_link,
    reference_link,
  } = req.body;

  if (!user_id || !date || !category || !title) {
    return res.status(400).json({ error: 'user_id, date, category, and title are required' });
  }

  const result = db
    .prepare(
      `INSERT INTO entries (user_id, date, category, title, notes, time_spent_minutes, platform, difficulty, problem_link, reference_link)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      user_id,
      date,
      category,
      title,
      notes,
      time_spent_minutes,
      platform || null,
      difficulty || null,
      problem_link || null,
      reference_link || null
    );

  const entry = db
    .prepare(
      `SELECT e.*, u.name as user_name FROM entries e
       JOIN users u ON u.id = e.user_id WHERE e.id = ?`
    )
    .get(result.lastInsertRowid);

  res.status(201).json(entry);
});

app.put('/api/entries/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM entries WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Entry not found' });

  const {
    date = existing.date,
    category = existing.category,
    title = existing.title,
    notes = existing.notes,
    time_spent_minutes = existing.time_spent_minutes,
    platform = existing.platform,
    difficulty = existing.difficulty,
    problem_link = existing.problem_link,
    reference_link = existing.reference_link,
  } = req.body;

  db.prepare(
    `UPDATE entries SET date=?, category=?, title=?, notes=?, time_spent_minutes=?,
     platform=?, difficulty=?, problem_link=?, reference_link=? WHERE id=?`
  ).run(
    date,
    category,
    title,
    notes,
    time_spent_minutes,
    platform || null,
    difficulty || null,
    problem_link || null,
    reference_link || null,
    req.params.id
  );

  const entry = db
    .prepare(
      `SELECT e.*, u.name as user_name FROM entries e
       JOIN users u ON u.id = e.user_id WHERE e.id = ?`
    )
    .get(req.params.id);
  res.json(entry);
});

app.delete('/api/entries/:id', (req, res) => {
  const result = db.prepare('DELETE FROM entries WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Entry not found' });
  res.json({ success: true });
});

app.get('/api/stats/:userId', (req, res) => {
  const year = parseInt(req.query.year || new Date().getFullYear(), 10);
  const month = parseInt(req.query.month || new Date().getMonth() + 1, 10);
  res.json(getUserStats(parseInt(req.params.userId, 10), year, month));
});

app.get('/api/leaderboard', (req, res) => {
  const year = parseInt(req.query.year || new Date().getFullYear(), 10);
  const month = parseInt(req.query.month || new Date().getMonth() + 1, 10);
  const users = db.prepare('SELECT id, name FROM users').all();
  const leaderboard = users.map((user) => ({
    name: user.name,
    userId: user.id,
    ...getUserStats(user.id, year, month),
  }));

  const leader = leaderboard.reduce((best, curr) => {
    if (!best) return curr;
    if (curr.productiveDays > best.productiveDays) return curr;
    if (curr.productiveDays === best.productiveDays && curr.totalMinutes > best.totalMinutes)
      return curr;
    return best;
  }, null);

  res.json({ leaderboard, leader: leader?.name });
});

app.get('/api/challenge', (req, res) => {
  const year = parseInt(req.query.year || new Date().getFullYear(), 10);
  const month = parseInt(req.query.month || new Date().getMonth() + 1, 10);
  res.json(getChallengeResult(year, month));
});

app.get('/api/weekly/:userId', (req, res) => {
  const year = parseInt(req.query.year || new Date().getFullYear(), 10);
  const month = parseInt(req.query.month || new Date().getMonth() + 1, 10);
  res.json(getWeeklyProgress(parseInt(req.params.userId, 10), year, month));
});

app.get('/api/heatmap/:userId', (req, res) => {
  res.json(getHeatmapData(parseInt(req.params.userId, 10)));
});

app.get('/api/badges/:userId', (req, res) => {
  res.json(getBadges(parseInt(req.params.userId, 10)));
});

app.get('/api/feed', (req, res) => {
  res.json(getActivityFeed(parseInt(req.query.limit || '50', 10)));
});

app.get('/api/day/:userId/:date', (req, res) => {
  res.json(getEntriesForDate(parseInt(req.params.userId, 10), req.params.date));
});

app.get('/api/breakdown/:userId', (req, res) => {
  const year = parseInt(req.query.year || new Date().getFullYear(), 10);
  const month = parseInt(req.query.month || new Date().getMonth() + 1, 10);
  res.json(getCategoryBreakdown(parseInt(req.params.userId, 10), year, month));
});

app.get('/api/today/:userId', (req, res) => {
  res.json(getTodayStatus(parseInt(req.params.userId, 10)));
});

app.get('/api/last-entry/:userId', (req, res) => {
  const entry = getLastEntry(parseInt(req.params.userId, 10));
  res.json(entry || null);
});

const clientDist = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDist));
app.get('*', (_req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'), (err) => {
    if (err) res.status(404).json({ error: 'Not found' });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
