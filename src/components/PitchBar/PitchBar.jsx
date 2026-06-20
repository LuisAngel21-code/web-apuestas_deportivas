import { VSIcon } from '../Icons';
import './PitchBar.css';

export default function PitchBar({ homeProb, drawProb, awayProb, homeName, awayName }) {
  const total = homeProb + drawProb + awayProb;
  const homeW = (homeProb / total) * 100;
  const drawW = (drawProb / total) * 100;
  const awayW = (awayProb / total) * 100;

  const homePos = homeW / 2;
  const drawPos = homeW + drawW / 2;
  const awayPos = homeW + drawW + awayW / 2;

  return (
    <div className="pitch-bar-container">
      <div className="pitch-bar">
        <div className="pitch-segment home" style={{ width: `${homeW}%` }} />
        <div className="pitch-segment draw" style={{ width: `${drawW}%` }} />
        <div className="pitch-segment away" style={{ width: `${awayW}%` }} />

        <div className="pitch-lines">
          <div className="pitch-line midfield" />
          <div className="pitch-line left-box" />
          <div className="pitch-line right-box" />
        </div>

        <div className="pitch-percentages">
          <span className="pitch-pct" style={{ left: `${homePos}%` }}>{homeProb}%</span>
          <span className="pitch-pct" style={{ left: `${drawPos}%` }}>{drawProb}%</span>
          <span className="pitch-pct" style={{ left: `${awayPos}%` }}>{awayProb}%</span>
        </div>
      </div>

      <div className="pitch-labels">
        <span className="pitch-team home">{homeName}</span>
        <span className="pitch-result">
          <VSIcon size={12} color="#4A5060" />
        </span>
        <span className="pitch-team away">{awayName}</span>
      </div>
    </div>
  );
}
