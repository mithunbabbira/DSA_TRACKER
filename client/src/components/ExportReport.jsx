import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MONTHS } from '../api';

export function exportMonthlyReport({
  userName,
  year,
  month,
  stats,
  settings,
  challenge,
  feed,
}) {
  const doc = new jsPDF();
  const monthName = MONTHS[month - 1];

  doc.setFontSize(18);
  doc.text('Monthly Prep Report', 14, 20);
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`${userName} — ${monthName} ${year}`, 14, 28);

  doc.setTextColor(0);
  doc.setFontSize(12);
  doc.text('Summary', 14, 40);

  autoTable(doc, {
    startY: 44,
    head: [['Metric', 'Value']],
    body: [
      ['Productive Days', `${stats.productiveDays}/${settings.monthly_target_days}`],
      ['Current Streak', `${stats.currentStreak} days`],
      ['Longest Streak', `${stats.longestStreak} days`],
      ['Total Hours', `${stats.totalHours}`],
      ['DSA Problems', `${stats.dsaCount}`],
      ['LLD Sessions', `${stats.lldCount}`],
      ['HLD Sessions', `${stats.hldCount}`],
      ['Target Progress', `${stats.targetProgress}%`],
      ['Status', stats.passed ? 'PASS' : 'FAIL'],
    ],
    theme: 'grid',
    headStyles: { fillColor: [34, 197, 94] },
  });

  const challengeY = doc.lastAutoTable.finalY + 12;
  doc.text('Challenge Outcome', 14, challengeY);
  doc.setFontSize(10);
  doc.text(challenge?.outcome || 'N/A', 14, challengeY + 6);

  const feedY = challengeY + 16;
  doc.setFontSize(12);
  doc.text('Recent Activities', 14, feedY);

  const userFeed = feed.filter((e) => e.user_name === userName).slice(0, 15);
  autoTable(doc, {
    startY: feedY + 4,
    head: [['Date', 'Category', 'Title', 'Minutes']],
    body: userFeed.map((e) => [e.date, e.category, e.title, e.time_spent_minutes]),
    theme: 'striped',
    headStyles: { fillColor: [34, 197, 94] },
  });

  doc.save(`${userName}-${monthName}-${year}-report.pdf`);
}

export default function ExportButton({ onExport }) {
  return (
    <button
      type="button"
      onClick={onExport}
      className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-3)] px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-[var(--color-border)]"
    >
      Export PDF
    </button>
  );
}
