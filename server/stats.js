import db from './db.js';

export function getSettings() {
  const rows = db.prepare('SELECT key, value FROM settings').all();
  const settings = {};
  for (const row of rows) {
    settings[row.key] = row.value;
  }
  return {
    monthly_target_days: parseInt(settings.monthly_target_days || '25', 10),
    penalty_amount: parseInt(settings.penalty_amount || '1000', 10),
    currency: settings.currency || 'INR',
  };
}

export function updateSettings(updates) {
  const upsert = db.prepare(
    'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value'
  );
  if (updates.monthly_target_days !== undefined) {
    upsert.run('monthly_target_days', String(updates.monthly_target_days));
  }
  if (updates.penalty_amount !== undefined) {
    upsert.run('penalty_amount', String(updates.penalty_amount));
  }
  if (updates.currency !== undefined) {
    upsert.run('currency', updates.currency);
  }
  return getSettings();
}

function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

function formatDate(year, month, day) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function getProductiveDates(userId, year, month) {
  const prefix = `${year}-${String(month).padStart(2, '0')}`;
  const rows = db
    .prepare(
      `SELECT DISTINCT date FROM entries
       WHERE user_id = ? AND date LIKE ? || '%'
       ORDER BY date`
    )
    .all(userId, prefix);
  return new Set(rows.map((r) => r.date));
}

function computeStreaks(productiveDates, year, month) {
  const daysInMonth = getDaysInMonth(year, month);
  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() + 1 === month;
  const todayStr = formatDate(
    today.getFullYear(),
    today.getMonth() + 1,
    today.getDate()
  );

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = formatDate(year, month, day);
    if (productiveDates.has(dateStr)) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }

  if (isCurrentMonth) {
    const todayDay = today.getDate();
    for (let day = todayDay; day >= 1; day--) {
      const dateStr = formatDate(year, month, day);
      if (productiveDates.has(dateStr)) {
        currentStreak++;
      } else if (dateStr !== todayStr || !productiveDates.has(todayStr)) {
        if (dateStr === todayStr && !productiveDates.has(todayStr)) {
          continue;
        }
        break;
      }
    }
  } else {
    for (let day = daysInMonth; day >= 1; day--) {
      const dateStr = formatDate(year, month, day);
      if (productiveDates.has(dateStr)) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  return { currentStreak, longestStreak };
}

function computeGlobalStreaks(userId) {
  const rows = db
    .prepare('SELECT DISTINCT date FROM entries WHERE user_id = ? ORDER BY date')
    .all(userId);
  const dates = rows.map((r) => r.date);
  if (dates.length === 0) return { currentStreak: 0, longestStreak: 0 };

  let longestStreak = 0;
  let tempStreak = 1;

  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1] + 'T00:00:00');
    const curr = new Date(dates[i] + 'T00:00:00');
    const diffDays = (curr - prev) / (1000 * 60 * 60 * 24);
    if (diffDays === 1) {
      tempStreak++;
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = formatDate(
    today.getFullYear(),
    today.getMonth() + 1,
    today.getDate()
  );

  let currentStreak = 0;
  if (dates.includes(todayStr)) {
    currentStreak = 1;
    let checkDate = new Date(today);
    while (true) {
      checkDate.setDate(checkDate.getDate() - 1);
      const checkStr = formatDate(
        checkDate.getFullYear(),
        checkDate.getMonth() + 1,
        checkDate.getDate()
      );
      if (dates.includes(checkStr)) {
        currentStreak++;
      } else {
        break;
      }
    }
  } else {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = formatDate(
      yesterday.getFullYear(),
      yesterday.getMonth() + 1,
      yesterday.getDate()
    );
    if (dates.includes(yesterdayStr)) {
      currentStreak = 1;
      let checkDate = new Date(yesterday);
      while (true) {
        checkDate.setDate(checkDate.getDate() - 1);
        const checkStr = formatDate(
          checkDate.getFullYear(),
          checkDate.getMonth() + 1,
          checkDate.getDate()
        );
        if (dates.includes(checkStr)) {
          currentStreak++;
        } else {
          break;
        }
      }
    }
  }

  return { currentStreak, longestStreak };
}

