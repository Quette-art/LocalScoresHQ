// Full 2026 varsity schedules for the three MAC football programs newly shown
// in LocalScoresHQ league standings: Flint Hill, Saint James, and Potomac School.
//
// Sources re-checked Sept. 13, 2026. Existing Maret/Sidwell/Landon opponent
// listings are merged rather than duplicated. Results are only added when a
// reliable current source has posted a final.

const SOURCES = {
  "Flint Hill": "https://www.maxpreps.com/va/oakton/flint-hill-huskies/football/schedule/",
  "Flint Hill official": "https://www.flinthill.org/athletics/athletics-football/",
  "Saint James": "https://www.stjames.edu/athletics/teams/team-profile/~athletics-team-id/114",
  "Potomac School": "https://www.maxpreps.com/va/mclean/potomac-school-panthers/football/schedule/",
  "Potomac School official": "https://www.potomacschool.org/athletics/teams-schedules",
  Landon: "https://www.landon.net/athletics/fall-sports/football",
  Sidwell: "https://www.sidwell.edu/athletics/team-page/~athletics-team-id/229",
  "DCSportsFan Sept. 11 results": "https://dcsportsfan.com/2026/09/11/football-scores/",
};

const rows = [
  // Flint Hill — official school page confirms varsity football; exact schedule
  // times are from the current MaxPreps listing, except Sidwell's home listing
  // controls the Oct. 17 time.
  { date: "2026-09-05", time: "1:00 PM", team1: "Fredericksburg Christian", team2: "Flint Hill", location: "Flint Hill School", sourceTeam: "Flint Hill", score1: 19, score2: 45 },
  { date: "2026-09-11", time: "4:30 PM", team1: "Jackson-Reed", team2: "Flint Hill", location: "Flint Hill School", sourceTeam: "Flint Hill", score1: 7, score2: 49, resultSource: "DCSportsFan Sept. 11 results" },
  { date: "2026-09-18", time: "4:00 PM", team1: "Flint Hill", team2: "Landon", location: "Landon School", sourceTeam: "Flint Hill" },
  { date: "2026-09-26", time: "2:00 PM", team1: "Flint Hill", team2: "Episcopal", location: "Episcopal High School", sourceTeam: "Flint Hill" },
  { date: "2026-10-02", time: "7:00 PM", team1: "Maret", team2: "Flint Hill", location: "Flint Hill School", sourceTeam: "Flint Hill" },
  { date: "2026-10-17", time: "2:00 PM", team1: "Flint Hill", team2: "Sidwell Friends", location: "Sidwell Friends", sourceTeam: "Sidwell" },
  { date: "2026-10-24", time: "1:00 PM", team1: "Flint Hill", team2: "Saint James", location: "Saint James School", sourceTeam: "Saint James" },
  { date: "2026-10-30", time: "6:30 PM", team1: "Flint Hill", team2: "St. John's Catholic Prep", location: "St. John's Catholic Prep", sourceTeam: "Flint Hill" },
  { date: "2026-11-07", time: "12:00 PM", team1: "Potomac School", team2: "Flint Hill", location: "Flint Hill School", sourceTeam: "Flint Hill" },

  // Saint James — official school schedule and conference description.
  { date: "2026-09-04", time: "4:30 PM", team1: "Saint James", team2: "Archbishop Curley", location: "Archbishop Curley High School", sourceTeam: "Saint James", score1: 22, score2: 14 },
  { date: "2026-09-12", time: "1:00 PM", team1: "Kiski School", team2: "Saint James", location: "Saint James School", sourceTeam: "Saint James" },
  { date: "2026-09-19", time: "1:00 PM", team1: "St. Stephen's & St. Agnes", team2: "Saint James", location: "Saint James School", sourceTeam: "Saint James" },
  { date: "2026-09-26", time: "2:00 PM", team1: "Saint James", team2: "Wyoming Seminary", location: "Wyoming Seminary", sourceTeam: "Saint James" },
  { date: "2026-10-03", time: "2:00 PM", team1: "Sidwell Friends", team2: "Saint James", location: "Saint James School", sourceTeam: "Saint James" },
  { date: "2026-10-09", time: "7:00 PM", team1: "Saint James", team2: "Bullis", location: "Bullis School", sourceTeam: "Saint James" },
  { date: "2026-10-17", time: "12:00 PM", team1: "Saint James", team2: "Potomac School", location: "Potomac School", sourceTeam: "Saint James" },
  { date: "2026-10-24", time: "1:00 PM", team1: "Flint Hill", team2: "Saint James", location: "Saint James School", sourceTeam: "Saint James" },
  { date: "2026-11-07", time: "1:30 PM", team1: "Saint James", team2: "Maret", location: "Maret", sourceTeam: "Saint James" },

  // Potomac School. Aug. 28 is confirmed by Landon's official varsity schedule;
  // the remaining dates match Potomac's current schedule listing.
  { date: "2026-08-28", time: "5:00 PM", team1: "Potomac School", team2: "Landon", location: "Landon School", sourceTeam: "Landon" },
  { date: "2026-09-04", time: "4:30 PM", team1: "Potomac School", team2: "Collegiate", location: "Collegiate School", sourceTeam: "Potomac School", score1: 0, score2: 24 },
  { date: "2026-09-12", time: "1:00 PM", team1: "Potomac School", team2: "St. Albans", location: "St. Albans School", sourceTeam: "Potomac School official" },
  { date: "2026-09-26", time: "12:00 PM", team1: "Saint John Paul the Great", team2: "Potomac School", location: "Potomac School", sourceTeam: "Potomac School" },
  { date: "2026-10-03", time: "1:00 PM", team1: "Bishop O'Connell", team2: "Potomac School", location: "Potomac School", sourceTeam: "Potomac School" },
  { date: "2026-10-10", time: "12:00 PM", team1: "Maret", team2: "Potomac School", location: "Potomac School", sourceTeam: "Potomac School" },
  { date: "2026-10-17", time: "12:00 PM", team1: "Saint James", team2: "Potomac School", location: "Potomac School", sourceTeam: "Potomac School" },
  { date: "2026-10-23", time: "6:00 PM", team1: "Potomac School", team2: "KIPP College Prep", location: "KIPP College Prep", sourceTeam: "Potomac School" },
  { date: "2026-10-31", time: "12:00 PM", team1: "Potomac School", team2: "Sidwell Friends", location: "Sidwell Friends", sourceTeam: "Sidwell" },
  { date: "2026-11-07", time: "12:00 PM", team1: "Potomac School", team2: "Flint Hill", location: "Flint Hill School", sourceTeam: "Flint Hill" },
];

