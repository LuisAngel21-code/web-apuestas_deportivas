import { getUpcomingOdds } from '../lib/oddsFetcher.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const oddsData = await getUpcomingOdds();

    if (!oddsData) {
      return res.status(200).json({
        odds: [],
        message: 'No odds data available. Check API key configuration.',
      });
    }

    res.status(200).json({ odds: oddsData });
  } catch (error) {
    console.error('Error fetching odds:', error.message);
    res.status(500).json({ error: 'Failed to fetch odds' });
  }
}
