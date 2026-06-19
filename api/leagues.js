import { getCompetitions } from '../lib/dataFetcher.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const competitions = await getCompetitions();

    const filtered = competitions
      .filter((c) => c.currentSeason)
      .map((c) => ({
        id: c.code,
        name: c.name,
        type: c.type,
        code: c.code,
        logo: c.emblem || '',
        country: c.area?.name || '',
        countryFlag: '',
        season: c.currentSeason?.startDate?.slice(0, 4) || null,
        seasonStart: c.currentSeason?.startDate || null,
        seasonEnd: c.currentSeason?.endDate || null,
      }));

    res.status(200).json({ leagues: filtered });
  } catch (error) {
    console.error('Error fetching competitions:', error.message);
    res.status(500).json({ error: 'Failed to fetch competitions' });
  }
}
