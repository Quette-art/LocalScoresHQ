const sameMatchup = (game, teamA, teamB) => {
  const teams = new Set([game.team1, game.team2]);
  return teams.has(teamA) && teams.has(teamB);
};

const RESULTS = [
  { teams: ["Good Counsel", "Bergen Catholic"], scores: { "Good Counsel": 41, "Bergen Catholic": 39 } },
  { teams: ["Bullis", "Gilman"], scores: { Bullis: 29, Gilman: 23 } },
  { teams: ["Riverdale Baptist", "North East"], scores: { "Riverdale Baptist": 54, "North East": 6 } },
  { teams: ["St. Albans", "St. Paul's"], scores: { "St. Albans": 21, "St. Paul's": 13 } },
  { teams: ["Landon", "Boys Latin"], scores: { Landon: 21, "Boys Latin": 35 } },
  { teams: ["Laurel", "Stephen Decatur"], scores: { Laurel: 0, "Stephen Decatur": 34 } },
];

const aliases = {
  "Good Counsel": ["Good Counsel", "Our Lady of Good Counsel"],
  "Bergen Catholic": ["Bergen Catholic"],
  Bullis: ["Bullis"],
  Gilman: ["Gilman", "Gilman School"],
  "Riverdale Baptist": ["Riverdale Baptist"],
  "North East": ["North East"],
  "St. Albans": ["St. Albans", "Saint Albans"],
  "St. Paul's": ["St. Paul's", "St. Paul’s", "St. Pauls", "Saint Paul's"],
  Landon: ["Landon"],
  "Boys Latin": ["Boys Latin", "Boys' Latin", "Boys’ Latin"],
  Laurel: ["Laurel"],
  "Stephen Decatur": ["Stephen Decatur", "Decatur"],
};

const matches = (game, team) => aliases[team].includes(game.team1) || aliases[team].includes(game.team2);
const scoreFor = (name, result) => {
  for (const [team, score] of Object.entries(result.scores)) {
    if (aliases[team].includes(name)) return score;
  }
  return undefined;
};

export function applyFootballResultsSep4(games) {
  return games.map((game) => {
    const result = RESULTS.find(({ teams }) => matches(game, teams[0]) && matches(game, teams[1]));
    if (!result) return game;

    return {
      ...game,
      date: "2026-09-04",
      score1: scoreFor(game.team1, result),
      score2: scoreFor(game.team2, result),
      scheduleStatus: "Final",
      subjectToChange: false,
      verificationStatus: "Final",
      sourceTier: "Verified score source",
      notes: "Final score verified Sept. 5, 2026.",
      lastChecked: "2026-09-05",
    };
  });
}

export default applyFootballResultsSep4;
