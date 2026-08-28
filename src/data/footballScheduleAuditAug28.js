const clean = (value = "") =>
  String(value)
    .replace(/[’‘]/g, "'")
    .replace(/&/g, "and")
    .replace(/\./g, "")
    .replace(/[^a-zA-Z0-9']+/g, " ")
    .trim()
    .toLowerCase();

const canonicalTeam = (name = "") => {
  const n = clean(name);
  const aliases = {
    "h d woodson": "woodson",
    woodson: "woodson",
    "kipp dc legacy college prep": "kipp dc legacy",
    kippdclcp: "kipp dc legacy",
    pace: "phelps ace",
    "phelps a c e high school": "phelps ace",
    "phelps architecture construction and engineering": "phelps ace",
    "st stephens st agnes": "st stephens and st agnes",
    "st stephen's and st agnes": "st stephens and st agnes",
    "st stephens and st agnes": "st stephens and st agnes",
    "st james school": "saint james",
    "saint james school": "saint james",
    "st james": "saint james",
    "mt zion": "mt zion prep academy",
    "mt zion prep": "mt zion prep academy",
  };
  return aliases[n] || n;
};

const pairKey = (a, b) =>
  [canonicalTeam(a), canonicalTeam(b)].sort().join("|");

const gameKey = (game) => `${game.date}|${pairKey(game.team1, game.team2)}`;

const slug = (value = "") =>
  clean(value).replace(/'/g, "").replace(/\s+/g, "-");

const baseMeta = {
  sport: "Football",
  division: "Varsity",
  ageGroup: "Varsity",
  score1: null,
  score2: null,
  lastChecked: "2026-08-28",
};

const official = (sourceUrl, notes = "") => ({
  ...baseMeta,
  scheduleStatus: "Confirmed",
  subjectToChange: false,
  verificationStatus: "Published",
  sourceTier: "Official school",
  sourceUrl,
  notes,
});

const officialTeam = (sourceUrl, notes = "") => ({
  ...baseMeta,
  scheduleStatus: "Confirmed",
  subjectToChange: false,
  verificationStatus: "Published",
  sourceTier: "Official team",
  sourceUrl,
  notes,
});

const secondary = (sourceUrl, notes = "") => ({
  ...baseMeta,
  scheduleStatus: "Subject to change",
  subjectToChange: true,
  verificationStatus: "Needs official confirmation",
  sourceTier: "Secondary / MaxPreps",
  sourceUrl,
  notes,
});

const conflict = (sourceUrl, notes = "") => ({
  ...baseMeta,
  scheduleStatus: "Subject to change",
  subjectToChange: true,
  verificationStatus: "Conflicting official sources",
  sourceTier: "Official school / team conflict",
  sourceUrl,
  notes,
});

const corroboratedTime = (sourceUrl, notes = "") => ({
  ...baseMeta,
  scheduleStatus: "Confirmed",
  subjectToChange: false,
  verificationStatus: "Published - time corroborated",
  sourceTier: "Official team + current listing",
  sourceUrl,
  notes,
});

const sidwell = "https://www.sidwell.edu/athletics/team-page/~athletics-team-id/229";
const archbishopCarroll = "https://www.archbishopcarroll.org/apps/pages/index.jsp?uREC_ID=350094&type=d&pREC_ID=760070";
const stAlbans = "https://www.stalbansschool.org/team-detail?Team=150814&fromId=213575";
const ballou = "https://www.instagram.com/bbbknightsfb/";
const ballouMaxPreps = "https://www.maxpreps.com/dc/washington/ballou-knights/football/schedule/";
const rooseveltMaxPreps = "https://www.maxpreps.com/dc/washington/roosevelt-roughriders/football/schedule/";
const friendshipMaxPreps = "https://www.maxpreps.com/dc/washington/friendship-collegiate-academy-knights/football/schedule/";
const digitalPioneersMaxPreps = "https://www.maxpreps.com/dc/washington/digital-pioneers-academy-pythons/football/schedule/";
const kippCollegePrepMaxPreps = "https://www.maxpreps.com/dc/washington/kipp-college-prep-panthers/football/";
const maretMaxPreps = "https://www.maxpreps.com/dc/washington/maret-frogs/football/schedule/";
const paulVI = "https://www.paulvi.net/team-page?Team=217720&fromId=304717";

const auditedRows = [
  // Restored after the Aug. 22 team-overlay filter removed this Ballou game.
  {
    date: "2026-08-28", time: "6:00 PM", team1: "Ron Brown", team2: "Ballou", location: "Ballou",
    replacePair: true,
    ...corroboratedTime(ballou, "Ballou's official 2026 team graphic confirms the matchup/home game; current Ballou and Ron Brown listings both show a 6:00 PM kickoff. Terry Bennett Day."),
  },
  {
    date: "2026-08-28", time: "6:00 PM", team1: "Roosevelt", team2: "Potomac", location: "Potomac",
    replacePair: true,
    ...secondary(rooseveltMaxPreps, "Current Roosevelt 2026 listing shows the Aug. 28 away game at Potomac at 6:00 PM; it was omitted by the Aug. 22 team overlay."),
  },

  // Sidwell Friends — current official school schedule.
  { date: "2026-08-26", time: "5:00 PM", team1: "Sidwell Friends", team2: "Fairmont Heights", location: "Fairmont Heights High School", replacePair: true, ...official(sidwell, "Sidwell official 2026 varsity football schedule; away game.") },
  { date: "2026-09-04", time: "6:00 PM", team1: "Sidwell Friends", team2: "Ron Brown", location: "Spingarn Field", replacePair: true, ...official(sidwell, "Sidwell's current official schedule lists Sept. 4; this replaces the older Ron Brown graphic's Sept. 3 date.") },
  { date: "2026-09-11", time: "4:30 PM", team1: "St. John Paul the Great Catholic", team2: "Sidwell Friends", location: "Lower Turf Field", replacePair: true, ...official(sidwell, "Sidwell official 2026 varsity football schedule; home game.") },
  { date: "2026-09-18", time: "4:30 PM", team1: "Sidwell Friends", team2: "Phelps ACE", location: "Spingarn Field", replacePair: true, ...conflict(sidwell, "Sidwell's live official page lists 4:30 PM; Phelps' official team graphic lists 6:00 PM. Matchup is confirmed but kickoff time remains subject to change.") },
  { date: "2026-09-26", time: "1:00 PM", team1: "Sidwell Friends", team2: "St. Stephen's & St. Agnes", location: "St. Stephen's & St. Agnes", replacePair: true, ...official(sidwell, "Sidwell official 2026 varsity football schedule; away game.") },
  { date: "2026-10-03", time: "2:00 PM", team1: "Sidwell Friends", team2: "Saint James", location: "Saint James School", replacePair: true, ...official(sidwell, "Sidwell official 2026 varsity football schedule; away game.") },
  { date: "2026-10-17", time: "2:00 PM", team1: "Flint Hill", team2: "Sidwell Friends", location: "Lower Turf Field", replacePair: true, ...official(sidwell, "Sidwell official 2026 varsity football schedule; home game.") },
  { date: "2026-10-24", time: "2:30 PM", team1: "Sidwell Friends", team2: "Maret", location: "Maret", replacePair: true, ...secondary(maretMaxPreps, "Sidwell's official schedule confirms the Oct. 24 away matchup but currently shows All Day; Maret's current listing supplies the 2:30 PM kickoff.") },
  { date: "2026-10-31", time: "12:00 PM", team1: "Potomac School", team2: "Sidwell Friends", location: "Lower Turf Field", replacePair: true, ...official(sidwell, "Sidwell official 2026 varsity football schedule; home game.") },

  // Archbishop Carroll — full official school varsity schedule (scrimmage and bye excluded).
  { date: "2026-09-04", time: "6:00 PM", team1: "Archbishop Carroll", team2: "Friendship Collegiate", location: "Friendship Collegiate", replacePair: true, ...official(archbishopCarroll, "Archbishop Carroll official 2026 varsity schedule; away game.") },
  { date: "2026-09-11", time: "6:00 PM", team1: "Archbishop Carroll", team2: "KIPP DC Legacy", location: "KIPP DC Legacy", replacePair: true, ...official(archbishopCarroll, "Archbishop Carroll official 2026 varsity schedule; away game.") },
  { date: "2026-09-18", time: "6:30 PM", team1: "Archbishop Carroll", team2: "Gonzaga", location: "Buchanan Field", replacePair: true, ...official(archbishopCarroll, "Archbishop Carroll official 2026 varsity schedule; away game. Also published by Gonzaga.") },
  { date: "2026-09-26", time: "12:00 PM", team1: "Bishop McNamara", team2: "Archbishop Carroll", location: "Archbishop Carroll High School", replacePair: true, ...official(archbishopCarroll, "Archbishop Carroll official 2026 varsity schedule; home game.") },
  { date: "2026-10-10", time: "12:00 PM", team1: "Landon", team2: "Archbishop Carroll", location: "Archbishop Carroll High School", replacePair: true, ...official(archbishopCarroll, "Archbishop Carroll official 2026 varsity schedule; home game.") },
  { date: "2026-10-17", time: "1:00 PM", team1: "Archbishop Carroll", team2: "Bishop Ireton", location: "Bishop Ireton High School", replacePair: true, ...official(archbishopCarroll, "Archbishop Carroll official 2026 varsity schedule; away game.") },
  { date: "2026-10-24", time: "1:00 PM", team1: "Paul VI", team2: "Archbishop Carroll", location: "Archbishop Carroll High School", replacePair: true, ...official(archbishopCarroll, "Archbishop Carroll official 2026 varsity schedule; homecoming/home game.") },
  { date: "2026-10-31", time: "1:00 PM", team1: "Archbishop Carroll", team2: "Bishop O'Connell", location: "Bishop O'Connell High School", replacePair: true, ...official(archbishopCarroll, "Archbishop Carroll official 2026 varsity schedule; away game.") },
  { date: "2026-11-07", time: "12:00 PM", team1: "St. Mary's Ryken", team2: "Archbishop Carroll", location: "Archbishop Carroll High School", replacePair: true, ...official(archbishopCarroll, "Archbishop Carroll official 2026 varsity schedule; Senior Day/home game.") },

  // St. Albans — current official school schedule. Scrimmages and HOLD dates are excluded.
  { date: "2026-09-04", time: "4:30 PM", team1: "St. Albans", team2: "St. Paul's", location: "St. Paul's School", replacePair: true, ...official(stAlbans, "St. Albans official 2026 varsity football schedule; away game.") },
  { date: "2026-09-12", time: "1:00 PM", team1: "Potomac School", team2: "St. Albans", location: "Steuart Field", replacePair: true, ...official(stAlbans, "St. Albans official 2026 varsity football schedule; home game.") },
  { date: "2026-09-17", time: "5:00 PM", team1: "St. Albans", team2: "St. John's Catholic Prep", location: "St. John's Catholic Prep", replacePair: true, ...official(stAlbans, "St. Albans official 2026 varsity football schedule; away game.") },
  { date: "2026-09-26", time: "2:00 PM", team1: "McKinley Tech", team2: "St. Albans", location: "Steuart Field", replacePair: true, ...official(stAlbans, "St. Albans official 2026 varsity football schedule; home game. School page labels the opponent McKinley Prep; matched to McKinley Tech's published schedule.") },
  { date: "2026-10-02", time: "6:00 PM", team1: "St. Albans", team2: "Paul VI", location: "St. Paul VI Catholic High School", replacePair: true, ...official(stAlbans, "St. Albans official 2026 varsity football schedule; away game.") },
  { date: "2026-10-17", time: "2:00 PM", team1: "Episcopal", team2: "St. Albans", location: "Steuart Field", replacePair: true, ...official(stAlbans, "St. Albans official 2026 varsity football schedule; home league game.") },
  { date: "2026-10-31", time: "1:00 PM", team1: "St. Albans", team2: "Maret", location: "Maret", replacePair: true, ...conflict(stAlbans, "St. Albans' official page lists Oct. 31 at 1:00 PM; Maret's secondary listing shows Oct. 30 at 3:30 PM. Using the official St. Albans date/time while retaining subject-to-change status.") },
  { date: "2026-11-06", time: "7:00 PM", team1: "St. Albans", team2: "Bullis", location: "Bullis School", replacePair: true, ...official(stAlbans, "St. Albans official 2026 varsity football schedule; away league game.") },
  { date: "2026-11-14", time: "1:00 PM", team1: "Landon", team2: "St. Albans", location: "Steuart Field", replacePair: true, ...official(stAlbans, "St. Albans official 2026 varsity football schedule; home league game.") },

  // Friendship Collegiate — named games from the current public schedule. Ambiguous C CLA and placeholder Varsity Opponent rows are intentionally excluded.
  { date: "2026-08-28", time: "6:00 PM", team1: "Friendship Collegiate", team2: "Eagle Academy II", location: "Eagle Academy II", ...secondary(friendshipMaxPreps, "Current Friendship Collegiate 2026 listing; away game.") },
  { date: "2026-09-11", time: "7:00 PM", team1: "Simon Gratz", team2: "Friendship Collegiate", location: "Friendship Collegiate", ...secondary(friendshipMaxPreps, "Current Friendship Collegiate 2026 listing; home game.") },
  { date: "2026-09-19", time: "12:00 PM", team1: "Friendship Collegiate", team2: "St. Georges Tech", location: "St. Georges Tech", ...secondary(friendshipMaxPreps, "Current Friendship Collegiate 2026 listing; away game.") },
  { date: "2026-09-25", time: "5:00 PM", team1: "Friendship Collegiate", team2: "Roanoke Catholic", location: "Roanoke Catholic", ...secondary(friendshipMaxPreps, "Current Friendship Collegiate 2026 listing; away game.") },
  { date: "2026-10-02", time: "7:00 PM", team1: "Friendship Collegiate", team2: "Loudoun Sports Academy", location: "Loudoun Sports Academy", ...secondary(friendshipMaxPreps, "Current Friendship Collegiate 2026 listing; away game.") },
  { date: "2026-10-09", time: "7:00 PM", team1: "Friendship Collegiate", team2: "Mt. Zion Prep Academy", location: "Mt. Zion Prep Academy", ...secondary(friendshipMaxPreps, "Current Friendship Collegiate 2026 listing; away game.") },
  { date: "2026-10-16", time: "6:00 PM", team1: "KIPP College Prep", team2: "Friendship Collegiate", location: "Friendship Collegiate", ...secondary(friendshipMaxPreps, "Current Friendship Collegiate 2026 listing; home game.") },
  { date: "2026-10-30", time: "6:00 PM", team1: "Riverdale Baptist", team2: "Friendship Collegiate", location: "Friendship Collegiate", ...secondary(friendshipMaxPreps, "Current Friendship Collegiate 2026 listing; home game.") },

  // Digital Pioneers — fill games missing from the official-graphic overlay.
  { date: "2026-09-05", time: "8:00 PM", team1: "Eleanor Roosevelt", team2: "Digital Pioneers Academy", location: "Digital Pioneers Academy", ...secondary(digitalPioneersMaxPreps, "Current Digital Pioneers 2026 listing; home game.") },
  { date: "2026-09-11", time: "6:00 PM", team1: "Digital Pioneers Academy", team2: "Roosevelt", location: "Roosevelt", replacePair: true, ...corroboratedTime(digitalPioneersMaxPreps, "The supplied Roosevelt team graphic confirms this matchup; current Digital Pioneers and Roosevelt listings both show 6:00 PM.") },
  { date: "2026-09-25", time: "7:00 PM", team1: "Digital Pioneers Academy", team2: "Paul VI", location: "St. Paul VI Catholic High School", replacePair: true, ...official(paulVI, "Paul VI's official varsity schedule confirms Digital Pioneers at Paul VI at 7:00 PM.") },
  { date: "2026-10-02", time: "7:00 PM", team1: "Digital Pioneers Academy", team2: "Riverdale Baptist", location: "Riverdale Baptist", ...secondary(digitalPioneersMaxPreps, "Current Digital Pioneers 2026 listing; away game.") },
  { date: "2026-10-09", time: "6:00 PM", team1: "Digital Pioneers Academy", team2: "KIPP College Prep", location: "KIPP College Prep", ...secondary(digitalPioneersMaxPreps, "Current Digital Pioneers 2026 listing; league away game.") },
  { date: "2026-10-23", time: "7:00 PM", team1: "Digital Pioneers Academy", team2: "Steubenville", location: "Steubenville", ...secondary(digitalPioneersMaxPreps, "Current Digital Pioneers 2026 listing; away game.") },
  { date: "2026-10-30", time: "7:00 PM", team1: "KIPP DC Legacy", team2: "Digital Pioneers Academy", location: "Digital Pioneers Academy", replacePair: true, ...secondary(digitalPioneersMaxPreps, "Both current Digital Pioneers and KIPP DC Legacy listings show a 7:00 PM league game.") },

  // KIPP College Prep — current listing added a Friendly game; other missing games are cross-listed above.
  { date: "2026-09-11", time: "4:30 PM", team1: "Friendly", team2: "KIPP College Prep", location: "KIPP College Prep", ...secondary(kippCollegePrepMaxPreps, "Current KIPP College Prep schedule-at-a-glance lists Friendly at 4:30 PM.") },

  // Maret — official team page has not published events yet, so these remain subject to change.
  { date: "2026-09-04", time: "4:30 PM", team1: "Penn Wood", team2: "Maret", location: "Maret", ...secondary(maretMaxPreps, "Current Maret 2026 listing; home game.") },
  { date: "2026-09-10", time: "6:30 PM", team1: "Maret", team2: "St. John's Catholic Prep", location: "St. John's Catholic Prep", ...secondary(maretMaxPreps, "Current Maret 2026 listing; away game.") },
  { date: "2026-09-26", time: "1:00 PM", team1: "Maret", team2: "Allegany", location: "Allegany", ...secondary(maretMaxPreps, "Current Maret 2026 listing; away game.") },
  { date: "2026-10-02", time: "7:00 PM", team1: "Maret", team2: "Flint Hill", location: "Flint Hill", ...secondary(maretMaxPreps, "Current Maret 2026 listing; away league game.") },
  { date: "2026-10-10", time: "12:00 PM", team1: "Maret", team2: "Potomac School", location: "Potomac School", ...secondary(maretMaxPreps, "Current Maret 2026 listing; away game.") },
  { date: "2026-11-07", time: "1:30 PM", team1: "Saint James", team2: "Maret", location: "Maret", ...secondary(maretMaxPreps, "Current Maret 2026 listing; home league game.") },

  // Useful kickoff-time fills for already-confirmed DCIAA matchups.
  { date: "2026-09-03", time: "7:00 PM", team1: "Ballou", team2: "Yorktown", location: "Yorktown", replacePair: true, ...corroboratedTime(ballouMaxPreps, "Ballou's official team graphic confirms the away matchup; current Ballou listing supplies the 7:00 PM kickoff.") },
  { date: "2026-10-15", time: "6:00 PM", team1: "Roosevelt", team2: "Ballou", location: "Ballou", replacePair: true, ...corroboratedTime(ballouMaxPreps, "Ballou's official team graphic confirms the home matchup; current Ballou and Roosevelt listings show 6:00 PM.") },
  { date: "2026-10-03", time: "12:30 PM", team1: "Bullis", team2: "Roosevelt", location: "Bullis", replacePair: true, ...secondary(rooseveltMaxPreps, "Current Roosevelt 2026 listing supplies a 12:30 PM kickoff for the away game at Bullis; older team graphic listed the matchup without a time.") },
];

const additions = auditedRows.map((row) => {
  const { replacePair, ...game } = row;
  return {
    id: game.id || `fb-${game.date}-${slug(game.team1)}-${slug(game.team2)}`,
    ...game,
    replacePair: Boolean(replacePair),
  };
});

const timeValue = (time = "") => {
  const match = String(time).match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return 24 * 60;
  let hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour === 12) hour = 0;
  if (match[3].toUpperCase() === "PM") hour += 12;
  return hour * 60 + minute;
};

export function applyFootballScheduleAudit(games = []) {
  let result = [...games];

  for (const addition of additions) {
    const pKey = pairKey(addition.team1, addition.team2);
    const gKey = gameKey(addition);

    result = result.filter((existing) => {
      if (addition.replacePair && pairKey(existing.team1, existing.team2) === pKey) return false;
      return gameKey(existing) !== gKey;
    });

    const { replacePair: _replacePair, ...cleanAddition } = addition;
    result.push(cleanAddition);
  }

  return result.sort((a, b) => {
    const dateCompare = String(a.date).localeCompare(String(b.date));
    if (dateCompare !== 0) return dateCompare;
    const timeCompare = timeValue(a.time) - timeValue(b.time);
    if (timeCompare !== 0) return timeCompare;
    return String(a.team1).localeCompare(String(b.team1));
  });
}

export default applyFootballScheduleAudit;
