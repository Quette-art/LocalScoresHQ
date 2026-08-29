// LocalScoresHQ football result pass — 2026-08-29.
//
// Adds verified finals from the Aug. 27-28 opening slate and clearly marks
// past games whose final score still cannot be confirmed from a trustworthy
// source. This layer intentionally sits on top of the schedule data so score
// corrections can be reviewed independently of the larger schedule files.

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

const gameMatches = (game, spec) => {
  const dates = spec.dates || [spec.date];
  if (!dates.includes(game.date)) return false;

  const [a, b] = spec.teams;
  return (
    (teamMatches(game.team1, a.aliases) && teamMatches(game.team2, b.aliases)) ||
    (teamMatches(game.team1, b.aliases) && teamMatches(game.team2, a.aliases))
  );
};

const scoreFor = (teamName, spec) => {
  const match = spec.teams.find((team) => teamMatches(teamName, team.aliases));
  return match?.score ?? null;
};

const finalSpecs = [
  {
    date: "2026-08-28",
    teams: [
      { aliases: ["Ron Brown"], score: 26 },
      { aliases: ["Ballou"], score: 32 },
    ],
    fallback: {
      id: "fb-2026-08-28-ron-brown-ballou",
      sport: "Football",
      division: "Varsity",
      ageGroup: "Varsity",
      date: "2026-08-28",
      time: "6:00 PM",
      team1: "Ron Brown",
      team2: "Ballou",
      location: "Ballou",
    },
    resultSourceUrl:
      "https://www.maxpreps.com/news/DGn1-gSJ90itWsbtuYwZdA/football-recap-ballou-now-2-1-since-losing-8-straight.htm",
    resultSource: "MaxPreps updated final",
    resultNotes:
      "Updated Aug. 29 result: Ballou 32, Ron Brown 26. This supersedes an earlier conflicting MaxPreps entry.",
  },
  {
    date: "2026-08-28",
    teams: [
      { aliases: ["New Town"], score: 6 },
      { aliases: ["Eastern"], score: 29 },
    ],
    fallback: {
      id: "fb-2026-08-28-new-town-eastern",
      sport: "Football",
      division: "Varsity",
      ageGroup: "Varsity",
      date: "2026-08-28",
      time: "6:00 PM",
      team1: "New Town",
      team2: "Eastern",
      location: "Eastern",
    },
    resultSourceUrl:
      "https://www.maxpreps.com/md/owings-mills/new-town-titans/football/",
    resultSource: "MaxPreps final",
    resultNotes: "Eastern 29, New Town 6.",
  },
  {
    date: "2026-08-28",
    teams: [
      { aliases: ["Gonzaga"], score: 22 },
      { aliases: ["Calvert Hall"], score: 21 },
    ],
    fallback: {
      id: "fb-2026-08-28-gonzaga-calvert-hall",
      sport: "Football",
      division: "Varsity",
      ageGroup: "Varsity",
      date: "2026-08-28",
      time: "7:00 PM",
      team1: "Gonzaga",
      team2: "Calvert Hall",
      location: "Calvert Hall College High School",
    },
    resultSourceUrl: "https://www.maxpreps.com/dc/",
    resultSource: "MaxPreps DC scoreboard",
    resultNotes: "Gonzaga 22, Calvert Hall 21.",
  },
  {
    date: "2026-08-28",
    teams: [
      { aliases: ["DeMatha"], score: 35 },
      { aliases: ["Archbishop Spalding"], score: 14 },
    ],
    fallback: {
      id: "fb-2026-08-28-dematha-archbishop-spalding",
      sport: "Football",
      division: "Varsity",
      ageGroup: "Varsity",
      date: "2026-08-28",
      time: "7:00 PM",
      team1: "DeMatha",
      team2: "Archbishop Spalding",
      location: "PG Sports & Learning",
    },
    resultSourceUrl: "https://www.maxpreps.com/md/",
    resultSource: "MaxPreps Maryland scoreboard / DC News Now",
    resultNotes: "DeMatha 35, Archbishop Spalding 14.",
  },
  {
    date: "2026-08-28",
    teams: [
      { aliases: ["John Champe"], score: 33 },
      { aliases: ["Dunbar"], score: 28 },
    ],
    fallback: {
      id: "fb-2026-08-28-john-champe-dunbar",
      sport: "Football",
      division: "Varsity",
      ageGroup: "Varsity",
      date: "2026-08-28",
      time: "7:00 PM",
      team1: "John Champe",
      team2: "Dunbar",
      location: "Dunbar",
    },
    resultSourceUrl:
      "https://www.maxpreps.com/news/DdH7ifHuFkSWmUNVUyQHsw/football-recap-dunbar-comes-up-short-against-john-champe--how-to-watch.htm",
    resultSource: "MaxPreps final / NFHS replay listing",
    resultNotes: "John Champe 33, Dunbar 28.",
  },
  {
    date: "2026-08-28",
    teams: [
      { aliases: ["Digital Pioneers Academy"], score: 38 },
      { aliases: ["Anacostia"], score: 6 },
    ],
    fallback: {
      id: "fb-2026-08-28-digital-pioneers-academy-anacostia",
      sport: "Football",
      division: "Varsity",
      ageGroup: "Varsity",
      date: "2026-08-28",
      time: "7:30 PM",
      team1: "Digital Pioneers Academy",
      team2: "Anacostia",
      location: "The St. James, Springfield, VA",
    },
    resultSourceUrl:
      "https://www.maxpreps.com/news/uFd6_pUwsEu3aBzO9haaug/football-recap-digital-pioneers-academy-piles-up-the-points-against-anacostia.htm",
    resultSource: "MaxPreps final",
    resultNotes: "Digital Pioneers Academy 38, Anacostia 6.",
  },
  {
    dates: ["2026-08-27", "2026-08-28"],
    teams: [
      { aliases: ["Coolidge"], score: 37 },
      {
        aliases: ["Kinnard (SC)", "Hunter-Kinard-Tyler", "Hunter Kinard Tyler"],
        score: 6,
      },
    ],
    fallback: {
      id: "fb-2026-08-28-coolidge-kinnard-sc",
      sport: "Football",
      division: "Varsity",
      ageGroup: "Varsity",
      date: "2026-08-28",
      time: "4:00 PM",
      team1: "Coolidge",
      team2: "Hunter-Kinard-Tyler",
      location: "Hunter-Kinard-Tyler",
    },
    resultSourceUrl:
      "https://www.maxpreps.com/sc/neeses/hunter-kinard-tyler-trojans/football/schedule/",
    resultSource: "MaxPreps final",
    resultNotes:
      "Coolidge 37, Hunter-Kinard-Tyler 6. Public listings conflict on Aug. 27 vs. Aug. 28, so the existing app date is retained for now.",
    keepSubjectToChange: true,
  },
];

