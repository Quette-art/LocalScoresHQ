// Full 2026 varsity schedules for the three WCAC Metro programs newly shown
// in LocalScoresHQ league standings: Bishop Ireton, Bishop O'Connell, and Paul VI.
//
// Schedule sources were re-checked Sept. 13, 2026 against official school pages.
// Scrimmages are excluded when an official opponent/source identifies them as such.
// Verified completed scores use official school results where available and
// DCSportsFan's Sept. 11 score roundup for cross-checking recent finals.

const SOURCES = {
  "Bishop Ireton": "https://www.bishopireton.org/varsity-highlights?Team=223723",
  "Bishop O'Connell": "https://www.bishopoconnell.org/athletics/teams/football",
  "Paul VI": "https://www.paulvi.net/team-page?Team=217720&fromId=304717",
  "DCSportsFan Sept. 11 results": "https://dcsportsfan.com/2026/09/11/football-scores/",
};

const rows = [
  // Bishop Ireton — official school schedule; Aug. 21 St. Albans scrimmage excluded.
  { date: "2026-08-29", time: "12:00 PM", team1: "Bullis", team2: "Bishop Ireton", location: "Bishop Ireton High School", sourceTeam: "Bishop Ireton", score1: 49, score2: 14 },
  { date: "2026-09-04", time: "7:00 PM", team1: "Bishop Ireton", team2: "Our Lady of Mount Carmel", location: "Our Lady of Mount Carmel School", sourceTeam: "Bishop Ireton", score1: 0, score2: 42, resultSource: "DCSportsFan Sept. 11 results" },
  { date: "2026-09-11", time: "6:00 PM", team1: "Bishop Ireton", team2: "McKinley Tech", location: "McKinley Technology High School", sourceTeam: "Bishop Ireton", score1: 40, score2: 30, resultSource: "DCSportsFan Sept. 11 results" },
  { date: "2026-09-19", time: "12:00 PM", team1: "Ron Brown", team2: "Bishop Ireton", location: "Bishop Ireton High School", sourceTeam: "Bishop Ireton" },
  { date: "2026-09-26", time: "1:00 PM", team1: "Bishop Ireton", team2: "Landon", location: "Landon School", sourceTeam: "Bishop Ireton" },
  { date: "2026-10-02", time: "4:00 PM", team1: "Bishop Ireton", team2: "St. Stephen's & St. Agnes", location: "St. Stephen's & St. Agnes School", sourceTeam: "Bishop Ireton" },
  {
    date: "2026-10-10",
    time: "11:00 AM",
    team1: "Bishop O'Connell",
    team2: "Bishop Ireton",
    location: "Bishop Ireton High School",
    sourceTeam: "Bishop Ireton",
    subjectToChange: true,
    notes: "Official home listing shows 11:00 AM; Bishop O'Connell's page currently shows 10:00 AM.",
  },
  { date: "2026-10-17", time: "1:00 PM", team1: "Archbishop Carroll", team2: "Bishop Ireton", location: "Bishop Ireton High School", sourceTeam: "Bishop Ireton" },
  { date: "2026-10-23", time: "7:00 PM", team1: "Bishop Ireton", team2: "St. Mary's Ryken", location: "St. Mary's Ryken High School", sourceTeam: "Bishop Ireton" },
  {
    date: "2026-10-30",
    time: "7:00 PM",
    team1: "Bishop Ireton",
    team2: "Paul VI",
    location: "St. Paul VI Catholic High School",
    sourceTeam: "Paul VI",
    subjectToChange: true,
    notes: "Paul VI's official home schedule shows Oct. 30; Bishop Ireton's page currently shows Oct. 31.",
  },

  // Bishop O'Connell — official school schedule.
  { date: "2026-08-21", time: "5:00 PM", team1: "Bishop O'Connell", team2: "Landon", location: "Landon School", sourceTeam: "Bishop O'Connell" },
  { date: "2026-08-28", time: "4:00 PM", team1: "Washington-Liberty", team2: "Bishop O'Connell", location: "Bishop O'Connell High School", sourceTeam: "Bishop O'Connell", score1: 35, score2: 21 },
  { date: "2026-09-04", time: "7:00 PM", team1: "Bishop O'Connell", team2: "John Paul the Great", location: "Saint John Paul the Great Catholic High School", sourceTeam: "Bishop O'Connell", score1: 41, score2: 0 },
  { date: "2026-09-19", time: "1:00 PM", team1: "Washington High School", team2: "Bishop O'Connell", location: "Bishop O'Connell High School", sourceTeam: "Bishop O'Connell" },
  { date: "2026-09-26", time: "1:00 PM", team1: "Northern VA Home School Athletic Assoc", team2: "Bishop O'Connell", location: "Bishop O'Connell High School", sourceTeam: "Bishop O'Connell" },
  { date: "2026-10-03", time: "TBD", team1: "Bishop O'Connell", team2: "Potomac School", location: "Potomac School", sourceTeam: "Bishop O'Connell" },
  { date: "2026-10-16", time: "7:00 PM", team1: "Bishop O'Connell", team2: "St. Mary's Ryken", location: "St. Mary's Ryken High School", sourceTeam: "Bishop O'Connell" },
  { date: "2026-10-24", time: "12:00 PM", team1: "St. John's Catholic Prep", team2: "Bishop O'Connell", location: "Bishop O'Connell High School", sourceTeam: "Bishop O'Connell" },
  { date: "2026-10-31", time: "1:00 PM", team1: "Archbishop Carroll", team2: "Bishop O'Connell", location: "Bishop O'Connell High School", sourceTeam: "Bishop O'Connell" },
  { date: "2026-11-07", time: "1:00 PM", team1: "Paul VI", team2: "Bishop O'Connell", location: "Bishop O'Connell High School", sourceTeam: "Bishop O'Connell" },

  // Paul VI — official school schedule. Georgetown Prep Aug. 21 is excluded
  // because Georgetown Prep's official schedule classifies it as a scrimmage.
  { date: "2026-08-14", time: "4:00 PM", team1: "Loudoun Sports Academy", team2: "Paul VI", location: "St. Paul VI Catholic High School", sourceTeam: "Paul VI" },
  { date: "2026-09-04", time: "7:00 PM", team1: "Episcopal", team2: "Paul VI", location: "St. Paul VI Catholic High School", sourceTeam: "Paul VI", score1: 20, score2: 8 },
  { date: "2026-09-10", time: "4:00 PM", team1: "Paul VI", team2: "Landon", location: "Landon School", sourceTeam: "Paul VI", score1: 0, score2: 27, resultSource: "DCSportsFan Sept. 11 results" },
  { date: "2026-09-18", time: "7:00 PM", team1: "John Paul the Great", team2: "Paul VI", location: "St. Paul VI Catholic High School", sourceTeam: "Paul VI" },
  { date: "2026-09-25", time: "7:00 PM", team1: "Digital Pioneers Academy", team2: "Paul VI", location: "St. Paul VI Catholic High School", sourceTeam: "Paul VI" },
  { date: "2026-10-02", time: "7:00 PM", team1: "St. Albans", team2: "Paul VI", location: "St. Paul VI Catholic High School", sourceTeam: "Paul VI" },
  { date: "2026-10-09", time: "7:00 PM", team1: "St. Mary's Ryken", team2: "Paul VI", location: "St. Paul VI Catholic High School", sourceTeam: "Paul VI" },
  { date: "2026-10-16", time: "7:30 PM", team1: "Paul VI", team2: "Loudoun Sports Academy", location: "Loudoun Sports Academy", sourceTeam: "Paul VI" },
  { date: "2026-10-24", time: "1:00 PM", team1: "Paul VI", team2: "Archbishop Carroll", location: "Archbishop Carroll High School", sourceTeam: "Paul VI" },
  { date: "2026-11-07", time: "1:00 PM", team1: "Paul VI", team2: "Bishop O'Connell", location: "Bishop O'Connell High School", sourceTeam: "Paul VI" },
];

