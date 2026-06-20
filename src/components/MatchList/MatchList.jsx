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
