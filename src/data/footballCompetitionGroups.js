import {
  canonicalTrackedFootballSchool,
  dcTrackedFootballSchools,
  marylandTrackedFootballSchools,
} from "./trackedFootballSchools.js";

// LocalScoresHQ 2026 football competition groups.
//
// The site's coverage area is broader than a single league, so a football
// "division" here means the standings group a tracked school competes in.
// Opponent-only league members are included where needed so division records
// can still be calculated when a tracked school plays an untracked league foe.

const normalize = (value = "") =>
  String(value)
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/\./g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const opponentAliases = new Map([
  ["woodson", "H.D. Woodson"],
  ["theodore roosevelt", "Roosevelt"],
  ["bell chec", "Bell"],
  ["phelps architecture construction engineering", "Phelps ACE"],
  ["phelps ace high school", "Phelps ACE"],
  ["bishop oconnell", "Bishop O'Connell"],
  ["bishop o connell", "Bishop O'Connell"],
  ["paul vi catholic", "Paul VI"],
  ["st pauls vi", "Paul VI"],
  ["st stephens st agnes", "St. Stephen's & St. Agnes"],
  ["st stephen s st agnes", "St. Stephen's & St. Agnes"],
  ["st stephens and st agnes", "St. Stephen's & St. Agnes"],
  ["saint james", "Saint James"],
  ["saint james school", "Saint James"],
  ["the potomac school", "Potomac School"],
  ["potomac school", "Potomac School"],
  ["st andrews episcopal", "St. Andrew's Episcopal"],
  ["st andrew s episcopal", "St. Andrew's Episcopal"],
]);

export const canonicalFootballTeamName = (teamName = "") => {
  const tracked = canonicalTrackedFootballSchool(teamName);
  if (tracked) return tracked;

  const key = normalize(teamName);
  return opponentAliases.get(key) || String(teamName).trim();
};

const canonicalSet = (names = []) =>
  new Set(names.map((name) => normalize(canonicalFootballTeamName(name))));

const group = ({
  id,
  label,
  shortLabel,
  region,
  trackedTeams,
  leagueMembers = trackedTeams,
  countsDivisionGames = true,
  note = "",
}) => ({
  id,
  label,
  shortLabel: shortLabel || label,
  region,
  trackedTeams,
  leagueMembers,
  countsDivisionGames,
  note,
  trackedSet: canonicalSet(trackedTeams),
  leagueSet: canonicalSet(leagueMembers),
});

