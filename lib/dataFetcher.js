import axios from 'axios';

const API_FOOTBALL_BASE = 'https://v3.football.api-sports.io';

const headers = {
  'x-apisports-key': process.env.API_FOOTBALL_KEY || '',
};

export async function getLeagues() {
  const { data } = await axios.get(`${API_FOOTBALL_BASE}/leagues`, {
    headers,
    params: { current: 'true' },
  });
  return data.response || [];
}

export async function getFixtures(leagueId, season, status) {
  const params = { league: leagueId, season };
  if (status) params.status = status;
  const { data } = await axios.get(`${API_FOOTBALL_BASE}/fixtures`, {
    headers,
    params,
  });
  return data.response || [];
}

export async function getTeamStatistics(leagueId, season, teamId) {
  const { data } = await axios.get(`${API_FOOTBALL_BASE}/teams/statistics`, {
    headers,
    params: { league: leagueId, season, team: teamId },
  });
  return data.response || null;
}

export async function getTeamFixtures(teamId, last = 10) {
  const { data } = await axios.get(`${API_FOOTBALL_BASE}/fixtures`, {
    headers,
    params: { team: teamId, last },
  });
  return data.response || [];
}

export async function getHeadToHead(h2h) {
  const { data } = await axios.get(`${API_FOOTBALL_BASE}/fixtures/headtohead`, {
    headers,
    params: { h2h },
  });
  return data.response || [];
}

export async function getLeagueSeasons(leagueId) {
  const { data } = await axios.get(`${API_FOOTBALL_BASE}/leagues`, {
    headers,
    params: { id: leagueId },
  });
  const league = data.response?.[0];
  return league?.seasons || [];
}
