const RESULTS = [
  { teams: ["Parkdale", "Laurel"], scores: { Parkdale: 37, Laurel: 19 }, time: "2:00 PM", location: "Parkdale" },
  { teams: ["Crossland", "Bladensburg"], scores: { Crossland: 50, Bladensburg: 0 }, time: "2:00 PM", location: "Crossland" },
  { teams: ["Central", "Northwestern"], scores: { Central: 32, Northwestern: 22 }, time: "4:00 PM", location: "Central" },
  { teams: ["Phelps ACE", "Surrattsville"], scores: { "Phelps ACE": 42, Surrattsville: 20 }, time: "TBD", location: "Surrattsville" },
  { teams: ["Potomac", "DuVal"], scores: { Potomac: 30, DuVal: 0 }, time: "6:30 PM", location: "Potomac" },
  { teams: ["Suitland", "Frederick Douglass"], scores: { Suitland: 15, "Frederick Douglass": 0 }, time: "6:30 PM", location: "Frederick Douglass" },
  { teams: ["Oxon Hill", "Largo"], scores: { "Oxon Hill": 21, Largo: 20 }, time: "6:30 PM", location: "Largo" },
  { teams: ["Georgetown Prep", "St. Vincent Pallotti"], scores: { "Georgetown Prep": 24, "St. Vincent Pallotti": 0 }, time: "6:00 PM", location: "Georgetown Prep", date: "2026-09-05" },
  { teams: ["St. John’s", "Archbishop Spalding"], scores: { "St. John’s": 21, "Archbishop Spalding": 18 }, time: "7:00 PM", location: "TBD" },
  { teams: ["DeMatha", "Imhotep Charter"], scores: { DeMatha: 21, "Imhotep Charter": 20 }, time: "7:00 PM", location: "Imhotep Charter" },
  { teams: ["Digital Pioneers Academy", "Eleanor Roosevelt"], scores: { "Digital Pioneers Academy": 32, "Eleanor Roosevelt": 8 }, time: "TBD", location: "TBD" },
  { teams: ["Gwynn Park", "Bowie"], scores: { "Gwynn Park": 56, Bowie: 6 }, time: "6:00 PM", location: "Gwynn Park" },
];

const ALIASES = {
  "St. John’s": ["St. John’s", "St. John's", "St. Johns"],
  "Archbishop Spalding": ["Archbishop Spalding", "Spalding"],
  "DeMatha": ["DeMatha", "DeMatha Catholic"],
  "Imhotep Charter": ["Imhotep Charter", "Imhotep", "Imhotep (PA)"],
  "Digital Pioneers Academy": ["Digital Pioneers Academy", "Digital Pioneers"],
  "Eleanor Roosevelt": ["Eleanor Roosevelt", "Eleanor Roosevelt (MD)"],
  "Frederick Douglass": ["Frederick Douglass", "Douglass", "Frederick Douglass (PG)"],
  "Phelps ACE": ["Phelps ACE", "Phelps Architecture, Construction & Engineering", "Phelps Architecture Construction & Engineering", "Phelps"],
  "Georgetown Prep": ["Georgetown Prep", "Georgetown Preparatory School"],
  "St. Vincent Pallotti": ["St. Vincent Pallotti", "St. Vincent Pallotti High School", "Pallotti"],
};

const namesFor = (team) => ALIASES[team] || [team];
const gameHas = (game, team) => namesFor(team).includes(game.team1) || namesFor(team).includes(game.team2);
const sameMatchup = (game, [teamA, teamB]) => gameHas(game, teamA) && gameHas(game, teamB);
const scoreForName = (name, result) => {
  for (const [team, score] of Object.entries(result.scores)) {
    if (namesFor(team).includes(name)) return score;
  }
  return undefined;
};
const slug = (v) => String(v).toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const toFinal = (game, result) => ({
  ...game,
  date: result.date || "2026-09-05",
  score1: scoreForName(game.team1, result),
  score2: scoreForName(game.team2, result),
  scheduleStatus: "Final",
  subjectToChange: false,
  verificationStatus: "Final",
  sourceTier: "Verified score source",
  notes: "Final score verified Sept. 6, 2026.",
  lastChecked: "2026-09-06",
});

export function applyFootballResultsSep5Finals(games) {
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
    const date = result.date || "2026-09-05";
    updated.push({
      id: `fb-${date}-${slug(team1)}-${slug(team2)}`,
      sport: "Football",
      division: "Varsity",
      ageGroup: "Varsity",
      date,
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
      notes: "Final score verified Sept. 6, 2026.",
      sourceUrl: "",
      lastChecked: "2026-09-06",
    });
  });

  return updated.sort((a, b) => a.date.localeCompare(b.date) || String(a.time).localeCompare(String(b.time)));
}

export default applyFootballResultsSep5Finals;
