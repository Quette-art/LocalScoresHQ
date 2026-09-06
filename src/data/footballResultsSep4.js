const RESULTS = [
  { teams: ["Good Counsel", "Bergen Catholic"], scores: { "Good Counsel": 41, "Bergen Catholic": 39 } },
  { teams: ["Bullis", "Gilman"], scores: { Bullis: 29, Gilman: 23 } },
  { teams: ["Riverdale Baptist", "North East"], scores: { "Riverdale Baptist": 54, "North East": 6 } },
  { teams: ["St. Albans", "St. Paul's"], scores: { "St. Albans": 21, "St. Paul's": 13 } },
  { teams: ["Landon", "Boys Latin"], scores: { Landon: 21, "Boys Latin": 35 } },
  { teams: ["Bishop McNamara", "Dundalk"], scores: { "Bishop McNamara": 33, Dundalk: 6 } },
  { teams: ["Mount St. Joseph", "St. Mary’s Ryken"], scores: { "Mount St. Joseph": 45, "St. Mary’s Ryken": 13 } },
  { teams: ["KIPP Atlanta Collegiate", "KIPP College Prep"], scores: { "KIPP Atlanta Collegiate": 41, "KIPP College Prep": 0 }, time: "TBD", location: "TBD" },
];

const aliases = {
  "Good Counsel": ["Good Counsel", "Our Lady of Good Counsel"],
  "Bergen Catholic": ["Bergen Catholic"],
  Bullis: ["Bullis"],
  Gilman: ["Gilman", "Gilman School"],
  "Riverdale Baptist": ["Riverdale Baptist"],
  "North East": ["North East"],
  "St. Albans": ["St. Albans", "Saint Albans"],
  "St. Paul's": ["St. Paul's", "St. Paul’s", "St. Pauls", "Saint Paul's"],
  Landon: ["Landon"],
  "Boys Latin": ["Boys Latin", "Boys' Latin", "Boys’ Latin"],
  "Bishop McNamara": ["Bishop McNamara"],
  Dundalk: ["Dundalk"],
  "Mount St. Joseph": ["Mount St. Joseph", "Mount Saint Joseph", "Mt. St. Joseph"],
  "St. Mary’s Ryken": ["St. Mary’s Ryken", "St. Mary's Ryken", "St Marys Ryken"],
  "KIPP Atlanta Collegiate": ["KIPP Atlanta Collegiate", "KIPP Atlanta"],
  "KIPP College Prep": ["KIPP College Prep", "KIPP DC College Prep"],
};

const namesFor = (team) => aliases[team] || [team];
const gameHas = (game, team) => namesFor(team).includes(game.team1) || namesFor(team).includes(game.team2);
const sameMatchup = (game, teams) => gameHas(game, teams[0]) && gameHas(game, teams[1]);
const scoreFor = (name, result) => {
  for (const [team, score] of Object.entries(result.scores)) {
    if (namesFor(team).includes(name)) return score;
  }
  return undefined;
};
const slug = (v) => String(v).toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const toFinal = (game, result) => ({
  ...game,
  date: "2026-09-04",
  score1: scoreFor(game.team1, result),
  score2: scoreFor(game.team2, result),
  scheduleStatus: "Final",
  subjectToChange: false,
  verificationStatus: "Final",
  sourceTier: "Verified score source",
  notes: "Final score verified Sept. 6, 2026.",
  lastChecked: "2026-09-06",
});

export function applyFootballResultsSep4(games) {
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
      id: `fb-2026-09-04-${slug(team1)}-${slug(team2)}`,
      sport: "Football",
      division: "Varsity",
      ageGroup: "Varsity",
      date: "2026-09-04",
      time: result.time || "TBD",
      team1,
      team2,
      score1: result.scores[team1],
      score2: result.scores[team2],
      location: result.location || "TBD",
      scheduleStatus: "Final",
      subjectToChange: false,
      verificationStatus: "Final",
      sourceTier: "Verified score source",
      notes: "Final score verified Sept. 6, 2026.",
      sourceUrl: "",
      lastChecked: "2026-09-06",
    });
  });

  return updated.sort((a, b) => a.date.localeCompare(b.date) || String(a.time).localeCompare(String(b.time)));
}

export default applyFootballResultsSep4;
