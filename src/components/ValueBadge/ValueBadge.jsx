import { TrendingUp } from '../Icons';
import './ValueBadge.css';

export default function ValueBadge({ label, value, classification }) {
  const classMap = {
    high: 'value-high',
    medium: 'value-medium',
    low: 'value-low',
    none: 'value-none',
  };

  const colorMap = {
    high: '#00F593',
    medium: '#F0B90B',
    low: '#FF1744',
    none: '#4A5060',
  };

  return (
    <div className={`value-badge ${classMap[classification] || 'value-none'}`}>
      <TrendingUp size={14} color={colorMap[classification] || colorMap.none} />
      <span className="value-label">{label}</span>
      <span className="value-number">+{value}%</span>
    </div>
  );
}