const unconfirmedSpecs = [
  {
    date: "2026-08-28",
    teams: [
      { aliases: ["KIPP College Prep"] },
      { aliases: ["Jackson-Reed"] },
    ],
    sourceUrl:
      "https://www.maxpreps.com/dc/washington/kipp-college-prep-panthers/football/",
  },
  {
    date: "2026-08-28",
    teams: [
      { aliases: ["KIPP DC Legacy", "KIPP DC Legacy College Prep"] },
      { aliases: ["McKinley Tech"] },
    ],
    sourceUrl:
      "https://www.maxpreps.com/dc/football/game/kipp-dc-legacy-college-prep-washington-vs-mckinley-tech-washington/8-28-2026/?c=57698aee-d63b-4402-8672-2826e2432791",
  },
  {
    date: "2026-08-28",
    teams: [
      { aliases: ["St. Michael the Archangel (VA)", "St. Michael the Archangel"] },
      { aliases: ["Bell"] },
    ],
    sourceUrl: "https://www.maxpreps.com/dc/football/",
  },
  {
    dates: ["2026-08-27", "2026-08-28"],
    teams: [
      { aliases: ["Edmondson-Westside"] },
      { aliases: ["Phelps ACE", "Phelps"] },
    ],
    sourceUrl: "https://www.phelpshsdc.org/",
  },
  {
    date: "2026-08-28",
    teams: [
      { aliases: ["Roosevelt"] },
      { aliases: ["Potomac"] },
    ],
    fallback: {
      id: "fb-2026-08-28-roosevelt-potomac",
      sport: "Football",
      division: "Varsity",
      ageGroup: "Varsity",
      date: "2026-08-28",
      time: "6:00 PM",
      team1: "Roosevelt",
      team2: "Potomac",
      score1: null,
      score2: null,
      location: "Potomac",
      scheduleStatus: "Published",
      subjectToChange: false,
      sourceTier: "MaxPreps / NFHS",
    },
    sourceUrl:
      "https://www.maxpreps.com/dc/washington/roosevelt-roughriders/football/schedule/",
  },
];

