import { getFixtures } from '../lib/dataFetcher.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { league, season, status, date } = req.query;

  if (!league || !season) {
    return res.status(400).json({ error: 'league and season are required' });
  }

  try {
    const fixtures = await getFixtures(league, season, status || 'NS');

    const mapped = fixtures.map((f) => ({
      id: f.fixture.id,
      date: f.fixture.date,
      timestamp: f.fixture.timestamp,
      status: f.fixture.status,
      venue: f.fixture.venue,
      league: {
        id: f.league.id,
        name: f.league.name,
        round: f.league.round,
        logo: f.league.logo,
      },
      homeTeam: {
        id: f.teams.home.id,
        name: f.teams.home.name,
        logo: f.teams.home.logo,
      },
      awayTeam: {
        id: f.teams.away.id,
        name: f.teams.away.name,
        logo: f.teams.away.logo,
      },
      goals: f.goals,
      score: f.score,
    }));

    res.status(200).json({ fixtures: mapped });
  } catch (error) {
    console.error('Error fetching fixtures:', error.message);
    res.status(500).json({ error: 'Failed to fetch fixtures' });
  }
}
