const RESULTS = [
  {
    teams: ["Gwynn Park", "New Town"],
    scores: { "Gwynn Park": 8, "New Town": 6 },
    time: "4:00 PM",
    location: "New Town",
  },
  {
    teams: ["Largo", "Glen Burnie"],
    scores: { Largo: 50, "Glen Burnie": 34 },
    time: "6:00 PM",
    location: "Glen Burnie",
  },
  {
    teams: ["McDonogh", "Mt. Zion Prep Academy"],
    scores: { McDonogh: 38, "Mt. Zion Prep Academy": 6 },
    time: "TBD",
    location: "TBD",
  },
];

const ALIASES = {
  "Mt. Zion Prep Academy": ["Mt. Zion Prep Academy", "Mt. Zion Prep", "Mt. Zion"],
  McDonogh: ["McDonogh", "McDonogh School"],
};

const namesFor = (team) => ALIASES[team] || [team];
const gameHas = (game, team) => namesFor(team).includes(game.team1) || namesFor(team).includes(game.team2);
const sameMatchup = (game, [teamA, teamB]) => game.date === "2026-09-10" && gameHas(game, teamA) && gameHas(game, teamB);
const scoreForName = (name, result) => {
  for (const [team, score] of Object.entries(result.scores)) {
    if (namesFor(team).includes(name)) return score;
  }
  return undefined;
};
const slug = (v) => String(v).toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const toFinal = (game, result) => ({
  ...game,
  score1: scoreForName(game.team1, result),
  score2: scoreForName(game.team2, result),
  scheduleStatus: "Final",
  subjectToChange: false,
  verificationStatus: "Final",
  sourceTier: "Verified score source",
  notes: "Final score verified Sept. 11, 2026.",
  lastChecked: "2026-09-11",
});

export function applyFootballResultsSep10Finals(games) {
  const found = new Set();
  const updated = games.map((game) => {
    const index = RESULTS.findIndex((result) => sameMatchup(game, result.teams));
    if (index < 0) return game;
    found.add(index);
    return toFinal(game, RESULTS[index]);
  });

  RESULTS.forEach((result, index) => {
    if (found.has(index)) return;
    const [team1, team2] = result.teams;
    updated.push({
      id: `fb-2026-09-10-${slug(team1)}-${slug(team2)}`,
      sport: "Football",
      division: "Varsity",
      ageGroup: "Varsity",
      date: "2026-09-10",
      time: result.time,
      team1,
      team2,
      score1: result.scores[team1],
      score2: result.scores[team2],
      location: result.location,
      scheduleStatus: "Final",
      subjectToChange: false,
      verificationStatus: "Final",
      sourceTier: "Verified score source",
      notes: "Final score verified Sept. 11, 2026.",
      sourceUrl: "",
      lastChecked: "2026-09-11",
    });
  });

  return updated.sort((a, b) => a.date.localeCompare(b.date) || String(a.time).localeCompare(String(b.time)));
}

export default applyFootballResultsSep10Finals;