const normalize = (value) => String(value || "")
  .toLowerCase()
  .replace(/[’‘']/g, "")
  .replace(/\bst\.?\s+paul\s+vi\s+catholic(?:\s+high\s+school)?\b/g, "paul vi")
  .replace(/\bpaul\s+vi\s+catholic\b/g, "paul vi")
  .replace(/\bbishop\s+denis\s+j\.?\s+oconnell(?:\s+high\s+school)?\b/g, "bishop oconnell")
  .replace(/\bbishop\s+ireton\s+high\s+school\b/g, "bishop ireton")
  .replace(/\bst\.?\s+marys\s+ryken(?:\s+high\s+school)?\b/g, "st marys ryken")
  .replace(/[^a-z0-9]+/g, " ")
  .trim();

const matchupKey = (a, b) => [normalize(a), normalize(b)].sort().join("|");
const datedKey = (date, a, b) => `${date}|${matchupKey(a, b)}`;
const slug = (value) => normalize(value).replace(/\s+/g, "-");

const rowMatchupCounts = rows.reduce((counts, row) => {
  const key = matchupKey(row.team1, row.team2);
  counts.set(key, (counts.get(key) || 0) + 1);
  return counts;
}, new Map());

export function applyWcacMetroFootballSchedulesSep13(games) {
  const merged = [...games];

  for (const row of rows) {
    const key = matchupKey(row.team1, row.team2);
    const exactKey = datedKey(row.date, row.team1, row.team2);

    let existingIndex = merged.findIndex(
      (game) => datedKey(game.date, game.team1, game.team2) === exactKey
    );

    // For a matchup that appears only once in this audit, allow an older row
    // with a stale date to be corrected instead of creating a duplicate.
    if (existingIndex === -1 && rowMatchupCounts.get(key) === 1) {
      const candidateIndexes = merged
        .map((game, index) => ({ game, index }))
        .filter(({ game }) => matchupKey(game.team1, game.team2) === key)
        .map(({ index }) => index);

      if (candidateIndexes.length === 1) existingIndex = candidateIndexes[0];
    }

    const scheduleSourceUrl = SOURCES[row.sourceTeam] || "";
    const resultSourceUrl = row.resultSource ? SOURCES[row.resultSource] : "";
    const hasFinal = Number.isFinite(row.score1) && Number.isFinite(row.score2);
    const subjectToChange = Boolean(row.subjectToChange);

    const auditedFields = {
      date: row.date,
      time: row.time,
      team1: row.team1,
      team2: row.team2,
      location: row.location,
      scheduleStatus: hasFinal ? "Final" : subjectToChange ? "Subject to change" : "Confirmed",
      subjectToChange,
      verificationStatus: hasFinal ? "Final" : subjectToChange ? "Official listings conflict" : "Published",
      sourceTier: resultSourceUrl ? "Verified result / official schedule" : "Official school",
      sourceUrl: resultSourceUrl || scheduleSourceUrl,
      lastChecked: "2026-09-13",
      notes: row.notes || `Full WCAC Metro schedule audit; source: ${row.sourceTeam}.`,
    };

    if (existingIndex !== -1) {
      const existing = merged[existingIndex];
      merged[existingIndex] = {
        ...existing,
        ...auditedFields,
        score1: hasFinal ? row.score1 : existing.score1,
        score2: hasFinal ? row.score2 : existing.score2,
      };
      continue;
    }

    merged.push({
      id: `fb-${row.date}-${slug(row.team1)}-${slug(row.team2)}`,
      sport: "Football",
      division: "Varsity",
      ageGroup: "Varsity",
      score1: hasFinal ? row.score1 : null,
      score2: hasFinal ? row.score2 : null,
      ...auditedFields,
    });
  }

  return merged.sort(
    (a, b) => a.date.localeCompare(b.date) || String(a.time).localeCompare(String(b.time))
  );
}

export default applyWcacMetroFootballSchedulesSep13;
