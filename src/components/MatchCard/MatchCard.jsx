import { motion } from 'framer-motion';
import { useState } from 'react';
import PitchBar from '../PitchBar/PitchBar';
import ValueBadge from '../ValueBadge/ValueBadge';
import BetCalculator from '../BetCalculator/BetCalculator';
import TeamStats from '../TeamStats/TeamStats';
import { VSIcon, CalendarIcon } from '../Icons';
import './MatchCard.css';

export default function MatchCard({ match, index }) {
  const [expanded, setExpanded] = useState(false);

  if (!match) return null;

  const { homeTeam, awayTeam, prediction, odds, values, bestValue, date } = match;
  const matchDate = new Date(date);
  const formattedDate = matchDate.toLocaleDateString('es-PE', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <motion.div
      className="match-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="match-card-header">
        <div className="match-teams">
          <div className="match-team home">
            {homeTeam?.logo && (
              <img src={homeTeam.logo} alt="" className="team-logo" />
            )}
            <span className="team-name">{homeTeam?.name}</span>
          </div>

          <div className="match-vs">
            <VSIcon size={20} color="#4A5060" />
          </div>

          <div className="match-team away">
            {awayTeam?.logo && (
              <img src={awayTeam.logo} alt="" className="team-logo" />
            )}
            <span className="team-name">{awayTeam?.name}</span>
          </div>
        </div>

        <div className="match-meta">
          <CalendarIcon size={14} color="#4A5060" />
          <span className="match-date">{formattedDate}</span>
        </div>
      </div>

      {prediction && (
        <div className="match-card-body">
          <PitchBar
            homeProb={prediction.probabilities.home}
            drawProb={prediction.probabilities.draw}
            awayProb={prediction.probabilities.away}
            homeName={homeTeam?.name}
            awayName={awayTeam?.name}
          />

          <div className="match-probabilities">
            <div className="prob-item home">
              <span className="prob-label">1</span>
              <span className="prob-value">{prediction.probabilities.home}%</span>
            </div>
            <div className="prob-item draw">
              <span className="prob-label">X</span>
              <span className="prob-value">{prediction.probabilities.draw}%</span>
            </div>
            <div className="prob-item away">
              <span className="prob-label">2</span>
              <span className="prob-value">{prediction.probabilities.away}%</span>
            </div>
          </div>

          <div className="match-expected-goals">
            <span>{prediction.expectedGoals.home} - {prediction.expectedGoals.away} goles esp.</span>
          </div>

          {odds && (
            <div className="match-odds-row">
              <span className="odds-label">Apuesta Total</span>
              <div className="odds-values">
                <span className="odd-value">1: {odds.home}</span>
                <span className="odd-value">X: {odds.draw}</span>
                <span className="odd-value">2: {odds.away}</span>
              </div>
            </div>
          )}

          {values && (
            <div className="match-values-row">
              {['home', 'draw', 'away'].map((key) => {
                const v = values[key];
                if (!v || !v.hasValue) return null;
                return (
                  <ValueBadge
                    key={key}
                    label={v.label}
                    value={v.value}
                    classification={v.value > 10 ? 'high' : v.value > 5 ? 'medium' : 'low'}
                  />
                );
              })}
            </div>
          )}

          {bestValue && (
            <div className="match-best-value">
              <span>Mejor valor: {bestValue.label} a {bestValue.odd} ({bestValue.value}%)</span>
            </div>
          )}
        </div>
      )}

      {expanded && prediction && (
        <motion.div
          className="match-card-expanded"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <TeamStats
            homeName={homeTeam?.name}
            awayName={awayTeam?.name}
            homeAttack={80}
            homeDefense={65}
            awayAttack={45}
            awayDefense={52}
          />

          {odds && (
            <BetCalculator
              odds={odds}
              probabilities={prediction.probabilities}
            />
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
