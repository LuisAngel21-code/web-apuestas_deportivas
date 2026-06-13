import { AttackIcon, DefenseIcon } from '../Icons';
import './TeamStats.css';

function StatBar({ label, value, icon: Icon, color }) {
  return (
    <div className="team-stat-row">
      <div className="stat-label-group">
        <Icon size={14} color={color} />
        <span className="stat-label">{label}</span>
      </div>
      <div className="stat-bar-track">
        <div
          className="stat-bar-fill"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
      <span className="stat-value">{value}</span>
    </div>
  );
}

export default function TeamStats({ homeName, awayName, homeAttack, homeDefense, awayAttack, awayDefense }) {
  return (
    <div className="team-stats">
      <div className="stats-header">
        <span className="stats-title">Analisis tactico</span>
      </div>

      <div className="stats-columns">
        <div className="stats-team home">
          <span className="stats-team-name">{homeName}</span>
          <StatBar label="Ataque" value={homeAttack} icon={AttackIcon} color="#00F593" />
          <StatBar label="Defensa" value={homeDefense} icon={DefenseIcon} color="#F0B90B" />
        </div>

        <div className="stats-divider">
          <span>VS</span>
        </div>

        <div className="stats-team away">
          <span className="stats-team-name">{awayName}</span>
          <StatBar label="Ataque" value={awayAttack} icon={AttackIcon} color="#00F593" />
          <StatBar label="Defensa" value={awayDefense} icon={DefenseIcon} color="#F0B90B" />
        </div>
      </div>
    </div>
  );
}
