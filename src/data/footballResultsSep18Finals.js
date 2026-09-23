const SOURCE_URLS = {
  dc: "https://www.maxpreps.com/dc/football/scores/?date=9/18/2026",
  maryland: "https://www.maxpreps.com/md/football/scores/?date=9/18/2026",
  marylandOnSI: "https://www.si.com/high-school/maryland",
  dcSportsFan: "https://dcsportsfan.com/2026/09/19/football-scores/",
  maxPrepsPhelps:
    "https://www.maxpreps.com/dc/washington/phelps-architecture-construction-and-engineering-panthers/football/",
  on3SidwellPhelps:
    "https://www.on3.com/high-school/scores/football/district-of-columbia/game/phelps-ace-vs-sidwell-friends-2026-09-18-1971327/",
  maxPrepsNorthwestern:
    "https://www.maxpreps.com/md/hyattsville/northwestern-wildcats/football/",
  marylandSep18Finals:
    "https://www.si.com/high-school/maryland/maryland-high-school-football-final-scores-september-18-01m2wr6ycbgj",
  maxPrepsLegacyJacksonReed:
    "https://www.maxpreps.com/dc/football/game/jackson-reed-washington-vs-kipp-dc-legacy-college-prep-washington/9-18-2026/?c=da2d255d-3de5-4875-9557-1802bc11265c&tab=Recap",
  siDcSep18:
    "https://www.si.com/high-school/stats/washington-dc/football/scores?date=2026-09-18",
};

const FINAL_RESULTS = [
  {
    teams: ["KIPP DC Legacy", "Jackson-Reed"],
    scores: { "KIPP DC Legacy": 32, "Jackson-Reed": 7 },
    sourceUrl: SOURCE_URLS.maxPrepsLegacyJacksonReed,
    secondarySourceUrl: SOURCE_URLS.siDcSep18,
    sourceTier: "MaxPreps + High School On SI verified result",
    lastChecked: "2026-09-23",
  },
  {
    teams: ["Sidwell Friends", "Phelps ACE"],
    scores: { "Sidwell Friends": 20, "Phelps ACE": 28 },
    sourceUrl: SOURCE_URLS.maxPrepsPhelps,
    secondarySourceUrl: SOURCE_URLS.on3SidwellPhelps,
    sourceTier: "MaxPreps + On3 verified result",
    lastChecked: "2026-09-21",
  },
  {
    teams: ["Northwestern", "Laurel"],
    scores: { Northwestern: 6, Laurel: 67 },
    sourceUrl: SOURCE_URLS.maxPrepsNorthwestern,
    secondarySourceUrl: SOURCE_URLS.marylandSep18Finals,
    sourceTier: "MaxPreps + High School On SI verified result",
    lastChecked: "2026-09-21",
  },
  {
    teams: ["Digital Pioneers Academy", "H.D. Woodson"],
    scores: { "Digital Pioneers Academy": 34, "H.D. Woodson": 0 },
    sourceUrl: "https://www.instagram.com/reel/DdcyPV0gaxN/",
    secondarySourceUrl: SOURCE_URLS.dcSportsFan,
    sourceTier: "Official Digital Pioneers football + DCSportsFan",
    lastChecked: "2026-09-21",
  },
  {
    teams: ["Potomac", "Bowie"],
    scores: { Potomac: 36, Bowie: 14 },
    sourceUrl: SOURCE_URLS.maryland,
    sourceTier: "MaxPreps verified result",
  },
  {
    teams: ["Surrattsville", "Frederick Douglass"],
    scores: { Surrattsville: 6, "Frederick Douglass": 32 },
    sourceUrl: SOURCE_URLS.maryland,
    sourceTier: "MaxPreps verified result",
  },
  {
    teams: ["DuVal", "Bladensburg"],
    scores: { DuVal: 34, Bladensburg: 0 },
    sourceUrl: SOURCE_URLS.maryland,
    sourceTier: "MaxPreps verified result",
  },
  {
    teams: ["Eastern", "Georgetown Prep"],
    scores: { Eastern: 30, "Georgetown Prep": 18 },
    sourceUrl: SOURCE_URLS.maryland,
    sourceTier: "MaxPreps verified result",
  },
  {
    teams: ["Anacostia", "Ballou"],
    scores: { Anacostia: 38, Ballou: 0 },
    sourceUrl: "https://www.instagram.com/anaathleticdept/",
    sourceTier: "Official Anacostia Athletics post",
  },
  {
    teams: ["Bell", "Maret"],
    scores: { Bell: 30, Maret: 42 },
    sourceUrl: SOURCE_URLS.dc,
    sourceTier: "MaxPreps / High School On SI verified result",
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
  {
    teams: ["Parkdale", "Eleanor Roosevelt"],
    scores: { Parkdale: 7, "Eleanor Roosevelt": 28 },
    sourceUrl: SOURCE_URLS.marylandOnSI,
    sourceTier: "High School On SI verified result",
  },
  {
    teams: ["Loudoun Sports Academy", "DeMatha"],
    scores: { "Loudoun Sports Academy": 6, DeMatha: 27 },
    sourceUrl: SOURCE_URLS.marylandOnSI,
    sourceTier: "High School On SI verified result",
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
      ...(result.secondarySourceUrl
        ? { secondarySourceUrl: result.secondarySourceUrl }
        : {}),
      notes: `Final: ${game.team1} ${scoreForTeam(game.team1, result)}, ${game.team2} ${scoreForTeam(game.team2, result)}.`,
      lastChecked: result.lastChecked || "2026-09-19",
    };
  });
}

export default applyFootballResultsSep18Finals;
