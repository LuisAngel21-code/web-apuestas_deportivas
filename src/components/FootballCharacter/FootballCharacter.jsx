import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';
import { LoadingBall } from '../Icons';
import { randomMessage, EMPTY_DATE, EMPTY_SEARCH, EMPTY_LEAGUE, ERROR, LOADING } from './messages';
import './FootballCharacter.css';

function formatDateLabel(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr.split('T')[0] + 'T00:00:00');
  return d.toLocaleDateString('es-PE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

export default function FootballCharacter({ type, nextDate, onGoToDate, searchQuery }) {
  const [msgIndex, setMsgIndex] = useState(0);
  const [blink, setBlink] = useState(false);

  const messages = useMemo(() => {
    if (type === 'loading') return LOADING;
    if (type === 'empty-date') return LOADING.concat('Cargando datos...');
    return [];
  }, [type]);

  useEffect(() => {
    if (messages.length > 1) {
      const interval = setInterval(() => {
        setMsgIndex((prev) => (prev + 1) % messages.length);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [messages]);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150);
    }, 3000);
    return () => clearInterval(blinkInterval);
  }, []);

  const message = useMemo(() => {
    if (type === 'loading') return messages[msgIndex % messages.length];
    if (type === 'empty-date') return randomMessage(EMPTY_DATE);
    if (type === 'empty-search') return randomMessage(EMPTY_SEARCH);
    if (type === 'empty-league') return randomMessage(EMPTY_LEAGUE);
    if (type === 'error') return randomMessage(ERROR);
    return 'Ey furbolero!';
  }, [type, msgIndex]);

  return (
    <motion.div
      className="football-character"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      <div className="character-speech">
        <div className="speech-bubble">
          <p className="speech-text">{message}</p>
          {type === 'loading' && (
            <span className="speech-dots">
              <span>.</span><span>.</span><span>.</span>
            </span>
          )}
          <div className="speech-arrow" />
        </div>
      </div>

      <div className="character-svg">
        <svg viewBox="0 0 120 180" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Body */}
          <rect x="35" y="75" width="50" height="65" rx="10" fill="#1A1F2E" stroke="#00F593" strokeWidth="1.5" />

          {/* Jersey stripes */}
          <rect x="35" y="75" width="50" height="65" rx="10" fill="url(#jerseyGrad)" opacity="0.3" />
          <line x1="50" y1="75" x2="50" y2="140" stroke="#00F593" strokeWidth="1" opacity="0.3" />
          <line x1="70" y1="75" x2="70" y2="140" stroke="#00F593" strokeWidth="1" opacity="0.3" />

          {/* Number */}
          <text x="60" y="125" textAnchor="middle" fill="#00F593" fontSize="18" fontWeight="bold" fontFamily="monospace">1</text>

          {/* Collar */}
          <path d="M47 75 L60 68 L73 75" stroke="#00F593" strokeWidth="1.5" fill="none" />

          {/* Left arm */}
          <motion.g
            animate={{ rotate: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '42px 85px' }}
          >
            <rect x="18" y="80" width="18" height="35" rx="6" fill="#1A1F2E" stroke="#00F593" strokeWidth="1.5" />
          </motion.g>

          {/* Right arm */}
          <motion.g
            animate={{ rotate: [0, 5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '78px 85px' }}
          >
            <rect x="84" y="80" width="18" height="35" rx="6" fill="#1A1F2E" stroke="#00F593" strokeWidth="1.5" />
          </motion.g>

          {/* Gloves */}
          <circle cx="27" cy="115" r="8" fill="#00F593" opacity="0.8" />
          <circle cx="93" cy="115" r="8" fill="#00F593" opacity="0.8" />

          {/* Head */}
          <circle cx="60" cy="45" r="24" fill="#1A1F2E" stroke="#00F593" strokeWidth="1.5" />

          {/* Hair */}
          <path d="M36 42 Q40 20 60 18 Q80 20 84 42" stroke="#00F593" strokeWidth="2" fill="#00F593" opacity="0.3" />

          {/* Cap */}
          <path d="M42 32 Q60 22 78 32 L80 28 Q60 16 40 28 Z" fill="#00F593" opacity="0.6" />
          <circle cx="60" cy="24" r="3" fill="#0A0E17" />

          {/* Eyes */}
          {blink ? (
            <line x1="50" y1="43" x2="54" y2="43" stroke="#00F593" strokeWidth="2" strokeLinecap="round" />
          ) : (
            <>
              <circle cx="52" cy="42" r="3" fill="#00F593" />
              <circle cx="52" cy="42" r="1.5" fill="#0A0E17" />
            </>
          )}

          {blink ? (
            <line x1="64" y1="43" x2="68" y2="43" stroke="#00F593" strokeWidth="2" strokeLinecap="round" />
          ) : (
            <>
              <circle cx="66" cy="42" r="3" fill="#00F593" />
              <circle cx="66" cy="42" r="1.5" fill="#0A0E17" />
            </>
          )}

          {/* Mouth */}
          {type === 'error' ? (
            <path d="M54 54 Q60 50 66 54" stroke="#FF1744" strokeWidth="1.5" fill="none" />
          ) : (
            <path d="M54 52 Q60 57 66 52" stroke="#00F593" strokeWidth="1.5" fill="none" />
          )}

          {/* Nose */}
          <circle cx="59" cy="47" r="1.5" fill="#00F593" opacity="0.5" />

          {/* Legs */}
          <motion.g
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <rect x="38" y="138" width="14" height="28" rx="5" fill="#1A1F2E" stroke="#00F593" strokeWidth="1.5" />
            <rect x="66" y="138" width="14" height="28" rx="5" fill="#1A1F2E" stroke="#00F593" strokeWidth="1.5" />
          </motion.g>

          {/* Shoes */}
          <rect x="34" y="164" width="20" height="8" rx="4" fill="#00F593" opacity="0.7" />
          <rect x="66" y="164" width="20" height="8" rx="4" fill="#00F593" opacity="0.7" />

          {/* Goalie gloves detail */}
          <rect x="21" y="110" width="12" height="4" rx="2" fill="#0A0E17" opacity="0.3" />
          <rect x="87" y="110" width="12" height="4" rx="2" fill="#0A0E17" opacity="0.3" />

          <defs>
            <linearGradient id="jerseyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00F593" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#00F593" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {type === 'empty-date' && nextDate && onGoToDate && (
        <motion.button
          className="character-action"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={onGoToDate}
        >
          Ir al {formatDateLabel(nextDate)}
        </motion.button>
      )}

      {type === 'empty-league' && (
        <motion.p
          className="character-hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Usa el selector de arriba
        </motion.p>
      )}
    </motion.div>
  );
}
