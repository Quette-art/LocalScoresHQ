// LocalScoresHQ result verification — 2026-08-30.
//
// Adds newly verified finals that were not available during the Aug. 29 pass.

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

const corrections = [
  {
    date: "2026-08-29",
    teams: [
      { aliases: ["St. John's", "St Johns", "St. John’s"], score: 45 },
      { aliases: ["Mt. Zion", "Mt. Zion Prep Academy", "Mount Zion Prep Academy"], score: 8 },
    ],
    resultSource: "MaxPreps final",
    resultSourceUrl:
      "https://www.maxpreps.com/dc/washington/st-johns-cadets/football/",
    resultNotes:
      "St. John's 45, Mt. Zion Prep Academy 8. Confirmed on both teams' MaxPreps pages after the game.",
  },
];

const gameMatches = (game, correction) => {
  if (game.date !== correction.date) return false;
  const [a, b] = correction.teams;
  return (
    (teamMatches(game.team1, a.aliases) && teamMatches(game.team2, b.aliases)) ||
    (teamMatches(game.team1, b.aliases) && teamMatches(game.team2, a.aliases))
  );
};

const scoreFor = (teamName, correction) => {
  const team = correction.teams.find((entry) =>
    teamMatches(teamName, entry.aliases)
  );
  return team?.score ?? null;
};

export function applyFootballResultCorrectionsAug30(games = []) {
  return games.map((game) => {
    const correction = corrections.find((entry) => gameMatches(game, entry));
    if (!correction) return game;

    const baseLocation = String(game.location || "TBD")
      .replace(/\s*•\s*RESULT UNCONFIRMED$/i, "")
      .trim();

    return {
      ...game,
      score1: scoreFor(game.team1, correction),
      score2: scoreFor(game.team2, correction),
      resultStatus: "Final",
      verificationStatus: "Final verified",
      scheduleStatus: "Confirmed",
      subjectToChange: false,
      location: baseLocation,
      resultSource: correction.resultSource,
      resultSourceUrl: correction.resultSourceUrl,
      resultNotes: correction.resultNotes,
      lastChecked: "2026-08-30",
    };
  });
}

export default applyFootballResultCorrectionsAug30;
