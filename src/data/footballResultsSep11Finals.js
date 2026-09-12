const RESULTS = [
  {
    teams: ["Georgetown Prep", "Loyola Blakefield"],
    scores: { "Georgetown Prep": 14, "Loyola Blakefield": 53 },
  },
  {
    teams: ["Woodberry Forest", "St. Mary’s Ryken"],
    scores: { "Woodberry Forest": 24, "St. Mary’s Ryken": 21 },
  },
  {
    teams: ["Wise", "Laurel"],
    scores: { Wise: 53, Laurel: 6 },
  },
  {
    teams: ["Suitland", "Northwestern"],
    scores: { Suitland: 53, Northwestern: 0 },
  },
  {
    teams: ["Flowers", "Eleanor Roosevelt"],
    scores: { Flowers: 42, "Eleanor Roosevelt": 0 },
    date: "2026-09-11",
  },
  {
    teams: ["Bishop Ireton", "McKinley Tech"],
    scores: { "Bishop Ireton": 40, "McKinley Tech": 30 },
  },
  {
    teams: ["Anacostia", "Surrattsville"],
    scores: { Anacostia: 48, Surrattsville: 24 },
  },
  {
    teams: ["Oxon Hill", "DuVal"],
    scores: { "Oxon Hill": 35, DuVal: 0 },
  },
  {
    teams: ["Archbishop Carroll", "KIPP DC Legacy"],
    scores: { "Archbishop Carroll": 38, "KIPP DC Legacy": 0 },
    time: "6:00 PM",
    location: "KIPP DC Legacy College Preparatory",
  },
  {
    teams: ["Ballou", "Annapolis Area Christian"],
    scores: { Ballou: 32, "Annapolis Area Christian": 0 },
    location: "Ballou",
  },
  {
    teams: ["Eastern", "Gonzaga"],
    scores: { Eastern: 0, Gonzaga: 18 },
    time: "6:30 PM",
    location: "Buchanan Field",
  },
  {
    teams: ["Digital Pioneers Academy", "Roosevelt"],
    scores: { "Digital Pioneers Academy": 28, Roosevelt: 29 },
  },
  {
    teams: ["Bowie", "Bladensburg"],
    scores: { Bowie: 28, Bladensburg: 0 },
    time: "5:00 PM",
    location: "Bladensburg",
  },
  {
    teams: ["Potomac", "Parkdale"],
    scores: { Potomac: 27, Parkdale: 6 },
    time: "4:00 PM",
    location: "Parkdale",
  },
  {
    teams: ["Ron Brown", "H.D. Woodson"],
    scores: { "Ron Brown": 18, "H.D. Woodson": 15 },
  },
  {
    teams: ["Fairmont Heights", "Douglass BM"],
    scores: { "Fairmont Heights": 16, "Douglass BM": 0 },
    time: "3:45 PM",
    location: "Douglass BM",
  },
  {
    teams: ["Jackson-Reed", "Flint Hill"],
    scores: { "Jackson-Reed": 7, "Flint Hill": 47 },
    time: "4:30 PM",
    location: "Flint Hill",
  },
  {
    teams: ["Friendly", "KIPP College Prep"],
    scores: { Friendly: 42, "KIPP College Prep": 35 },
    time: "4:30 PM",
    location: "KIPP College Prep",
  },
  {
    teams: ["Friendship Collegiate Academy", "Simon Gratz"],
    scores: { "Friendship Collegiate Academy": 18, "Simon Gratz": 14 },
    time: "7:00 PM",
    location: "Friendship Collegiate Academy",
  },
  {
    teams: ["Riverdale Baptist", "Bell"],
    scores: { "Riverdale Baptist": 49, Bell: 14 },
    time: "7:00 PM",
    location: "Riverdale Baptist School",
  },
  {
    teams: ["Archbishop Spalding", "Good Counsel"],
    scores: { "Archbishop Spalding": 45, "Good Counsel": 20 },
    time: "7:00 PM",
    location: "Dancel Field",
  },
  {
    teams: ["Roman Catholic", "DeMatha"],
    scores: { "Roman Catholic": 14, DeMatha: 7 },
    time: "7:00 PM",
    location: "DeMatha Catholic High School",
  },
  {
    teams: ["Frederick Douglass", "Lake Clifton"],
    scores: { "Frederick Douglass": 46, "Lake Clifton": 0 },
    time: "3:45 PM",
    location: "Dunbar Athletic Field",
  },
];

