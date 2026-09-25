const SOURCE_URL = "https://x.com/EasternHS_FB";

const normalize = (value = "") =>
  String(value)
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const matchupKey = (team1, team2) =>
  [normalize(team1), normalize(team2)].sort().join("|");

const EASTERN_BALLOU_KEY = matchupKey("Eastern", "Ballou");

export function applyFootballResultsSep24Finals(games = []) {
  return games.map((game) => {
    if (matchupKey(game.team1, game.team2) !== EASTERN_BALLOU_KEY) return game;

    const scores = { eastern: 57, ballou: 2 };
    const score1 = scores[normalize(game.team1)];
    const score2 = scores[normalize(game.team2)];

    return {
      ...game,
      date: "2026-09-24",
      score1,
      score2,
      status: undefined,
      scheduleStatus: "Final",
      subjectToChange: false,
      verificationStatus: "Final",
      sourceTier: "Official Eastern football result",
      sourceUrl: SOURCE_URL,
      notes: `Final: ${game.team1} ${score1}, ${game.team2} ${score2}.`,
      lastChecked: "2026-09-25",
    };
  });
}

export default applyFootballResultsSep24Finals;
