import {
  getFixtures,
  getTeamFixtures,
} from '../lib/dataFetcher.js';
import { calculatePrediction } from '../lib/poissonModel.js';
import { getOddsByFixture } from '../lib/oddsFetcher.js';
import { calculateAllValues, getBestValue, classifyValue } from '../lib/valueCalculator.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { fixture, league, season, homeTeam, awayTeam, homeName, awayName, date } = req.query;

  if (!fixture) {
    return res.status(400).json({ error: 'fixture id is required' });
  }

  try {
    const fixtures = await getFixtures(league, season, 'NS');
    const match = fixtures.find((f) => f.fixture.id === Number(fixture));

    if (!match) {
      return res.status(404).json({ error: 'Fixture not found' });
    }

    const homeId = match.teams.home.id;
    const awayId = match.teams.away.id;

    const [homeRecent, awayRecent, leagueFixtures] = await Promise.all([
      getTeamFixtures(homeId, 10),
      getTeamFixtures(awayId, 10),
      getFixtures(league, season, 'FT'),
    ]);

    const prediction = await calculatePrediction(
      homeId,
      awayId,
      homeRecent,
      awayRecent,
      leagueFixtures
    );

    const oddsData = await getOddsByFixture(
      match.teams.home.name,
      match.teams.away.name,
      match.fixture.date
    );

    const apuestaTotalOdds = oddsData?.bookmakers?.['Apuesta Total'];
    let odds = null;
    if (apuestaTotalOdds) {
      const moneyline = apuestaTotalOdds.find((m) => m.name === 'Moneyline');
      if (moneyline?.odds?.[0]) {
        odds = {
          home: parseFloat(moneyline.odds[0].home),
          draw: parseFloat(moneyline.odds[0].draw),
          away: parseFloat(moneyline.odds[0].away),
        };
      }
    }

    const values = calculateAllValues(prediction.probabilities, odds);
    const bestValue = getBestValue(values);

    res.status(200).json({
      fixture: {
        id: match.fixture.id,
        date: match.fixture.date,
        venue: match.fixture.venue?.name || '',
      },
      homeTeam: {
        id: match.teams.home.id,
        name: match.teams.home.name,
        logo: match.teams.home.logo,
      },
      awayTeam: {
        id: match.teams.away.id,
        name: match.teams.away.name,
        logo: match.teams.away.logo,
      },
      prediction,
      odds,
      values,
      bestValue: bestValue
        ? {
            market: bestValue.market,
            label: bestValue.label,
            odd: bestValue.odd,
            value: bestValue.value,
            classification: classifyValue(bestValue.value),
            probability: bestValue.probability,
          }
        : null,
    });
  } catch (error) {
    console.error('Error calculating prediction:', error.message);
    res.status(500).json({ error: 'Failed to calculate prediction' });
  }
}
