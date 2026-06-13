import { StadiumIcon, TrophyIcon, OddsIcon, PitchIcon } from '../Icons';
import './Header.css';

export default function Header({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'matches', label: 'Partidos', icon: PitchIcon },
    { id: 'leagues', label: 'Ligas', icon: TrophyIcon },
    { id: 'odds', label: 'Cuotas', icon: OddsIcon },
  ];

  return (
    <header className="header">
      <div className="header-spotlight" />
      <div className="header-content">
        <div className="header-brand">
          <StadiumIcon size={28} />
          <h1 className="header-title">PITCH</h1>
        </div>
        <nav className="header-nav">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`header-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => onTabChange(tab.id)}
              >
                <Icon size={18} color={activeTab === tab.id ? '#00F593' : '#8A94A6'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
