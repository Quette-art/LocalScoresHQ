const SOURCE_URLS = {
  dc: "https://www.maxpreps.com/dc/football/scores/?date=9/18/2026",
  maryland: "https://www.maxpreps.com/md/football/scores/?date=9/18/2026",
};

const FINAL_RESULTS = [
  {
    teams: ["Anacostia", "Ballou"],
    scores: { Anacostia: 38, Ballou: 0 },
    sourceUrl: "https://www.instagram.com/anaathleticdept/",
    sourceTier: "Official Anacostia Athletics post",
  },
  {
    teams: ["Flint Hill", "Landon"],
    scores: { "Flint Hill": 42, Landon: 48 },
    sourceUrl: SOURCE_URLS.maryland,
  },
  {
    teams: ["KIPP College Prep", "Coolidge"],
    scores: { "KIPP College Prep": 6, Coolidge: 23 },
    sourceUrl: SOURCE_URLS.dc,
  },
  {
    teams: ["Archbishop Carroll", "Gonzaga"],
    scores: { "Archbishop Carroll": 27, Gonzaga: 47 },
    sourceUrl: SOURCE_URLS.dc,
  },
  {
    teams: ["Gwynn Park", "Fairmont Heights"],
    scores: { "Gwynn Park": 49, "Fairmont Heights": 0 },
    sourceUrl: SOURCE_URLS.maryland,
  },
  {
    teams: ["Crossland", "Largo"],
    scores: { Crossland: 0, Largo: 42 },
    sourceUrl: SOURCE_URLS.maryland,
  },
  {
    teams: ["Bullis", "St. Christopher's"],
    scores: { Bullis: 14, "St. Christopher's": 6 },
    sourceUrl: SOURCE_URLS.maryland,
  },
  {
    teams: ["Middletown", "Good Counsel"],
    scores: { Middletown: 17, "Good Counsel": 52 },
    sourceUrl: SOURCE_URLS.maryland,
  },
  {
    teams: ["John Paul the Great", "Paul VI"],
    scores: { "John Paul the Great": 0, "Paul VI": 41 },
    sourceUrl: SOURCE_URLS.maryland,
  },
];

const normalize = (value = "") =>
  String(value)
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const sameTeam = (a, b) => normalize(a) === normalize(b);

const sameMatchup = (game, teams) => {
  const [a, b] = teams;
  return (
    (sameTeam(game.team1, a) && sameTeam(game.team2, b)) ||
    (sameTeam(game.team1, b) && sameTeam(game.team2, a))
  );
};

const scoreForTeam = (teamName, result) => {
  for (const [name, score] of Object.entries(result.scores)) {
    if (sameTeam(teamName, name)) return score;
  }
  return null;
};

export function applyFootballResultsSep18Finals(games = []) {
  return games.map((game) => {
    if (game.date !== "2026-09-18") return game;

    const result = FINAL_RESULTS.find((item) => sameMatchup(game, item.teams));
    if (!result) return game;

    return {
      ...game,
      score1: scoreForTeam(game.team1, result),
      score2: scoreForTeam(game.team2, result),
      status: undefined,
      scheduleStatus: "Final",
      subjectToChange: false,
      verificationStatus: "Final",
      sourceTier: result.sourceTier || "Verified result",
      sourceUrl: result.sourceUrl,
      notes: `Final: ${game.team1} ${scoreForTeam(game.team1, result)}, ${game.team2} ${scoreForTeam(game.team2, result)}.`,
      lastChecked: "2026-09-19",
    };
  });
}

export default applyFootballResultsSep18Finals;
