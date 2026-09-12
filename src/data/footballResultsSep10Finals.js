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
    teams: ["Central", "Lewis"],
    scores: { Central: 38, Lewis: 12 },
    time: "3:45 PM",
    location: "Central",
  },
  {
    teams: ["McDonogh", "Mt. Zion Prep Academy"],
    scores: { McDonogh: 38, "Mt. Zion Prep Academy": 6 },
    time: "TBD",
    location: "TBD",
  },
  {
    teams: ["St. Vincent Pallotti", "Guilford Park"],
    scores: { "St. Vincent Pallotti": 0, "Guilford Park": 21 },
    time: "6:30 PM",
    location: "Guilford Park",
  },
  {
    teams: ["Crossland", "Alexandria City"],
    scores: { Crossland: 0, "Alexandria City": 35 },
    time: "6:00 PM",
    location: "Alexandria City",
  },
  {
    teams: ["Paul VI", "Landon"],
    scores: { "Paul VI": 0, Landon: 27 },
    time: "4:00 PM",
    location: "Landon",
  },
  {
    teams: ["Dunbar", "Dunbar (Baltimore)"],
    scores: { Dunbar: 6, "Dunbar (Baltimore)": 34 },
    time: "TBD",
    location: "UA Stadium",
  },
  {
    teams: ["Maret", "Tower Hill"],
    scores: { Maret: 40, "Tower Hill": 7 },
    time: "6:30 PM",
    location: "Tower Hill",
  },
];

const ALIASES = {
  "Mt. Zion Prep Academy": ["Mt. Zion Prep Academy", "Mt. Zion Prep", "Mt. Zion"],
  McDonogh: ["McDonogh", "McDonogh School"],
  "St. Vincent Pallotti": ["St. Vincent Pallotti", "Pallotti"],
  Dunbar: ["Dunbar", "Dunbar (DC)", "DC Dunbar"],
  "Dunbar (Baltimore)": ["Dunbar (Baltimore)", "Baltimore Dunbar", "Dunbar Baltimore"],
  Lewis: ["Lewis", "Reginald F. Lewis", "Reginald F Lewis"],
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

const normalizeSep10Matchup = (game) => {
  if (gameHas(game, "Central") && gameHas(game, "Lewis") && ["2026-09-10", "2026-09-11"].includes(game.date)) {
    return {
      ...game,
      date: "2026-09-10",
      time: "3:45 PM",
      location: "Central",
    };
  }

  if (game.date === "2026-09-10" && gameHas(game, "Maret") && !gameHas(game, "Tower Hill")) {
    const maretIsTeam1 = namesFor("Maret").includes(game.team1);
    return {
      ...game,
      team1: maretIsTeam1 ? "Maret" : "Tower Hill",
      team2: maretIsTeam1 ? "Tower Hill" : "Maret",
      time: "6:30 PM",
      location: "Tower Hill",
    };
  }
  return game;
};

const toFinal = (game, result) => ({
  ...game,
  score1: scoreForName(game.team1, result),
  score2: scoreForName(game.team2, result),
  time: result.time || game.time,
  location: result.location || game.location,
  scheduleStatus: "Final",
  subjectToChange: false,
  verificationStatus: "Final",
  sourceTier: "Verified score source",
  notes: "Final score verified Sept. 12, 2026.",
  lastChecked: "2026-09-12",
});

export function applyFootballResultsSep10Finals(games) {
  const found = new Set();
  const updated = games.map((originalGame) => {
    const game = normalizeSep10Matchup(originalGame);
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
      notes: "Final score verified Sept. 12, 2026.",
      sourceUrl: "",
      lastChecked: "2026-09-12",
    });
  });

  return updated.sort((a, b) => a.date.localeCompare(b.date) || String(a.time).localeCompare(String(b.time)));
}

export default applyFootballResultsSep10Finals;
