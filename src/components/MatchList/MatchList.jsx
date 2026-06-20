import { useMemo } from 'react';
import MatchCard from '../MatchCard/MatchCard';
import FootballCharacter from '../FootballCharacter/FootballCharacter';
import { LoadingBall } from '../Icons';
import './MatchList.css';

export default function MatchList({
  fixtures,
  loading,
  error,
  predictions,
  searchQuery,
  availableDates,
  onGoToDate,
  hasLeague,
}) {
  const { finished, upcoming } = useMemo(() => {
    if (!fixtures) return { finished: [], upcoming: [] };
    return {
      finished: fixtures.filter((f) => f.status === 'FINISHED'),
      upcoming: fixtures.filter((f) => f.status !== 'FINISHED'),
    };
  }, [fixtures]);

  if (loading) {
    return (
      <div className="match-list-empty">
        <FootballCharacter type="loading" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="match-list-empty">
        <FootballCharacter type="error" />
        <p className="match-list-error">{error}</p>
      </div>
    );
  }

  if (!hasLeague) {
    return (
      <div className="match-list-empty">
        <FootballCharacter type="empty-league" />
      </div>
    );
  }

  if (!fixtures || fixtures.length === 0) {
    const nextDate = availableDates?.[0];
    return (
      <div className="match-list-empty">
        {searchQuery ? (
          <FootballCharacter type="empty-search" />
        ) : (
          <FootballCharacter
            type="empty-date"
            nextDate={nextDate}
            onGoToDate={onGoToDate}
          />
        )}
      </div>
    );
  }

  const getPrediction = (fixtureId) => {
    return predictions?.[fixtureId] || null;
  };

  const renderMatch = (fixture, i) => (
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
  );

  return (
    <div className="match-list">
      {finished.length > 0 && (
        <div className="match-list-section">
          <div className="match-list-section-header">
            <span className="section-icon finished-icon" />
            <span className="section-label">Finalizados</span>
            <span className="section-count">{finished.length}</span>
          </div>
          <div className="match-list-grid">
            {finished.map((f, i) => renderMatch(f, i))}
          </div>
        </div>
      )}

      {upcoming.length > 0 && (
        <div className="match-list-section">
          <div className="match-list-section-header">
            <span className="section-icon upcoming-icon" />
            <span className="section-label">Proximos</span>
            <span className="section-count">{upcoming.length}</span>
          </div>
          <div className="match-list-grid">
            {upcoming.map((f, i) => renderMatch(f, i))}
          </div>
        </div>
      )}
    </div>
  );
}
