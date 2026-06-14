import { useCallback, useEffect, useState } from 'react';
import {
  fetchUsers,
  fetchSettings,
  fetchStats,
  fetchLeaderboard,
  fetchChallenge,
  fetchWeekly,
  fetchHeatmap,
  fetchBadges,
  fetchFeed,
  fetchDayEntries,
  MONTHS,
} from './api';
import SummaryCards from './components/SummaryCards';
import Leaderboard from './components/Leaderboard';
import CalendarView from './components/CalendarView';
import ActivityFeed from './components/ActivityFeed';
import EntryForm from './components/EntryForm';
import SettingsPanel from './components/SettingsPanel';
import ChallengeResult from './components/ChallengeResult';
import Heatmap from './components/Heatmap';
import WeeklyChart from './components/WeeklyChart';
import Badges from './components/Badges';
import ExportButton, { exportMonthlyReport } from './components/ExportReport';

export default function App() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [settings, setSettings] = useState(null);
  const [stats, setStats] = useState(null);
  const [leaderboard, setLeaderboard] = useState(null);
  const [challenge, setChallenge] = useState(null);
  const [weekly, setWeekly] = useState([]);
  const [heatmap, setHeatmap] = useState([]);
  const [badges, setBadges] = useState([]);
  const [feed, setFeed] = useState([]);
  const [dayEntries, setDayEntries] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const selectedUser = users.find((u) => u.id === selectedUserId);

  const loadData = useCallback(async () => {
    if (!selectedUserId) return;

    const [s, lb, ch, wk, hm, bd, fd] = await Promise.all([
      fetchStats(selectedUserId, year, month),
      fetchLeaderboard(year, month),
      fetchChallenge(year, month),
      fetchWeekly(selectedUserId, year, month),
      fetchHeatmap(selectedUserId),
      fetchBadges(selectedUserId),
      fetchFeed(),
    ]);

    setStats(s);
    setLeaderboard(lb);
    setChallenge(ch);
    setWeekly(wk);
    setHeatmap(hm);
    setBadges(bd);
    setFeed(fd);
  }, [selectedUserId, year, month]);

  useEffect(() => {
    async function init() {
      const [u, s] = await Promise.all([fetchUsers(), fetchSettings()]);
      setUsers(u);
      setSettings(s);
      if (u.length > 0) setSelectedUserId(u[0].id);
    }
    init();
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDayClick = async (date) => {
    setSelectedDate(date);
    const entries = await fetchDayEntries(selectedUserId, date);
    setDayEntries(entries);
  };

  const handleExport = () => {
    if (!selectedUser || !stats || !settings) return;
    exportMonthlyReport({
      userName: selectedUser.name,
      year,
      month,
      stats,
      settings,
      challenge,
      feed,
    });
  };

  const changeMonth = (delta) => {
    let m = month + delta;
    let y = year;
    if (m > 12) {
      m = 1;
      y++;
    } else if (m < 1) {
      m = 12;
      y--;
    }
    setMonth(m);
    setYear(y);
    setSelectedDate(null);
    setDayEntries([]);
  };

  return (
    <div className="mx-auto min-h-dvh max-w-6xl px-4 py-6 sm:px-6">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
            Prep Tracker
            <span className="ml-2 text-emerald-400">⚡</span>
          </h1>
          <p className="text-sm text-slate-500">Mithun vs Devesh — daily accountability</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedUserId ?? ''}
            onChange={(e) => setSelectedUserId(Number(e.target.value))}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-sm font-medium outline-none focus:border-emerald-500"
          >
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>

          <div className="flex items-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)]">
            <button
              type="button"
              onClick={() => changeMonth(-1)}
              className="px-2.5 py-2 text-slate-400 hover:text-white"
            >
              ‹
            </button>
            <span className="min-w-[120px] px-2 text-center text-sm font-medium">
              {MONTHS[month - 1]} {year}
            </span>
            <button
              type="button"
              onClick={() => changeMonth(1)}
              className="px-2.5 py-2 text-slate-400 hover:text-white"
            >
              ›
            </button>
          </div>

          <ExportButton onExport={handleExport} />
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <SummaryCards stats={stats} settings={settings} />
          <EntryForm userId={selectedUserId} onSuccess={loadData} />
          <Leaderboard data={leaderboard} />
          <ChallengeResult challenge={challenge} />
          <WeeklyChart data={weekly} />
        </div>

        <div className="space-y-4">
          <CalendarView
            stats={stats}
            year={year}
            month={month}
            onDayClick={handleDayClick}
            selectedDate={selectedDate}
            dayEntries={dayEntries}
          />
          <Badges badges={badges} />
          <Heatmap data={heatmap} />
          <SettingsPanel
            settings={settings}
            onUpdate={(s) => {
              setSettings(s);
              loadData();
            }}
          />
          <ActivityFeed feed={feed} />
        </div>
      </div>
    </div>
  );
}
