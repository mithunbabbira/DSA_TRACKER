import { useCallback, useEffect, useRef, useState } from 'react';
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
  fetchBreakdown,
  fetchTodayStatus,
  deleteEntry,
  MONTHS,
  USER_COLORS,
} from './api';
import SummaryCards, { ProgressRing } from './components/SummaryCards';
import Leaderboard from './components/Leaderboard';
import CalendarView from './components/CalendarView';
import ActivityFeed from './components/ActivityFeed';
import EntryForm from './components/EntryForm';
import SettingsPanel from './components/SettingsPanel';
import ChallengeResult from './components/ChallengeResult';
import Heatmap from './components/Heatmap';
import WeeklyChart from './components/WeeklyChart';
import Badges from './components/Badges';
import TodayBanner from './components/TodayBanner';
import CategoryChart from './components/CategoryChart';
import EditEntryModal from './components/EditEntryModal';
import MobileNav from './components/MobileNav';
import Toast from './components/Toast';
import ExportButton, { exportMonthlyReport } from './components/ExportReport';

export default function App() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [mobileTab, setMobileTab] = useState('overview');

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
  const [breakdown, setBreakdown] = useState(null);
  const [todayStatus, setTodayStatus] = useState(null);
  const [dayEntries, setDayEntries] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [editEntry, setEditEntry] = useState(null);
  const [toast, setToast] = useState(null);

  const formRef = useRef(null);
  const selectedUser = users.find((u) => u.id === selectedUserId);

  const showToast = (message, type = 'success') => setToast({ message, type });

  const loadData = useCallback(async () => {
    if (!selectedUserId) return;

    const [s, lb, ch, wk, hm, bd, fd, br, ts] = await Promise.all([
      fetchStats(selectedUserId, year, month),
      fetchLeaderboard(year, month),
      fetchChallenge(year, month),
      fetchWeekly(selectedUserId, year, month),
      fetchHeatmap(selectedUserId),
      fetchBadges(selectedUserId),
      fetchFeed(),
      fetchBreakdown(selectedUserId, year, month),
      fetchTodayStatus(selectedUserId),
    ]);

    setStats(s);
    setLeaderboard(lb);
    setChallenge(ch);
    setWeekly(wk);
    setHeatmap(hm);
    setBadges(bd);
    setFeed(fd);
    setBreakdown(br);
    setTodayStatus(ts);

    if (selectedDate) {
      const entries = await fetchDayEntries(selectedUserId, selectedDate);
      setDayEntries(entries);
    }
  }, [selectedUserId, year, month, selectedDate]);

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
    setStats(null);
    setTodayStatus(null);
    setBreakdown(null);
    setSelectedDate(null);
    setDayEntries([]);
    loadData();
  }, [loadData]);

  const handleDayClick = async (date) => {
    setSelectedDate(date);
    const entries = await fetchDayEntries(selectedUserId, date);
    setDayEntries(entries);
  };

  const handleDeleteEntry = async (id) => {
    if (!confirm('Delete this entry?')) return;
    try {
      await deleteEntry(id);
      showToast('Entry deleted');
      loadData();
    } catch {
      showToast('Failed to delete', 'error');
    }
  };

  const handleExport = () => {
    if (!selectedUser || !stats || !settings) return;
    exportMonthlyReport({ userName: selectedUser.name, year, month, stats, settings, challenge, feed });
    showToast('PDF downloaded!', 'info');
  };

  const changeMonth = (delta) => {
    let m = month + delta;
    let y = year;
    if (m > 12) { m = 1; y++; } else if (m < 1) { m = 12; y--; }
    setMonth(m);
    setYear(y);
    setSelectedDate(null);
    setDayEntries([]);
  };

  const scrollToLog = () => {
    setMobileTab('log');
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const show = (tab) => mobileTab === tab;

  return (
    <div className="mx-auto min-h-dvh max-w-6xl px-4 pb-24 pt-6 sm:px-6 lg:pb-6">
      <header className="mb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
              Prep Tracker
            </h1>
            <p className="text-sm text-slate-500">Mithun vs Devesh — stay accountable</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
              {users.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => setSelectedUserId(u.id)}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                    selectedUserId === u.id
                      ? USER_COLORS[u.name] + ' shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {u.name}
                </button>
              ))}
            </div>

            <div className="flex items-center rounded-xl border border-slate-200 bg-white shadow-sm">
              <button type="button" onClick={() => changeMonth(-1)} className="px-3 py-2 text-slate-400 hover:text-slate-700">‹</button>
              <span className="min-w-[130px] px-2 text-center text-sm font-semibold text-slate-700">
                {MONTHS[month - 1]} {year}
              </span>
              <button type="button" onClick={() => changeMonth(1)} className="px-3 py-2 text-slate-400 hover:text-slate-700">›</button>
            </div>

            <ExportButton onExport={handleExport} />
          </div>
        </div>
      </header>

      <div className="mb-4">
        <TodayBanner
          todayStatus={todayStatus}
          userName={selectedUser?.name}
          onLogClick={scrollToLog}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className={`space-y-4 lg:col-span-2 ${show('overview') || show('log') ? '' : 'hidden lg:block'}`}>
          {(show('overview') || !show('log')) && (
            <div className={`${show('overview') ? '' : 'hidden lg:block'}`}>
              <SummaryCards stats={stats} settings={settings} />
            </div>
          )}

          <div className={`${show('log') || show('overview') ? '' : 'hidden lg:block'}`}>
            <EntryForm
              userId={selectedUserId}
              onSuccess={loadData}
              onToast={showToast}
              formRef={formRef}
            />
          </div>

          <div className={`space-y-4 ${show('overview') ? '' : 'hidden lg:block'}`}>
            <Leaderboard data={leaderboard} />
            <ChallengeResult challenge={challenge} />
          </div>

          <div className={`${show('stats') || show('overview') ? '' : 'hidden lg:block'}`}>
            <WeeklyChart data={weekly} />
            <div className="mt-4">
              <CategoryChart breakdown={breakdown} />
            </div>
          </div>
        </div>

        <div className={`space-y-4 ${show('overview') || show('activity') || show('stats') ? '' : 'hidden lg:block'}`}>
          <div className={`${show('overview') ? '' : 'hidden lg:block'}`}>
            <ProgressRing stats={stats} settings={settings} />
          </div>

          <div className={`${show('overview') || show('stats') ? '' : 'hidden lg:block'}`}>
            <CalendarView
              stats={stats}
              year={year}
              month={month}
              onDayClick={handleDayClick}
              selectedDate={selectedDate}
              dayEntries={dayEntries}
              onDeleteEntry={handleDeleteEntry}
            />
            <div className="mt-4">
              <Badges badges={badges} />
            </div>
            <div className="mt-4">
              <Heatmap data={heatmap} />
            </div>
          </div>

          <div className={`${show('overview') ? '' : 'hidden lg:block'}`}>
            <SettingsPanel
              settings={settings}
              onUpdate={(s) => { setSettings(s); loadData(); }}
            />
          </div>

          <div className={`${show('activity') || show('overview') ? '' : 'hidden lg:block'}`}>
            <ActivityFeed
              feed={feed}
              users={users}
              onDelete={handleDeleteEntry}
              onEdit={setEditEntry}
            />
          </div>
        </div>
      </div>

      <MobileNav active={mobileTab} onChange={setMobileTab} />

      {editEntry && (
        <EditEntryModal
          entry={editEntry}
          onClose={() => setEditEntry(null)}
          onSave={() => { showToast('Entry updated'); loadData(); }}
        />
      )}

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
