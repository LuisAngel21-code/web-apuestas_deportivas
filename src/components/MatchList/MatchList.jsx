import MatchCard from '../MatchCard/MatchCard';
import { LoadingBall } from '../Icons';
import './MatchList.css';

export default function MatchList({ fixtures, loading, error, predictions }) {
  if (loading) {
    return (
      <div className="match-list-empty">
        <LoadingBall size={40} />
        <p className="match-list-text">Cargando partidos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="match-list-empty">
        <p className="match-list-error">{error}</p>
      </div>
    );
  }

  if (!fixtures || fixtures.length === 0) {
    return (
      <div className="match-list-empty">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#4A5060" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2v20" />
          <path d="M2 12h20" />
        </svg>
        <p className="match-list-text">No hay partidos disponibles</p>
        <p className="match-list-sub">Selecciona una liga para ver los proximos encuentros</p>
      </div>
    );
  }

  const getPrediction = (fixtureId) => {
    return predictions?.[fixtureId] || null;
  };

  return (
    <div className="match-list">
      <div className="match-list-grid">
        {fixtures.map((fixture, i) => (
          <MatchCard
            key={fixture.id}
            match={{
              ...fixture,
              prediction: getPrediction(fixture.id)?.prediction || null,
              odds: getPrediction(fixture.id)?.odds || null,
              values: getPrediction(fixture.id)?.values || null,
              bestValue: getPrediction(fixture.id)?.bestValue || null,
            }}
            index={i}
          />
        ))}
      </div>
    </div>
  );
}
