import { getMatches, getFinishedMatches, getTeamMatchesBatch } from '../lib/dataFetcher.js';
import { calculatePrediction } from '../lib/poissonModel.js';
import { getOddsByFixture } from '../lib/oddsFetcher.js';
import { calculateAllValues, getBestValue, classifyValue } from '../lib/valueCalculator.js';

const UPCOMING_STATUSES = ['SCHEDULED', 'TIMED', 'POSTPONED'];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { league, date } = req.query;

  if (!league) {
    return res.status(400).json({ error: 'league code is required' });
  }

  try {
    const matches = await getMatches(league, UPCOMING_STATUSES.join(','));

    const dateFiltered = date
      ? matches.filter((m) => m.utcDate?.startsWith(date))
      : matches;

    const validMatches = dateFiltered.filter(
      (m) => m.homeTeam?.id && m.awayTeam?.id
    );

    const teamIds = [
      ...new Set(validMatches.flatMap((m) => [m.homeTeam.id, m.awayTeam.id])),
    ];

    const allDates = [
      ...new Set(
        matches
          .filter((m) => m.homeTeam?.id && m.awayTeam?.id)
          .map((m) => m.utcDate?.split('T')[0])
          .filter(Boolean)
      ),
    ].sort();

    const [teamMatchesMap, leagueFinished] = await Promise.all([
      getTeamMatchesBatch(teamIds, 10),
      getFinishedMatches(league),
    ]);

    const allFixtures = mapLeagueMatches(leagueFinished);
    const predictions = {};

    for (const match of validMatches) {
      const homeId = match.homeTeam.id;
      const awayId = match.awayTeam.id;

      const homeRecent = mapTeamMatches(teamMatchesMap[homeId] || [], homeId);
      const awayRecent = mapTeamMatches(teamMatchesMap[awayId] || [], awayId);

      const prediction = await calculatePrediction(
        homeId,
        awayId,
        homeRecent,
        awayRecent,
        allFixtures
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

      predictions[match.id] = {
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
      };
    }

    const mapped = dateFiltered.map((m) => ({
      id: m.id,
      date: m.utcDate,
      timestamp: new Date(m.utcDate).getTime(),
      status: m.status,
      venue: m.venue || { name: '' },
      league: {
        id: m.competition?.id,
        name: m.competition?.name,
        round: m.matchday || '',
        logo: m.competition?.emblem || '',
      },
      homeTeam: {
        id: m.homeTeam?.id,
        name: m.homeTeam?.name,
        logo: m.homeTeam?.crest || '',
      },
      awayTeam: {
        id: m.awayTeam?.id,
        name: m.awayTeam?.name,
        logo: m.awayTeam?.crest || '',
      },
      goals: {
        home: m.score?.fullTime?.home,
        away: m.score?.fullTime?.away,
      },
      score: m.score,
    })).filter((f) => f.homeTeam.id && f.awayTeam.id);

    res.status(200).json({
      fixtures: mapped,
      predictions,
      availableDates: allDates,
    });
  } catch (error) {
    console.error('Error fetching fixtures:', error.message);
    res.status(500).json({ error: 'Failed to fetch fixtures' });
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
