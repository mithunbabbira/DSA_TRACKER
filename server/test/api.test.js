import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEST_DB = path.join(__dirname, 'test-tracker.db');
const PORT = 3099;
const BASE = `http://localhost:${PORT}/api`;

let serverProcess;

async function fetchJson(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const text = await res.text();
  let body;
  try { body = text ? JSON.parse(text) : null; } catch { body = text; }
  return { status: res.status, body };
}

before(async () => {
  if (fs.existsSync(TEST_DB)) fs.unlinkSync(TEST_DB);
  process.env.DB_PATH = TEST_DB;
  process.env.PORT = String(PORT);

  serverProcess = spawn('node', ['index.js'], {
    cwd: path.join(__dirname, '..'),
    env: { ...process.env, DB_PATH: TEST_DB, PORT: String(PORT) },
    stdio: 'pipe',
  });

  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Server start timeout')), 8000);
    serverProcess.stdout.on('data', (d) => {
      if (d.toString().includes('running')) {
        clearTimeout(timeout);
        resolve();
      }
    });
    serverProcess.stderr.on('data', (d) => console.error(d.toString()));
  });
});

after(() => {
  serverProcess?.kill();
  if (fs.existsSync(TEST_DB)) fs.unlinkSync(TEST_DB);
});

describe('API Tests', () => {
  let mithunId, deveshId, entryId;

  it('GET /users returns Mithun and Devesh', async () => {
    const { status, body } = await fetchJson(`${BASE}/users`);
    assert.equal(status, 200);
    assert.equal(body.length, 2);
    assert.equal(body[0].name, 'Mithun');
    assert.equal(body[1].name, 'Devesh');
    mithunId = body[0].id;
    deveshId = body[1].id;
  });

  it('GET /settings returns defaults', async () => {
    const { body } = await fetchJson(`${BASE}/settings`);
    assert.equal(body.monthly_target_days, 25);
    assert.equal(body.penalty_amount, 1000);
  });

  it('PUT /settings updates target', async () => {
    const { body } = await fetchJson(`${BASE}/settings`, {
      method: 'PUT',
      body: JSON.stringify({ monthly_target_days: 20 }),
    });
    assert.equal(body.monthly_target_days, 20);
  });

  it('POST /entries creates DSA entry', async () => {
    const today = new Date().toISOString().slice(0, 10);
    const { status, body } = await fetchJson(`${BASE}/entries`, {
      method: 'POST',
      body: JSON.stringify({
        user_id: mithunId,
        date: today,
        category: 'DSA',
        title: 'Two Sum',
        notes: 'Hash map',
        time_spent_minutes: 45,
        platform: 'LeetCode',
        difficulty: 'Easy',
      }),
    });
    assert.equal(status, 201);
    assert.equal(body.title, 'Two Sum');
    entryId = body.id;
  });

  it('POST /entries creates LLD entry', async () => {
    const today = new Date().toISOString().slice(0, 10);
    const { status, body } = await fetchJson(`${BASE}/entries`, {
      method: 'POST',
      body: JSON.stringify({
        user_id: deveshId,
        date: today,
        category: 'LLD',
        title: 'Parking Lot',
        time_spent_minutes: 60,
      }),
    });
    assert.equal(status, 201);
    assert.equal(body.category, 'LLD');
  });

  it('POST /entries rejects missing fields', async () => {
    const { status } = await fetchJson(`${BASE}/entries`, {
      method: 'POST',
      body: JSON.stringify({ user_id: mithunId }),
    });
    assert.equal(status, 400);
  });

  it('GET /stats returns productive day', async () => {
    const now = new Date();
    const { body } = await fetchJson(
      `${BASE}/stats/${mithunId}?year=${now.getFullYear()}&month=${now.getMonth() + 1}`
    );
    assert.equal(body.productiveDays, 1);
    assert.equal(body.dsaCount, 1);
    assert.ok(body.totalMinutes >= 45);
  });

  it('GET /today returns logged status', async () => {
    const { body } = await fetchJson(`${BASE}/today/${mithunId}`);
    assert.equal(body.loggedToday, true);
    assert.ok(body.entryCount >= 1);
  });

  it('GET /leaderboard identifies leader', async () => {
    const now = new Date();
    const { body } = await fetchJson(
      `${BASE}/leaderboard?year=${now.getFullYear()}&month=${now.getMonth() + 1}`
    );
    assert.ok(body.leader);
    assert.equal(body.leaderboard.length, 2);
  });

  it('GET /challenge returns outcome', async () => {
    const now = new Date();
    const { body } = await fetchJson(
      `${BASE}/challenge?year=${now.getFullYear()}&month=${now.getMonth() + 1}`
    );
    assert.ok(body.outcome);
    assert.equal(body.status, 'in_progress');
  });

  it('GET /breakdown returns categories', async () => {
    const now = new Date();
    const { body } = await fetchJson(
      `${BASE}/breakdown/${mithunId}?year=${now.getFullYear()}&month=${now.getMonth() + 1}`
    );
    assert.ok(body.categories.length >= 1);
  });

  it('GET /feed returns entries', async () => {
    const { body } = await fetchJson(`${BASE}/feed`);
    assert.ok(body.length >= 2);
  });

  it('GET /badges returns streak badges', async () => {
    const { body } = await fetchJson(`${BASE}/badges/${mithunId}`);
    assert.equal(body.length, 3);
  });

  it('GET /heatmap returns data', async () => {
    const { body } = await fetchJson(`${BASE}/heatmap/${mithunId}`);
    assert.ok(body.length >= 1);
  });

  it('GET /weekly returns progress', async () => {
    const now = new Date();
    const { body } = await fetchJson(
      `${BASE}/weekly/${mithunId}?year=${now.getFullYear()}&month=${now.getMonth() + 1}`
    );
    assert.ok(Array.isArray(body));
  });

  it('GET /last-entry returns most recent', async () => {
    const { body } = await fetchJson(`${BASE}/last-entry/${mithunId}`);
    assert.equal(body.title, 'Two Sum');
  });

  it('PUT /entries updates entry', async () => {
    const { body } = await fetchJson(`${BASE}/entries/${entryId}`, {
      method: 'PUT',
      body: JSON.stringify({ title: 'Two Sum Updated', time_spent_minutes: 50 }),
    });
    assert.equal(body.title, 'Two Sum Updated');
    assert.equal(body.time_spent_minutes, 50);
  });

  it('GET /day returns entries for date', async () => {
    const today = new Date().toISOString().slice(0, 10);
    const { body } = await fetchJson(`${BASE}/day/${mithunId}/${today}`);
    assert.ok(body.length >= 1);
  });

  it('DELETE /entries removes entry', async () => {
    const { status } = await fetchJson(`${BASE}/entries/${entryId}`, { method: 'DELETE' });
    assert.equal(status, 200);
    const { status: s2 } = await fetchJson(`${BASE}/entries/${entryId}`, { method: 'DELETE' });
    assert.equal(s2, 404);
  });
});