const applyFinalSpec = (game, spec) => ({
  ...game,
  score1: scoreFor(game.team1, spec),
  score2: scoreFor(game.team2, spec),
  resultStatus: "Final",
  verificationStatus: spec.keepSubjectToChange
    ? "Final verified; date conflict remains"
    : "Final verified",
  scheduleStatus: spec.keepSubjectToChange
    ? "Final verified; date conflict"
    : "Confirmed",
  subjectToChange: !!spec.keepSubjectToChange,
  resultSource: spec.resultSource,
  resultSourceUrl: spec.resultSourceUrl,
  resultNotes: spec.resultNotes,
  lastChecked: "2026-08-29",
});

const markUnconfirmed = (game, spec) => {
  const baseLocation = String(game.location || "TBD")
    .replace(/\s*•\s*RESULT UNCONFIRMED$/i, "")
    .trim();

  return {
    ...game,
    score1: null,
    score2: null,
    resultStatus: "Unconfirmed",
    verificationStatus: "Result unconfirmed",
    location: `${baseLocation} • RESULT UNCONFIRMED`,
    resultSourceUrl: spec.sourceUrl,
    resultNotes:
      "No trustworthy final score found as of the Aug. 29 morning verification pass.",
    lastChecked: "2026-08-29",
  };
};

const timeValue = (time = "") => {
  const match = String(time).match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return 24 * 60;
  let hour = Number(match[1]);
  const minute = Number(match[2]);
  const period = match[3].toUpperCase();
  if (hour === 12) hour = 0;
  if (period === "PM") hour += 12;
  return hour * 60 + minute;
};

export function applyFootballResultsAug29(games = []) {
  let next = [...games];

  for (const spec of finalSpecs) {
    const index = next.findIndex((game) => gameMatches(game, spec));

    if (index >= 0) {
      next[index] = applyFinalSpec(next[index], spec);
      continue;
    }

    const fallback = applyFinalSpec(
      {
        ...spec.fallback,
        score1: null,
        score2: null,
        scheduleStatus: "Confirmed",
        subjectToChange: false,
        sourceTier: "Result verification pass",
      },
      spec
    );

    next.push(fallback);
  }

  for (const spec of unconfirmedSpecs) {
    const index = next.findIndex((game) => gameMatches(game, spec));

    if (index >= 0) {
      next[index] = markUnconfirmed(next[index], spec);
      continue;
    }

    if (spec.fallback) {
      next.push(markUnconfirmed(spec.fallback, spec));
    }
  }

  return next.sort((a, b) => {
    const dateCompare = String(a.date).localeCompare(String(b.date));
    if (dateCompare !== 0) return dateCompare;
    return timeValue(a.time) - timeValue(b.time);
  });
}

export default applyFootballResultsAug29;
