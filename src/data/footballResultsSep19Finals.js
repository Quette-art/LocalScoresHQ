const SOURCES = {
  maxPrepsMaryland:
    "https://www.maxpreps.com/md/football/scores/?date=9/19/2026",
  marylandHighSchoolSports:
    "https://www.instagram.com/maryland_high_school_sports_/",
  suitlandFootball: "https://www.instagram.com/suitlandramsfb/",
  flowersFootball: "https://www.instagram.com/flowersfootball/",
  bishopOConnell:
    "https://www.bishopoconnell.org/athletics/teams/football",
  saintJames:
    "https://www.stjames.edu/athletics/teams/team-profile/~athletics-team-id/114",
  maxPrepsStJohns:
    "https://www.maxpreps.com/inter-state/football/game/st-johns-washington-dc-vs-west-boca-raton-fl/9-19-2026/?c=b031d257-314e-4546-8a1c-211ebbb42d62",
  dcSportsFan: "https://dcsportsfan.com/2026/09/19/football-scores/",
};

const normalize = (value = "") =>
  String(value)
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const matchupKey = (team1, team2) =>
  [normalize(team1), normalize(team2)].sort().join("|");

const RESULTS = [
  {
    team1: "St. John’s",
    team2: "West Boca Raton",
    date: "2026-09-19",
    scores: { "st john s": 15, "west boca raton": 14 },
    sourceTier: "MaxPreps + DCSportsFan verified result",
    sourceUrl: SOURCES.maxPrepsStJohns,
    secondarySourceUrl: SOURCES.dcSportsFan,
    note: "Played September 19 after the September 18 postponement.",
  },
  {
    team1: "Suitland",
    team2: "Oxon Hill",
    date: "2026-09-19",
    scores: { suitland: 26, "oxon hill": 14 },
    sourceTier: "Official Suitland football + Maryland High School Sports",
    sourceUrl: SOURCES.suitlandFootball,
    secondarySourceUrl: SOURCES.marylandHighSchoolSports,
  },
  {
    team1: "Wise",
    team2: "Flowers",
    date: "2026-09-19",
    scores: { wise: 25, flowers: 22 },
    sourceTier: "Official Flowers football + Maryland High School Sports",
    sourceUrl: SOURCES.flowersFootball,
    secondarySourceUrl: SOURCES.marylandHighSchoolSports,
    note: "Final in overtime.",
  },
  {
    team1: "St. Mary’s Ryken",
    team2: "Bishop McNamara",
    date: "2026-09-19",
    scores: { "st mary s ryken": 27, "bishop mcnamara": 33 },
    sourceTier: "MaxPreps + Maryland High School Sports",
    sourceUrl: SOURCES.maxPrepsMaryland,
    secondarySourceUrl: SOURCES.marylandHighSchoolSports,
    note: "Final in overtime.",
  },
  {
    team1: "Friendly",
    team2: "Central",
    date: "2026-09-19",
    time: "2:00 PM",
    scores: { friendly: 20, central: 32 },
    sourceTier: "MaxPreps + Maryland High School Sports",
    sourceUrl: SOURCES.maxPrepsMaryland,
    secondarySourceUrl: SOURCES.marylandHighSchoolSports,
  },
  {
    team1: "Loyola Blakefield",
    team2: "St. Michael the Archangel",
    date: "2026-09-19",
    time: "5:00 PM",
    location: "St. Michael the Archangel",
    scores: { "loyola blakefield": 42, "st michael the archangel": 28 },
    sourceTier: "MaxPreps + Maryland High School Sports",
    sourceUrl: SOURCES.maxPrepsMaryland,
    secondarySourceUrl: SOURCES.marylandHighSchoolSports,
  },
  {
    team1: "Washington High School",
    team2: "Bishop O'Connell",
    date: "2026-09-19",
    scores: { "washington high school": 20, "bishop o connell": 31 },
    sourceTier: "Official Bishop O'Connell athletics result",
    sourceUrl: SOURCES.bishopOConnell,
  },
  {
    team1: "St. Stephen's & St. Agnes",
    team2: "Saint James",
    date: "2026-09-19",
    scores: { "st stephen s st agnes": 0, "saint james": 43 },
    sourceTier: "Official Saint James athletics result",
    sourceUrl: SOURCES.saintJames,
  },
];

const resultByMatchup = new Map(
  RESULTS.map((result) => [matchupKey(result.team1, result.team2), result])
);

const scoreForTeam = (result, teamName) => result.scores[normalize(teamName)];

const applyResult = (game, result) => {
  const score1 = scoreForTeam(result, game.team1);
  const score2 = scoreForTeam(result, game.team2);

  return {
    ...game,
    date: result.date,
    ...(result.time ? { time: result.time } : {}),
    ...(result.location ? { location: result.location } : {}),
    score1,
    score2,
    status: undefined,
    scheduleStatus: "Final",
    subjectToChange: false,
    verificationStatus: "Final",
    sourceTier: result.sourceTier,
    sourceUrl: result.sourceUrl,
    secondarySourceUrl: result.secondarySourceUrl,
    notes: `Final: ${game.team1} ${score1}, ${game.team2} ${score2}.${result.note ? ` ${result.note}` : ""}`,
    lastChecked: "2026-09-20",
  };
};

export function applyFootballResultsSep19Finals(games = []) {
  const matched = new Set();
  const updated = games.map((game) => {
    const key = matchupKey(game.team1, game.team2);
    const result = resultByMatchup.get(key);
    if (!result) return game;

    matched.add(key);
    return applyResult(game, result);
  });

  const loyolaResult = RESULTS.find(
    (result) => result.team1 === "Loyola Blakefield"
  );
  const loyolaKey = matchupKey(loyolaResult.team1, loyolaResult.team2);
  if (!matched.has(loyolaKey)) {
    updated.push(
      applyResult(
        {
          id: "fb-2026-09-19-loyola-blakefield-st-michael-the-archangel",
          sport: "Football",
          division: "Varsity",
          ageGroup: "Varsity",
          date: loyolaResult.date,
          time: loyolaResult.time,
          team1: loyolaResult.team1,
          team2: loyolaResult.team2,
          score1: null,
          score2: null,
          location: loyolaResult.location,
        },
        loyolaResult
      )
    );
  }

  return updated.sort(
    (a, b) =>
      a.date.localeCompare(b.date) || String(a.time).localeCompare(String(b.time))
  );
}

export default applyFootballResultsSep19Finals;
