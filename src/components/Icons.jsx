const GREEN = '#00F593';
const GOLD = '#F0B90B';
const WHITE = '#FFFFFF';

export function StadiumIcon({ size = 24, color = GREEN }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20V8l8-4 8 4v12" />
      <path d="M4 20h16" />
      <path d="M6 12h3" />
      <path d="M15 12h3" />
      <path d="M6 16h3" />
      <path d="M15 16h3" />
      <path d="M12 20v-4" />
      <circle cx="12" cy="10" r="1" fill={color} />
    </svg>
  );
}

export function TrophyIcon({ size = 24, color = GOLD }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2" />
      <path d="M18 9h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2" />
      <path d="M6 3h12v6a6 6 0 0 1-12 0V3z" />
      <path d="M8 21h8" />
      <path d="M12 17v4" />
    </svg>
  );
}

export function OddsIcon({ size = 24, color = GREEN }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M7 15l3-6 3 6 3-6" />
      <path d="M7 12h6" />
    </svg>
  );
}

export function AttackIcon({ size = 24, color = GREEN }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v14" />
      <path d="M8 7l4-4 4 4" />
      <path d="M4 21h16" />
      <path d="M8 17l4 4 4-4" />
    </svg>
  );
}

export function DefenseIcon({ size = 24, color = GOLD }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l8 4v6c0 4-3.5 7.5-8 9-4.5-1.5-8-5-8-9V6l8-4z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

export function CalendarIcon({ size = 24, color = WHITE }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h18" />
      <circle cx="12" cy="15" r="1" fill={color} />
      <circle cx="16" cy="15" r="1" fill={color} />
      <circle cx="8" cy="15" r="1" fill={color} />
    </svg>
  );
}

export function ValueStarIcon({ size = 24, color = GOLD }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export function FootballIcon({ size = 24, color = GREEN }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2v20" />
      <path d="M2 12h20" />
      <path d="M4.93 4.93l14.14 14.14" />
      <path d="M19.07 4.93L4.93 19.07" />
    </svg>
  );
}

export function VSIcon({ size = 24, color = WHITE }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4l6 16 2-8 2 8 6-16" />
    </svg>
  );
}

export function MoneyIcon({ size = 24, color = GREEN }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v12" />
      <path d="M9 9c0-1.5 1.5-2 3-2s3 .5 3 2-1.5 2-3 2-3 .5-3 2 1.5 2 3 2 3-.5 3-2" />
    </svg>
  );
}

export function GoalIcon({ size = 24, color = WHITE }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="12" rx="1" />
      <path d="M6 6V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
      <circle cx="12" cy="12" r="3" />
      <circle cx="12" cy="12" r="1" fill={color} />
    </svg>
  );
}

export function LoadingBall({ size = 40, color = GREEN }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="16" stroke={color} strokeWidth="2" fill="none">
        <animate attributeName="r" values="16;18;16" dur="1.2s" repeatCount="indefinite" />
      </circle>
      <path d="M20 8 L22 16 L30 18 L22 20 L20 28 L18 20 L10 18 L18 16 Z" fill={color} opacity="0.8">
        <animateTransform attributeName="transform" type="rotate" from="0 20 20" to="360 20 20" dur="3s" repeatCount="indefinite" />
      </path>
    </svg>
  );
}

export function PitchIcon({ size = 24, color = GREEN }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="1" />
      <path d="M12 4v16" />
      <circle cx="12" cy="12" r="3" />
      <rect x="2" y="8" width="5" height="8" rx="1" />
      <rect x="17" y="8" width="5" height="8" rx="1" />
    </svg>
  );
}

export function SearchIcon({ size = 20, color = WHITE }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

export function ChevronDown({ size = 20, color = WHITE }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function TrendingUp({ size = 20, color = GREEN }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}