const normalize = (value) => String(value || "")
  .toLowerCase()
  .replace(/[’‘']/g, "")
  .replace(/\bsaint\b/g, "st")
  .replace(/\bthe\s+potomac\s+school\b/g, "potomac school")
  .replace(/\bflint\s+hill\s+school\b/g, "flint hill")
  .replace(/\bst\.?\s+james\s+school\b/g, "st james")
  .replace(/\bst\.?\s+stephens\s+(?:and|&)\s+st\.?\s+agnes(?:\s+school)?\b/g, "st stephens st agnes")
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

export function applyMacFootballSchedulesSep13(games) {
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
      sourceTier: row.sourceTeam === "Flint Hill" || row.sourceTeam === "Potomac School"
        ? "Current team schedule"
        : "Official school",
      sourceUrl: resultSourceUrl || scheduleSourceUrl,
      lastChecked: "2026-09-13",
      notes: `Full MAC football schedule audit; source: ${row.sourceTeam}.`,
    };

    if (existingIndex !== -1) {
      const existing = merged[existingIndex];
      const existingIsFinal =
        existing.scheduleStatus === "Final" &&
        Number.isFinite(existing.score1) &&
        Number.isFinite(existing.score2);
      merged[existingIndex] = {
        ...existing,
        ...auditedFields,
        score1: hasFinal ? row.score1 : existing.score1,
        score2: hasFinal ? row.score2 : existing.score2,
        ...(existingIsFinal && !hasFinal
          ? {
              scheduleStatus: existing.scheduleStatus,
              subjectToChange: existing.subjectToChange,
              verificationStatus: existing.verificationStatus,
              sourceTier: existing.sourceTier,
              sourceUrl: existing.sourceUrl,
              notes: existing.notes,
              lastChecked: existing.lastChecked,
            }
          : {}),
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

export default applyMacFootballSchedulesSep13;
