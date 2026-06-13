import { getLeagues } from '../lib/dataFetcher.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const leagues = await getLeagues();

    const filtered = leagues
      .filter((l) => l.league.type === 'League' || l.league.type === 'Cup')
      .map((l) => ({
        id: l.league.id,
        name: l.league.name,
        type: l.league.type,
        logo: l.league.logo,
        country: l.country?.name || '',
        countryFlag: l.country?.flag || '',
        season: l.seasons?.[0]?.year || null,
        seasonStart: l.seasons?.[0]?.start || null,
        seasonEnd: l.seasons?.[0]?.end || null,
      }));

    res.status(200).json({ leagues: filtered });
  } catch (error) {
    console.error('Error fetching leagues:', error.message);
    res.status(500).json({ error: 'Failed to fetch leagues' });
  }
}
