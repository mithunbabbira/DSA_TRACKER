import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.DB_PATH || path.join(__dirname, 'tracker.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    category TEXT NOT NULL CHECK(category IN ('DSA', 'LLD', 'HLD')),
    title TEXT NOT NULL,
    notes TEXT DEFAULT '',
    time_spent_minutes INTEGER NOT NULL DEFAULT 0,
    platform TEXT,
    difficulty TEXT CHECK(difficulty IS NULL OR difficulty IN ('Easy', 'Medium', 'Hard')),
    problem_link TEXT,
    reference_link TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_entries_user_date ON entries(user_id, date);
  CREATE INDEX IF NOT EXISTS idx_entries_date ON entries(date);
`);

const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
if (userCount.count === 0) {
  db.prepare('INSERT INTO users (name) VALUES (?), (?)').run('Mithun', 'Devesh');
}

const settingsCount = db.prepare('SELECT COUNT(*) as count FROM settings').get();
if (settingsCount.count === 0) {
  const defaults = [
    ['monthly_target_days', '25'],
    ['penalty_amount', '1000'],
    ['currency', 'INR'],
  ];
  const insert = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)');
  for (const [key, value] of defaults) {
    insert.run(key, value);
  }
}

export default db;