const ALIASES = {
  Flowers: ["Flowers", "C.H. Flowers", "Charles H. Flowers", "Charles H. Flowers High School"],
  "Eleanor Roosevelt": ["Eleanor Roosevelt", "Roosevelt (MD)"],
  "Georgetown Prep": ["Georgetown Prep", "Georgetown Preparatory School"],
  "Loyola Blakefield": ["Loyola Blakefield", "Loyola"],
  "St. Mary’s Ryken": ["St. Mary’s Ryken", "St. Mary's Ryken"],
  "KIPP DC Legacy": ["KIPP DC Legacy", "KIPP DC Legacy College Prep", "KIPP DC Legacy College Preparatory"],
  "Friendship Collegiate Academy": ["Friendship Collegiate Academy", "Friendship Collegiate", "FCA"],
  "Good Counsel": ["Good Counsel", "Our Lady of Good Counsel"],
  "Frederick Douglass": ["Frederick Douglass", "Frederick Douglass High School"],
  "Annapolis Area Christian": ["Annapolis Area Christian", "Annapolis Area Christian School", "AACS"],
  "Digital Pioneers Academy": ["Digital Pioneers Academy", "DPA"],
};

const namesFor = (team) => ALIASES[team] || [team];
const gameHas = (game, team) =>
  namesFor(team).includes(game.team1) || namesFor(team).includes(game.team2);
const sameMatchup = (game, [teamA, teamB]) =>
  gameHas(game, teamA) && gameHas(game, teamB);

const scoreForName = (name, result) => {
  for (const [team, score] of Object.entries(result.scores)) {
    if (namesFor(team).includes(name)) return score;
  }
  return undefined;
};

const slug = (v) =>
  String(v)
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const toFinal = (game, result) => ({
  ...game,
  date: result.date || "2026-09-11",
  time: result.time || game.time,
  location: result.location || game.location,
  score1: scoreForName(game.team1, result),
  score2: scoreForName(game.team2, result),
  scheduleStatus: "Final",
  subjectToChange: false,
  verificationStatus: "Final",
  sourceTier: "Verified score source",
  notes: "Final score verified Sept. 12, 2026.",
  lastChecked: "2026-09-12",
});

export function applyFootballResultsSep11Finals(games = []) {
  const found = new Set();

  const updated = games.map((game) => {
    const index = RESULTS.findIndex((item) => sameMatchup(game, item.teams));
    if (index < 0) return game;

    const result = RESULTS[index];

    // These are Sept. 11 finals. Flowers-Eleanor Roosevelt had been listed as
    // Sept. 12 in an older schedule row, so that matchup is intentionally
    // allowed to move to the confirmed Sept. 11 game date.
    const allowedDate =
      game.date === "2026-09-11" ||
      (result.teams.includes("Flowers") && game.date === "2026-09-12");

    if (!allowedDate) return game;

    found.add(index);
    return toFinal(game, result);
  });

  // If a verified final was not present in an older schedule layer, add it so
  // the score still appears on LocalScoresHQ instead of silently disappearing.
  RESULTS.forEach((result, index) => {
    if (found.has(index)) return;

    const [team1, team2] = result.teams;
    updated.push({
      id: `fb-2026-09-11-${slug(team1)}-${slug(team2)}`,
      sport: "Football",
      division: "Varsity",
      ageGroup: "Varsity",
      date: result.date || "2026-09-11",
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
      notes: "Final score verified Sept. 12, 2026.",
      sourceUrl: "",
      lastChecked: "2026-09-12",
    });
  });

  return updated.sort(
    (a, b) => a.date.localeCompare(b.date) || String(a.time).localeCompare(String(b.time))
  );
}

export default applyFootballResultsSep11Finals;
