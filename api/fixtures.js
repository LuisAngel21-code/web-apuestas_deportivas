import { getMatches } from '../lib/dataFetcher.js';

const UPCOMING_STATUSES = ['SCHEDULED', 'TIMED', 'POSTPONED'];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { league } = req.query;

  if (!league) {
    return res.status(400).json({ error: 'league code is required' });
  }

  try {
    const matches = await getMatches(league, UPCOMING_STATUSES.join(','));

    const mapped = matches.map((m) => ({
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
    }));

    res.status(200).json({ fixtures: mapped });
  } catch (error) {
    console.error('Error fetching fixtures:', error.message);
    res.status(500).json({ error: 'Failed to fetch fixtures' });
  }
}
