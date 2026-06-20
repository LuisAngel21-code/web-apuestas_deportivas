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
        <svg viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Shadow */}
          <ellipse cx="100" cy="232" rx="50" ry="6" fill="#00F593" opacity="0.15" />

          {/* Left leg (back) */}
          <motion.g
            animate={{ rotate: [0, -8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '95px 150px' }}
          >
            <path d="M80 150 L72 198 L65 200 L68 208 L80 205 L85 195 L92 150" fill="#1A1F2E" stroke="#00F593" strokeWidth="1.2" />
            <path d="M62 202 L68 208 L80 205 L78 200 Z" fill="#00F593" opacity="0.7" />
          </motion.g>

          {/* Right leg (kicking forward) */}
          <motion.g
            animate={{ rotate: [0, 15, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '105px 150px' }}
          >
            <path d="M108 150 L118 185 L125 200 L122 208 L112 205 L105 190 L100 150" fill="#1A1F2E" stroke="#00F593" strokeWidth="1.2" />
            <path d="M125 200 L122 208 L112 205 L115 198 Z" fill="#00F593" opacity="0.7" />
          </motion.g>

          {/* Body / Jersey */}
          <path d="M82 70 Q80 80 78 95 L77 110 Q77 120 80 128 L82 135 Q85 145 90 150 L100 155 L110 150 Q115 145 118 135 L120 128 Q123 120 123 110 L122 95 Q120 80 118 70 Z" fill="#1A1F2E" stroke="#00F593" strokeWidth="1.2" />

          {/* Jersey stripes */}
          <path d="M90 75 L88 150" stroke="#00F593" strokeWidth="1" opacity="0.2" />
          <path d="M100 75 L100 155" stroke="#00F593" strokeWidth="1" opacity="0.2" />
          <path d="M110 75 L112 150" stroke="#00F593" strokeWidth="1" opacity="0.2" />

          {/* Jersey number */}
          <text x="100" y="130" textAnchor="middle" fill="#00F593" fontSize="20" fontWeight="bold" fontFamily="'Bebas Neue', sans-serif" opacity="0.6">10</text>

          {/* Collar */}
          <path d="M90 70 Q100 62 110 70" stroke="#00F593" strokeWidth="1.5" fill="none" />

          {/* Left arm (back, swinging) */}
          <motion.g
            animate={{ rotate: [10, 0, 10] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '82px 85px' }}
          >
            <path d="M78 80 Q60 85 50 100 Q45 108 48 115 L52 120 Q56 115 62 108 Q72 95 82 90" fill="#1A1F2E" stroke="#00F593" strokeWidth="1.2" />
            <circle cx="50" cy="118" r="6" fill="#1A1F2E" stroke="#00F593" strokeWidth="1" />
          </motion.g>

          {/* Right arm (forward, pointing) */}
          <motion.g
            animate={{ rotate: [-15, 0, -15] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '118px 85px' }}
          >
            <path d="M118 80 Q135 82 145 90 Q152 96 155 105 L152 110 Q148 105 142 100 Q132 92 122 88" fill="#1A1F2E" stroke="#00F593" strokeWidth="1.2" />
            <circle cx="154" cy="108" r="6" fill="#1A1F2E" stroke="#00F593" strokeWidth="1" />
          </motion.g>

          {/* Shorts */}
          <path d="M82 135 Q80 142 80 150 L80 155 Q80 160 85 165 L100 168 L115 165 Q120 160 120 155 L120 150 Q120 142 118 135 Q108 140 100 142 Q92 140 82 135 Z" fill="#0A0E17" stroke="#00F593" strokeWidth="1" />

          {/* Head */}
          <g>
            <ellipse cx="100" cy="48" rx="22" ry="24" fill="#1A1F2E" stroke="#00F593" strokeWidth="1.2" />

            {/* Hair */}
            <path d="M78 42 Q80 22 100 20 Q120 22 122 42 Q120 30 100 28 Q80 30 78 42" fill="#00F593" opacity="0.4" />
            <path d="M80 38 Q82 28 100 25 Q118 28 120 38" stroke="#00F593" strokeWidth="1.5" fill="none" opacity="0.3" />

            {/* Eyes - blinking */}
            {blink ? (
              <>
                <line x1="90" y1="46" x2="95" y2="46" stroke="#00F593" strokeWidth="2" strokeLinecap="round" />
                <line x1="105" y1="46" x2="110" y2="46" stroke="#00F593" strokeWidth="2" strokeLinecap="round" />
              </>
            ) : (
              <>
                <ellipse cx="93" cy="46" rx="3" ry="3.5" fill="#00F593" />
                <circle cx="93" cy="46" r="1.5" fill="#0A0E17" />
                <ellipse cx="107" cy="46" rx="3" ry="3.5" fill="#00F593" />
                <circle cx="107" cy="46" r="1.5" fill="#0A0E17" />
              </>
            )}

            {/* Eyebrows */}
            <line x1="88" y1="39" x2="96" y2="40" stroke="#00F593" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
            <line x1="104" y1="40" x2="112" y2="39" stroke="#00F593" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />

            {/* Mouth */}
            {type === 'error' ? (
              <path d="M93 58 Q100 54 107 58" stroke="#FF1744" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            ) : (
              <path d="M93 57 Q100 62 107 57" stroke="#00F593" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            )}

            {/* Nose */}
            <path d="M100 48 L100 53" stroke="#00F593" strokeWidth="1" strokeLinecap="round" opacity="0.4" />

            {/* Ear */}
            <circle cx="78" cy="48" r="4" fill="#1A1F2E" stroke="#00F593" strokeWidth="0.8" />
            <circle cx="122" cy="48" r="4" fill="#1A1F2E" stroke="#00F593" strokeWidth="0.8" />
          </g>

          {/* Soccer ball at foot */}
          <motion.g
            animate={{ x: [0, 5, 0], y: [0, 2, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <circle cx="130" cy="210" r="12" fill="#0A0E17" stroke="#00F593" strokeWidth="1.5" />
            <path d="M130 198 V222" stroke="#00F593" strokeWidth="0.8" opacity="0.4" />
            <path d="M118 210 H142" stroke="#00F593" strokeWidth="0.8" opacity="0.4" />
            <circle cx="130" cy="210" r="4" fill="none" stroke="#00F593" strokeWidth="0.8" opacity="0.4" />
          </motion.g>

          {/* Speed lines behind */}
          <motion.g
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <line x1="35" y1="100" x2="55" y2="100" stroke="#00F593" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
            <line x1="25" y1="120" x2="50" y2="120" stroke="#00F593" strokeWidth="1" strokeLinecap="round" opacity="0.2" />
            <line x1="30" y1="140" x2="45" y2="140" stroke="#00F593" strokeWidth="0.8" strokeLinecap="round" opacity="0.2" />
          </motion.g>
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
