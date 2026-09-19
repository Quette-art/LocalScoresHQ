const SOURCES = {
  maxPreps:
    "https://www.maxpreps.com/inter-state/football/game/st-johns-washington-dc-vs-west-boca-raton-fl/9-19-2026/?c=b031d257-314e-4546-8a1c-211ebbb42d62",
  dcSportsFan: "https://dcsportsfan.com/2026/09/19/football-scores/",
};

const normalize = (value = "") =>
  String(value)
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const isStJohnsWestBoca = (game) => {
  const teams = [normalize(game.team1), normalize(game.team2)];
  return teams.includes("st john s") && teams.includes("west boca raton");
};

const scoreForTeam = (teamName) =>
  normalize(teamName) === "st john s" ? 15 : 14;

export function applyFootballResultsSep19Finals(games = []) {
  return games.map((game) => {
    if (!isStJohnsWestBoca(game)) return game;

    return {
      ...game,
      date: "2026-09-19",
      score1: scoreForTeam(game.team1),
      score2: scoreForTeam(game.team2),
      status: undefined,
      scheduleStatus: "Final",
      subjectToChange: false,
      verificationStatus: "Final",
      sourceTier: "MaxPreps + DCSportsFan verified result",
      sourceUrl: SOURCES.maxPreps,
      secondarySourceUrl: SOURCES.dcSportsFan,
      notes: `Final: ${game.team1} ${scoreForTeam(game.team1)}, ${game.team2} ${scoreForTeam(game.team2)}. Played September 19 after the September 18 postponement.`,
      lastChecked: "2026-09-19",
    };
  });
}

export default applyFootballResultsSep19Finals;
