import axios from 'axios';

const ODDS_API_BASE = 'https://api.odds-api.io/v1';

export async function getOddsByFixture(homeTeam, awayTeam, date) {
  const apiKey = process.env.ODDS_API_KEY;
  if (!apiKey) return null;

  try {
    const { data } = await axios.get(`${ODDS_API_BASE}/odds`, {
      params: {
        apiKey,
        bookmaker: 'apuestatotal',
        sport: 'football',
        event: `${homeTeam} vs ${awayTeam}`,
      },
      timeout: 5000,
    });
    return data;
  } catch {
    return null;
  }
}

export async function getUpcomingOdds() {
  const apiKey = process.env.ODDS_API_KEY;
  if (!apiKey) return null;

  try {
    const { data } = await axios.get(`${ODDS_API_BASE}/odds`, {
      params: {
        apiKey,
        bookmaker: 'apuestatotal',
        sport: 'football',
      },
      timeout: 5000,
    });
    return data;
  } catch {
    return null;
  }
}
