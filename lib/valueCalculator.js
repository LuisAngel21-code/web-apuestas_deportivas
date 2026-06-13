export function calculateValue(probabilityPercent, decimalOdds) {
  if (!decimalOdds || decimalOdds <= 0) return null;

  const probDecimal = probabilityPercent / 100;
  const expectedValue = (probDecimal * decimalOdds) - 1;

  return {
    value: parseFloat((expectedValue * 100).toFixed(2)),
    fairOdds: parseFloat((1 / probDecimal).toFixed(2)),
    hasValue: expectedValue > 0,
  };
}

export function classifyValue(valuePercent) {
  if (valuePercent === null || valuePercent === undefined) return 'none';
  if (valuePercent > 10) return 'high';
  if (valuePercent > 5) return 'medium';
  if (valuePercent > 0) return 'low';
  return 'none';
}

export function calculateAllValues(probabilities, odds) {
  if (!odds) return null;

  const result = {};
  const markets = [
    { key: 'home', label: '1', probKey: 'home' },
    { key: 'draw', label: 'X', probKey: 'draw' },
    { key: 'away', label: '2', probKey: 'away' },
  ];

  for (const market of markets) {
    const prob = probabilities[market.probKey];
    const odd = odds[market.key];

    if (prob && odd) {
      result[market.key] = {
        ...calculateValue(prob, odd),
        label: market.label,
        odd,
        probability: prob,
      };
    }
  }

  return result;
}

export function getBestValue(values) {
  if (!values) return null;

  let best = null;
  for (const key of ['home', 'draw', 'away']) {
    if (values[key]?.hasValue) {
      if (!best || values[key].value > best.value) {
        best = { market: key, ...values[key] };
      }
    }
  }
  return best;
}
