const normalize = (value = "") =>
  String(value)
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const matchupKey = (team1, team2) =>
  [normalize(team1), normalize(team2)].sort().join("|");

const RESULTS = new Map([
  [
    matchupKey("Eastern", "Ballou"),
    {
      scores: { eastern: 57, ballou: 2 },
      sourceTier: "Official Eastern football result",
      sourceUrl: "https://x.com/EasternHS_FB",
    },
  ],
  [
    matchupKey("H.D. Woodson", "Roosevelt"),
    {
      scores: { "h d woodson": 16, roosevelt: 30 },
      sourceTier: "User-confirmed result; MaxPreps report",
      sourceUrl: "https://www.maxpreps.com/dc/washington/roosevelt-roughriders/football/schedule/",
    },
  ],
]);

export function applyFootballResultsSep24Finals(games = []) {
  return games.map((game) => {
    if (game.date !== "2026-09-24") return game;
    const result = RESULTS.get(matchupKey(game.team1, game.team2));
    if (!result) return game;

    const score1 = result.scores[normalize(game.team1)];
    const score2 = result.scores[normalize(game.team2)];

    return {
      ...game,
      date: "2026-09-24",
      score1,
      score2,
      status: undefined,
      scheduleStatus: "Final",
      subjectToChange: false,
      verificationStatus: "Final",
      sourceTier: result.sourceTier,
      sourceUrl: result.sourceUrl,
      notes: `Final: ${game.team1} ${score1}, ${game.team2} ${score2}.`,
      lastChecked: "2026-09-25",
    };
  });
}

export default applyFootballResultsSep24Finals;
