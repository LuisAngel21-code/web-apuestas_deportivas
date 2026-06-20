import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import './BallAnimation.css';

export default function BallAnimation() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="ball-animation-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            className="ball-animation-ball"
            initial={{ y: -200, rotate: 0 }}
            animate={{ y: [0, 120, 80, 140, 100, 160, 120], rotate: [0, 720, 1080] }}
            transition={{ duration: 1.8, ease: 'easeInOut' }}
          >
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <circle cx="30" cy="30" r="28" fill="#0A0E17" stroke="#00F593" strokeWidth="2" />
              <path d="M30 4V56" stroke="#00F593" strokeWidth="1.5" opacity="0.6" />
              <path d="M4 30H56" stroke="#00F593" strokeWidth="1.5" opacity="0.6" />
              <path d="M11.72 11.72L48.28 48.28" stroke="#00F593" strokeWidth="1.5" opacity="0.6" />
              <path d="M48.28 11.72L11.72 48.28" stroke="#00F593" strokeWidth="1.5" opacity="0.6" />
              <circle cx="30" cy="30" r="10" fill="none" stroke="#00F593" strokeWidth="1.5" />
              <polygon points="30,8 34,18 44,18 36,24 38,34 30,28 22,34 24,24 16,18 26,18" fill="#00F593" opacity="0.4" />
            </svg>
          </motion.div>
          <motion.p
            className="ball-animation-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            PITCH
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
