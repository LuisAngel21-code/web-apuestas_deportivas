import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { SearchIcon, ChevronDown, TrophyIcon } from '../Icons';
import './CompetitionSelector.css';

export default function CompetitionSelector({ leagues, selected, onSelect, loading }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const filtered = leagues?.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.country.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div className="competition-selector" ref={ref}>
      <button className="selector-trigger" onClick={() => setOpen(!open)}>
        <TrophyIcon size={18} color="#00F593" />
        <span>{selected ? selected.name : 'Seleccionar liga'}</span>
        <ChevronDown size={16} color="#8A94A6" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="selector-dropdown"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            <div className="selector-search">
              <SearchIcon size={16} />
              <input
                type="text"
                placeholder="Buscar liga o pais..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </div>
            <div className="selector-list">
              {loading ? (
                <div className="selector-loading">Cargando ligas...</div>
              ) : filtered.length === 0 ? (
                <div className="selector-empty">Sin resultados</div>
              ) : (
                filtered.map((league) => (
                  <button
                    key={league.id}
                    className={`selector-item ${selected?.id === league.id ? 'active' : ''}`}
                    onClick={() => {
                      onSelect(league);
                      setOpen(false);
                      setSearch('');
                    }}
                  >
                    {league.logo ? (
                      <img src={league.logo} alt="" className="selector-logo" />
                    ) : (
                      <TrophyIcon size={20} color="#4A5060" />
                    )}
                    <div className="selector-info">
                      <span className="selector-name">{league.name}</span>
                      <span className="selector-country">{league.country}</span>
                    </div>
                    <span className="selector-season">{league.season}</span>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
