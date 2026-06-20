import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header/Header';
import CompetitionSelector from './components/CompetitionSelector/CompetitionSelector';
import MatchList from './components/MatchList/MatchList';
import LoadingSkeleton from './components/LoadingSkeleton/LoadingSkeleton';
import { FootballIcon, GoalIcon } from './components/Icons';
import './App.css';

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

export default function App() {
  const [activeTab, setActiveTab] = useState('matches');
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [fixtures, setFixtures] = useState([]);
  const [predictions, setPredictions] = useState({});
  const [loading, setLoading] = useState(true);
  const [fixturesLoading, setFixturesLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchLeagues() {
      try {
        const res = await fetch('/api/leagues');
        const data = await res.json();
        if (data.leagues) {
          setLeagues(data.leagues);
          const worldCup = data.leagues.find(
            (l) => l.code === 'WC'
          );
          if (worldCup) setSelectedLeague(worldCup);
        }
      } catch (err) {
        console.error('Error fetching leagues:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchLeagues();
  }, []);

  const fetchFixtures = useCallback(async (league) => {
    if (!league) return;
    setFixturesLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/fixtures?league=${league.id}`
      );
      const data = await res.json();
      if (data.fixtures) {
        setFixtures(data.fixtures);
        if (data.predictions) {
          setPredictions(data.predictions);
        }
      } else {
        setFixtures([]);
      }
    } catch (err) {
      setError('Error al cargar partidos');
      console.error(err);
    } finally {
      setFixturesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedLeague) {
      fetchFixtures(selectedLeague);
    }
  }, [selectedLeague, fetchFixtures]);

  return (
    <div className="app">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="app-main">
        <div className="app-top-bar">
          <CompetitionSelector
            leagues={leagues}
            selected={selectedLeague}
            onSelect={setSelectedLeague}
            loading={loading}
          />
          {selectedLeague && (
            <div className="league-info">
              <GoalIcon size={16} color="#4A5060" />
              <span className="league-round">
                {selectedLeague.name} — {selectedLeague.season}
              </span>
            </div>
          )}
        </div>

        {activeTab === 'matches' && (
          <>
            {fixturesLoading ? (
              <LoadingSkeleton count={6} />
            ) : (
              <MatchList
                fixtures={fixtures}
                loading={fixturesLoading}
                error={error}
                predictions={predictions}
              />
            )}
          </>
        )}

        {activeTab === 'leagues' && (
          <div className="tab-content">
            <div className="leagues-grid">
              {leagues.slice(0, 50).map((league) => (
                <button
                  key={league.id}
                  className={`league-card ${selectedLeague?.id === league.id ? 'active' : ''}`}
                  onClick={() => setSelectedLeague(league)}
                >
                  {league.logo ? (
                    <img src={league.logo} alt="" className="league-card-logo" />
                  ) : (
                    <FootballIcon size={32} color="#4A5060" />
                  )}
                  <div className="league-card-info">
                    <span className="league-card-name">{league.name}</span>
                    <span className="league-card-country">{league.country}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'odds' && (
          <div className="tab-content">
            <div className="odds-placeholder">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#4A5060" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M7 15l3-6 3 6 3-6" />
                <path d="M7 12h6" />
              </svg>
              <p>Cuotas de Apuesta Total en tiempo real</p>
              <span>Disponible al seleccionar un partido</span>
            </div>
          </div>
        )}

        
      </main>

      <footer className="app-footer">
        <span>PITCH — Predicciones deportivas</span>
        <span className="footer-sep">|</span>
        <span>Datos via football-data.org y Odds API</span>
      </footer>
    </div>
  );
}
