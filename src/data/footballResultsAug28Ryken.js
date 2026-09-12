// LocalScoresHQ — verified Aug. 28 final for St. Mary’s Ryken at McCallie.
// This updates the existing scheduled matchup only; it does not append a new game.

const normalize = (value = "") =>
  String(value)
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/\./g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const matches = (name, aliases = []) =>
  aliases.some((alias) => normalize(alias) === normalize(name));

export function applyFootballResultsAug28Ryken(games = []) {
  return games.map((game) => {
    if (game.date !== "2026-08-28") return game;

    const isRykenMcCallie =
      (matches(game.team1, ["St. Mary’s Ryken", "St. Mary's Ryken"]) &&
        matches(game.team2, ["McCallie", "McCallie School"])) ||
      (matches(game.team2, ["St. Mary’s Ryken", "St. Mary's Ryken"]) &&
        matches(game.team1, ["McCallie", "McCallie School"]));

    if (!isRykenMcCallie) return game;

    const scoreFor = (teamName) =>
      matches(teamName, ["St. Mary’s Ryken", "St. Mary's Ryken"]) ? 17 : 67;

    return {
      ...game,
      score1: scoreFor(game.team1),
      score2: scoreFor(game.team2),
      resultStatus: "Final",
      verificationStatus: "Final verified",
      scheduleStatus: "Confirmed",
      subjectToChange: false,
      resultSource: "Verified final",
      resultNotes: "McCallie 67, St. Mary’s Ryken 17.",
      lastChecked: "2026-09-12",
    };
  });
}

export default applyFootballResultsAug28Ryken;
