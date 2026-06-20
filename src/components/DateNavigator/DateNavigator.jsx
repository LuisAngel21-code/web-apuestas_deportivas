import { CalendarIcon } from '../Icons';
import './DateNavigator.css';

const DAY_MS = 86400000;

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function formatDisplay(date) {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const d = date.toDateString();
  if (d === today.toDateString()) return 'Hoy';
  if (d === tomorrow.toDateString()) return 'Manana';
  if (d === yesterday.toDateString()) return 'Ayer';

  return date.toLocaleDateString('es-PE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

export default function DateNavigator({ selectedDate, onChange, availableDates }) {
  const dateObj = new Date(selectedDate);
  const dateStr = formatDate(dateObj);

  const goPrev = () => {
    const prev = new Date(dateObj);
    prev.setDate(prev.getDate() - 1);
    onChange(formatDate(prev));
  };

  const goNext = () => {
    const next = new Date(dateObj);
    next.setDate(next.getDate() + 1);
    onChange(formatDate(next));
  };

  const hasPrev = true;
  const hasNext = true;

  return (
    <div className="date-navigator">
      <button className="date-nav-btn" onClick={goPrev} title="Dia anterior">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <div className="date-nav-display">
        <CalendarIcon size={16} color="#00F593" />
        <div className="date-nav-text">
          <span className="date-nav-label">{formatDisplay(dateObj)}</span>
          <span className="date-nav-sub">
            {dateObj.getDate()} de {MONTHS[dateObj.getMonth()]} {dateObj.getFullYear()}
          </span>
        </div>
      </div>

      <button className="date-nav-btn" onClick={goNext} title="Dia siguiente">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  );
}