export function getUserStats(userId, year, month) {
  const prefix = `${year}-${String(month).padStart(2, '0')}`;
  const settings = getSettings();

  const productiveDates = getProductiveDates(userId, year, month);
  const productiveDays = productiveDates.size;

  const globalStreaks = computeGlobalStreaks(userId);

  const categoryCounts = db
    .prepare(
      `SELECT category, COUNT(*) as count FROM entries
       WHERE user_id = ? AND date LIKE ? || '%'
       GROUP BY category`
    )
    .all(userId, prefix);

  const counts = { DSA: 0, LLD: 0, HLD: 0 };
  for (const row of categoryCounts) {
    counts[row.category] = row.count;
  }

  const timeRow = db
    .prepare(
      `SELECT COALESCE(SUM(time_spent_minutes), 0) as total FROM entries
       WHERE user_id = ? AND date LIKE ? || '%'`
    )
    .get(userId, prefix);

  const totalMinutes = timeRow.total;
  const daysInMonth = getDaysInMonth(year, month);
  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() + 1 === month;
  const elapsedDays = isCurrentMonth ? today.getDate() : daysInMonth;

  const calendar = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = formatDate(year, month, day);
    const isFuture = isCurrentMonth && day > today.getDate();
    calendar.push({
      date: dateStr,
      day,
      productive: productiveDates.has(dateStr),
      missed: !isFuture && !productiveDates.has(dateStr),
      isFuture,
    });
  }

  return {
    productiveDays,
    remainingDays: Math.max(0, settings.monthly_target_days - productiveDays),
    currentStreak: globalStreaks.currentStreak,
    longestStreak: globalStreaks.longestStreak,
    totalMinutes,
    totalHours: Math.round((totalMinutes / 60) * 10) / 10,
    dsaCount: counts.DSA,
    lldCount: counts.LLD,
    hldCount: counts.HLD,
    targetProgress: Math.min(
      100,
      Math.round((productiveDays / settings.monthly_target_days) * 100)
    ),
    passed: productiveDays >= settings.monthly_target_days,
    calendar,
    elapsedDays,
    daysInMonth,
  };
}

export function getChallengeResult(year, month) {
  const settings = getSettings();
  const users = db.prepare('SELECT id, name FROM users').all();
  const results = users.map((user) => ({
    name: user.name,
    ...getUserStats(user.id, year, month),
  }));

  const mithun = results.find((r) => r.name === 'Mithun');
  const devesh = results.find((r) => r.name === 'Devesh');

  let outcome = 'Both pass — no penalty';
  let details = [];
  let status = 'final';

  const today = new Date();
  const isPastMonth =
    year < today.getFullYear() ||
    (year === today.getFullYear() && month < today.getMonth() + 1);
  const isFutureMonth =
    year > today.getFullYear() ||
    (year === today.getFullYear() && month > today.getMonth() + 1);

  if (isFutureMonth) {
    outcome = 'Month not started yet';
    status = 'upcoming';
  } else if (mithun && devesh) {
    const mPassed = mithun.passed;
    const dPassed = devesh.passed;

    if (!isPastMonth) {
      status = 'in_progress';
      if (mPassed && dPassed) outcome = 'On track — both meeting target';
      else if (!mPassed && dPassed) outcome = 'Mithun behind — would pay if month ended today';
      else if (mPassed && !dPassed) outcome = 'Devesh behind — would pay if month ended today';
      else outcome = 'Both behind target — would each contribute if month ended today';
    } else if (mPassed && dPassed) {
      outcome = 'Both pass — no penalty';
    } else if (!mPassed && dPassed) {
      outcome = `Mithun pays ₹${settings.penalty_amount}`;
      details.push({ user: 'Mithun', action: 'pays', amount: settings.penalty_amount });
    } else if (mPassed && !dPassed) {
      outcome = `Devesh pays ₹${settings.penalty_amount}`;
      details.push({ user: 'Devesh', action: 'pays', amount: settings.penalty_amount });
    } else {
      outcome = `Both fail — each contributes ₹${settings.penalty_amount} to common pool`;
      details.push(
        { user: 'Mithun', action: 'contributes', amount: settings.penalty_amount },
        { user: 'Devesh', action: 'contributes', amount: settings.penalty_amount }
      );
    }
  }

  const leader = results.reduce((best, curr) => {
    if (!best) return curr;
    if (curr.productiveDays > best.productiveDays) return curr;
    if (curr.productiveDays === best.productiveDays && curr.totalMinutes > best.totalMinutes)
      return curr;
    return best;
  }, null);

  return { results, outcome, details, leader: leader?.name, settings, status };
}

