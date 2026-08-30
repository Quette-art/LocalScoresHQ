// LocalScoresHQ DC varsity football coverage audit — 2026-08-29.
//
// Adds schedule rows that were missing from the main DC dataset after checking
// the active 2026 varsity programs. Archbishop Carroll uses its official school
// schedule. Friendship, Maret, Sidwell Friends, St. Albans, Digital Pioneers
// Academy and KIPP rows below use current MaxPreps listings and therefore remain
// subject to change unless independently confirmed by a higher-tier source.
//
// Richard Wright is intentionally NOT added here: the two games currently
// surfaced on MaxPreps also appear on its JV page and conflict with the varsity
// schedules of Roosevelt/Digital Pioneers Academy.

const normalize = (value = "") =>
  String(value)
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/\./g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const slug = (value = "") =>
  normalize(value).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const matchupKey = (game) =>
  `${game.date}|${[normalize(game.team1), normalize(game.team2)].sort().join("|")}`;

const maxPreps = (date, time, team1, team2, location, sourceUrl, notes = "Added during Aug. 29 DC varsity schedule audit.") => ({
  id: `fb-${date}-${slug(team1)}-${slug(team2)}`,
  sport: "Football",
  division: "Varsity",
  ageGroup: "Varsity",
  date,
  time,
  team1,
  team2,
  score1: null,
  score2: null,
  location,
  scheduleStatus: "Subject to change",
  subjectToChange: true,
  verificationStatus: "Published - secondary",
  sourceTier: "Secondary / MaxPreps",
  sourceUrl,
  notes,
  lastChecked: "2026-08-29",
});

const official = (date, time, team1, team2, location, sourceUrl, notes = "Published on Archbishop Carroll's official 2026 varsity schedule.") => ({
  id: `fb-${date}-${slug(team1)}-${slug(team2)}`,
  sport: "Football",
  division: "Varsity",
  ageGroup: "Varsity",
  date,
  time,
  team1,
  team2,
  score1: null,
  score2: null,
  location,
  scheduleStatus: "Confirmed",
  subjectToChange: false,
  verificationStatus: "Published",
  sourceTier: "Official school",
  sourceUrl,
  notes,
  lastChecked: "2026-08-29",
});

const CARROLL = "https://www.archbishopcarroll.org/apps/pages/index.jsp?pREC_ID=760070&type=d&uREC_ID=350094";
const FRIENDSHIP = "https://www.maxpreps.com/dc/washington/friendship-collegiate-academy-knights/football/schedule/";
const MARET = "https://www.maxpreps.com/dc/washington/maret-frogs/football/schedule/";
const SIDWELL = "https://www.maxpreps.com/dc/washington/sidwell-friends-quakers/football/schedule/";
const ST_ALBANS = "https://www.maxpreps.com/dc/washington/st-albans-bulldogs/football/schedule/";
const DPA = "https://www.maxpreps.com/dc/washington/digital-pioneers-academy-pythons/football/schedule/";
const KIPP_CP = "https://www.maxpreps.com/dc/washington/kipp-college-prep-panthers/football/schedule/";
const KIPP_LEGACY = "https://www.maxpreps.com/dc/washington/kipp-dc-legacy-college-prep-bulldogs/football/schedule/";

