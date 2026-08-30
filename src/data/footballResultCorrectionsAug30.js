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
    fallback: {
      id: "fb-2026-08-29-mt-zion-st-johns",
      sport: "Football",
      division: "Varsity",
      ageGroup: "Varsity",
      date: "2026-08-29",
      time: "2:30 PM",
      team1: "Mt. Zion Prep Academy",
      team2: "St. John's",
      location: "Fernandez Stadium",
    },
  },
  {
    date: "2026-08-29",
    teams: [
      { aliases: ["Bullis", "Bullis School"], score: 49 },
      { aliases: ["Bishop Ireton"], score: 14 },
    ],
    resultSource: "MaxPreps final",
    resultSourceUrl:
      "https://www.maxpreps.com/inter-state/football/game/bishop-ireton-alexandria-va-vs-bullis-potomac-md/8-29-2026/?c=15ce0723-1d43-429d-abd8-9e2cfb12284c",
    resultNotes:
      "Bullis 49, Bishop Ireton 14. MaxPreps game page lists the Aug. 29 varsity non-conference game as final.",
    fallback: {
      id: "fb-2026-08-29-bullis-bishop-ireton",
      sport: "Football",
      division: "Varsity",
      ageGroup: "Varsity",
      date: "2026-08-29",
      time: "12:00 PM",
      team1: "Bullis",
      team2: "Bishop Ireton",
      location: "Bishop Ireton",
    },
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

const applyCorrection = (game, correction) => {
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
    sourceTier: game.sourceTier || "Result verification pass",
    resultSource: correction.resultSource,
    resultSourceUrl: correction.resultSourceUrl,
    resultNotes: correction.resultNotes,
    lastChecked: "2026-08-30",
  };
};

export function applyFootballResultCorrectionsAug30(games = []) {
  const next = [...games];

  for (const correction of corrections) {
    const index = next.findIndex((game) => gameMatches(game, correction));

    if (index >= 0) {
      next[index] = applyCorrection(next[index], correction);
      continue;
    }

    if (correction.fallback) {
      next.push(applyCorrection(correction.fallback, correction));
    }
  }

  return next.sort((a, b) =>
    String(a.date).localeCompare(String(b.date)) ||
    String(a.time).localeCompare(String(b.time))
  );
}

export default applyFootballResultCorrectionsAug30;
