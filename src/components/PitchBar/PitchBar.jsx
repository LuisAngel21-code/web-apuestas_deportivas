import { VSIcon } from '../Icons';
import './PitchBar.css';

export default function PitchBar({ homeProb, drawProb, awayProb, homeName, awayName }) {
  const total = homeProb + drawProb + awayProb;
  const homeWidth = (homeProb / total) * 100;
  const drawWidth = (drawProb / total) * 100;
  const awayWidth = (awayProb / total) * 100;

  const highest = Math.max(homeProb, drawProb, awayProb);
  const ballPosition = highest === homeProb
    ? homeWidth / 2
    : highest === drawProb
    ? homeWidth + drawWidth / 2
    : homeWidth + drawWidth + awayWidth / 2;

  return (
    <div className="pitch-bar-container">
      <div className="pitch-bar">
        <div
          className="pitch-segment home"
          style={{ width: `${homeWidth}%` }}
        >
          <span className="pitch-percent">{homeProb}%</span>
        </div>
        <div
          className="pitch-segment draw"
          style={{ width: `${drawWidth}%` }}
        >
          <span className="pitch-percent">{drawProb}%</span>
        </div>
        <div
          className="pitch-segment away"
          style={{ width: `${awayWidth}%` }}
        >
          <span className="pitch-percent">{awayProb}%</span>
        </div>

        <div className="pitch-lines">
          <div className="pitch-line midfield" />
          <div className="pitch-line left-box" />
          <div className="pitch-line right-box" />
        </div>

        <div
          className="pitch-ball"
          style={{ left: `${ballPosition}%` }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="6" fill="#00F593" stroke="#0A0E17" strokeWidth="1.5" />
            <path d="M7 2 V5 M9 3.5 L7.5 6 M11 7 H8 M9 10.5 L7.5 8 M7 12 V9 M5 10.5 L6.5 8 M3 7 H6 M5 3.5 L6.5 6" stroke="#0A0E17" strokeWidth="0.8" strokeLinecap="round" />
          </svg>
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
