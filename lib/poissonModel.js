function factorial(n) {
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

function poissonProbability(lambda, k) {
  return (Math.exp(-lambda) * Math.pow(lambda, k)) / factorial(k);
}

function calculateGoalExpectation(attackStrength, defenseStrength, avgGoals) {
  return attackStrength * defenseStrength * avgGoals;
}

function calculateTeamStrengths(fixtures, teamId, leagueAvgGoals) {
  let goalsFor = 0;
  let goalsAgainst = 0;
  let matches = 0;

  for (const fixture of fixtures) {
    const isHome = fixture.teams.home.id === teamId;
    const gf = isHome ? fixture.goals.home : fixture.goals.away;
    const ga = isHome ? fixture.goals.away : fixture.goals.home;

    if (gf !== null && ga !== null) {
      goalsFor += gf;
      goalsAgainst += ga;
      matches++;
    }
  }

  if (matches === 0) return { attack: 1, defense: 1 };

  const avgGoalsFor = goalsFor / matches;
  const avgGoalsAgainst = goalsAgainst / matches;

  return {
    attack: leagueAvgGoals > 0 ? avgGoalsFor / leagueAvgGoals : 1,
    defense: leagueAvgGoals > 0 ? avgGoalsAgainst / leagueAvgGoals : 1,
  };
}

function calculateLeagueAvgGoals(allFixtures) {
  let totalGoals = 0;
  let matches = 0;

  for (const f of allFixtures) {
    if (f.goals.home !== null && f.goals.away !== null) {
      totalGoals += f.goals.home + f.goals.away;
      matches++;
    }
  }

  return matches > 0 ? totalGoals / matches : 2.5;
}

export function predictMatch(teamAStats, teamBStats, leagueAvgGoals) {
  const homeAttack = teamAStats.attack;
  const homeDefense = teamAStats.defense;
  const awayAttack = teamBStats.attack;
  const awayDefense = teamBStats.defense;

  const expectedHomeGoals = calculateGoalExpectation(homeAttack, awayDefense, leagueAvgGoals);
  const expectedAwayGoals = calculateGoalExpectation(awayAttack, homeDefense, leagueAvgGoals);

  const maxGoals = 6;
  let homeWin = 0;
  let draw = 0;
  let awayWin = 0;

  const matrix = [];

  for (let i = 0; i <= maxGoals; i++) {
    matrix[i] = [];
    for (let j = 0; j <= maxGoals; j++) {
      const prob = poissonProbability(expectedHomeGoals, i) *
                   poissonProbability(expectedAwayGoals, j);
      matrix[i][j] = prob;

      if (i > j) homeWin += prob;
      else if (i === j) draw += prob;
      else awayWin += prob;
    }
  }

  return {
    probabilities: {
      home: parseFloat((homeWin * 100).toFixed(1)),
      draw: parseFloat((draw * 100).toFixed(1)),
      away: parseFloat((awayWin * 100).toFixed(1)),
    },
    expectedGoals: {
      home: parseFloat(expectedHomeGoals.toFixed(2)),
      away: parseFloat(expectedAwayGoals.toFixed(2)),
    },
    scoreMatrix: matrix,
    mostLikelyScore: findMostLikelyScore(matrix),
  };
}

function findMostLikelyScore(matrix) {
  let max = 0;
  let score = { home: 0, away: 0 };
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] > max) {
        max = matrix[i][j];
        score = { home: i, away: j };
      }
    }
  }
  return score;
}

export async function calculatePrediction(homeTeamId, awayTeamId, homeFixtures, awayFixtures, allFixtures) {
  const leagueAvgGoals = calculateLeagueAvgGoals(allFixtures);

  const homeStats = calculateTeamStrengths(homeFixtures, homeTeamId, leagueAvgGoals);
  const awayStats = calculateTeamStrengths(awayFixtures, awayTeamId, leagueAvgGoals);

  return predictMatch(homeStats, awayStats, leagueAvgGoals);
}
