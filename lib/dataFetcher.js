import axios from 'axios';

const API_BASE = 'https://api.football-data.org/v4';

function getHeaders() {
  return {
    'X-Auth-Token': process.env.API_FOOTBALL_KEY || '',
  };
}

export async function getCompetitions() {
  const { data } = await axios.get(`${API_BASE}/competitions`, {
    headers: getHeaders(),
  });
  return data.competitions || [];
}

export async function getMatches(competitionCode, status) {
  const params = {};
  if (status) params.status = status;
  const { data } = await axios.get(`${API_BASE}/competitions/${competitionCode}/matches`, {
    headers: getHeaders(),
    params,
  });
  return data.matches || [];
}

export async function getFinishedMatches(competitionCode) {
  const { data } = await axios.get(`${API_BASE}/competitions/${competitionCode}/matches`, {
    headers: getHeaders(),
    params: { status: 'FINISHED' },
  });
  return data.matches || [];
}

export async function getTeamMatches(teamId, limit = 10) {
  const { data } = await axios.get(`${API_BASE}/teams/${teamId}/matches`, {
    headers: getHeaders(),
    params: { limit },
  });
  return data.matches || [];
}

export async function getTeamFinishedMatches(teamId, limit = 10) {
  const { data } = await axios.get(`${API_BASE}/teams/${teamId}/matches`, {
    headers: getHeaders(),
    params: { limit, status: 'FINISHED' },
  });
  return data.matches || [];
}

export async function getTeamMatchesBatch(teamIds, limit = 10) {
  const results = {};
  const batchSize = 3;
  const delayMs = 6000;

  for (let i = 0; i < teamIds.length; i += batchSize) {
    const batch = teamIds.slice(i, i + batchSize);
    const promises = batch.map(async (teamId) => {
      try {
        const matches = await getTeamFinishedMatches(teamId, limit);
        results[teamId] = matches;
      } catch (err) {
        console.error(`Error fetching team ${teamId}:`, err.message);
        results[teamId] = [];
      }
    });
    await Promise.all(promises);
    if (i + batchSize < teamIds.length) {
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }

  return results;
}
