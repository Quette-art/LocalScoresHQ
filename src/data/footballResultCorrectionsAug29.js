// LocalScoresHQ result corrections — 2026-08-29.
//
// These corrections are applied after the Aug. 29 verification layer so newer
// confirmed finals supersede earlier conflicting or unconfirmed result entries.

const normalize = (value = "") =>
  String(value)
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/\./g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const corrections = [
  {
    date: "2026-08-28",
    teams: [
      { aliases: ["Ballou"], score: 28 },
      { aliases: ["Ron Brown"], score: 26 },
    ],
    resultSource: "Ballou football Instagram post",
    resultSourceUrl: "https://www.instagram.com/bbbknightsfb/",
    resultNotes:
      "Corrected Aug. 29 from Ballou football's posted final: Ballou 28, Ron Brown 26. Supersedes the earlier conflicting result entry.",
  },
  {
    date: "2026-08-28",
    teams: [
      { aliases: ["KIPP College Prep"], score: 24 },
      { aliases: ["Jackson-Reed"], score: 0 },
    ],
    resultSource: "MaxPreps final",
    resultSourceUrl:
      "https://www.maxpreps.com/news/gizLdPp_tUiHNufNyaHI-A/football-recap-kipp-college-prep-now-3-2-since-losing-4-straight--how-to-watch.htm",
    resultNotes: "KIPP College Prep 24, Jackson-Reed 0.",
  },
  {
    date: "2026-08-28",
    teams: [
      { aliases: ["KIPP DC Legacy", "KIPP DC Legacy College Prep"], score: 6 },
      { aliases: ["McKinley Tech"], score: 0 },
    ],
    resultSource: "MaxPreps final",
    resultSourceUrl:
      "https://www.maxpreps.com/news/f6FgwO08OEqXW0tIV4qJrA/football-recap-kipp-dc-legacy-college-prep-extends-home-winning-streak-to-five.htm",
    resultNotes: "KIPP DC Legacy 6, McKinley Tech 0.",
  },
  {
    date: "2026-08-28",
    teams: [
      {
        aliases: [
          "St. Michael the Archangel",
          "St. Michael the Archangel (VA)",
          "St Michael the Archangel",
        ],
        score: 58,
      },
      { aliases: ["Bell"], score: 8 },
    ],
    resultSource: "MaxPreps Bell schedule",
    resultSourceUrl:
      "https://www.maxpreps.com/dc/washington/bell-griffins/football/schedule/",
    resultNotes:
      "MaxPreps Bell schedule lists the Aug. 28 final as St. Michael the Archangel 58, Bell 8.",
  },
];

const teamMatches = (name, aliases = []) => {
  const normalized = normalize(name);
  return aliases.some((alias) => normalize(alias) === normalized);
};

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

export function applyFootballResultCorrectionsAug29(games = []) {
  return games.map((game) => {
    const correction = corrections.find((entry) => gameMatches(game, entry));
    if (!correction) return game;

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
      resultSource: correction.resultSource,
      resultSourceUrl: correction.resultSourceUrl,
      resultNotes: correction.resultNotes,
      lastChecked: "2026-08-29",
    };
  });
}

export default applyFootballResultCorrectionsAug29;