export function getWeeklyProgress(userId, year, month) {
  const prefix = `${year}-${String(month).padStart(2, '0')}`;
  const rows = db
    .prepare(
      `SELECT date, SUM(time_spent_minutes) as minutes, COUNT(*) as entries
       FROM entries WHERE user_id = ? AND date LIKE ? || '%'
       GROUP BY date ORDER BY date`
    )
    .all(userId, prefix);

  const weeks = {};
  for (const row of rows) {
    const d = new Date(row.date + 'T00:00:00');
    const weekNum = Math.ceil(d.getDate() / 7);
    const key = `Week ${weekNum}`;
    if (!weeks[key]) weeks[key] = { week: key, minutes: 0, entries: 0, days: 0 };
    weeks[key].minutes += row.minutes;
    weeks[key].entries += row.entries;
    weeks[key].days += 1;
  }

  return Object.values(weeks);
}

export function getHeatmapData(userId) {
  const rows = db
    .prepare(
      `SELECT date, COUNT(*) as count, SUM(time_spent_minutes) as minutes
       FROM entries WHERE user_id = ?
       GROUP BY date ORDER BY date`
    )
    .all(userId);

  return rows.map((r) => ({
    date: r.date,
    count: r.count,
    minutes: r.minutes,
    level: r.count >= 3 ? 4 : r.count >= 2 ? 3 : r.count >= 1 ? 2 : 0,
  }));
}

export function getBadges(userId) {
  const { longestStreak } = computeGlobalStreaks(userId);
  const badges = [];
  if (longestStreak >= 7) badges.push({ id: 'streak-7', name: '7-Day Streak', earned: true });
  else badges.push({ id: 'streak-7', name: '7-Day Streak', earned: false });
  if (longestStreak >= 15) badges.push({ id: 'streak-15', name: '15-Day Streak', earned: true });
  else badges.push({ id: 'streak-15', name: '15-Day Streak', earned: false });
  if (longestStreak >= 30) badges.push({ id: 'streak-30', name: '30-Day Streak', earned: true });
  else badges.push({ id: 'streak-30', name: '30-Day Streak', earned: false });
  return badges;
}

export function getEntriesForDate(userId, date) {
  return db
    .prepare(
      `SELECT e.*, u.name as user_name FROM entries e
       JOIN users u ON u.id = e.user_id
       WHERE e.user_id = ? AND e.date = ?
       ORDER BY e.created_at DESC`
    )
    .all(userId, date);
}

export function getActivityFeed(limit = 50) {
  return db
    .prepare(
      `SELECT e.*, u.name as user_name FROM entries e
       JOIN users u ON u.id = e.user_id
       ORDER BY e.date DESC, e.created_at DESC
       LIMIT ?`
    )
    .all(limit);
}

export function getCategoryBreakdown(userId, year, month) {
  const prefix = `${year}-${String(month).padStart(2, '0')}`;
  const categories = db
    .prepare(
      `SELECT category, COUNT(*) as count, SUM(time_spent_minutes) as minutes
       FROM entries WHERE user_id = ? AND date LIKE ? || '%'
       GROUP BY category`
    )
    .all(userId, prefix);

  const difficulties = db
    .prepare(
      `SELECT difficulty, COUNT(*) as count FROM entries
       WHERE user_id = ? AND date LIKE ? || '%' AND category = 'DSA' AND difficulty IS NOT NULL
       GROUP BY difficulty`
    )
    .all(userId, prefix);

  return { categories, difficulties };
}

export function getTodayStatus(userId) {
  const today = new Date();
  const todayStr = formatDate(today.getFullYear(), today.getMonth() + 1, today.getDate());
  const count = db
    .prepare('SELECT COUNT(*) as count FROM entries WHERE user_id = ? AND date = ?')
    .get(userId, todayStr);
  const minutes = db
    .prepare(
      'SELECT COALESCE(SUM(time_spent_minutes), 0) as total FROM entries WHERE user_id = ? AND date = ?'
    )
    .get(userId, todayStr);
  const { currentStreak } = computeGlobalStreaks(userId);

  return {
    date: todayStr,
    loggedToday: count.count > 0,
    entryCount: count.count,
    minutesToday: minutes.total,
    currentStreak,
  };
}

export function getLastEntry(userId) {
  return db
    .prepare(
      `SELECT e.*, u.name as user_name FROM entries e
       JOIN users u ON u.id = e.user_id
       WHERE e.user_id = ? ORDER BY e.created_at DESC LIMIT 1`
    )
    .get(userId);
}