export const footballCompetitionGroups = [
  group({
    id: "dciaa-stars",
    label: "DCIAA Stars",
    shortLabel: "Stars",
    region: "DC",
    trackedTeams: [
      "Ballou",
      "Bell",
      "Coolidge",
      "Dunbar",
      "Eastern",
      "H.D. Woodson",
      "Roosevelt",
    ],
    note: "2026-27 DCIAA Stars alignment.",
  }),
  group({
    id: "dciaa-stripes",
    label: "DCIAA Stripes",
    shortLabel: "Stripes",
    region: "DC",
    trackedTeams: [
      "Anacostia",
      "Cardozo",
      "Jackson-Reed",
      "McKinley Tech",
      "Phelps ACE",
      "Ron Brown",
    ],
    note: "2026-27 DCIAA Stripes alignment.",
  }),
  group({
    id: "wcac-capital",
    label: "WCAC Capital",
    shortLabel: "WCAC Capital",
    region: "DMV",
    trackedTeams: [
      "Bishop McNamara",
      "DeMatha",
      "Gonzaga",
      "Our Lady of Good Counsel",
      "St. John’s",
    ],
    note: "WCAC Capital football group.",
  }),
  group({
    id: "wcac-metro",
    label: "WCAC Metro",
    shortLabel: "WCAC Metro",
    region: "DMV",
    trackedTeams: ["Archbishop Carroll", "St. Mary's Ryken"],
    leagueMembers: [
      "Archbishop Carroll",
      "St. Mary's Ryken",
      "Bishop Ireton",
      "Bishop O'Connell",
      "Paul VI",
    ],
    note: "Only LocalScoresHQ tracked schools are listed; opponent-only WCAC Metro members still count toward division records.",
  }),
  group({
    id: "iac",
    label: "IAC",
    shortLabel: "IAC",
    region: "DMV",
    trackedTeams: ["Bullis", "Georgetown Prep", "Landon", "St. Albans"],
    leagueMembers: [
      "Bullis",
      "Georgetown Prep",
      "Landon",
      "St. Albans",
      "Episcopal",
      "St. Stephen's & St. Agnes",
    ],
    note: "Interstate Athletic Conference. Opponent-only members can count toward tracked-team league records.",
  }),
  group({
    id: "mac",
    label: "MAC",
    shortLabel: "MAC",
    region: "DC",
    trackedTeams: ["Maret", "Sidwell Friends"],
    leagueMembers: [
      "Maret",
      "Sidwell Friends",
      "Flint Hill",
      "Georgetown Day",
      "St. Andrew's Episcopal",
      "Saint James",
      "Potomac School",
    ],
    note: "Mid-Atlantic Athletic Conference. Only tracked schools are listed in LocalScoresHQ standings.",
  }),
  group({
    id: "pgcps-4a3a",
    label: "PGCPS 4A/3A",
    shortLabel: "PG 4A/3A",
    region: "MD",
    trackedTeams: [
      "Bladensburg",
      "Bowie",
      "DuVal",
      "Eleanor Roosevelt",
      "Flowers",
      "High Point",
      "Laurel",
      "Northwestern",
      "Oxon Hill",
      "Parkdale",
      "Potomac",
      "Suitland",
      "Wise",
    ],
    note: "Prince George's County 4A/3A football group.",
  }),
  group({
    id: "pgcps-2a1a",
    label: "PGCPS 2A/1A",
    shortLabel: "PG 2A/1A",
    region: "MD",
    trackedTeams: [
      "Central",
      "Crossland",
      "Fairmont Heights",
      "Frederick Douglass",
      "Friendly",
      "Gwynn Park",
      "Largo",
      "Surrattsville",
    ],
    note: "Prince George's County 2A/1A football group.",
  }),
  group({
    id: "dc-other",
    label: "D.C. Independent / PCSAA",
    shortLabel: "DC Other",
    region: "DC",
    trackedTeams: [
      "Friendship Collegiate Academy",
      "Digital Pioneers Academy",
      "KIPP College Prep",
      "KIPP DC Legacy",
    ],
    countsDivisionGames: false,
    note: "Coverage group, not one single league table. Overall records are shown without a combined division record.",
  }),
  group({
    id: "md-other",
    label: "Maryland Private / Independent",
    shortLabel: "MD Private",
    region: "MD",
    trackedTeams: [
      "Mt. Zion Prep Academy",
      "National Christian Academy",
      "Riverdale Baptist",
      "Rock Creek Christian Academy",
      "St. Vincent Pallotti",
    ],
    countsDivisionGames: false,
    note: "Coverage group for tracked Maryland private/independent programs outside the primary standings groups.",
  }),
];

const groupsById = new Map(
  footballCompetitionGroups.map((entry) => [entry.id, entry])
);

export const getFootballCompetitionGroup = (groupId) =>
  groupsById.get(groupId) || null;

export const getFootballCompetitionGroupsForTeam = (teamName = "") => {
  const key = normalize(canonicalFootballTeamName(teamName));
  return footballCompetitionGroups.filter((entry) => entry.trackedSet.has(key));
};

export const getPrimaryFootballCompetitionGroup = (teamName = "") =>
  getFootballCompetitionGroupsForTeam(teamName)[0] || null;

export const getFootballCompetitionGroupsForGame = (game = {}) => {
  const found = new Map();

  [game.team1, game.team2].forEach((teamName) => {
    getFootballCompetitionGroupsForTeam(teamName).forEach((entry) => {
      found.set(entry.id, entry);
    });
  });

  return [...found.values()];
};

// Used by score filters: include a game when at least one tracked team belongs
// to the selected competition group.
export const gameMatchesFootballCompetitionGroup = (game = {}, groupId) => {
  if (!groupId || groupId === "ALL") return true;

  const entry = getFootballCompetitionGroup(groupId);
  if (!entry) return false;

  return [game.team1, game.team2].some((teamName) =>
    entry.trackedSet.has(normalize(canonicalFootballTeamName(teamName)))
  );
};

// Used for the DIV/league record in standings. Both opponents must actually be
// members of that competition group; cross-division/non-league games do not
// inflate the division record.
export const isFootballCompetitionGame = (game = {}, groupId) => {
  const entry = getFootballCompetitionGroup(groupId);
  if (!entry?.countsDivisionGames) return false;

  return [game.team1, game.team2].every((teamName) =>
    entry.leagueSet.has(normalize(canonicalFootballTeamName(teamName)))
  );
};

export const getFootballDivisionLabelForTeam = (teamName = "") =>
  getPrimaryFootballCompetitionGroup(teamName)?.label || "Independent";

export const getFootballDivisionLabelsForGame = (game = {}) =>
  getFootballCompetitionGroupsForGame(game).map((entry) => entry.label);

export const dcOverallFootballSchools = [...dcTrackedFootballSchools];
export const marylandOverallFootballSchools = [...marylandTrackedFootballSchools];

export default footballCompetitionGroups;