const auditRows = [
  // Archbishop Carroll — official school schedule (scrimmages/BYE excluded).
  official("2026-09-04", "6:00 PM", "Archbishop Carroll", "Friendship Collegiate Academy", "Friendship Collegiate Academy", CARROLL),
  official("2026-09-11", "6:00 PM", "Archbishop Carroll", "KIPP DC Legacy", "KIPP DC Legacy", CARROLL),
  official("2026-09-18", "6:30 PM", "Archbishop Carroll", "Gonzaga", "Buchanan Field", CARROLL),
  official("2026-09-26", "12:00 PM", "Bishop McNamara", "Archbishop Carroll", "Archbishop Carroll High School", CARROLL),
  official("2026-10-10", "12:00 PM", "Landon", "Archbishop Carroll", "Archbishop Carroll High School", CARROLL),
  official("2026-10-17", "1:00 PM", "Archbishop Carroll", "Bishop Ireton", "Bishop Ireton", CARROLL),
  official("2026-10-24", "1:00 PM", "Paul VI", "Archbishop Carroll", "Archbishop Carroll High School", CARROLL),
  official("2026-10-31", "1:00 PM", "Archbishop Carroll", "Bishop O'Connell", "Bishop O'Connell", CARROLL),
  official("2026-11-07", "12:00 PM", "St. Mary's Ryken", "Archbishop Carroll", "Archbishop Carroll High School", CARROLL),

  // Friendship Collegiate Academy — current 2026 listing. Generic Nov. 13
  // "Varsity Opponent" placeholder is intentionally excluded.
  maxPreps("2026-08-28", "6:00 PM", "Friendship Collegiate Academy", "Eagle Academy II", "Eagle Academy II", FRIENDSHIP),
  maxPreps("2026-09-11", "7:00 PM", "Simon Gratz", "Friendship Collegiate Academy", "Friendship Collegiate Academy", FRIENDSHIP),
  maxPreps("2026-09-19", "12:00 PM", "Friendship Collegiate Academy", "St. Georges Tech", "St. Georges Tech", FRIENDSHIP),
  maxPreps("2026-09-25", "5:00 PM", "Friendship Collegiate Academy", "Roanoke Catholic", "Roanoke Catholic", FRIENDSHIP),
  maxPreps("2026-10-02", "7:00 PM", "Friendship Collegiate Academy", "Loudoun Sports Academy", "Loudoun Sports Academy", FRIENDSHIP),
  maxPreps("2026-10-09", "7:00 PM", "Friendship Collegiate Academy", "Mt. Zion Prep Academy", "Mt. Zion Prep Academy", FRIENDSHIP),
  maxPreps("2026-10-16", "6:00 PM", "KIPP College Prep", "Friendship Collegiate Academy", "Friendship Collegiate Academy", FRIENDSHIP),
  maxPreps("2026-10-30", "6:00 PM", "Riverdale Baptist", "Friendship Collegiate Academy", "Friendship Collegiate Academy", FRIENDSHIP),
  maxPreps("2026-11-07", "1:00 PM", "Friendship Collegiate Academy", "Connexions Leadership Academy", "Connexions Leadership Academy", FRIENDSHIP),

  // Maret — full current listing.
  maxPreps("2026-09-04", "4:30 PM", "Penn Wood", "Maret", "Maret", MARET),
  maxPreps("2026-09-10", "6:30 PM", "Maret", "Tower Hill", "Tower Hill", MARET),
  maxPreps("2026-09-18", "4:30 PM", "Bell", "Maret", "Maret", MARET),
  maxPreps("2026-09-26", "1:00 PM", "Maret", "Allegany", "Allegany", MARET),
  maxPreps("2026-10-02", "7:00 PM", "Maret", "Flint Hill", "Flint Hill", MARET),
  maxPreps("2026-10-10", "12:00 PM", "Maret", "Potomac School", "Potomac School", MARET),
  maxPreps("2026-10-24", "2:30 PM", "Sidwell Friends", "Maret", "Maret", MARET),
  maxPreps("2026-10-30", "3:30 PM", "St. Albans", "Maret", "Maret", MARET),
  maxPreps("2026-11-07", "1:30 PM", "Saint James", "Maret", "Maret", MARET),

  // Sidwell Friends. Ron Brown/Sidwell remains on the higher-tier official
  // team-graphic date already in the dataset; Phelps is also already present.
  maxPreps("2026-09-11", "4:30 PM", "Saint John Paul the Great Catholic", "Sidwell Friends", "Sidwell Friends", SIDWELL),
  maxPreps("2026-09-26", "1:00 PM", "Sidwell Friends", "St. Stephen's & St. Agnes", "St. Stephen's & St. Agnes", SIDWELL),
  maxPreps("2026-10-03", "2:00 PM", "Sidwell Friends", "Saint James", "Saint James", SIDWELL),
  maxPreps("2026-10-17", "2:30 PM", "Flint Hill", "Sidwell Friends", "Sidwell Friends", SIDWELL),
  maxPreps("2026-10-31", "12:00 PM", "Potomac School", "Sidwell Friends", "Sidwell Friends", SIDWELL),

  // St. Albans — full current listing; McKinley Tech game already exists.
  maxPreps("2026-08-28", "10:00 AM", "St. Albans", "St. Stephen's & St. Agnes", "St. Stephen's & St. Agnes", ST_ALBANS, "Final score still unreported as of Aug. 29 audit."),
  maxPreps("2026-09-04", "4:00 PM", "St. Albans", "St. Paul's", "St. Paul's", ST_ALBANS),
  maxPreps("2026-09-12", "1:00 PM", "Potomac School", "St. Albans", "St. Albans", ST_ALBANS),
  maxPreps("2026-09-17", "5:00 PM", "St. Albans", "St. John's Catholic Prep", "St. John's Catholic Prep", ST_ALBANS),
  maxPreps("2026-10-02", "7:00 PM", "St. Albans", "Paul VI", "Paul VI", ST_ALBANS),
  maxPreps("2026-10-17", "2:00 PM", "Episcopal", "St. Albans", "St. Albans", ST_ALBANS),
  maxPreps("2026-11-06", "7:00 PM", "St. Albans", "Bullis", "Bullis", ST_ALBANS),
  maxPreps("2026-11-14", "12:30 PM", "Landon", "St. Albans", "St. Albans", ST_ALBANS),

  // Digital Pioneers Academy — missing rows from its published 9-game slate.
  maxPreps("2026-09-05", "8:00 PM", "Eleanor Roosevelt", "Digital Pioneers Academy", "Digital Pioneers Academy", DPA),
  maxPreps("2026-09-25", "7:00 PM", "Digital Pioneers Academy", "Paul VI", "Paul VI", DPA),
  maxPreps("2026-10-02", "7:00 PM", "Digital Pioneers Academy", "Riverdale Baptist", "Riverdale Baptist", DPA),
  maxPreps("2026-10-09", "6:00 PM", "Digital Pioneers Academy", "KIPP College Prep", "KIPP College Prep", DPA),
  maxPreps("2026-10-23", "7:00 PM", "Digital Pioneers Academy", "Steubenville", "Steubenville", DPA),

  // KIPP College Prep — current Aug. 29 listing additions. The official
  // Anacostia graphic's Sept. 25 KIPP College Prep game is retained even though
  // it is not currently shown on MaxPreps.
  maxPreps("2026-09-11", "4:30 PM", "Friendly", "KIPP College Prep", "KIPP College Prep", KIPP_CP),
  maxPreps("2026-10-23", "6:00 PM", "Potomac School", "KIPP College Prep", "KIPP College Prep", KIPP_CP, "MaxPreps updated this matchup from Oct. 24 to Oct. 23 on Aug. 29."),

  // KIPP DC Legacy — add non-conflicting missing rows. The Sept. 25 Anacostia
  // listing conflicts with Anacostia's higher-tier official team graphic, so it
  // is intentionally not duplicated here.
  maxPreps("2026-10-09", "6:00 PM", "KIPP DC Legacy", "Eastern Tech", "Eastern Tech", KIPP_LEGACY),
  maxPreps("2026-10-16", "6:00 PM", "Riverdale Baptist", "KIPP DC Legacy", "KIPP DC Legacy", KIPP_LEGACY),
];

