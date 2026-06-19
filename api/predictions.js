import {
  getMatches,
  getTeamFinishedMatches,
  getFinishedMatches,
} from '../lib/dataFetcher.js';
import { calculatePrediction } from '../lib/poissonModel.js';
import { getOddsByFixture } from '../lib/oddsFetcher.js';
import { calculateAllValues, getBestValue, classifyValue } from '../lib/valueCalculator.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { fixture, league } = req.query;

  if (!fixture || !league) {
    return res.status(400).json({ error: 'fixture id and league are required' });
  }

  try {
    const matches = await getMatches(league, 'SCHEDULED,TIMED,POSTPONED');
    const match = matches.find((m) => m.id === Number(fixture));

    if (!match) {
      return res.status(404).json({ error: 'Fixture not found' });
    }

    const homeId = match.homeTeam.id;
    const awayId = match.awayTeam.id;

    const [homeRecent, awayRecent, leagueFixtures] = await Promise.all([
      getTeamFinishedMatches(homeId, 10),
      getTeamFinishedMatches(awayId, 10),
      getFinishedMatches(league),
    ]);

    const prediction = await calculatePrediction(
      homeId,
      awayId,
      mapTeamMatches(homeRecent, homeId),
      mapTeamMatches(awayRecent, awayId),
      mapLeagueMatches(leagueFixtures)
    );

    const oddsData = await getOddsByFixture(
      match.homeTeam.name,
      match.awayTeam.name,
      match.utcDate
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
        id: match.id,
        date: match.utcDate,
        venue: match.venue?.name || '',
      },
      homeTeam: {
        id: match.homeTeam.id,
        name: match.homeTeam.name,
        logo: match.homeTeam.crest || '',
      },
      awayTeam: {
        id: match.awayTeam.id,
        name: match.awayTeam.name,
        logo: match.awayTeam.crest || '',
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

function mapTeamMatches(matches, teamId) {
  return matches
    .filter((m) => m.score?.fullTime?.home !== null && m.score?.fullTime?.away !== null)
    .map((m) => ({
      teams: {
        home: { id: m.homeTeam.id },
        away: { id: m.awayTeam.id },
      },
      goals: {
        home: m.score.fullTime.home,
        away: m.score.fullTime.away,
      },
    }));
}

function mapLeagueMatches(matches) {
  return matches
    .filter((m) => m.score?.fullTime?.home !== null && m.score?.fullTime?.away !== null)
    .map((m) => ({
      teams: {
        home: { id: m.homeTeam.id },
        away: { id: m.awayTeam.id },
      },
      goals: {
        home: m.score.fullTime.home,
        away: m.score.fullTime.away,
      },
    }));
}
