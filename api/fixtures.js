import { getMatches, getFinishedMatches, getTeamMatchesBatch } from '../lib/dataFetcher.js';
import { calculatePrediction } from '../lib/poissonModel.js';
import { getOddsByFixture } from '../lib/oddsFetcher.js';
import { calculateAllValues, getBestValue, classifyValue } from '../lib/valueCalculator.js';

const ALL_STATUSES = ['SCHEDULED', 'TIMED', 'POSTPONED', 'FINISHED', 'IN_PLAY', 'PAUSED'];
const CACHE_TTL = 5 * 60 * 1000;
const cache = new Map();

function cacheGet(key) {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.ts < CACHE_TTL) return entry.data;
  return null;
}

function cacheSet(key, data) {
  cache.set(key, { data, ts: Date.now() });
  if (cache.size > 200) {
    const first = cache.keys().next().value;
    if (first) cache.delete(first);
  }
}

function cacheKey(league, date) {
  return `${league}:${date || 'all'}`;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { league, date } = req.query;

  if (!league) {
    return res.status(400).json({ error: 'league code is required' });
  }

  const cKey = cacheKey(league, date);
  const cached = cacheGet(cKey);
  if (cached) {
    return res.status(200).json(cached);
  }

  try {
    const matches = await getMatches(league, ALL_STATUSES.join(','));

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

    let teamMatchesMap = {};
    let leagueFinished = [];
    let rateLimited = false;

    if (teamIds.length > 0) {
      const leagueCacheKey = `league:${league}`;
      leagueFinished = cacheGet(leagueCacheKey);

      const uncachedTeams = [];
      for (const tid of teamIds) {
        const tCacheKey = `team:${league}:${tid}`;
        const td = cacheGet(tCacheKey);
        if (td) teamMatchesMap[tid] = td;
        else uncachedTeams.push(tid);
      }

      if (uncachedTeams.length > 0) {
        try {
          const freshTeams = await getTeamMatchesBatch(uncachedTeams, 10);
          for (const tid of uncachedTeams) {
            const data = freshTeams[tid] || [];
            teamMatchesMap[tid] = data;
            cacheSet(`team:${league}:${tid}`, data);
          }
        } catch (teamErr) {
          console.error('Team data fetch failed (rate limit?):', teamErr.message);
          rateLimited = true;
          for (const tid of uncachedTeams) {
            teamMatchesMap[tid] = [];
          }
        }
      }

      if (!leagueFinished) {
        try {
          leagueFinished = await getFinishedMatches(league);
          cacheSet(leagueCacheKey, leagueFinished);
        } catch (leagueErr) {
          console.error('League finished fetch failed:', leagueErr.message);
          leagueFinished = [];
        }
      }
    }

    const allFixtures = mapLeagueMatches(leagueFinished);
    const predictions = {};

    for (const match of validMatches) {
      const homeId = match.homeTeam.id;
      const awayId = match.awayTeam.id;

      const homeRecent = mapTeamMatches(teamMatchesMap[homeId] || [], homeId);
      const awayRecent = mapTeamMatches(teamMatchesMap[awayId] || [], awayId);

      let prediction;
      try {
        prediction = await calculatePrediction(homeId, awayId, homeRecent, awayRecent, allFixtures);
      } catch {
        prediction = { probabilities: { home: 33.3, draw: 33.3, away: 33.4 }, expectedGoals: { home: 1.25, away: 1.25 }, mostLikelyScore: { home: 1, away: 1 } };
      }

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

    const response = {
      fixtures: mapped,
      predictions,
      availableDates: allDates,
      _cached: true,
      _rateLimited: rateLimited || undefined,
    };

    cacheSet(cKey, response);

    res.status(200).json(response);
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
