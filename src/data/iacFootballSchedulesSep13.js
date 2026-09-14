// Full 2026 varsity schedules for the two IAC programs newly shown in
// LocalScoresHQ league standings: Episcopal and St. Stephen's & St. Agnes.
//
// Sources re-checked Sept. 13, 2026 against official school athletics pages.
// Scrimmages are excluded. Verified finals are included only when supported by
// a current school result or a credible score roundup.

const SOURCES = {
  Episcopal: "https://www.episcopalhighschool.org/football",
  "St. Stephen's & St. Agnes": "https://www.sssas.org/fall-team-1/varsity-football",
  "DCSportsFan Sept. 11 results": "https://dcsportsfan.com/2026/09/11/football-scores/",
};

const rows = [
  // Episcopal — Aug. 24 Maret scrimmage excluded.
  { date: "2026-08-29", time: "2:00 PM", team1: "St. Anne's-Belfield", team2: "Episcopal", location: "Episcopal High School", sourceTeam: "Episcopal" },
  { date: "2026-09-04", time: "7:00 PM", team1: "Episcopal", team2: "Paul VI", location: "St. Paul VI Catholic High School", sourceTeam: "Episcopal", score1: 20, score2: 8 },
  { date: "2026-09-11", time: "7:00 PM", team1: "Archbishop Curley", team2: "Episcopal", location: "Episcopal High School", sourceTeam: "Episcopal", score1: 0, score2: 34, resultSource: "DCSportsFan Sept. 11 results" },
  { date: "2026-09-26", time: "2:00 PM", team1: "Flint Hill", team2: "Episcopal", location: "Episcopal High School", sourceTeam: "Episcopal" },
  { date: "2026-10-02", time: "6:30 PM", team1: "Episcopal", team2: "St. Christopher's", location: "St. Christopher's School", sourceTeam: "Episcopal" },
  { date: "2026-10-08", time: "4:30 PM", team1: "Episcopal", team2: "St. Stephen's & St. Agnes", location: "St. Stephen's & St. Agnes School", sourceTeam: "Episcopal" },
  { date: "2026-10-17", time: "2:00 PM", team1: "Episcopal", team2: "St. Albans", location: "St. Albans School", sourceTeam: "Episcopal" },
  { date: "2026-10-24", time: "1:30 PM", team1: "Episcopal", team2: "Landon", location: "Landon School", sourceTeam: "Episcopal" },
  { date: "2026-10-31", time: "1:00 PM", team1: "Bullis", team2: "Episcopal", location: "Episcopal High School", sourceTeam: "Episcopal" },
  { date: "2026-11-07", time: "1:00 PM", team1: "Georgetown Prep", team2: "Episcopal", location: "Episcopal High School", sourceTeam: "Episcopal" },
  { date: "2026-11-14", time: "1:00 PM", team1: "Woodberry Forest", team2: "Episcopal", location: "Episcopal High School", sourceTeam: "Episcopal" },

  // St. Stephen's & St. Agnes — Aug. 28 St. Albans scrimmage excluded.
  { date: "2026-09-04", time: "4:30 PM", team1: "Christchurch", team2: "St. Stephen's & St. Agnes", location: "St. Stephen's & St. Agnes School", sourceTeam: "St. Stephen's & St. Agnes", score1: 20, score2: 28, resultSource: "DCSportsFan Sept. 11 results" },
  { date: "2026-09-11", time: "4:00 PM", team1: "Severn", team2: "St. Stephen's & St. Agnes", location: "St. Stephen's & St. Agnes School", sourceTeam: "St. Stephen's & St. Agnes", score1: 41, score2: 24, resultSource: "DCSportsFan Sept. 11 results" },
  { date: "2026-09-19", time: "1:00 PM", team1: "St. Stephen's & St. Agnes", team2: "Saint James", location: "Saint James School", sourceTeam: "St. Stephen's & St. Agnes" },
  { date: "2026-09-26", time: "1:00 PM", team1: "Sidwell Friends", team2: "St. Stephen's & St. Agnes", location: "St. Stephen's & St. Agnes School", sourceTeam: "St. Stephen's & St. Agnes" },
  { date: "2026-10-02", time: "4:00 PM", team1: "Bishop Ireton", team2: "St. Stephen's & St. Agnes", location: "St. Stephen's & St. Agnes School", sourceTeam: "St. Stephen's & St. Agnes" },
  { date: "2026-10-08", time: "4:30 PM", team1: "Episcopal", team2: "St. Stephen's & St. Agnes", location: "St. Stephen's & St. Agnes School", sourceTeam: "St. Stephen's & St. Agnes" },
  { date: "2026-10-16", time: "4:00 PM", team1: "St. John's Catholic Prep", team2: "St. Stephen's & St. Agnes", location: "St. Stephen's & St. Agnes School", sourceTeam: "St. Stephen's & St. Agnes" },
  { date: "2026-10-23", time: "7:00 PM", team1: "St. Stephen's & St. Agnes", team2: "Saint John Paul the Great", location: "Saint John Paul the Great Catholic High School", sourceTeam: "St. Stephen's & St. Agnes" },
  { date: "2026-11-07", time: "4:00 PM", team1: "St. Stephen's & St. Agnes", team2: "Landon", location: "Landon School", sourceTeam: "St. Stephen's & St. Agnes" },
];

const normalize = (value) => String(value || "")
  .toLowerCase()
  .replace(/[’‘']/g, "")
  .replace(/\bsaint\b/g, "st")
  .replace(/\bst\.?\s+stephens\s+(?:and|&)\s+st\.?\s+agnes(?:\s+school)?\b/g, "st stephens st agnes")
  .replace(/\bepiscopal\s+high\s+school\b/g, "episcopal")
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

export function applyIacFootballSchedulesSep13(games) {
  const merged = [...games];

  for (const row of rows) {
    const key = matchupKey(row.team1, row.team2);
    const exactKey = datedKey(row.date, row.team1, row.team2);

    let existingIndex = merged.findIndex(
      (game) => datedKey(game.date, game.team1, game.team2) === exactKey
    );

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

    const auditedFields = {
      date: row.date,
      time: row.time,
      team1: row.team1,
      team2: row.team2,
      location: row.location,
      scheduleStatus: hasFinal ? "Final" : "Confirmed",
      subjectToChange: false,
      verificationStatus: hasFinal ? "Final" : "Published",
      sourceTier: resultSourceUrl ? "Verified result / official schedule" : "Official school",
      sourceUrl: resultSourceUrl || scheduleSourceUrl,
      lastChecked: "2026-09-13",
      notes: `Full IAC schedule audit; source: ${row.sourceTeam}.`,
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

export default applyIacFootballSchedulesSep13;
