import { useState } from 'react';
import { MoneyIcon } from '../Icons';
import './BetCalculator.css';

const MARKET_LABELS = { home: 'Local (1)', draw: 'Empate (X)', away: 'Visita (2)' };

export default function BetCalculator({ odds, probabilities }) {
  const [amount, setAmount] = useState(50);
  const [selected, setSelected] = useState('home');

  if (!odds) return null;

  const odd = odds[selected];
  const prob = probabilities?.[selected];
  const potentialWin = amount * odd;
  const profit = potentialWin - amount;

  return (
    <div className="bet-calculator">
      <div className="calculator-header">
        <MoneyIcon size={16} color="#00F593" />
        <span className="calculator-title">Calculadora de ganancia</span>
      </div>

      <div className="calculator-markets">
        {['home', 'draw', 'away'].map((key) => (
          <button
            key={key}
            className={`calc-market ${selected === key ? 'active' : ''}`}
            onClick={() => setSelected(key)}
          >
            <span className="calc-market-label">{MARKET_LABELS[key]}</span>
            <span className="calc-market-odd">{odds[key]}</span>
          </button>
        ))}
      </div>

      <div className="calculator-input-row">
        <span className="calc-input-label">Monto</span>
        <div className="calc-input-group">
          <span className="calc-currency">S/</span>
          <input
            type="number"
            className="calc-input"
            value={amount}
            onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
            min={0}
          />
        </div>
      </div>

      <div className="calculator-results">
        <div className="calc-result">
          <span className="calc-result-label">Ganancia potencial</span>
          <span className="calc-result-value win">S/ {potentialWin.toFixed(2)}</span>
        </div>
        <div className="calc-result">
          <span className="calc-result-label">Ganancia neta</span>
          <span className="calc-result-value profit">S/ {profit.toFixed(2)}</span>
        </div>
        {prob && (
          <div className="calc-result">
            <span className="calc-result-label">Probabilidad modelo</span>
            <span className="calc-result-value">{prob}%</span>
          </div>
        )}
      </div>
    </div>
  );
}
