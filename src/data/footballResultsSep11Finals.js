const RESULTS = [
  {
    teams: ["Georgetown Prep", "Loyola Blakefield"],
    scores: { "Georgetown Prep": 14, "Loyola Blakefield": 53 },
  },
  {
    teams: ["Woodberry Forest", "St. Mary’s Ryken"],
    scores: { "Woodberry Forest": 24, "St. Mary’s Ryken": 21 },
  },
  {
    teams: ["Wise", "Laurel"],
    scores: { Wise: 53, Laurel: 6 },
  },
  {
    teams: ["Suitland", "Northwestern"],
    scores: { Suitland: 53, Northwestern: 0 },
  },
  {
    teams: ["Flowers", "Eleanor Roosevelt"],
    scores: { Flowers: 42, "Eleanor Roosevelt": 0 },
    date: "2026-09-11",
  },
  {
    teams: ["Bishop Ireton", "McKinley Tech"],
    scores: { "Bishop Ireton": 40, "McKinley Tech": 30 },
  },
  {
    teams: ["Anacostia", "Surrattsville"],
    scores: { Anacostia: 48, Surrattsville: 24 },
  },
  {
    teams: ["Oxon Hill", "DuVal"],
    scores: { "Oxon Hill": 35, DuVal: 0 },
  },
];

const ALIASES = {
  Flowers: ["Flowers", "C.H. Flowers"],
  "Eleanor Roosevelt": ["Eleanor Roosevelt", "Roosevelt (MD)"],
  "Georgetown Prep": ["Georgetown Prep", "Georgetown Preparatory School"],
  "Loyola Blakefield": ["Loyola Blakefield", "Loyola"],
  "St. Mary’s Ryken": ["St. Mary’s Ryken", "St. Mary's Ryken"],
};

const namesFor = (team) => ALIASES[team] || [team];
const gameHas = (game, team) =>
  namesFor(team).includes(game.team1) || namesFor(team).includes(game.team2);
const sameMatchup = (game, [teamA, teamB]) =>
  gameHas(game, teamA) && gameHas(game, teamB);

const scoreForName = (name, result) => {
  for (const [team, score] of Object.entries(result.scores)) {
    if (namesFor(team).includes(name)) return score;
  }
  return undefined;
};

const toFinal = (game, result) => ({
  ...game,
  date: result.date || "2026-09-11",
  score1: scoreForName(game.team1, result),
  score2: scoreForName(game.team2, result),
  scheduleStatus: "Final",
  subjectToChange: false,
  verificationStatus: "Final",
  sourceTier: "Verified score source",
  notes: "Final score verified Sept. 12, 2026.",
  lastChecked: "2026-09-12",
});

export function applyFootballResultsSep11Finals(games = []) {
  return games.map((game) => {
    const result = RESULTS.find((item) => sameMatchup(game, item.teams));
    if (!result) return game;

    // These are Sept. 11 finals. Flowers-Eleanor Roosevelt had been listed as
    // Sept. 12 in an older schedule row, so that matchup is intentionally
    // allowed to move to the confirmed Sept. 11 game date.
    const allowedDate =
      game.date === "2026-09-11" ||
      (result.teams.includes("Flowers") && game.date === "2026-09-12");

    return allowedDate ? toFinal(game, result) : game;
  });
}

export default applyFootballResultsSep11Finals;
