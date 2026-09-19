const SOURCE_URL =
  "https://www.maxpreps.com/dc/football/game/mckinley-tech-washington-vs-roosevelt-washington/9-17-2026/?c=69e34c48-8b1b-4f8b-82f3-1ef594cd0c9a";

const normalize = (value = "") =>
  String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const hasTeam = (game, team) =>
  normalize(game.team1) === normalize(team) ||
  normalize(game.team2) === normalize(team);

export function applyFootballResultsSep17Finals(games = []) {
  return games.map((game) => {
    if (
      game.date !== "2026-09-17" ||
      !hasTeam(game, "Roosevelt") ||
      !hasTeam(game, "McKinley Tech")
    ) {
      return game;
    }

    const rooseveltIsTeam1 = normalize(game.team1) === normalize("Roosevelt");

    return {
      ...game,
      score1: rooseveltIsTeam1 ? 30 : 7,
      score2: rooseveltIsTeam1 ? 7 : 30,
      scheduleStatus: "Final",
      subjectToChange: false,
      verificationStatus: "Final",
      sourceTier: "Verified result",
      sourceUrl: SOURCE_URL,
      notes: "Final: Roosevelt 30, McKinley Tech 7.",
      lastChecked: "2026-09-19",
    };
  });
}

export default applyFootballResultsSep17Finals;
