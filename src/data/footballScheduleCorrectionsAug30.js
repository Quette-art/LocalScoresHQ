// LocalScoresHQ schedule cleanup — 2026-08-30.
//
// St. Albans' official calendar labels the Aug. 28 game at St. Stephen's &
// St. Agnes as a SCRIMMAGE. It should not appear in the regular-season varsity
// schedule or results feed.

const normalize = (value = "") =>
  String(value)
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/\./g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const teamMatches = (name, aliases = []) => {
  const normalized = normalize(name);
  return aliases.some((alias) => normalize(alias) === normalized);
};

export function applyFootballScheduleCorrectionsAug30(games = []) {
  return games.filter((game) => {
    if (game.date !== "2026-08-28") return true;

    const isStAlbansScrimmage =
      (teamMatches(game.team1, ["St. Albans"]) &&
        teamMatches(game.team2, ["St. Stephen's & St. Agnes", "St. Stephen's and St. Agnes", "St. Stephen’s & St. Agnes"])) ||
      (teamMatches(game.team2, ["St. Albans"]) &&
        teamMatches(game.team1, ["St. Stephen's & St. Agnes", "St. Stephen's and St. Agnes", "St. Stephen’s & St. Agnes"]));

    return !isStAlbansScrimmage;
  });
}

export default applyFootballScheduleCorrectionsAug30;