const friendshipFinalKey = matchupKey({
  date: "2026-08-28",
  team1: "Friendship Collegiate Academy",
  team2: "Eagle Academy II",
});

const staleKippPotomacKey = matchupKey({
  date: "2026-10-24",
  team1: "KIPP College Prep",
  team2: "Potomac School",
});

export function applyFootballScheduleAuditAug29(games = []) {
  // Remove only the stale KIPP/Potomac date superseded by the Aug. 29 listing.
  const next = games.filter((game) => matchupKey(game) !== staleKippPotomacKey);
  const byKey = new Map(next.map((game) => [matchupKey(game), game]));

  for (const row of auditRows) {
    const key = matchupKey(row);
    // Preserve any pre-existing row because many of those came from official
    // team graphics and outrank the secondary sources used in this audit.
    if (!byKey.has(key)) byKey.set(key, row);
  }

  const friendship = byKey.get(friendshipFinalKey);
  if (friendship) {
    byKey.set(friendshipFinalKey, {
      ...friendship,
      score1: 12,
      score2: 14,
      resultStatus: "Final",
      scheduleStatus: "Confirmed",
      subjectToChange: false,
      verificationStatus: "Final verified",
      resultSource: "MaxPreps final",
      resultSourceUrl: FRIENDSHIP,
      resultNotes: "Eagle Academy II 14, Friendship Collegiate Academy 12.",
      lastChecked: "2026-08-29",
    });
  }

  return [...byKey.values()].sort((a, b) =>
    String(a.date).localeCompare(String(b.date)) || String(a.time).localeCompare(String(b.time))
  );
}

export default applyFootballScheduleAuditAug29;
